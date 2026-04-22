import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { forkJoin, from, Observable, of } from 'rxjs';
import { buffer, bufferCount, concatMap, delay, map, mergeMap, scan } from 'rxjs/operators'
import { CharacterPaginationModel } from '../models/character-pagination-model';
import { environment } from 'src/environments/environment';
import { CharacterModel } from '../models/character-model';
import { CHARACTER_PROGRESIVE_LOADING_CONSTS, CharacterProgresiveLoadingModel, CharacterProgresiveLoadingTotalsModel } from '../models/character-progresive-loading.model';


@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  private readonly apiCharacterUrl = environment.apiUrl + environment.endpoints.character;

  private readonly localCharacterTotalsInfoKey = 'charactersTotals';
  private readonly locaCharacterTotalsDate = 'charactersTotalsDate';

  constructor(private readonly _http: HttpClient) {

  }

  getDataByUrl<T>(url: string): Observable<T> {
    return this._http.get<T>(url);
  }

  getSingleCharacter(characterId: number | string): Observable<CharacterModel> {
    return this._http.get<CharacterModel>(this.apiCharacterUrl, { params: new HttpParams().set('id', characterId) });
  }

  getCharactersByFilters(pageNumber: number, characterName: string, characterStatus: string): Observable<CharacterPaginationModel> {
    let httpParams = new HttpParams().set('page', pageNumber.toString());

    if (characterName) {
      httpParams = httpParams.set('name', characterName);
    }
    if (characterStatus) {
      httpParams = httpParams.set('status', characterStatus);
    }
    //console.log('characterService -> getCharactersByFilters() httpParams: ', JSON.stringify(httpParams.toString()));
    return this._http.get<CharacterPaginationModel>(this.apiCharacterUrl, { params: httpParams })
  }

  getGlobalTotalsProgressive(): Observable<CharacterProgresiveLoadingModel> {
    const cacheDatos = localStorage.getItem(this.localCharacterTotalsInfoKey);
    const cacheFecha = localStorage.getItem(this.locaCharacterTotalsDate);

    //Verificar que el calculo de totales ya haran sido guardados,
    // claro primeramente, debe terminar de hacer los calculos de totales
    // antes de ser cacheados. Si se recarga la página antes de terminar
    // de calcular los totales, pues comenzará de nuevo el cálculo desde cero.
    if (cacheDatos && cacheFecha) {
      const time = (new Date().getTime() - parseInt(cacheFecha, 10)) / (1000 * 60 * 60);

      // Nos sirve para caché en localStorage, si no han pasado 24 horas, solamente
      // carga los datos almacenados para no cargar los totales de la api
      // cada que la pagina se recarga,
      if (time < 24) {
        const charactersTotalLoading = JSON.parse(cacheDatos) as CharacterProgresiveLoadingModel;
        //console.log(`Cache Especies: ${JSON.stringify(charactersTotalLoading.species, null, 3)} \n\n\n\n Cache Types: ${JSON.stringify(charactersTotalLoading.types, null, 3)}`);
        console.log('Cargando datos de totales desde cache local.');
        return of(charactersTotalLoading);
      }
    }

    console.log('Carga progresiva de totales iniciada...');

    return this._http.get<CharacterPaginationModel>(this.apiCharacterUrl).pipe(
      mergeMap((primeraPagina) => {
        const totalPaginas = primeraPagina.info.pages;
        // Almacenar las paginas restantes a consultar,
        // comienza en 2, porque la primera página
        // es justamente insterceptada en este pipe()
        // en la variable primeraPagina
        const agruparPaginas = [];
        for (let i = 2; i <= totalPaginas; i++) {
          agruparPaginas.push(i);
        }

        //from emite los numeros del array uno a la vez (2,3,4...)
        return from(agruparPaginas).pipe(
          //convertimos nuestro arreglo en grupos de 3,
          //nos servirá para consultar 3 hilos a la vez hacia la api
          bufferCount(3),

          //aquí procesamos los grupos de 3
          concatMap(paginasAgrupadas => {
            // Procesamos las 3 peticiones de forma individual, 1 a 1, hasta completar las 3
            const paginaPeticionHtpp = paginasAgrupadas.map(
              num => {
                const httpParams = new HttpParams().set('page', num.toString());
                return this._http.get<CharacterPaginationModel>(this.apiCharacterUrl, { params: httpParams });
              }
            );

            //con forkJoin disparamos las 3 peticiones grupales cuando ya estén listas
            return forkJoin(paginaPeticionHtpp).pipe(
              // Al terminar este lote de 3 peticiones, descansa 5 segundos antes del siguiente lote.
              delay(5000)
            );

          }),
          // scan nos resive ahora el grupo de 3 de las peticiones que hicimos arriba
          scan((acum, arrayOfResponses) => {
            // Guardando datos de la primera página
            let charactersFetched = [...acum.personajes];
            // Guardando datos del resto de las páginas sumándolas al array
            arrayOfResponses.forEach(results => {
              charactersFetched = [...charactersFetched, ...results.results]
            });

            return {
              personajes: charactersFetched,
              paginasProcesadas: acum.paginasProcesadas + arrayOfResponses.length,
              paginasTotales: totalPaginas
            };

          },//deficion de las varibles para mi scan, y a la vez, valores iniciales de mi acumulador (acum)
            { personajes: [...primeraPagina.results], paginasProcesadas: 1, paginasTotales: totalPaginas }
          ),

          //Ahora realizamos los calculos para determinar los totales pedidos
          map((characters) => {
            const totales = this.calculateProgressiveTotals(characters.personajes, characters.paginasProcesadas, characters.paginasTotales);

            //Verificamos que todas las paginas de la api han sido consultadas
            //Si ya terminaron todas las página guardamos una caché
            if (totales.isCompleted) {
              console.log('Calculo progresivo de totales terminado. Guardando en caché.');
              localStorage.setItem(this.localCharacterTotalsInfoKey, JSON.stringify(totales));
              localStorage.setItem(this.locaCharacterTotalsDate, new Date().getTime().toString());
            }

            return totales;
          })

        );
      })
    );
  }

  private calculateProgressiveTotals(personajes: CharacterModel[],
    paginasProcesadas: number,
    paginasTotales: number
  ): CharacterProgresiveLoadingModel {
    const conteoSpecies: Record<string, number> = {};
    const conteoTypes: Record<string, number> = {};
    personajes.forEach((c) => {
      const specie = c.species || CHARACTER_PROGRESIVE_LOADING_CONSTS.UNKNOWN;
      const type = c.type || CHARACTER_PROGRESIVE_LOADING_CONSTS.NONE;

      conteoSpecies[specie] = (conteoSpecies[specie] || 0) + 1;
      conteoTypes[type] = (conteoTypes[type] || 0) + 1;
    });

    // Arrays de los totales
    const totalSpecies: CharacterProgresiveLoadingTotalsModel[] = Object.keys(conteoSpecies).map(k => {
      return {
        name: k,
        count: conteoSpecies[k]
      }
    }
    );

    const totalTypes: CharacterProgresiveLoadingTotalsModel[] = Object.keys(conteoTypes).map(k => {
      return {
        name: k,
        count: conteoTypes[k]
      }
    });

    const totales: CharacterProgresiveLoadingModel = {
      species: totalSpecies,
      types: totalTypes,
      isCompleted: paginasProcesadas >= paginasTotales
    }
    return totales;
  }

}

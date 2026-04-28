import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { CharacterModel } from 'src/app/features/character/models/character-model';
import { EpisodeModel } from 'src/app/features/character/models/episode-model';
import { LocationModel } from 'src/app/features/character/models/location-model';
import { CharacterService } from '../services/character.service';

interface BasicInfo {
  name: string,
  resident: string
}

interface FullCharacterDetails {
  character: CharacterModel,
  originInfo: BasicInfo,
  locationInfo: BasicInfo,
  episode: EpisodeModel[]
}



@Injectable({
  providedIn: 'root'
})
export class CharacterDetailsFacade {
  private selectedCharacter = new BehaviorSubject<CharacterModel | null>(null);
  selecterCharacter$ = this.selectedCharacter.asObservable();


  readonly fullCharacterDetails$ = this.selectedCharacter.pipe(
    switchMap((char) => {
      if (!char) return of(null);

      // Aquí disparamos la carga simultánea que pide la prueba
      return forkJoin({
        origen: this.getOriginData(char),
        location: this.getLocationData(char),
        episodio: this.getEpisodeData(char)
      }).pipe(
        map(fork => {
          const fullData: FullCharacterDetails = {
            character: char,
            originInfo: fork.origen,
            locationInfo: fork.location,
            episode: fork.episodio
          }
          return fullData;
        }));
    })
  );
  constructor(
    private readonly _characterService: CharacterService
  ) { }

  setSelectedCharacter(character: CharacterModel | null) {
    if (character) {
      if (!(character.id == this.selectedCharacter.value?.id)) {
        this.selectedCharacter.next(character);
      }
    }
  }


  /**
   * Obtener la informacion de origin del personaje, y un residente que
   * comparte ese origin del personaje seleccionado.
   * Origin la api arroja un Location, es decir ambos son lo mismo un LocationModel,
   * pero de diferente nombre en su respectivo endpoint
   * @param char Personaje seleccionado
   */
  private getOriginData(char: CharacterModel) {
    //---- Para el origen necesitamos armar, el nombre
    // y el nombre de un personaje que comparte ese origen ----

    //Un personaje tiene un origen que es un LocationModel
    // por ende, consultamos si tiene un origen, caso contrario
    // guardamos datos por defautl en la interface BasicInfo
    const origen: Observable<BasicInfo> = char.origin.url ?

      //si existe el origen, el origen es un LocationModel,
      //consultamos qué personajes tiene existen en esa Location
      this._characterService.getDataByUrl<LocationModel>(char.origin.url).pipe(
        switchMap(location => {
          //Los residentes son de tipo CharacterModel
          return location.residents.length > 0 ?
            //si tenemos personajes en esa location, entonces porfin tenemos
            // un nombre de personaje(s) que vive(n) en un origin,
            // y podremos completar nuestro Observable<BasicInfo>
            this._characterService.getDataByUrl<CharacterModel>(location.residents[0]).pipe(
              map(resChar => {
                const basic: BasicInfo = {
                  name: location.name,
                  resident: resChar.name
                }
                return basic;
              })
            ) :
            //si no tenemos personajes, devolvemos un observable por default
            // a nuestra variable origen: Observable<BasicInfo>,
            // almenos con el nombre del origen que es un location
            of({ name: location.name, resident: "None" })
        }),
        //Por si surge un error al consultar la Location para obtener
        //el nombre del personaje que existe en esa Location
        catchError(() => {
          const basic: BasicInfo = {
            name: char.location.name,
            resident: 'Error'
          }
          return of(basic);
        })
      )
      // si no hay location que consultar, pues entonces
      // devolvemo un observable con valores por default
      // a nuestra variable origen: Observable<BasicInfo>,
      // almenos con el nombre del origen del personaje
      : of({ name: char.origin.name, resident: 'None' });

    return origen;
  }

  /**
   * Obtener la location de un personaje seleccionado,
   * obtener un residente que comparte esa location
   * del personaje seleccionado.
   * @param char Personaje seleccionado
   * @returns Observable<BasicInfo>
   */
  private getLocationData(char: CharacterModel) {
    // Teniendo el personaje seleccionado, partimos a anidar las peticiones.
    // La location devuelve un LocationModel
    const location: Observable<BasicInfo> = char.location.url ?

      // si el personaje tiene una location, entonces podemos usar la LocationModel
      // que devuelve la consulta de location, dentro de LocationModel tambien
      // llegan las url de los personajes
      this._characterService.getDataByUrl<LocationModel>(char.location.url).pipe(
        //verificamos que haya personajes
        switchMap(loc => loc.residents.length > 0 ?
          // si hay personajes, entonces ya tenemos nuestros datos para Observable<BasicInfo>,
          // que seria tener el nombre de la location y el nombre del residente de esa location;
          this._characterService.getDataByUrl<CharacterModel>(loc.residents[0]).pipe(
            map(resident => {
              const basic: BasicInfo = {
                name: loc.name,
                resident: resident.name
              }
              return basic;
            })
          ) :
          // si no hay personajes, entonces armamos un Observable<BasicInfo> por defecto,
          // al menos con el nombre de la location.
          of({ name: loc.name, resident: 'None' })
        ),
        // por si hay un error, entonces armamos un Observable<BasicInfo> por defecto,
        // al menos con el nombre de la location.
        catchError(() => of({ name: char.location.name, resident: 'Error' }))
      )
      :
      of({ name: char.location.name, resident: 'None' })
      ;

    return location;
  }

  private getEpisodeData(char: CharacterModel) {
    const blankEpisode = of([]);

    let episodesUrls: Array<string> = [];
    if (!char.episode || char.episode.length === 0) {
      return blankEpisode;
    } else {

      if (char.episode.length >= 3) {
        episodesUrls = char.episode.slice(0, 3);
      } else {
        episodesUrls = char.episode;
      }
    }

    const episodesPetitionHttp = episodesUrls.map(url => this._characterService.getDataByUrl<EpisodeModel>(url));
    return forkJoin(episodesPetitionHttp).pipe(
      catchError(() => {
        return blankEpisode;
      })
    );
  }



}

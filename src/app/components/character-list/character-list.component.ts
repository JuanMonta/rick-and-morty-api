import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CharacterModel } from 'src/app/models/character-model';
import { CharacterPaginationModel } from 'src/app/models/character-pagination-model';
import { PaginationModel } from 'src/app/models/pagination-info-model';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit {

  listCharacters = new BehaviorSubject<CharacterModel[]>([]);

  currentPage = 1;
  totalPages = 1;

  loadingInformation = false;
  private destroySuscription = new Subject<void>();



  constructor(private _characterService: CharacterService) { }

  ngOnInit(): void {
    //this.getAllCharacters();
    //this.getSingleCharacter(1);
    this.getCharactersByPage(this.currentPage);
    const characterUrls = [
      "https://rickandmortyapi.com/api/character/1",
      "https://rickandmortyapi.com/api/character/2",
      "https://rickandmortyapi.com/api/character/3",
      "https://rickandmortyapi.com/api/character/4"
    ]
    //this.getMultipleCharactersByUrls(characterUrls);
  }

  getAllCharacters() {
    this.loadingInformation = true;
    this._characterService.getAllCharacters()
      .pipe(
        takeUntil(this.destroySuscription)
      )
      .subscribe({
        next: (res) => {
          this.listCharacters.next(res.results);
          console.log('Lista de personajes: ' + this.listCharacters);
          this.loadingInformation = false;
        },
        error: (err) => {
          console.log('Ocurrió un error al momento de consultar todos los personajes.', err);
          this.loadingInformation = false;
        }
      }
      );
  }

  getSingleCharacter(id: number) {
    this.loadingInformation = true;
    this._characterService.getSingleCharacter(id).subscribe({
      next: (res) => {
        const character: CharacterModel[] = [res];
        //console.log(`Personaje por id: ${JSON.stringify(character, null, '\t')}`);
        this.listCharacters.next(character)
        this.loadingInformation = false;
      },
      error: (err) => {
        console.error('Error al cargar el personaje por id.');
        this.loadingInformation = false;
      }
    });
  }

  getMultipleCharactersByUrls(charUrsl: string[]) {
    this._characterService.getMultipleCharactersByUrls(charUrsl).subscribe({
      next: (res) => {
        this.listCharacters.next(res);
      },
      error: (err) => {

      }
    });
  }

  getCharactersByPage(pageNumber: number) {
    this.loadingInformation = true;
    this._characterService.getCharactersByPage(pageNumber).subscribe(
      {
        next: (res) => {

          this.listCharacters.next(res.results);
          this.currentPage = pageNumber;
          this.totalPages = res.info.pages;
          this.loadingInformation = false;
        },
        error: (er) => {
          console.error('Error al cargar los personajes por paginación.');
          this.loadingInformation = false;
        }
      });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.getCharactersByPage(this.currentPage + 1);
    }
  }

  previewPage() {

    if (this.currentPage > 1) {
      this.getCharactersByPage(this.currentPage - 1);
    }
  }


  ngOnDestroy() {
    this.destroySuscription.next();// Cortar todas las suscripciones al instante
    this.destroySuscription.complete(); // Limpiar
  }
}

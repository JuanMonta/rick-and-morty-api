import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CharacterModel } from '../models/character-model';
import { CharacterService } from './character.service';
@Injectable({
  providedIn: 'root',
})
export class CharacterListFacade {
  constructor(private readonly _characterService: CharacterService) { }

  private listCharacterSubject = new BehaviorSubject<CharacterModel[]>([]);
  listCharacter$: Observable<CharacterModel[]> =
    this.listCharacterSubject.asObservable();

  private currentPageSubject = new BehaviorSubject<number>(1);
  currentPage$: Observable<number> = this.currentPageSubject.asObservable();

  private totalPagesSubject = new BehaviorSubject<number>(1);
  totalPages$: Observable<number> = this.totalPagesSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoadingInformation$: Observable<boolean> =
    this.isLoadingSubject.asObservable();

  nextPage(characterName: string, characterStatus: string) {
    if (
      this.currentPageSubject.getValue() < this.totalPagesSubject.getValue()
    ) {
      this.loadCharacters(
        this.currentPageSubject.getValue() + 1,
        characterName,
        characterStatus,
      );
    }
  }

  previewPage(characterName: string, characterStatus: string) {
    if (this.currentPageSubject.getValue() > 1) {
      this.loadCharacters(
        this.currentPageSubject.getValue() - 1,
        characterName,
        characterStatus,
      );
    }
  }

  loadCharacters(
    updateCurrentPage: number,
    characterName: string,
    characterStatus: string,
  ) {
    this.currentPageSubject.next(updateCurrentPage);
    this.getCharacters(
      this.currentPageSubject.getValue(),
      characterName,
      characterStatus,
    );

  }

  private getCharacters(
    pageNumber: number,
    characterName: string,
    characterStatus: string,
  ) {
    this.isLoadingSubject.next(true);
    this._characterService
      .getCharactersByFilters(pageNumber, characterName, characterStatus)
      .subscribe({
        next: (resp) => {
          this.managerLoadCharactersRespoponse(
            resp.results,
            resp.info.pages,
            pageNumber,
            false,
          );
        },
        error: (err) => {
          this.managerLoadCharactersRespoponse([], 1, 1, false);
        },
      });
  }

  private managerLoadCharactersRespoponse(
    characters: CharacterModel[],
    totalPages: number,
    currentPage: number,
    isLoading: boolean,
  ) {
    this.listCharacterSubject.next(characters);
    this.totalPagesSubject.next(totalPages);
    this.currentPageSubject.next(currentPage);
    this.isLoadingSubject.next(isLoading);
  }
}

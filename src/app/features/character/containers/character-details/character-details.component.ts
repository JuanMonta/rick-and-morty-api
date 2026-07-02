import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CharacterDetailsFacade } from '../../facades/character-details.facade';
import { Character } from 'src/app/core/models/api.model';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface CharacterDetailsViewModel {
  isLoading: boolean;
  characterFullDetails: Character | null;
}

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterDetailsComponent implements OnInit {

  // Orquestamos el estado reactivo en TypeScript, no en el HTML
  public readonly vm$: Observable<CharacterDetailsViewModel> = combineLatest([
    this._characterDetailsFacade.isCharacterLoading$.pipe(startWith(false)),
    this._characterDetailsFacade.currentCharacter$.pipe(startWith(null))
  ]).pipe(
    map(([isLoading, characterFullDetails]) => ({
      isLoading,
      characterFullDetails
    }))
  );

  constructor(
    private readonly _characterDetailsFacade: CharacterDetailsFacade,
  ) { }

  ngOnInit(): void {

  }



}

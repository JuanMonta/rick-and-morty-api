import { CharacterProgresiveLoadingTotalsModel, CharacterProgresiveLoadingModel, CHARACTER_PROGRESIVE_LOADING_CONSTS } from './../../models/character-progresive-loading.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-character-footer',
  templateUrl: './character-footer.component.html',
  styleUrls: ['./character-footer.component.css']
})
export class CharacterFooterComponent implements OnInit {

  private destroySuscription = new Subject<void>();

  isLoadingTotals: boolean = true;

  speciesTotales: CharacterProgresiveLoadingTotalsModel[] = [];
  typesTotales: CharacterProgresiveLoadingTotalsModel[] = [];

  constructor(private readonly _characterService: CharacterService) { }

  ngOnInit(): void {
    this.getGlobalTotalsProgressive();
  }

  private getGlobalTotalsProgressive() {
    this.isLoadingTotals = true;
    this._characterService.getGlobalTotalsProgressive()
      .pipe(
        takeUntil(this.destroySuscription)
      )
      .subscribe(
        {
          next: (totales) => {
            this.speciesTotales = totales.species;
            this.typesTotales = totales.types.filter(f => f.name !== CHARACTER_PROGRESIVE_LOADING_CONSTS.NONE);
            this.isLoadingTotals = false;
          },
          error: (err) => {
            console.log('Error al cargar totales progresivos.', err)
            this.isLoadingTotals = false;
          }
        }
      );


  }





  ngOnDestroy(): void {
    this.destroySuscription.next();
    this.destroySuscription.complete();
  }

}

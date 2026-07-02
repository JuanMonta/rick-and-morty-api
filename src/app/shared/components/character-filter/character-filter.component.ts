import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith, takeUntil } from 'rxjs/operators';

export interface FilterCriteria {
  name: string;
  status: string;
}

@Component({
  selector: 'app-character-filter',
  templateUrl: './character-filter.component.html',
  styleUrls: ['./character-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterFilterComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>();

  @Output() readonly filterChange = new EventEmitter<FilterCriteria>();

  public readonly searchByName = new FormControl('');
  public readonly searchByStatus = new FormControl('');


  constructor() { }

  ngOnInit(): void {
    this.initFilterStream();
  }

  private initFilterStream(): void {
    const filterName$ = this.searchByName.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      //eliminar los espacios vacios al principio y final de una palabra
      map((value: string | null) => (value || '').trim()),
      distinctUntilChanged(),
      // dejamos pasar el valor si está vacío o si tiene 3+ letras
      filter((value: string) => value.length === 0 || value.length >= 3)
    );

    const filterStatus$ = this.searchByStatus.valueChanges.pipe(
      startWith(''),
      distinctUntilChanged()
    );

    // combineLatest siempre usará el último valor que logró pasar los filtros arriba
    combineLatest([filterName$, filterStatus$]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([name, status]) => {
      this.filterChange.emit({ name, status });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Character } from 'src/app/core/models/api.model';

@Component({
  selector: 'app-character-table',
  templateUrl: './character-table.component.html',
  styleUrls: ['./character-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterTableComponent implements OnInit {

  materialTableDataSource = new MatTableDataSource<Character>([]);

  @Input() characters: Character[] = [];
  @Input() isLoading: boolean = false;

  @Input() favoriteCharacterId: string | number | undefined | null;
  @Input() selectedCharacterId: string | number | undefined | null;

  @Output() readonly toggleFavorite = new EventEmitter<Character>();
  @Output() readonly selectCharacter = new EventEmitter<Character>();

  tableColumns: string[] = ['FAV', 'IMG', 'NAME', 'STATUS', 'SPECIES', 'TYPE', 'GENDER', 'CREATED'];

  constructor() { }

  ngOnInit(): void {

  }

  onToggleFavorite(character: Character): void {
    this.toggleFavorite.emit(character);
  }

  onSelectCharacter(character: Character): void {
    this.selectCharacter.emit(character);
  }

}

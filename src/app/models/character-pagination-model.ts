import { CharacterModel } from "./character-model";
import { PaginationModel } from "./pagination-info-model";

export interface CharacterPaginationModel {
  info: PaginationModel,
  results: CharacterModel[]
}

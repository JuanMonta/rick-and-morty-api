import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CharacterPaginationModel } from '../models/character-pagination-model';
import { ICharacterService } from './character-service.interface';

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $name: String, $status: String) {
    characters(page: $page, filter: { name: $name, status: $status }) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        type
        gender
        image
        created
        origin {
          name
          url
        }
        location {
          name
          url
        }
        episode
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class CharacterGraphqlService implements ICharacterService {

  constructor(private apollo: Apollo) { }
  getCharactersByFilters(pageNumber: number, characterName: string, characterStatus: string): Observable<CharacterPaginationModel> {
    return this.apollo.watchQuery<any>({
      query: GET_CHARACTERS,
      variables: {
        page: pageNumber,
        name: characterName,
        status: characterStatus
      }
    }).valueChanges.pipe(
      map(response => response.data.characters as CharacterPaginationModel)
    );;
  }



}

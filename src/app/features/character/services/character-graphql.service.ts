import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CharacterPaginationModel } from '../models/character-pagination-model';
import { ICharacterService } from './character-service.interface';
import { CharacterModel } from '../models/character-model';

interface GetCharactersResponse {
  characters: CharacterPaginationModel
}

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

interface GetSingleCharacterResponse {
  character: CharacterModel
}

const GET_SINGLE_CHARACTER = gql`
  query GetSingleCharacter($characterId: ID!){
    character(id: $characterId){
        id,
        name,
        status,
        species,
        type,
        gender,
        origin{
            name,
            url
        }
        location{
          name,
          url
        }
        image,
        episode
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class CharacterGraphqlService implements ICharacterService {

  constructor(private apollo: Apollo) { }

  getDataByUrl<T>(url: string): Observable<T> {
    throw new Error('Method not implemented.');
  }

  getSingleCharacter(characterId: number | string): Observable<CharacterModel> {
    return this.apollo.watchQuery<GetSingleCharacterResponse>({
      query: GET_SINGLE_CHARACTER,
      variables: {
        id: characterId
      }
    }).valueChanges.pipe(
      map(response => response.data.character)
    );
  }

  getCharactersByFilters(pageNumber: number, characterName: string, characterStatus: string): Observable<CharacterPaginationModel> {
    return this.apollo.watchQuery<GetCharactersResponse>({
      query: GET_CHARACTERS,
      variables: {
        page: pageNumber,
        name: characterName,
        status: characterStatus
      }
    }).valueChanges.pipe(
      map(response => response.data.characters)
    );;
  }



}

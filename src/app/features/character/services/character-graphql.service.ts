import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { characterGraphQlDtoToCharacter, createBaseCharacter } from 'src/app/core/adapters/api.adapter';
import { Character, CharacterGraphQLResponse, CharactersGraphQLResponse, PaginatedCharacters } from 'src/app/core/models/api.model';
import { CharacterRepository } from 'src/app/core/services/character-repository.abstract';

const CORE_EPISODE_FIELDS = gql`
  fragment CoreEpisodeFields on Episode{
    name
    air_date
    episode
  }
`;

const CORE_RESIDENT_FIELDS = gql`
  fragment CoreResidentFields on Character{
    id
    name
  }
`;

const CORE_LOCATION_FIELDS = gql`
${CORE_RESIDENT_FIELDS}
  fragment CoreLocationFields on Location{
    id
    name
    dimension
    residents{
      ...CoreResidentFields
    }
  }
`;

const CORE_CHARACTER_FIELDS = gql`
  ${CORE_LOCATION_FIELDS}
  ${CORE_EPISODE_FIELDS}
  fragment CoreCharacterFields on Character{
    id
    name
    status
    species
    type
    gender
    image
    origin{
      ...CoreLocationFields
    }
    location{
      ...CoreLocationFields
    }
    episode{
      ...CoreEpisodeFields
    }
    created
  }
`;


const CORE_INFO_FIELDS = gql`
  fragment CoreInfoFields on Info{
    count
    pages
    next
    prev
  }
`;


const GET_CHARACTER_BY_ID = gql`
  ${CORE_CHARACTER_FIELDS}
  query getCharacterById($id : ID!){
    character(id: $id){
      ...CoreCharacterFields
    }
  }
`;

const GET_CHARACTERS = gql`
  ${CORE_INFO_FIELDS}
  ${CORE_CHARACTER_FIELDS}
  query GetCharacters($name : String, $status : String, $page : Int){
    characters(filter:{name: $name, status: $status, }, page: $page){
      info{
        ...CoreInfoFields
      }
      results{
        ...CoreCharacterFields
      }
    }
  }
`;


@Injectable({
  providedIn: 'root'
})
export class CharacterGraphqlService implements CharacterRepository {

  constructor(private apollo: Apollo) { }



  getCharacterById(id: string | number): Observable<Character> {

    return this.apollo.watchQuery<CharacterGraphQLResponse>({
      query: GET_CHARACTER_BY_ID,
      variables: {
        id: id
      },
      errorPolicy: 'all', // Permite a Apollo procesar errores sin colapsar de inmediato
      fetchPolicy: 'cache-first' // Le decimos a Apollo: "Busca en tu memoria RAM primero. Si no está, ve a la red".
    }).valueChanges.pipe(
      take(1),
      map(result => {
        const graphqlDto = result.data?.character;
        if (graphqlDto) {
          return characterGraphQlDtoToCharacter(graphqlDto);
        }
        return createBaseCharacter({});
      })
    );
  }

  getCharacters(pageNumber: string | number = 1, characterName: string = '', characterStatus: string = ''): Observable<PaginatedCharacters> {
    return this.apollo.watchQuery<CharactersGraphQLResponse>(
      {
        query: GET_CHARACTERS,
        variables: {
          name: characterName,
          status: characterStatus,
          page: pageNumber
        },
        errorPolicy: 'all', // Permite a Apollo procesar errores sin colapsar de inmediato
        fetchPolicy: 'cache-first' // Le decimos a Apollo: "Busca en tu memoria RAM primero. Si no está, ve a la red".
      }
    ).valueChanges.pipe(
      take(1),
      map(results => {
        const paginatedResults = results.data?.characters;
        if (!paginatedResults) {
          return { info: null, results: [] }
        }
        return { info: paginatedResults.info, results: paginatedResults.results.map(char => characterGraphQlDtoToCharacter(char)) }
      }),
      catchError(error => {
        return of({ info: null, results: [] })
      })
    );
  }

}

import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CharacterModel } from '../models/character-model';
import { CharacterPaginationModel } from '../models/character-pagination-model';
import { EpisodeModel } from '../models/episode-model';
import { LocationModel } from '../models/location-model';
import { PaginationModel } from '../models/pagination-info-model';
import { ICharacterService } from './character.service.interface';
import { GraphqlCharacter, GraphqlMapper, GraphqlResident } from './mapper/graphql-mapper';

interface GetCharacterPaginationModelResponse {
  characters: {
    info: PaginationModel,
    results: GraphqlCharacter[]
  }
}

interface GetCharacterModelResponse {
  character: GraphqlCharacter
}

interface GetLocationModelResponse {
  location: {
    name: string,
    type: string,
    dimension: string,
    residents: GraphqlResident[]
  }
}

interface GetEpisodeModelResponse {
  episode: EpisodeModel
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
          id
          name
        }
        location {
          id
          name
        }
        episode{
          id
        }
      }
    }
  }
`;

const GET_SINGLE_CHARACTER = gql`
  query GetSingleCharacter($id: ID!){
    character(id: $id){
        id
        name
        status
        species
        type
        gender
        origin{
            id
            name
        }
        location{
          id
          name
        }
        image
        episode{
          id
        }
    }
  }
`;

const GET_CHARACTER_LOCATION = gql`
  query GetCharacterLocation($id: ID!){
    location(id: $id){
      name
      type
      dimension
      residents{
        id
      }
    }
  }
`;

const GET_CHARACTER_EPISODE = gql`
  query GetCharacterEpisode($id: ID!){
    episode(id: $id){
      id
      name
      air_date
      episode
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class CharacterGraphqlService implements ICharacterService {

  constructor(private apollo: Apollo) { }

  private extractIdFromUrl(url: string | number): string {
    if (!url) return '';
    const value = url.toString().trim();

    if (value.includes('/')) {
      const parts = value.split('/').filter(p => p !== '');
      return parts[parts.length - 1]
    }
    return value;
  }

  getSingleCharacter(idChar: number | string): Observable<CharacterModel> {
    return this.apollo.watchQuery<GetCharacterModelResponse>({
      query: GET_SINGLE_CHARACTER,
      variables: {
        id: this.extractIdFromUrl(idChar.toString())
      }
    }).valueChanges.pipe(
      take(1),
      map(response => GraphqlMapper.toCharacterModel(response.data.character))
    );
  }

  getCharacterLocationByUrl(locationUrl: string): Observable<LocationModel> {
    return this.apollo.watchQuery<GetLocationModelResponse>({
      query: GET_CHARACTER_LOCATION,
      variables: {
        id: this.extractIdFromUrl(locationUrl)
      }
    }).valueChanges.pipe(
      take(1),
      map(response => GraphqlMapper.toLocationModel(response.data.location))
    );
  }
  getCharacterByUrl(characterUrl: string): Observable<CharacterModel> {
    return this.getSingleCharacter(this.extractIdFromUrl(characterUrl));
  }



  getEpisodeByUrl(episodeUrl: string): Observable<EpisodeModel> {
    return this.apollo.watchQuery<GetEpisodeModelResponse>({
      query: GET_CHARACTER_EPISODE,
      variables: {
        id: this.extractIdFromUrl(episodeUrl)
      }
    }).valueChanges.pipe(
      take(1),
      map(response => response.data.episode)
    );
  }

  getCharactersByFilters(pageNumber: number, characterName: string, characterStatus: string): Observable<CharacterPaginationModel> {
    return this.apollo.watchQuery<GetCharacterPaginationModelResponse>({
      query: GET_CHARACTERS,
      variables: {
        page: pageNumber,
        name: characterName,
        status: characterStatus
      }
    }).valueChanges.pipe(
      take(1),
      map(response => {
        const paginationData = response.data.characters;
        const results = paginationData.results.map((char: GraphqlCharacter) => GraphqlMapper.toCharacterModel(char));

        return {
          ...paginationData,
          results: results
        } as CharacterPaginationModel;
      })
    );;
  }



}

import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CharacterModel } from '../models/character-model';
import { CharacterPaginationModel } from '../models/character-pagination-model';
import { EpisodeModel } from '../models/episode-model';
import { LocationModel } from '../models/location-model';
import { ICharacterService } from './character.service.interface';

interface GetCharacterPaginationModelResponse {
  characters: CharacterPaginationModel
}

interface GetCharacterModelResponse {
  character: CharacterModel
}

interface GetLocationModelResponse {
  location: LocationModel
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

const GET_CHARACTER_LOCATION = gql`
  query GetCharacterLocation($locationId: ID!){
    location(id: $locationId){
      name,
      type,
      dimension,
      residents
    }
  }
`;

const GET_CHARACTER_EPISODE = gql`
  query GetCharacterEpisode($episodeId: ID!){
    episode(id: $episodeId){
      name,
      air_date,
      episode,
      characters
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class CharacterGraphqlService implements ICharacterService {

  constructor(private apollo: Apollo) { }

  private extractIdFromUrl(url: string): string {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  getSingleCharacter(characterId: number | string): Observable<CharacterModel> {
    return this.apollo.watchQuery<GetCharacterModelResponse>({
      query: GET_SINGLE_CHARACTER,
      variables: {
        id: characterId
      }
    }).valueChanges.pipe(
      map(response => response.data.character)
    );
  }

  getCharacterLocationByUrl(locationUrl: string): Observable<LocationModel> {
    return this.apollo.watchQuery<GetLocationModelResponse>({
      query: GET_CHARACTER_LOCATION,
      variables: {
        id: this.extractIdFromUrl(locationUrl)
      }
    }).valueChanges.pipe(
      map(response => response.data.location)
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
    })
      .valueChanges.pipe(
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
      map(response => response.data.characters)
    );;
  }



}

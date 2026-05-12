import { CharacterModel } from '../../models/character-model';
import { LocationModel } from '../../models/location-model';
import { EpisodeModel } from '../../models/episode-model';

/**
 * INTERFACES DTO (Data Transfer Objects)
 * Representan la estructura cruda que viene de GraphQL.
 */
export interface GraphqlEpisode {
  id: string;
  name?: string;
  air_date?: string;
  episode?: string;
  __typename?: string;
}

export interface GraphqlLocation {
  name: string;
  type: string;
  dimension: string;
  residents: { id: string }[];
  __typename?: string;
}

export interface GraphqlCharacter {
  id: string;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  created: string;
  origin: { id?: string; name: string } | null;
  location: { id?: string; name: string } | null;
  episode: GraphqlEpisode[];
}

export interface GraphqlResident {
  id: string;
  __typename?: string;
}

/**
 * MAPPER: El traductor oficial de la infraestructura GraphQL al Dominio.
 */
export class GraphqlMapper {

  static toCharacterModel(char: GraphqlCharacter): CharacterModel {
    return {
      ...char,
      id: Number(char.id),
      url: char.id, // Normalizamos: el ID de Graph sirve como URL para nuestro extractor
      origin: {
        name: char.origin?.name || 'unknown',
        url: char.origin?.id || ''
      },
      location: {
        name: char.location?.name || 'unknown',
        url: char.location?.id || ''
      },
      episode: char.episode.map(ep => ep.id)
    } as CharacterModel;
  }

  static toLocationModel(loc: GraphqlLocation): LocationModel {
    return {
      name: loc.name,
      type: loc.type,
      dimension: loc.dimension,
      residents: loc.residents.map(r => r.id)
    } as LocationModel;
  }

  static toEpisodeModel(ep: GraphqlEpisode): EpisodeModel {
    return {
      id: Number(ep.id),
      name: ep.name || '',
      air_date: ep.air_date || '',
      episode: ep.episode || '',
      characters: [],
      url: ep.id,
      created: ''
    } as EpisodeModel;
  }
}

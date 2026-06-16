//============ MODELOS CRUDOS ================================================
export interface PaginationInfo {
  count: number;
  pages: number;
  next: number | string | null;
  prev: number | string | null;
}

export interface PaginatedCharacters {
  info: PaginationInfo | null,
  results: Character[]
}

export interface AtributeTotal {
  key: string;
  count: number;
}

export interface CharacterOrigin {
  name: string,
  url: string,
  dimension?: string,
  residentName?: string // Para un residente de un location
}

export interface CharacterEpisode {
  name: string;
  air_date?: string;
  episode?: string; // el codigo del episodio
}

// Modelo de dominio único para los componentes
export interface Character {
  id: string | number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  url: string;

  origin: CharacterOrigin; // Lugar de origen del personaje
  location: CharacterOrigin;
  episode?: CharacterEpisode;
}

//=========== MODELOS REST ====================================
export interface LocationRestDTO {
  id: string | number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

export interface EpisodeRestDTO {
  id: string | number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string[];
  created: string;
}

// DTO de la api REST
export interface CharacterRestDTO {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  created: string;
  url: string;
  origin: CharacterOrigin,
  location: CharacterOrigin,
  episode: string[]
}
export interface CharacterPaginatedRestDTO {
  info: PaginationInfo;
  results: CharacterRestDTO[]
}

//=============MODELOS GRAPHQL ==========================================================
export interface CharacterGraphQLResponse {
  character: CharacterGraphQLDTO
}

export interface ResidentGraphqlDTO {
  id: string | number;
  name: string
}

export interface LocationGraphQLDTO {
  name: string;
  dimension?: string;
  residents: ResidentGraphqlDTO[];
}
// DTO del query de GraphQl
// GraphQL comúnmente no trae campos que no solicitamos explícitamente
export interface CharacterGraphQLDTO {
  id: string;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: LocationGraphQLDTO,
  location: LocationGraphQLDTO,
  episode: CharacterEpisode[]
}

export interface CharactersPaginatedGraphQLResponse {
  info: PaginationInfo | null;
  results: CharacterGraphQLDTO[]
}

export interface CharactersGraphQLResponse {
  characters: CharactersPaginatedGraphQLResponse
}


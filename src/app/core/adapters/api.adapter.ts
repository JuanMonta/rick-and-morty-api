import { Character, CharacterGraphQLDTO, CharacterRestDTO, ResidentGraphqlDTO } from "../models/api.model";

/**
 * Aplica los valores por defecto y construye el modelo unificado de Character.
 */
export function createBaseCharacter(data: Partial<Character>): Character {
  // **Si en el futuro agregas más propiedades por defecto, SOLO las agregas aquí.
  return {
    id: data.id ?? 0,
    name: data.name ?? 'Desconocido',
    status: data.status ?? 'Desconocido',
    species: data.species ?? 'unknown',
    type: data.type === '' ? 'Estándar' : (data.type ?? 'Estándar'),
    gender: data.gender ?? 'unknown',
    image: data.image ?? '',
    url: data.url ?? '',
    origin: data.origin ?? {
      name: 'unknown',
      url: ''
    },
    location: data.location ?? {
      name: 'unknown',
      url: ''
    },
    episode: data.episode ?? {
      name: 'Sin episodios asignados',
    }
    // Si mañana agregas una propiedad como "origin", solo agregas:
    // origin: data.origin ?? 'Desconocido'
    // sin olvidar que hay que agregar esa propiedad al modelo base que devuelve
  }
}

/**
 * Transforma un payload de la API REST al modelo de Dominio Unificado.
 */
export function characterRestDtoToCharacter(dto: CharacterRestDTO): Character {
  //* Para este caso devolvemos todas las propiedades de mi Character, (ver la funcion para GraphQL)
  return createBaseCharacter({
    id: dto.id,
    name: dto.name,
    status: dto.status,
    species: dto.species,
    type: dto.type,
    gender: dto.gender,
    image: dto.image,
    url: dto.url,
    origin: {
      name: dto.origin.name ?? 'unknown',
      url: dto.origin.url ?? '',
      residentName: dto.origin.residentName ?? 'No tiene residentes'
    },
    location: {
      name: dto.location.name ?? 'unknown',
      url: dto.location.url ?? '',
      residentName: dto.location.residentName ?? 'No tiene residentes'
    },
    // No mapeamos el episodio directo aquí porque viene como string[] desde REST y requiere enriquecimiento asíncrono
  })
}

/**
 * Transforma un payload de la API GraphQL al modelo de Dominio Unificado.
 */
export function characterGraphQlDtoToCharacter(dto: CharacterGraphQLDTO): Character {
  const currentId = String(dto.id);

  const getResidentName = (residents: ResidentGraphqlDTO[]) => {
    if (!residents || residents.length === 0) {
      return 'No tiene residentes'
    }
    const resident = residents.find((r: ResidentGraphqlDTO) => String(r.id) !== currentId);
    return resident ? resident.name : 'No tiene residentes'
  };

  //* Para este caso devolvemos solo las propiedades que hemos querido traer usando Graphql
  //* y usando el mappeador mantenemos completas las propiedades que aquí nos faltan del modelo base que seria Character.
  return createBaseCharacter({
    id: dto.id,
    name: dto.name,
    status: dto.status,
    species: dto.species,
    type: dto.type,
    gender: dto.gender,
    image: dto.image,
    origin: {
      name: dto.origin.name ?? 'unknown',
      url: '',
      dimension: dto.origin.dimension ?? 'unknown',
      residentName: getResidentName(dto.origin.residents)
    },
    location: {
      name: dto.location.name ?? 'unknown',
      url: '',
      dimension: dto.location.dimension ?? 'unknown',
      residentName: getResidentName(dto.location.residents)
    },
    // Extraemos de forma segura el primer episodio del array para cumplir con la prueba técnica
    episode: dto.episode && dto.episode.length > 0 ? dto.episode[0] : { name: 'No posee episodios' }
  })
}

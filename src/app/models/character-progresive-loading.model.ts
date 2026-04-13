export const CHARACTER_PROGRESIVE_LOADING_CONSTS ={
  NONE: 'None',
  UNKNOWN: 'Unknown'
}

export interface CharacterProgresiveLoadingTotalsModel{
  name : string,
  count: number
}

export interface CharacterProgresiveLoadingModel {
  species: CharacterProgresiveLoadingTotalsModel[],
  types: CharacterProgresiveLoadingTotalsModel[],
  isCompleted: boolean
}

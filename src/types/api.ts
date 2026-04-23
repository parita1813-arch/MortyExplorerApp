/** Common pagination metadata returned by the API. */
export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

/** Paginated API response wrapper. */
export interface PaginatedResponse<T> {
  info: ApiInfo;
  results: T[];
}

/** Character location shape from API. */
export interface CharacterPlace {
  name: string;
  url: string;
}

/** Character entity returned by API. */
export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: CharacterPlace;
  location: CharacterPlace;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

/** Episode entity returned by API. */
export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

/** Location entity returned by API. */
export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

/** App-level filter options for character list. */
export interface CharacterFilters {
  search: string;
  status: '' | 'alive' | 'dead' | 'unknown';
  gender: '' | 'female' | 'male' | 'genderless' | 'unknown';
}

/** Favourite character record persisted in SQLite. */
export interface FavouriteCharacter {
  id: number;
  name: string;
  status: Character['status'];
  species: string;
  image: string;
  locationName: string;
}

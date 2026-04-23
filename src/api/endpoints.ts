import { apiClient } from './client';
import type {
  Character,
  CharacterFilters,
  Episode,
  Location,
  PaginatedResponse,
} from '../types/api';

/** Gets paginated characters with optional filters. */
export async function getCharacters(params: {
  page: number;
  filters: CharacterFilters;
}): Promise<PaginatedResponse<Character>> {
  const { page, filters } = params;
  const response = await apiClient.get<PaginatedResponse<Character>>('/character', {
    params: {
      page,
      name: filters.search || undefined,
      status: filters.status || undefined,
      gender: filters.gender || undefined,
    },
  });
  return response.data;
}

/** Gets single character details. */
export async function getCharacter(id: number): Promise<Character> {
  const response = await apiClient.get<Character>(`/character/${id}`);
  return response.data;
}

/** Gets paginated episodes list. */
export async function getEpisodes(page: number): Promise<PaginatedResponse<Episode>> {
  const response = await apiClient.get<PaginatedResponse<Episode>>('/episode', {
    params: { page },
  });
  return response.data;
}

/** Gets many episodes by id list used by character details. */
export async function getEpisodesByIds(ids: number[]): Promise<Episode[]> {
  if (ids.length === 0) {
    return [];
  }
  const response = await apiClient.get<Episode | Episode[]>(`/episode/${ids.join(',')}`);
  const data = response.data;
  return Array.isArray(data) ? data : [data];
}

/** Gets paginated locations list. */
export async function getLocations(page: number): Promise<PaginatedResponse<Location>> {
  const response = await apiClient.get<PaginatedResponse<Location>>('/location', {
    params: { page },
  });
  return response.data;
}

/** Gets many characters by id list used by episode/location details. */
export async function getCharactersByIds(ids: number[]): Promise<Character[]> {
  if (ids.length === 0) {
    return [];
  }
  const uniqueIds = Array.from(new Set(ids));
  const chunkSize = 20;
  const chunks: number[][] = [];

  for (let index = 0; index < uniqueIds.length; index += chunkSize) {
    chunks.push(uniqueIds.slice(index, index + chunkSize));
  }

  const responses = await Promise.all(
    chunks.map(async chunk => {
      const response = await apiClient.get<Character | Character[]>(`/character/${chunk.join(',')}`);
      return Array.isArray(response.data) ? response.data : [response.data];
    }),
  );

  return responses.flat();
}

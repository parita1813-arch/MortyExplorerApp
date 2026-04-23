import { open, type Scalar } from '@op-engineering/op-sqlite';
import type { FavouriteCharacter } from '../types/api';

const DB_NAME = 'morty_explorer.db';
const TABLE_NAME = 'favourites';

const db = open({ name: DB_NAME });

/** Ensures SQLite table exists for favorites. */
export async function initFavouritesTable(): Promise<void> {
  await executeSql(
    `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      status TEXT NOT NULL,
      species TEXT NOT NULL,
      image TEXT NOT NULL,
      locationName TEXT NOT NULL
    )`,
  );
}

/** Reads all persisted favorite characters. */
export async function getFavouriteCharacters(): Promise<FavouriteCharacter[]> {
  return executeSql<FavouriteCharacter>(`SELECT * FROM ${TABLE_NAME} ORDER BY name ASC`);
}

/** Inserts or updates a favorite character row. */
export async function upsertFavouriteCharacter(character: FavouriteCharacter): Promise<void> {
  await executeSql(
    `INSERT OR REPLACE INTO ${TABLE_NAME}
      (id, name, status, species, image, locationName)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      character.id,
      character.name,
      character.status,
      character.species,
      character.image,
      character.locationName,
    ],
  );
}

/** Removes favorite by character id. */
export async function deleteFavouriteCharacter(id: number): Promise<void> {
  await executeSql(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]);
}

function executeSql<T = Record<string, unknown>>(
  query: string,
  params: (string | number)[] = [],
): Promise<T[]> {
  return db
    .execute(query, params as Scalar[])
    .then(result => result.rows as T[]);
}

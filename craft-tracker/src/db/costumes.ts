import db from './db';
import { newId, now } from './helpers';
import { Costume } from '../types';

export function getAllCostumes(): Costume[] {
  return db.getAllSync<Costume>(
    `SELECT * FROM costumes ORDER BY
       CASE WHEN faireDate IS NULL THEN 1 ELSE 0 END,
       faireDate ASC`
  );
}

export function getCostumeById(id: string): Costume | null {
  return db.getFirstSync<Costume>(`SELECT * FROM costumes WHERE id = ?`, [id]) ?? null;
}

export function createCostume(input: {
  name: string;
  coverImageUri?: string | null;
  notes?: string;
  faireDate?: string | null;
}): Costume {
  const id = newId();
  const timestamp = now();
  db.runSync(
    `INSERT INTO costumes (id, name, coverImageUri, notes, faireDate, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, input.name, input.coverImageUri ?? null, input.notes ?? '', input.faireDate ?? null, timestamp, timestamp]
  );
  return getCostumeById(id)!;
}

export function updateCostume(
  id: string,
  input: Partial<Pick<Costume, 'name' | 'coverImageUri' | 'notes' | 'faireDate'>>
): void {
  const existing = getCostumeById(id);
  if (!existing) return;
  const merged = { ...existing, ...input, updatedAt: now() };
  db.runSync(
    `UPDATE costumes SET name = ?, coverImageUri = ?, notes = ?, faireDate = ?, updatedAt = ? WHERE id = ?`,
    [merged.name, merged.coverImageUri, merged.notes, merged.faireDate, merged.updatedAt, id]
  );
}

export function deleteCostume(id: string): void {
  db.runSync(`DELETE FROM costumes WHERE id = ?`, [id]);
}

// Days until faireDate, or null if no date set. Negative means the date has passed.
export function daysUntil(faireDate: string | null): number | null {
  if (!faireDate) return null;
  const diffMs = new Date(faireDate).getTime() - new Date().setHours(0, 0, 0, 0);
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

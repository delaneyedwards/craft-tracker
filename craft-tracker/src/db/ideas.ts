import db from './db';
import { newId, now } from './helpers';
import { Idea, IdeaStatus, IdeaWithProgress } from '../types';

export function getIdeasForCostume(costumeId: string): IdeaWithProgress[] {
  return db.getAllSync<IdeaWithProgress>(
    `SELECT
       i.*,
       COUNT(s.id) as totalSteps,
       SUM(CASE WHEN s.isDone THEN 1 ELSE 0 END) as doneSteps
     FROM ideas i
     LEFT JOIN steps s ON s.ideaId = i.id
     WHERE i.costumeId = ?
     GROUP BY i.id
     ORDER BY i.createdAt DESC`,
    [costumeId]
  );
}

export function getIdeaById(id: string): Idea | null {
  return db.getFirstSync<Idea>(`SELECT * FROM ideas WHERE id = ?`, [id]) ?? null;
}

export function createIdea(input: { costumeId: string; title: string; notes?: string }): Idea {
  const id = newId();
  const timestamp = now();
  db.runSync(
    `INSERT INTO ideas (id, costumeId, title, status, notes, createdAt, updatedAt)
     VALUES (?, ?, ?, 'idea', ?, ?, ?)`,
    [id, input.costumeId, input.title, input.notes ?? '', timestamp, timestamp]
  );
  return getIdeaById(id)!;
}

export function updateIdeaStatus(id: string, status: IdeaStatus): void {
  db.runSync(`UPDATE ideas SET status = ?, updatedAt = ? WHERE id = ?`, [status, now(), id]);
}

export function updateIdea(id: string, input: Partial<Pick<Idea, 'title' | 'notes'>>): void {
  const existing = getIdeaById(id);
  if (!existing) return;
  const merged = { ...existing, ...input, updatedAt: now() };
  db.runSync(`UPDATE ideas SET title = ?, notes = ?, updatedAt = ? WHERE id = ?`, [
    merged.title,
    merged.notes,
    merged.updatedAt,
    id,
  ]);
}

export function deleteIdea(id: string): void {
  db.runSync(`DELETE FROM ideas WHERE id = ?`, [id]);
}

// Powers the Workbench: every idea whose status is in `statuses`, across
// all costumes, with its parent costume's name and faire date attached
// so the screen can sort by deadline urgency.
export function getIdeasByStatuses(statuses: IdeaStatus[]): IdeaWithProgress[] {
  const placeholders = statuses.map(() => '?').join(',');
  return db.getAllSync<IdeaWithProgress>(
    `SELECT
       i.*,
       c.name as costumeName,
       c.faireDate as faireDate,
       COUNT(s.id) as totalSteps,
       SUM(CASE WHEN s.isDone THEN 1 ELSE 0 END) as doneSteps
     FROM ideas i
     JOIN costumes c ON c.id = i.costumeId
     LEFT JOIN steps s ON s.ideaId = i.id
     WHERE i.status IN (${placeholders})
     GROUP BY i.id
     ORDER BY
       CASE WHEN c.faireDate IS NULL THEN 1 ELSE 0 END,
       c.faireDate ASC`,
    statuses
  );
}

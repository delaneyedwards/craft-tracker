import db from './db';
import { newId, now } from './helpers';
import { Step } from '../types';

export function getStepsForIdea(ideaId: string): Step[] {
  return db
    .getAllSync<any>(`SELECT * FROM steps WHERE ideaId = ? ORDER BY orderIndex ASC`, [ideaId])
    .map((row) => ({ ...row, isDone: !!row.isDone }));
}

export function createStep(ideaId: string, title: string): Step {
  const id = newId();
  const existing = getStepsForIdea(ideaId);
  const orderIndex = existing.length;
  db.runSync(
    `INSERT INTO steps (id, ideaId, title, isDone, orderIndex, createdAt) VALUES (?, ?, ?, 0, ?, ?)`,
    [id, ideaId, title, orderIndex, now()]
  );
  return getStepsForIdea(ideaId).find((s) => s.id === id)!;
}

export function toggleStep(id: string, isDone: boolean): void {
  db.runSync(`UPDATE steps SET isDone = ? WHERE id = ?`, [isDone ? 1 : 0, id]);
}

export function deleteStep(id: string): void {
  db.runSync(`DELETE FROM steps WHERE id = ?`, [id]);
}

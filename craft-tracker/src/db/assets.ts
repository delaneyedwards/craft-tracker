import db from './db';
import { newId, now } from './helpers';
import { Asset, AssetType } from '../types';

export function getAssetsForIdea(ideaId: string): Asset[] {
  return db.getAllSync<Asset>(`SELECT * FROM assets WHERE ideaId = ? ORDER BY createdAt ASC`, [ideaId]);
}

export function createAsset(input: {
  ideaId: string;
  stepId?: string | null;
  type: AssetType;
  value: string;
}): Asset {
  const id = newId();
  const timestamp = now();
  db.runSync(
    `INSERT INTO assets (id, ideaId, stepId, type, value, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, input.ideaId, input.stepId ?? null, input.type, input.value, timestamp]
  );
  return { id, ideaId: input.ideaId, stepId: input.stepId ?? null, type: input.type, value: input.value, createdAt: timestamp };
}

export function deleteAsset(id: string): void {
  db.runSync(`DELETE FROM assets WHERE id = ?`, [id]);
}

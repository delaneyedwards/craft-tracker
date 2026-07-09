import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('craft-tracker.db');

// Schema notes:
// - Every table uses a UUID primary key (not autoincrement) and carries
//   updatedAt. This is deliberate even though we're local-only for now —
//   it's what makes adding cloud sync later a matter of pushing rows,
//   not a data-model migration.
// - Foreign keys use ON DELETE CASCADE so deleting a costume cleans up
//   its ideas, steps, and assets automatically.
export function initDatabase() {
  db.execSync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS costumes (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      coverImageUri TEXT,
      notes TEXT NOT NULL DEFAULT '',
      faireDate TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ideas (
      id TEXT PRIMARY KEY NOT NULL,
      costumeId TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'idea',
      notes TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (costumeId) REFERENCES costumes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS steps (
      id TEXT PRIMARY KEY NOT NULL,
      ideaId TEXT NOT NULL,
      title TEXT NOT NULL,
      isDone INTEGER NOT NULL DEFAULT 0,
      orderIndex INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (ideaId) REFERENCES ideas(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY NOT NULL,
      ideaId TEXT NOT NULL,
      stepId TEXT,
      type TEXT NOT NULL,
      value TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (ideaId) REFERENCES ideas(id) ON DELETE CASCADE,
      FOREIGN KEY (stepId) REFERENCES steps(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_ideas_costume ON ideas(costumeId);
    CREATE INDEX IF NOT EXISTS idx_steps_idea ON steps(ideaId);
    CREATE INDEX IF NOT EXISTS idx_assets_idea ON assets(ideaId);
  `);
}

export default db;

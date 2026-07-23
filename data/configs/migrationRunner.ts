import { dbPromise } from "@/data/providers/sqlite";
import { MIGRATIONS } from "./migrations";

/**
 * Run all pending database migrations.
 *
 * Reads `db_version` from the settings table.
 * If no version is stored (fresh install or pre‑migration update),
 * all migrations are applied sequentially.
 * On subsequent launches only new migrations run.
 */
export async function runMigrations(): Promise<void> {
  const db = await dbPromise;

  // Ensure settings table exists (needed to read/store version)
  await db.runAsync(
    `CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT,
      value TEXT,
      UNIQUE(key)
    );`
  );

  // Read current schema version
  let currentVersion: number | null = null;
  try {
    const row = await db.getFirstAsync<{ value: string }>(
      "SELECT value FROM settings WHERE key = ?",
      ["db_version"]
    );
    if (row?.value) {
      currentVersion = parseInt(row.value, 10);
    }
  } catch {
    // settings table may not exist yet on very first fresh install
  }

  const latestVersion = MIGRATIONS.length;

  if (currentVersion === latestVersion) {
    console.log(`✅ Database schema is up to date (v${currentVersion})`);
    return;
  }

  console.log(
    `🔄 Running migrations from v${currentVersion ?? 0} to v${latestVersion}...`
  );

  for (const migration of MIGRATIONS) {
    if (currentVersion != null && migration.version <= currentVersion) {
      continue; // already applied
    }

    try {
      await migration.up(db);
      // Persist after each successful migration
      await db.runAsync(
        "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
        ["db_version", String(migration.version)]
      );
      console.log(`✅ Migration v${migration.version} committed`);
    } catch (error) {
      console.error(
        `‼️ Migration v${migration.version} (${migration.name}) failed:`,
        error
      );
      throw error;
    }
  }

  console.log(`✅ All migrations complete. Schema at v${latestVersion}`);
}
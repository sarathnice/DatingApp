import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { describe, expect, it } from "vitest";

describe("Mila initial migration", () => {
  it("applies cleanly and creates all 19 tables", () => {
    const database = new DatabaseSync(":memory:");
    const migration = readFileSync(
      new URL("../drizzle/0000_flippant_wallflower.sql", import.meta.url),
      "utf8",
    ).replaceAll("--> statement-breakpoint", "");

    database.exec(migration);
    const result = database.prepare(
      "SELECT count(*) AS count FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
    ).get() as { count: number };

    expect(result.count).toBe(19);
    database.close();
  });
});

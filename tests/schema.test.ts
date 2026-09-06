import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import * as schema from "../db/schema";

describe("Mila database schema", () => {
  it("contains the 19 documented application tables", () => {
    const tableNames = Object.values(schema).map((table) => getTableName(table)).sort();
    expect(tableNames).toHaveLength(19);
    expect(tableNames).toContain("users");
    expect(tableNames).toContain("profiles");
    expect(tableNames).toContain("matches");
    expect(tableNames).toContain("messages");
    expect(tableNames).toContain("subscriptions");
  });
});

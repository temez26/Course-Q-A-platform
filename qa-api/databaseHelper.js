// Helper functions
export async function insertIntoTable(table, fields, values, returning) {
  const query = sql`INSERT INTO ${sql(table)} (${sql(fields)}) VALUES (${sql(
    values
  )}) ${returning ? sql`RETURNING ${sql(returning)}` : sql``}`;
  return await query;
}

export async function selectFromTable(table, condition) {
  const query = condition
    ? sql`SELECT * FROM ${sql(table)} WHERE ${sql(condition)}`
    : sql`SELECT * FROM ${sql(table)}`;
  return await query;
}

export async function updateTable(table, updates, condition) {
  const query = sql`UPDATE ${sql(table)} SET ${sql(updates)} WHERE ${sql(
    condition
  )}`;
  return await query;
}

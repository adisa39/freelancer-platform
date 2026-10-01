type JsonObject = Record<string, unknown>;

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function asObject(value: unknown): JsonObject | null {
  return typeof value === "object" && value !== null
    ? (value as JsonObject)
    : null;
}

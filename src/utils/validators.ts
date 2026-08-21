import * as z from "zod/mini";

export const SnowflakeSchema = z.string().check(z.regex(/^\d{17,21}$/, "Invalid Snowflake ID"));
/**
 * Accepts both a plain ISO 8601 date (`2024-01-01`) and a full ISO 8601 datetime
 * with an optional timezone offset and arbitrary fractional-second precision
 * (e.g. `2026-08-21T22:02:18.0014413+00:00`), matching the formats Top.gg sends.
 */
export const ISO8601DateSchema = z.union([z.iso.date(), z.iso.datetime({ offset: true, local: true })]);

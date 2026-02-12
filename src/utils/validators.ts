import * as z from "zod/mini";

export const SnowflakeSchema = z.string().check(z.regex(/^\d{17,21}$/, "Invalid Snowflake ID"));
export const ISO8601DateSchema = z.iso.date();

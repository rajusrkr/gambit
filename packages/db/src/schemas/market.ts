import {
  bigint,
  decimal,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { admin } from "./admin";

export const marketCategory = pgEnum("market_category", [
  "sports",
  "crypto",
  "weather",
]);
export const marketStatus = pgEnum("market_status", [
  "open",
  "settled",
  "new_order_paused",
  "open_soon",
  "canceled",
]);

export const market = pgTable("market", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  settlementRules: text("settlement_rules").notNull(),
  category: marketCategory("category").notNull(),
  winner: text("winner"),
  marketStatus: marketStatus("status").notNull().default("open_soon"),

  // Market start and ending time
  marketStarts: bigint("market_starts", { mode: "number" }).notNull(),
  marketEnds: bigint("market_ends", { mode: "number" }).notNull(),

  createdBy: text("created_by").references(() => admin.id, {
    onDelete: "cascade",
  }),

  // Market create and update timestamp
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

// Outcomes
export const marketOutcomes = pgTable("outcomes", {
  id: uuid("id").primaryKey().defaultRandom(),
  marketId: uuid("market_id").references(() => market.id, {
    onDelete: "cascade",
  }).notNull(),

  liquidityParameter: integer("liquidity_parameter").notNull(),
  titles: text("title").array().notNull(),
  volume: integer("volume").array().notNull(),
  prices: decimal("prices", { precision: 36, scale: 18, mode: "number" }).array().notNull(),
});

// Sports category
export const sportsCategory = pgTable("sports_category", {
  id: uuid("id").primaryKey().defaultRandom(),
  match: text("match").notNull(),
  matchId: text("match_id").notNull(),
  matchStarts: bigint("match_starts", { mode: "number" }).notNull(),
  matchEnds: bigint("match_ends", { mode: "number" }).notNull(),
  marketId: uuid("market_id").references(() => market.id, {
    onDelete: "cascade",
  }),
});

// Crypto category
export const cryptoCategory = pgTable("crypto_category", {
  id: uuid("id").primaryKey().defaultRandom(),
  interval: text("interval").notNull(),
  cryptoName: text("crypto_name").notNull(),
  marketId: uuid("market_id").references(() => market.id, {
    onDelete: "cascade",
  }),
});

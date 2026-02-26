import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { market } from "./market";
import { user } from "./user";

export const positionStatus = pgEnum("position_status", [
  "open",
  "partially_open",
  "settled",
]);

export const position = pgTable(
  "position",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Position taken by
    positionTakenBy: text("position_taken_by")
      .references(() => user.id, {
        onDelete: "cascade",
      })
      .notNull(),

    // Market details
    positionTakenIn: uuid("position_taken_in")
      .references(() => market.id, { onDelete: "cascade" })
      .notNull(),
    positionTakenFor: text("position_taken_for").notNull(),

    qty: integer("qty").notNull(),
    atTotalCost: decimal("at_total_cost", {
      precision: 36,
      scale: 18,
      mode: "string",
    }).notNull(),
    avgPrice: decimal("avg_price", {
      precision: 36,
      scale: 18,
      mode: "string",
    }).notNull(),

    pnl: decimal("pnl", { precision: 36, scale: 18, mode: "string" }),
    positionStatus: positionStatus("position_status").notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => ({
    uniquePosition: uniqueIndex("unique_position_idx").on(
      table.positionTakenBy,
      table.positionTakenFor,
      table.positionTakenIn,
    ),
  }),
);

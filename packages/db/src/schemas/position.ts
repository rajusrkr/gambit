import {
  bigint,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { market } from "./market";
import { user } from "./user";

interface TotalQtyAndAvgPrice {
  qty: number;
  avgPrice: number;
  atTotalCost: number;
}

export const positionStatus = pgEnum("position_status", [
  "open",
  "partially_open",
  "settled",
]);

export const position = pgTable("position", {
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
  totalQtyAndAvgPrice: jsonb("total_qty_and_avg_price")
    .$type<TotalQtyAndAvgPrice>()
    .notNull(),

  pnl: bigint("pnl", { mode: "number" }),
  positionStatus: positionStatus("position_status").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

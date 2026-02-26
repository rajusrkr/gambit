import {
  decimal,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { market } from "./market";
import { user } from "./user";

interface Outcomes {
  title: string,
  volume: number,
  price: string
}

export const orderType = pgEnum("order_type", ["buy", "sell"]);
export const orderStatus = pgEnum("order_status", ["success", "failed"]);

export const order = pgTable("order", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Order placed by
  orderPlacedBy: text("order_placed_by")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  // Market details
  orderTakenIn: uuid("order_taken_in")
    .references(() => market.id, { onDelete: "cascade" })
    .notNull(),
  orderPlacedFor: text("order_placed_for").notNull(),
  orderType: orderType("order_type").notNull(),
  qty: integer("qty").notNull(),
  averageTradedPrice: decimal("average_traded_price", {
    precision: 36,
    scale: 18,
    mode: "string",
  }),

  // Updated price details, will be used as price data
  updatedPrices: jsonb("updated_prices").$type<Outcomes[]>(),

  // Order data
  orderStatus: orderStatus("order_status").notNull(),
  orderFailureReason: text("order_failure_reason"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
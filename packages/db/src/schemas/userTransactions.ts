import {
  decimal,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const transactionTypes = pgEnum("transaction_types", [
  "credit",
  "debit",
]);
export const reasonTypes = pgEnum("reason_types", [
  "trade:buy",
  "trade:sell",
  "deposit",
  "withdrawal",
  "charge",
]);

export const userTransactions = pgTable("user_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  transactionType: transactionTypes("transaction_type").notNull(),
  reason: reasonTypes("reason").notNull(),
  details: text("details").notNull(),
  amount: decimal("amount", {
    precision: 36,
    scale: 18,
    mode: "string",
  }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => new Date())
    .notNull(),
});

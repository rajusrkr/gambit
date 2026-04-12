import type { PgEnum } from "drizzle-orm/pg-core";
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

export const positionStatus: PgEnum<["open", "settled"]> = pgEnum(
	"position_status",
	["open", "settled"],
);

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

		buyQty: integer("buy_qty").notNull(),
		sellQty: integer("sell_qty").notNull().default(0),
		availableQty: integer("available_qty").notNull().default(0),

		buyTradeCost: decimal("buy_trade_cost", {
			precision: 36,
			scale: 18,
			mode: "string",
		}).notNull(),
		sellTradeReturn: decimal("sell_trade_return", {
			precision: 36,
			scale: 18,
			mode: "string",
		})
			.notNull()
			.default("0"),
		buyAvgPrice: decimal("buy_avg_price", {
			precision: 36,
			scale: 18,
			mode: "string",
		}).notNull(),
		sellAvgPrice: decimal("sell_avg_price", {
			precision: 36,
			scale: 18,
			mode: "string",
		})
			.notNull()
			.default("0"),
		realizedPnl: decimal("realized_pnl", {
			precision: 36,
			scale: 18,
			mode: "string",
		})
			.notNull()
			.default("0"),
		positionStatus: positionStatus("position_status").notNull(),

		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
			() => new Date(),
		),
	},
	(table) => ({
		uniquePosition: uniqueIndex("unique_position_idx").on(
			table.positionTakenBy,
			table.positionTakenFor,
			table.positionTakenIn,
		),
	}),
);

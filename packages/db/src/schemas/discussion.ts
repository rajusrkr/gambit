import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { market } from "./market";
import { user } from "./user";

export const discussionRoom = pgTable("discussionRoom", {
	id: uuid("id")
		.primaryKey()
		.$defaultFn(() => uuidv7())
		.notNull(),
	marketId: uuid("market_id")
		.references(() => market.id)
		.notNull(),
});

export const discussions = pgTable("discussions", {
	id: uuid("id")
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	discussionRef: uuid("discussion_ref")
		.references(() => discussionRoom.id, { onDelete: "cascade" })
		.notNull(),
	message: text("message").notNull(),
	messageBy: text("message_by")
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});

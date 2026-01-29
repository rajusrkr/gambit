import { pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const adminRequestStatus = pgEnum("admin_request_status", ["rejected", "approved"])

export const adminRequest = pgTable("admin_request", {
    id: uuid("id").primaryKey().defaultRandom(),
    // requestBy: uuid("reques_by").references(() =>)

    status: adminRequestStatus("status").notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
})
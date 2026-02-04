import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { admin } from "./admin";

export const adminRequestStatus = pgEnum("admin_request_status", [
  "rejected",
  "approved",
]);

export const adminRequest = pgTable("admin_request", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestBy: text("reques_by").references(() => admin.id, {
    onDelete: "cascade",
  }),

  status: adminRequestStatus("status").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

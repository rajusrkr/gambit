import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const admin = pgTable("admin", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  role: text("role", { enum: ["admin", "superAdmin"] })
    .default("admin")
    .notNull(),
  isFullNameVisible: boolean("is_full_name_visible").default(true),
  isUserNameVisible: boolean("is_user_name_visible").default(true),
  approval: text("approval", { enum: ["approved", "pending", "rejected"] })
    .default("pending")
    .notNull(),
  permissions: jsonb("permissions"),
});

export const adminSession = pgTable(
  "admin_session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => admin.id, { onDelete: "cascade" }),
  },
  (table) => [index("adminSession_userId_idx").on(table.userId)],
);

export const adminAccount = pgTable(
  "admin_account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => admin.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("adminAccount_userId_idx").on(table.userId)],
);

export const adminVerification = pgTable(
  "admin_verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("adminVerification_identifier_idx").on(table.identifier)],
);

export const adminTwoFactor = pgTable(
  "admin_two_factor",
  {
    id: text("id").primaryKey(),
    secret: text("secret").notNull(),
    backupCodes: text("backup_codes").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => admin.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("adminTwoFactor_secret_idx").on(table.secret),
    index("adminTwoFactor_userId_idx").on(table.userId),
  ],
);

export const adminRelations = relations(admin, ({ many }) => ({
  adminSessions: many(adminSession),
  adminAccounts: many(adminAccount),
  adminTwoFactors: many(adminTwoFactor),
}));

export const adminSessionRelations = relations(adminSession, ({ one }) => ({
  admin: one(admin, {
    fields: [adminSession.userId],
    references: [admin.id],
  }),
}));

export const adminAccountRelations = relations(adminAccount, ({ one }) => ({
  admin: one(admin, {
    fields: [adminAccount.userId],
    references: [admin.id],
  }),
}));

export const adminTwoFactorRelations = relations(adminTwoFactor, ({ one }) => ({
  admin: one(admin, {
    fields: [adminTwoFactor.userId],
    references: [admin.id],
  }),
}));

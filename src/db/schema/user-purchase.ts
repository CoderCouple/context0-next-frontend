import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { user } from "./user";

export const userPurchase = pgTable("user_purchase", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),

  stripeId: varchar("stripe_id", { length: 255 }).notNull().unique(),

  description: varchar("description", { length: 1024 }),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 10 }),
  date: timestamp("date", { withTimezone: true }),

  createdBy: uuid("created_by")
    .notNull()
    .references(() => user.id),
  updatedBy: uuid("updated_by")
    .notNull()
    .references(() => user.id),

  isDeleted: boolean("is_deleted").notNull().default(false),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const userPurchaseRelations = relations(userPurchase, ({ one }) => ({
  user: one(user, {
    fields: [userPurchase.userId],
    references: [user.id],
  }),
  creator: one(user, {
    fields: [userPurchase.createdBy],
    references: [user.id],
  }),
  updater: one(user, {
    fields: [userPurchase.updatedBy],
    references: [user.id],
  }),
}));

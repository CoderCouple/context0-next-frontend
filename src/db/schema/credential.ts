import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { user } from "./user";

export const credential = pgTable("credential", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),

  name: varchar("name", { length: 255 }).notNull(),
  value: varchar("value", { length: 2048 }).notNull(), // long enough for secrets, tokens, etc.

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

export const credentialRelations = relations(credential, ({ one }) => ({
  user: one(user, {
    fields: [credential.userId],
    references: [user.id],
  }),
  creator: one(user, {
    fields: [credential.createdBy],
    references: [user.id],
  }),
  updater: one(user, {
    fields: [credential.updatedBy],
    references: [user.id],
  }),
}));

import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { executionPhase } from "./execution-phase";
import { user } from "./user";

export const executionLog = pgTable("execution_log", {
  id: uuid("id").primaryKey().defaultRandom(),

  executionPhaseId: uuid("execution_phase_id") // ← db column is snake_case
    .notNull()
    .references(() => executionPhase.id), // ← field name is camelCase

  logLevel: varchar("log_level", { length: 20 }).notNull(),
  message: varchar("message", { length: 2048 }).notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),

  createdBy: uuid("created_by")
    .notNull()
    .references(() => user.id),
  updatedBy: uuid("updated_by")
    .notNull()
    .references(() => user.id),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const executionLogRelations = relations(executionLog, ({ one }) => ({
  executionPhase: one(executionPhase, {
    fields: [executionLog.executionPhaseId],
    references: [executionPhase.id],
  }),
  creator: one(user, {
    fields: [executionLog.createdBy],
    references: [user.id],
  }),
  updater: one(user, {
    fields: [executionLog.updatedBy],
    references: [user.id],
  }),
}));

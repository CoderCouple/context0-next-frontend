import { relations } from "drizzle-orm";
import {
  boolean,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { user } from "./user";

export const workflow = pgTable("workflow", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),

  name: varchar("name", { length: 255 }),
  description: varchar("description", { length: 1024 }),
  definition: text("definition"),
  executionPlan: text("execution_plan"),
  cron: varchar("cron", { length: 100 }),
  status: varchar("status", { length: 50 }).notNull(),

  creditsCost: numeric("credits_cost"),
  lastRunAt: timestamp("last_run_at", { withTimezone: true }),
  lastRunId: uuid("last_run_id"),
  lastRunStatus: varchar("last_run_status", { length: 50 }),
  nextRunAt: timestamp("next_run_at", { withTimezone: true }),

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

export const workflowRelations = relations(workflow, ({ one }) => ({
  user: one(user, {
    fields: [workflow.userId],
    references: [user.id],
  }),
  creator: one(user, {
    fields: [workflow.createdBy],
    references: [user.id],
  }),
  updater: one(user, {
    fields: [workflow.updatedBy],
    references: [user.id],
  }),
}));

type Workflow = typeof workflow.$inferSelect;
export type { Workflow };

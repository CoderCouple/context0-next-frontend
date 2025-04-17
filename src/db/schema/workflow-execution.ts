import { relations } from "drizzle-orm";
import {
  boolean,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { user } from "./user";
import { workflow } from "./workflow";

export const workflowExecution = pgTable("workflow_execution", {
  id: uuid("id").primaryKey().defaultRandom(),

  workflowId: uuid("workflow_id")
    .notNull()
    .references(() => workflow.id),

  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),

  trigger: varchar("trigger", { length: 255 }),
  status: varchar("status", { length: 50 }),

  creditsConsumed: numeric("credits_consumed"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),

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
});

export const workflowExecutionRelations = relations(
  workflowExecution,
  ({ one }) => ({
    workflow: one(workflow, {
      fields: [workflowExecution.workflowId],
      references: [workflow.id],
    }),
    user: one(user, {
      fields: [workflowExecution.userId],
      references: [user.id],
    }),
    creator: one(user, {
      fields: [workflowExecution.createdBy],
      references: [user.id],
    }),
    updater: one(user, {
      fields: [workflowExecution.updatedBy],
      references: [user.id],
    }),
  })
);

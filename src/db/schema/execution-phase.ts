import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { user } from "./user";
import { workflowExecution } from "./workflow-execution";

export const executionPhase = pgTable("execution_phase", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id") // DB column = user_id
    .notNull()
    .references(() => user.id),

  workflowExecutionId: uuid("workflow_execution_id")
    .notNull()
    .references(() => workflowExecution.id),

  status: varchar("status", { length: 50 }).notNull(),
  number: integer("number").notNull(),
  node: varchar("node", { length: 255 }),
  name: varchar("name", { length: 255 }),

  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),

  inputs: text("inputs"),
  outputs: text("outputs"),

  creditsConsumed: numeric("credits_consumed"),

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

export const executionPhaseRelations = relations(executionPhase, ({ one }) => ({
  user: one(user, {
    fields: [executionPhase.userId],
    references: [user.id],
  }),
  creator: one(user, {
    fields: [executionPhase.createdBy],
    references: [user.id],
  }),
  updater: one(user, {
    fields: [executionPhase.updatedBy],
    references: [user.id],
  }),
  workflowExecution: one(workflowExecution, {
    fields: [executionPhase.workflowExecutionId],
    references: [workflowExecution.id],
  }),
}));

import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  role: text("role").notNull().default("user"),
  phone: varchar("phone", { length: 256 }),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  avatar: varchar("avatar", { length: 2048 }).notNull(),
});

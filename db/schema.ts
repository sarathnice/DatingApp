import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
};

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  phone: text("phone"),
  status: text("status", { enum: ["active", "paused", "suspended", "deleted"] }).notNull().default("active"),
  birthDate: text("birth_date").notNull(),
  ...timestamps,
}, (table) => [uniqueIndex("idx_users_email").on(table.email), uniqueIndex("idx_users_phone").on(table.phone)]);

export const profiles = sqliteTable("profiles", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  gender: text("gender").notNull(),
  bio: text("bio"),
  jobTitle: text("job_title"),
  employer: text("employer"),
  school: text("school"),
  educationLevel: text("education_level"),
  city: text("city").notNull(),
  countryCode: text("country_code").notNull(),
  latitude: integer("latitude_e6"),
  longitude: integer("longitude_e6"),
  relationshipGoal: text("relationship_goal").notNull(),
  languagesJson: text("languages_json").notNull().default("[]"),
  verifiedAt: integer("verified_at", { mode: "timestamp_ms" }),
  ...timestamps,
}, (table) => [index("idx_profiles_location").on(table.countryCode, table.city), index("idx_profiles_goal").on(table.relationshipGoal)]);

export const profileMedia = sqliteTable("profile_media", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  storageKey: text("storage_key").notNull(),
  mediaType: text("media_type", { enum: ["photo", "video"] }).notNull(),
  position: integer("position").notNull(),
  moderationStatus: text("moderation_status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [uniqueIndex("idx_profile_media_position").on(table.userId, table.position), uniqueIndex("idx_profile_media_storage_key").on(table.storageKey)]);

export const profilePrompts = sqliteTable("profile_prompts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  promptKey: text("prompt_key").notNull(),
  answer: text("answer").notNull(),
  position: integer("position").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [uniqueIndex("idx_profile_prompts_position").on(table.userId, table.position)]);

export const interests = sqliteTable("interests", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  category: text("category").notNull(),
}, (table) => [uniqueIndex("idx_interests_label").on(table.label)]);

export const profileInterests = sqliteTable("profile_interests", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  interestId: text("interest_id").notNull().references(() => interests.id, { onDelete: "cascade" }),
}, (table) => [primaryKey({ columns: [table.userId, table.interestId] })]);

export const discoveryPreferences = sqliteTable("discovery_preferences", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  interestedInJson: text("interested_in_json").notNull(),
  minAge: integer("min_age").notNull(),
  maxAge: integer("max_age").notNull(),
  maxDistanceMiles: integer("max_distance_miles").notNull(),
  goalsJson: text("goals_json").notNull().default("[]"),
  dealbreakersJson: text("dealbreakers_json").notNull().default("[]"),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const swipes = sqliteTable("swipes", {
  id: text("id").primaryKey(),
  actorUserId: text("actor_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  targetUserId: text("target_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  decision: text("decision", { enum: ["like", "pass"] }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [uniqueIndex("idx_swipes_pair").on(table.actorUserId, table.targetUserId), index("idx_swipes_target_decision").on(table.targetUserId, table.decision)]);

export const favorites = sqliteTable("favorites", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  favoriteUserId: text("favorite_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [primaryKey({ columns: [table.userId, table.favoriteUserId] })]);

export const matches = sqliteTable("matches", {
  id: text("id").primaryKey(),
  userAId: text("user_a_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  userBId: text("user_b_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["active", "unmatched", "blocked"] }).notNull().default("active"),
  matchedAt: integer("matched_at", { mode: "timestamp_ms" }).notNull(),
  endedAt: integer("ended_at", { mode: "timestamp_ms" }),
}, (table) => [uniqueIndex("idx_matches_pair").on(table.userAId, table.userBId), index("idx_matches_user_b_status").on(table.userBId, table.status)]);

export const introductions = sqliteTable("introductions", {
  id: text("id").primaryKey(),
  senderUserId: text("sender_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  recipientUserId: text("recipient_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  status: text("status", { enum: ["pending", "accepted", "declined", "expired"] }).notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  respondedAt: integer("responded_at", { mode: "timestamp_ms" }),
}, (table) => [index("idx_introductions_recipient_status").on(table.recipientUserId, table.status)]);

export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  matchId: text("match_id").notNull().references(() => matches.id, { onDelete: "cascade" }),
  lastMessageAt: integer("last_message_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [uniqueIndex("idx_conversations_match").on(table.matchId), index("idx_conversations_last_message").on(table.lastMessageAt)]);

export const conversationMembers = sqliteTable("conversation_members", {
  conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lastReadAt: integer("last_read_at", { mode: "timestamp_ms" }),
}, (table) => [primaryKey({ columns: [table.conversationId, table.userId] }), index("idx_conversation_members_user").on(table.userId)]);

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderUserId: text("sender_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  messageType: text("message_type", { enum: ["text", "voice", "system"] }).notNull().default("text"),
  sentAt: integer("sent_at", { mode: "timestamp_ms" }).notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
}, (table) => [index("idx_messages_conversation_sent").on(table.conversationId, table.sentAt)]);

export const blocks = sqliteTable("blocks", {
  blockerUserId: text("blocker_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  blockedUserId: text("blocked_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [primaryKey({ columns: [table.blockerUserId, table.blockedUserId] }), index("idx_blocks_blocked_user").on(table.blockedUserId)]);

export const reports = sqliteTable("reports", {
  id: text("id").primaryKey(),
  reporterUserId: text("reporter_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  reportedUserId: text("reported_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  details: text("details"),
  status: text("status", { enum: ["open", "reviewing", "resolved", "dismissed"] }).notNull().default("open"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  resolvedAt: integer("resolved_at", { mode: "timestamp_ms" }),
}, (table) => [index("idx_reports_status_created").on(table.status, table.createdAt), index("idx_reports_reported_user").on(table.reportedUserId)]);

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider", { enum: ["apple", "google", "web"] }).notNull(),
  providerReference: text("provider_reference").notNull(),
  plan: text("plan").notNull(),
  status: text("status", { enum: ["active", "past_due", "cancelled", "expired"] }).notNull(),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp_ms" }),
  ...timestamps,
}, (table) => [uniqueIndex("idx_subscriptions_provider_reference").on(table.provider, table.providerReference), index("idx_subscriptions_user_status").on(table.userId, table.status)]);

export const boosts = sqliteTable("boosts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["available", "scheduled", "active", "completed", "cancelled"] }).notNull().default("available"),
  scheduledFor: integer("scheduled_for", { mode: "timestamp_ms" }),
  startedAt: integer("started_at", { mode: "timestamp_ms" }),
  endsAt: integer("ends_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [index("idx_boosts_user_status").on(table.userId, table.status), index("idx_boosts_schedule").on(table.status, table.scheduledFor)]);

export const userSettings = sqliteTable("user_settings", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  theme: text("theme").notNull().default("sunrise"),
  locale: text("locale").notNull().default("en"),
  profileVisibility: text("profile_visibility", { enum: ["everyone", "liked_only", "hidden"] }).notNull().default("everyone"),
  voiceBriefingEnabled: integer("voice_briefing_enabled", { mode: "boolean" }).notNull().default(false),
  voiceBriefingTime: text("voice_briefing_time"),
  notificationsJson: text("notifications_json").notNull().default("{}"),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

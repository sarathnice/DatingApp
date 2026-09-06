# Mila application architecture

## Current data model: 19 tables

| Area | Tables |
| --- | --- |
| Identity and profile | `users`, `profiles`, `profile_media`, `profile_prompts`, `user_settings` |
| Discovery | `interests`, `profile_interests`, `discovery_preferences`, `swipes`, `favorites` |
| Connections | `matches`, `introductions`, `conversations`, `conversation_members`, `messages` |
| Trust and revenue | `blocks`, `reports`, `subscriptions`, `boosts` |

The first migration is generated from `db/schema.ts`. D1 stores structured records. R2 stores private photo, video, and voice bytes; `profile_media.storage_key` stores only the object reference and moderation state.

## Runtime shape

1. **Responsive clients** — the `/web` application supports desktop and mobile browsers. The existing `/` route remains the iOS and Android product preview. Native iOS and Android clients can reuse the same API contract after private-beta flows stabilize.
2. **Worker API** — Vinext runs on Cloudflare Workers. Route handlers validate sessions and authorize every record by the authenticated user before reading or writing D1 or R2.
3. **Relational state** — D1 owns profiles, discovery decisions, matches, conversations, safety actions, subscriptions, and Boost state. Migrations are append-only and applied during deployment.
4. **Media storage** — R2 owns media bytes. Uploads require type and size validation, malware scanning, moderation, private access, and deletion jobs before public beta.
5. **AI boundary** — voice briefings, match explanations, and message drafts remain suggestions. The user must confirm any Like, Introduction, or message before it is sent.

## Request flow

`Browser or native app → authenticated Worker route → authorization policy → D1/R2 → response`

Blocking and reporting are checked before discovery results and before every messaging operation. Subscription and Boost entitlements are checked server-side; client state never grants premium access.

## Remaining private-beta work

- Connect authentication and session middleware.
- Replace demo profiles in `/web` with authorized D1 queries.
- Add signed R2 upload and delivery routes plus moderation processing.
- Add server-side mutations for likes, matches, introductions, chat, block, report, subscriptions, and Boosts.
- Add rate limiting, audit events, backups, account export/deletion, and operational monitoring.

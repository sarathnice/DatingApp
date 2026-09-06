# Mila production readiness

The current milestone creates a repeatable, tested delivery foundation. The visual product is functional as a prototype, but real user accounts and payments should not launch until the following systems are complete.

## Delivery path

1. **Test foundation — now**
   - Type checking, unit tests, mobile browser smoke tests, and production builds run in CI.
   - Docker provides a consistent local and staging-like runtime.
   - A health endpoint supports container monitoring.

2. **Private beta**
   - Phone/email verification and secure account sessions.
   - Database-backed profiles, preferences, likes, matches, blocks, reports, and messages.
   - Private media storage with upload validation, malware scanning, moderation, and deletion.
   - Invite-only users, seeded test profiles, audit logs, backups, and restore drills.

3. **Payments and trust**
   - App Store and Play billing for native subscriptions; an approved web payment provider for web purchases.
   - Server-side entitlement checks for Introductions and Boosts. Never trust client state.
   - Receipt validation, renewals, refunds, cancellation state, regional pricing, taxes, and purchase restoration.
   - Human moderation queues, appeals, rate limits, abuse detection, and age assurance.

4. **Production launch**
   - Privacy policy, terms, community guidelines, data export/deletion, consent records, and retention schedules.
   - Monitoring, error reporting, security alerts, uptime checks, performance budgets, and incident response.
   - Accessibility review, localization, notification preferences, and regional compliance review.

## Recommended architecture

- **Clients:** responsive web first; React Native/Expo for iOS and Android once the API contract stabilizes.
- **API:** typed server endpoints with authentication and authorization on every user-owned record.
- **Data:** relational database for user and match state; object storage for photos/video; a queue for moderation and notifications.
- **Realtime:** managed WebSocket or event service for chats, with durable message storage and delivery receipts.
- **AI:** isolated service boundary, explicit user confirmation before sending, prompt/output logging with redaction, safety filters, and a non-AI fallback.

## Release gates

- No critical or high known vulnerabilities in production dependencies.
- Automated authorization tests for every private resource.
- Payment entitlements verified server-side.
- Block/report actions take effect immediately across discovery and messaging.
- Backups and account deletion tested end to end.
- App review, privacy disclosures, moderation coverage, and incident ownership completed.

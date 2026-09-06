# Mila competitive settings and safety research

Date: September 6, 2026  
Scope: public product and help documentation from Tinder, Bumble, Hinge, Coffee Meets Bagel, Match, and Feeld. No private dating account was accessed.

## Executive recommendation

Mila should match the market on account, discovery, visibility, notification, subscription, and safety controls, but should not copy a competitor's long settings sheet. The better structure is four plain-language groups: **Account**, **Discovery & visibility**, **Privacy & safer conversations**, and **Notifications & media**.

The product advantage should be a consent-aware relationship assistant—not an autonomous dating bot. Every AI-authored profile change, like, introduction, and message must require the user to review and confirm it. Hinge explicitly prohibits bots and automated swiping tools, which also reflects the trust risk of silent automation.

## Evidence from current products

| Product | Useful pattern | Mila decision |
| --- | --- | --- |
| Tinder | Discovery can be turned off while existing matches and chats remain available; age and distance can be dealbreakers. | Keep Mila's discovery switch, explain its effect inline, and retain matched chats. |
| Bumble | Snooze supports 24 hours, 72 hours, one week, or indefinite breaks while retaining conversations. | Add a clear pause selector and reuse Mila's Life Change Mode for richer context. |
| Bumble | Photo/ID verification, in-app voice/video, explicit-image detection, block/report, and deception detection are grouped as safety tools. | Keep safety free; add verified-only messages and pre-send message review. |
| Hinge | Preferences distinguish hard dealbreakers from ranking preferences. | Keep Mila's Must-have / Prefer / Open-minded model. |
| Hinge | “We Met” collects private post-date feedback and can improve future recommendations. | Build a private Date Debrief in the next safety release. |
| Coffee Meets Bagel | Activity reports, read receipts, boosts, incognito, and curated daily suggestions are premium controls. | Keep one understandable Mila Plus tier; do not split basic safety across tiers. |
| Feeld | Incognito reveals a profile only to people the member liked first; private photos can be limited to connections. | Add Incognito now; evaluate connection-only media later. |
| Match | Safe-message filtering, scam education, public-place guidance, and friend check-ins are emphasized. | Add harmful-message review and make Share a Date Plan a first-class safety action. |

## Gap matrix

| Capability | Before this release | Release decision |
| --- | --- | --- |
| Account phone, email, connected sign-in methods | Missing | Added to settings hub with masked personal data |
| Payment/subscription management entry | Membership screen existed | Added a direct account entry |
| Discovery on/off with clear consequences | “Hide my profile” existed | Added the positive “Enable discovery” control and retained matches explanation |
| Incognito visibility | Mentioned in plan benefits | Added as an explicit visibility mode |
| Balanced vs recently active ordering | Missing | Added; Balanced remains the default |
| Timed pause/snooze | Life Change Mode only | Added 24h, 72h, one week, and indefinite options |
| Verified-only messaging | Missing | Added |
| Pre-send harmful-language review | Missing | Added with user control and no automatic sending |
| Block contacts | Missing | Added as a safety entry point |
| Date-plan sharing | Date-plan demo existed elsewhere | Added as a first-class settings action |
| Push/email/SMS controls | Registration copy only | Added individual controls |
| Autoplay and active status | Missing | Added |
| Support, privacy choices, terms, logout, delete | Mentioned but not navigable | Added grouped entry points and safe preview actions |

## What Mila should build next

### Release 1 — trust fundamentals

- Real identity and age assurance with liveness checks, privacy retention disclosure, and an explicit warning that verification reduces risk but is not a guarantee.
- Working block-contact import using privacy-preserving contact hashes.
- Global Safety Center with localized crisis and legal resources.
- Share a Date Plan with an expiring link, trusted-contact check-in, and easy emergency exit.
- Download data, revoke permissions, and deletion with identity confirmation and a cooling-off window.

### Release 2 — helpful, user-controlled AI

- Conversation risk review for harassment, coercion, money requests, off-platform pressure, and likely scams.
- Profile Coach that explains suggestions and never publishes without approval.
- Private Date Debrief that adapts recommendations without exposing feedback to the other person.
- Photo Selector that runs on-device where possible and never uploads the camera roll for analysis.
- Voice briefing with granular privacy controls, discreet output, and confirmation before every like or message.

### Release 3 — Mila-only relationship intelligence

- Boundary Passport: mutual, contextual permissions for voice, video, location, and date planning.
- Connection Capacity: reduce new recommendations when the user reaches their chosen conversation limit.
- Reciprocal Fairness: prevent popularity-only ranking and explain why a recommendation appeared.
- Pace Modes: intentional “ready this weekend,” “slow dating,” relocation, and recovery modes without manipulative countdowns.
- Relationship Journey: mutual milestones from introduction to call, date plan, check-in, and optional debrief.

## Sources

- [Tinder — Discovery Settings](https://www.help.tinder.com/hc/en-us/articles/115003340963-Discovery-Settings)
- [Tinder — Photo Verified Chat](https://www.help.tinder.com/hc/en-us/articles/4408385774989-Photo-Verified-Chat)
- [Tinder — Photo Selector](https://www.help.tinder.com/hc/en-us/articles/21276850679693-Photo-Selector)
- [Tinder — Photo Verification](https://www.help.tinder.com/hc/en-us/articles/360034941812-Photo-Verification)
- [Bumble — Taking a break](https://support.bumble.com/hc/articles/28537106111261-Taking-a-break-from-online-dating)
- [Bumble — Safety features](https://support.bumble.com/hc/articles/28537051467293-Our-safety-features)
- [Bumble — Sharing date plans](https://support.bumble.com/hc/en-us/articles/32668227103645-Sharing-your-date-plans)
- [Bumble — Review before you send](https://support.bumble.com/hc/en-us/articles/32668136364829--Review-before-you-send-prompt)
- [Hinge — Dating preferences](https://help.hinge.co/hc/en-us/articles/360011063294-How-do-I-set-my-Dating-Preferences)
- [Hinge — Selfie Verification](https://help.hinge.co/hc/en-us/articles/10303221435539-What-is-Selfie-Verification)
- [Hinge — Did This Bother You?](https://help.hinge.co/hc/en-us/articles/47313953563411-What-is-Did-This-Bother-You)
- [Hinge — Third-party automated tools](https://help.hinge.co/hc/en-us/articles/49657802257683-Note-on-Third-Party-Automated-Tools)
- [Coffee Meets Bagel — Premium and Platinum](https://coffeemeetsbagel.zendesk.com/hc/en-us/articles/360021076153-What-s-included-in-CMB-Premium-and-Platinum-subscriptions)
- [Feeld — Majestic membership](https://support.feeld.co/hc/en-gb/articles/9406793654556-Majestic-Membership-explained)
- [Feeld — Incognito](https://support.feeld.co/hc/en-gb/articles/9406755132316-Incognito-explained)
- [Match — Dating safety tips](https://help.match.com/hc/en-us/articles/6991442293787-Dating-Safety-Tips)
- [Match — 72 Hours](https://help.match.com/hc/en-us/articles/18136037259163-72-Hours-Explained)


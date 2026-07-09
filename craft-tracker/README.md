# Craft Tracker

A lightweight costume/craft project manager for renaissance faire cosplay builders.

## Running it

You'll need [Node.js](https://nodejs.org) (18+) and the **Expo Go** app on your
phone (iOS App Store / Google Play).

```bash
npm install
npx expo start
```

This prints a QR code in the terminal. Scan it with your phone's camera (iOS)
or the Expo Go app (Android) to open the app on your device — no build step,
no Xcode/Android Studio required for day-to-day development.

## What's built

- **Costumes** — create/list costumes with name, faire date, notes, cover image field
- **Ideas** — attached to a costume, with the six statuses (Idea, Researching,
  Gathering materials, Building, Faire ready, Upgrade later)
- **Steps** — break an idea down into an ordered checklist
- **Attachments** — photos (via device photo library), links, and text notes,
  attachable to an idea
- **Costume View** — idea counts by status, active builds with step progress,
  upgrades list
- **Workbench** — cross-costume view of what's building, researching, and
  queued for later, sorted by the parent costume's faire date
- **Local storage** — SQLite on-device, schema designed with UUIDs and
  timestamps so cloud sync can be layered on later without a data migration

## Deliberately deferred (per our design discussion)

- Materials checklists (Gathering materials is currently just a status label)
- Cloud sync / multi-device
- Archiving completed costumes
- Cost tracking
- Photo picker for step-level attachments (currently idea-level only)
- Cover image picker on the New Costume screen (field exists in the schema;
  UI to set it isn't wired up yet)

## Project structure

```
App.tsx                    Entry point, DB init
src/
  types/                   Costume, Idea, Step, Asset types + status enum
  db/                      SQLite schema + queries (one file per entity)
  navigation/               Tab + stack navigation
  screens/                  One file per screen
  components/               Shared bits (StatusBadge, DeadlineChip)
  theme.ts                  Colors
```

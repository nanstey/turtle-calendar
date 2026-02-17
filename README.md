# turtle-calendar

A React + TypeScript web app that visualizes a turtle-shell lunar calendar with:

- 28 outer day plates
- 13 inner moon/month plates
- Extra day badge outside Month 13
- Current Gregorian date (local timezone)
- Approximate current lunar phase
- Rotatable Chinese zodiac wheel highlighting the current animal (Lunar New Year boundary)
- Educational context section with citations and disclaimer

## Project Status

This repository now includes a full frontend scaffold and implementation (no backend).

## Tech Stack

- React 18
- TypeScript
- Vite

## Run Locally

1. Install dependencies:

```bash
pnpm install
```

2. Start dev server:

```bash
pnpm dev
```

3. Build for production:

```bash
pnpm build
```

4. Run tests:

```bash
pnpm test
```

## Calendar Rules Implemented

- Turtle anchor date for Month 1 Day 1: **Tuesday, February 17, 2026** (local timezone)
- 13 months x 28 days = 364 in-month days
- Extra day(s) rendered outside Month 13
- All shell plates softly illuminated, with stronger highlight on current day/month
- Lunar phase uses a simple synodic-month approximation

## Cultural Respect Notes

- The visualization is educational and not ceremonial authority.
- Naming systems differ by Nation, region, language, and community.
- A sample reference table is included below the visualization with explicit sourcing.

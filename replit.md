# ElephantBet Bac Bo Analytics System

## Overview

This is a real-time betting analytics platform for monitoring and predicting outcomes in "Bac Bo Brasileiro" casino games. The system features a cyberpunk-themed dashboard that displays live game results, analyzes patterns, generates betting signals, and sends notifications via Telegram. It scrapes game data from ElephantBet, applies pattern recognition algorithms, and provides users with high-confidence predictions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state with aggressive polling (1-5 second intervals for live data)
- **Styling**: Tailwind CSS with a custom cyberpunk/neon theme, shadcn/ui components (New York style)
- **Animations**: Framer Motion for UI transitions and effects
- **Build Tool**: Vite with custom path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Design**: REST endpoints defined in shared/routes.ts with Zod validation
- **Database ORM**: Drizzle ORM with PostgreSQL
- **External Services**: 
  - Telegram Bot API for notifications
  - Web scraper (simulated) for game data collection

### Data Flow
1. Scraper polls external game source every 12 seconds
2. New results trigger pattern analysis in telegram-service.ts
3. Patterns are matched against predefined algorithms (Marretada, Zig-Zag, etc.)
4. Matching patterns generate signals stored in database
5. Telegram notifications sent for high-confidence predictions
6. Frontend polls API for real-time updates

### Database Schema
Two main tables in PostgreSQL:
- **game_results**: Stores color outcomes (blue/red/tie) with timestamps
- **signals**: Stores pattern detections, predictions, confidence levels, and win/loss status

### Pattern Recognition System
The core analytics uses several pattern algorithms:
- Marretada (streak of 4 same colors)
- Quebra de Tendência (reversal after 5)
- Zig-Zag (alternating pattern)
- Padrão 2-2 (paired sequence)

## External Dependencies

### Database
- **PostgreSQL**: Primary database via DATABASE_URL environment variable
- **Drizzle Kit**: Schema migrations with `npm run db:push`

### Third-Party Services
- **Telegram Bot API**: Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables for sending betting signals

### Key NPM Packages
- **drizzle-orm/node-postgres**: Database connectivity
- **node-telegram-bot-api**: Telegram integration
- **cheerio/axios**: Web scraping capabilities (prepared but using simulation)
- **zod**: Runtime validation for API contracts
- **framer-motion**: Cyberpunk UI animations

### Environment Variables Required
- DATABASE_URL: PostgreSQL connection string
- TELEGRAM_BOT_TOKEN: Bot token from BotFather
- TELEGRAM_CHAT_ID: Target chat for notifications
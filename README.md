# TT2 Dashboard

An open-source clan management dashboard for the mobile game **Tap Titans 2**. It listens to the TT2 public WebSocket API in real time, persists raid events to a PostgreSQL database, and exposes them through a REST + SSE API consumed by a React dashboard.

The long-term goal is to bring all community-built tools for TT2 into one place — making players' lives easier without scattering across dozens of spreadsheets and bots.

---

## Features

- **Live raid tracking** — subscribes to the TT2 public API and stores every raid event as it happens
- **Raid statistics** — per-player attack history, morale transactions, clan activity
- **Raid planner** — local seed-file based planning tool (no API call required)
- **Card browser** — browse all available cards grouped by type
- **Live stream** — SSE endpoint pushes events to connected dashboard clients in real time
- **Discord bot** — watches a Discord channel for seed file uploads

---

## Architecture

```
TT2 Public API (WebSocket)
        │
        ▼
  [apiconsumer] ──► Redis list (api_event)
                              │
                              ▼
                         [worker] ──► PostgreSQL
                              │
                              ▼
                    Redis pub/sub (live_events)
                              │
                              ▼
                          [api] ──► SSE ──► [frontend]
                          [api] ──► REST ──► [frontend]
```

### Services

| Service | Language | Role |
|---|---|---|
| `apiconsumer` | Python | Connects to the TT2 WebSocket API and pushes events to a Redis list |
| `worker` | .NET 10 (Worker) | Pops events from Redis, applies EF Core migrations, routes events to typed handlers |
| `api` | .NET 10 (Web) | Minimal API serving REST endpoints + SSE live stream (Dapper for queries) |
| `botReadSeedFile` | Python | Discord bot that watches a channel for seed file uploads |
| `frontend` | React + TypeScript (Vite) | SPA dashboard |

Infrastructure: **PostgreSQL 18** + **Redis**

---

## Getting started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- A TT2 public API token (`API_APP_TOKEN`)
- *(Optional)* A Discord bot token for the seed file bot

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/tt2-app.git
cd tt2-app

# 2. Configure environment
cp .env.example .env
# Edit .env and fill in your values

# 3. Start the full stack
docker compose up --build
```

The frontend is served by Vite (dev) or the `api` container (prod) and the REST API is available at `http://localhost:5000`.  
Adminer (database UI) is available at `http://localhost:8080`.

### Environment variables

| Variable | Description |
|---|---|
| `DB_PASSWORD` | PostgreSQL password |
| `DB_USER` | PostgreSQL username |
| `DB_NAME` | PostgreSQL database name |
| `API_APP_TOKEN` | TT2 public API token |
| `DISCORD_TOKEN_READ_SEED_FILE` | Discord bot token *(optional)* |

---

## Development

### Frontend

```bash
cd frontend
bun install
bun run dev      # dev server with HMR
bun run build    # production build (tsc + vite)
bun run lint     # oxlint
```

### .NET (worker / api)

```bash
# Start only infra so .NET can connect locally
docker compose up -d db redis

dotnet build tt2.slnx
dotnet run --project worker
dotnet run --project api
```

### Database migrations

Migrations run automatically on worker startup. To create a new one:

```bash
cd worker
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

---

## Project structure

```
tt2-app/
├── apiconsumer/        # Python WebSocket consumer
├── worker/             # .NET event processor + EF Core
│   ├── Entities/       # Database entity classes
│   ├── Handlers/       # One handler per event type
│   └── Migrations/     # EF Core migrations
├── api/                # .NET REST + SSE API
│   ├── Endpoints/      # Route definitions (Player, Raid, SSE)
│   └── Services/       # LiveEventBroadcaster (SSE fan-out)
├── frontend/           # React + TypeScript SPA
│   └── src/
│       ├── pages/      # HomePage, CardListPage, RaidStatementPage, ClanPage
│       ├── components/
│       ├── types/      # api.ts, titan.ts, raid.ts
│       └── utils/      # Raid planning logic (raid.ts)
└── docker-compose.yml
```

---

## Adding a new event handler

1. Create `worker/Handlers/<EventName>Handler.cs` implementing `IEventHandler` — set `EventName` to the exact string sent by the API.
2. Register it as `IEventHandler` in `worker/Program.cs` (see the comment there).

That's it — `EventDispatcher` will automatically route matching events to your handler. Unrecognized events fall through to `DefaultEventHandler`.

---

## Roadmap

- [ ] Background polling service as an alternative to the WebSocket consumer
- [ ] Aggregated raid statistics and charts
- [ ] Community tool integration (damage calculators, build helpers, etc.)
- [ ] Player profiles and historical progression
- [ ] Multi-clan support

---

## Contributing

Contributions are welcome! This project is fully open-source — there is no private code or hidden configuration beyond your own API credentials.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Open a pull request and describe what you changed and why

If you have an idea for a community tool that would fit here, open an issue to discuss it first.

---

## License

MIT

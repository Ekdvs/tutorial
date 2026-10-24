# NestJS Learning Workspace

This repository is a hands-on learning workspace for building applications with
[NestJS](https://nestjs.com/), [Prisma](https://www.prisma.io/), PostgreSQL,
React, Vite, and Socket.IO.

It contains three independent applications:

| Application | Directory | Purpose | Default port |
| --- | --- | --- | --- |
| REST API | [`tutorial/`](./tutorial/) | NestJS API for users and products, backed by PostgreSQL and Prisma | `3000` |
| WebSocket server | [`websocket/`](./websocket/) | NestJS Socket.IO server for private real-time chat | `3000` |
| Frontend | [`frontend/`](./frontend/) | React/Vite client for the private chat server | `5173` |

The applications are separate Node.js projects. Install dependencies and run
commands from the relevant application directory rather than from the
repository root.

## Table of contents

- [Features](#features)
- [Repository structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [Running the applications](#running-the-applications)
- [REST API](#rest-api)
- [WebSocket chat](#websocket-chat)
- [Database and Prisma](#database-and-prisma)
- [Testing and quality checks](#testing-and-quality-checks)
- [Production notes](#production-notes)
- [Troubleshooting](#troubleshooting)
- [Useful resources](#useful-resources)

## Features

- NestJS 12 applications written in TypeScript.
- REST endpoints for product management.
- User registration and login endpoints.
- JWT authentication infrastructure and role metadata.
- PostgreSQL persistence through Prisma ORM.
- Prisma migrations and generated Prisma client code.
- Socket.IO private messaging between connected users.
- React client with connection status, online users, conversation history, and
  message validation.
- Unit and end-to-end test setup with Vitest.
- Type-aware linting with Oxlint for the NestJS applications and ESLint for the
  frontend.

## Repository structure

```text
.
├── frontend/                 # React + Vite + Socket.IO client
│   └── src/
├── tutorial/                 # REST API + Prisma application
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── api/product/      # Product controller and service
│   │   ├── api/user/         # User controller and service
│   │   ├── config/           # Prisma and JWT configuration
│   │   ├── decorator/        # Public and role decorators
│   │   └── guard/            # JWT guard
│   └── test/
└── websocket/                # Socket.IO chat server
    ├── src/api/health/
    ├── src/socket/
    └── test/
```

## Prerequisites

- Node.js 20 or a later LTS release.
- npm.
- PostgreSQL for the REST API.
- Git, if you are cloning the repository.

Check your installed versions:

```bash
node --version
npm --version
```

## Installation

Install each application's dependencies:

```bash
cd tutorial
npm install

cd ..\websocket
npm install

cd ..\frontend
npm install
```

On macOS or Linux, replace the Windows-style `..\` path segments with `../`.

## Environment variables

The REST API requires a PostgreSQL connection string. Create
[`tutorial/.env`](./tutorial/.env) locally, or create it from the following
template:

```dotenv
DATABASE_URL="postgresql://postgres:password@localhost:5432/nest_learning"
PORT=3000
```

Use your own database credentials. Do not commit `.env` files or real secrets.
The `DATABASE_URL` value is read by both Prisma and the NestJS
`PrismaService`.

The WebSocket server currently listens on port `3000` by default. The frontend
currently connects to `http://localhost:3000`, so keep the server on that port
for local development unless you update the client connection URL in
[`frontend/src/App.tsx`](./frontend/src/App.tsx).

## Running the applications

Run each application in a separate terminal.

### REST API

```bash
cd tutorial
npm run start:dev
```

The API is available at `http://localhost:3000`. Its global HTTP prefix is
`/api`, so application routes begin with `http://localhost:3000/api`.

Other REST API commands:

```bash
npm run start       # Start once
npm run start:dev   # Start with watch mode
npm run start:prod  # Run the compiled application from dist/
npm run build       # Compile the application
```

### WebSocket server

```bash
cd websocket
npm run start:dev
```

The Socket.IO server is available at `http://localhost:3000`. If the REST API
is running on the same port, stop it first or set a different `PORT` for one
of the applications.

```bash
npm run start       # Start once
npm run start:dev   # Start with watch mode
npm run start:prod  # Run the compiled application from dist/
npm run build       # Compile the application
```

### Frontend

```bash
cd frontend
npm run dev
```

Open the URL printed by Vite, normally
[`http://localhost:5173`](http://localhost:5173). The chat UI connects to the
WebSocket server automatically.

```bash
npm run build       # Type-check and create a production build
npm run preview     # Preview the production build
npm run lint        # Run ESLint
```

## REST API

The REST API is served from `http://localhost:3000/api`.

### Application endpoint

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Returns `Hello World!` |

The root endpoint is not prefixed, so it is available at
`http://localhost:3000/`.

### Product endpoints

| Method | Path | Description | Authentication |
| --- | --- | --- | --- |
| `GET` | `/api/product/all-products` | Return all products ordered by ID | Public |
| `GET` | `/api/product/get-product/:productId` | Return one product | JWT guard |
| `POST` | `/api/product/add-product` | Create a product | JWT guard |
| `PUT` | `/api/product/update-product/:productId` | Update a product | JWT guard |
| `DELETE` | `/api/product/delete-product/:productId` | Delete a product | JWT guard |

Product request bodies use these fields:

```json
{
  "name": "Mechanical Keyboard",
  "price": 99.99,
  "image": "https://example.com/keyboard.jpg",
  "description": "A compact mechanical keyboard",
  "rating": 4.5
}
```

### User endpoints

| Method | Path | Description | Authentication |
| --- | --- | --- | --- |
| `POST` | `/api/user` | Create a user | JWT guard |
| `POST` | `/api/user/register` | Register a user | JWT guard |
| `POST` | `/api/user/login` | Authenticate a user and return a JWT | Public |
| `GET` | `/api/user` | User collection endpoint | Admin role |
| `GET` | `/api/user/:id` | Find one user | JWT guard |
| `PATCH` | `/api/user/:id` | Update a user | JWT guard |
| `DELETE` | `/api/user/:id` | Delete a user | JWT guard |

Example registration body:

```json
{
  "name": "Ada Lovelace",
  "username": "ada",
  "age": 36,
  "city": "London",
  "phone": "+44 20 0000 0000",
  "email": "ada@example.com",
  "password": "change-me"
}
```

Example login body:

```json
{
  "username": "ada",
  "password": "change-me"
}
```

For protected endpoints, send the returned token as:

```http
Authorization: Bearer <token>
```

## WebSocket chat

The frontend and server use Socket.IO. The server allows browser connections
from `http://localhost:5173`.

The WebSocket project also exposes the following REST-style health resource at
`http://localhost:3000/health`:

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Return all health records |
| `POST` | `/health` | Create a health record |
| `GET` | `/health/:id` | Return one health record |
| `PATCH` | `/health/:id` | Update a health record |
| `DELETE` | `/health/:id` | Delete a health record |

### Client-to-server events

| Event | Payload | Description |
| --- | --- | --- |
| `joinChat` | `string` | Register a username, trimmed to 30 characters |
| `getPrivateHistory` | `string` | Request history with a connected recipient ID |
| `privateMessage` | `{ recipientId: string, message: string }` | Send a private message |

### Server-to-client events

| Event | Payload | Description |
| --- | --- | --- |
| `usersUpdate` | `ChatUser[]` | Current connected users |
| `privateHistory` | `{ recipientId, messages }` | Stored conversation history |
| `privateMessageReceived` | `PrivateMessage` | A message sent or received |
| `chatError` | `string` | Validation or chat error |

Conversation history is stored in server memory and capped at 100 messages per
conversation. It is lost when the WebSocket server restarts, and the current
implementation does not persist chat users or messages in PostgreSQL.

## Database and Prisma

The REST API uses PostgreSQL through Prisma. The current schema contains:

- `Product`: name, price, image, description, rating, and timestamps.
- `User`: name, username, age, city, optional phone, unique email, password,
  and timestamps.

From the `tutorial` directory:

```bash
# Generate the Prisma client
npx prisma generate

# Apply existing migrations in a deployment-like environment
npx prisma migrate deploy

# Create and apply a new migration during development
npx prisma migrate dev --name describe-your-change

# Inspect the migration state
npx prisma migrate status

# Open Prisma Studio
npx prisma studio
```

After changing [`tutorial/prisma/schema.prisma`](./tutorial/prisma/schema.prisma),
generate the client and create a migration before running the API.

## Testing and quality checks

### REST API and WebSocket server

Run these commands from either `tutorial` or `websocket`:

```bash
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
npm run test:watch    # Watch tests
npm run lint          # Type-aware Oxlint
npm run format        # Format source and test files
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

The current e2e test setup expects the NestJS application's default
environment and database configuration to be available. Configure
`DATABASE_URL` before running tests that initialize the Prisma module.

## Production notes

This repository is intended for learning and experimentation. Before
production use, address at least the following:

- Move the JWT signing secret out of source code and into a protected
  environment variable or secret manager.
- Hash passwords with a password-hashing algorithm such as Argon2 or bcrypt;
  the current login flow compares stored passwords directly.
- Add DTO validation with `class-validator` and enable a global validation
  pipe.
- Replace placeholder user service methods with real database operations.
- Add authorization guards to all routes that require authentication and verify
  the guard handles asynchronous token verification correctly.
- Persist WebSocket users and messages if chat history must survive restarts.
- Configure the frontend Socket.IO URL per environment instead of hard-coding
  `http://localhost:3000`.
- Restrict CORS to trusted production origins.
- Add rate limiting, structured logging, monitoring, and database backup
  procedures.
- Use HTTPS/WSS and secure secret management in deployed environments.

## Troubleshooting

### `DATABASE_URL environment variable is not defined`

Create `tutorial/.env` with a valid PostgreSQL connection string and restart
the NestJS process.

### Prisma cannot connect to PostgreSQL

Verify that PostgreSQL is running, the database exists, credentials are
correct, and the connection string points to the correct host and port. Then
run:

```bash
cd tutorial
npx prisma migrate status
```

### Port 3000 is already in use

The REST API and WebSocket server both default to port `3000`, so they cannot
run there simultaneously. Stop the other process or start one application on a
different port:

```powershell
$env:PORT=3001
npm run start:dev
```

If the WebSocket server moves to another port, update the Socket.IO URL in
[`frontend/src/App.tsx`](./frontend/src/App.tsx) as well.

### The frontend says `Connecting...`

Start the WebSocket server, confirm it is listening on port `3000`, and open
the frontend from `http://localhost:5173`. The server CORS configuration
currently permits that origin.

## Useful resources

- [NestJS documentation](https://docs.nestjs.com/)
- [NestJS WebSockets](https://docs.nestjs.com/websockets/gateways)
- [Prisma documentation](https://www.prisma.io/docs)
- [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate)
- [Socket.IO documentation](https://socket.io/docs/v4/)
- [React documentation](https://react.dev/)
- [Vite documentation](https://vite.dev/guide/)

## License

The individual applications currently declare `UNLICENSED` in their package
metadata. Treat this repository as private learning code unless a project
owner adds and documents an explicit open-source license.
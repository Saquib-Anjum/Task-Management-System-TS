# Task Management API --- Backend Design Guide

A practical backend architecture guide for building a maintainable Task
Management API with **Node.js, TypeScript, Express 5, MongoDB, Mongoose,
and Zod**.

This project uses a **feature-based modular architecture with layered
responsibilities**. Each feature keeps its routes, controllers,
services, repositories, models, validators, and types together.

------------------------------------------------------------------------

## Table of Contents

1.  [Project Goals](#project-goals)
2.  [Technology Stack](#technology-stack)
3.  [Architecture Overview](#architecture-overview)
4.  [Recommended Folder Structure](#recommended-folder-structure)
5.  [Request Lifecycle](#request-lifecycle)
6.  [Layer Responsibilities](#layer-responsibilities)
7.  [Task Module Design](#task-module-design)
8.  [API Design](#api-design)
9.  [Validation and Error Handling](#validation-and-error-handling)
10. [Environment Configuration](#environment-configuration)
11. [TypeScript and ES Modules](#typescript-and-es-modules)
12. [Development Workflow](#development-workflow)
13. [Testing Strategy](#testing-strategy)
14. [Security and Production
    Checklist](#security-and-production-checklist)
15. [How to Add a New Feature](#how-to-add-a-new-feature)
16. [Architecture Decisions](#architecture-decisions)

------------------------------------------------------------------------

## Project Goals

The goal is to build a backend that is:

-   **Maintainable:** Each file has a clear responsibility.
-   **Type-safe:** TypeScript catches many mistakes during development.
-   **Validated:** Incoming request data is checked at runtime with Zod.
-   **Testable:** Business logic is separated from HTTP and database
    code.
-   **Scalable:** New features can be added as independent modules.
-   **Consistent:** API responses and errors follow a predictable
    format.

This is a **modular monolith**, not a microservices architecture. The
application runs as one deployable service, but its code is divided into
well-defined feature modules.

## Technology Stack

  -----------------------------------------------------------------------
  Technology                          Purpose
  ----------------------------------- -----------------------------------
  Node.js                             JavaScript runtime

  TypeScript                          Static typing and safer refactoring

  Express 5                           HTTP server, routes, and middleware

  MongoDB                             Document database

  Mongoose                            MongoDB schemas, models, and
                                      queries

  Zod                                 Runtime validation for request data
                                      and environment variables

  dotenv                              Loads environment variables from
                                      `.env`

  cors                                Configures cross-origin browser
                                      requests

  helmet                              Adds security-related HTTP headers

  Nodemon                             Restarts the development process
                                      when files change

  tsx                                 Executes TypeScript during
                                      development

  TypeScript compiler (`tsc`)         Type-checks and builds production
                                      JavaScript
  -----------------------------------------------------------------------

Mongoose includes its own TypeScript declarations. You do not need
`@types/mongoose`.

## Architecture Overview

The project is organized by **feature**, and each feature is separated
into layers.

``` mermaid
flowchart TD
    Client[Client / Postman] --> Routes[Routes]
    Routes --> Controller[Controller]
    Controller --> Validator[Zod Validation]
    Validator --> Service[Service]
    Service --> Repository[Repository]
    Repository --> Model[Mongoose Model]
    Model --> DB[(MongoDB)]

    Service --> AppError[Application Error]
    Repository --> AppError
    AppError --> ErrorMiddleware[Central Error Middleware]
    ErrorMiddleware --> Client
    Controller --> Response[HTTP Response]
    Response --> Client
```

### Why feature-based modules?

A traditional structure groups files by technical role:

``` text
controllers/
models/
services/
repositories/
routes/
```

That works well for small applications, but a single feature's files
become spread across many folders.

This project groups files by domain instead:

``` text
modules/
├── tasks/
│   ├── task.routes.ts
│   ├── task.controller.ts
│   ├── task.service.ts
│   ├── task.repository.ts
│   ├── task.model.ts
│   ├── task.validator.ts
│   └── task.types.ts
├── auth/
└── users/
```

The `tasks` feature stays together, while each file still has a specific
responsibility. The name `modules` is just an organizational convention;
it is separate from Node.js's native ES module system.

## Recommended Folder Structure

``` text
taskmanagement-api/
├── src/
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── config/
│   │   ├── env.ts
│   │   ├── database.ts
│   │   └── logger.ts                 # Optional; add when logging is configured
│   │
│   ├── modules/
│   │   └── tasks/
│   │       ├── task.routes.ts
│   │       ├── task.controller.ts
│   │       ├── task.service.ts
│   │       ├── task.repository.ts
│   │       ├── task.model.ts
│   │       ├── task.validator.ts
│   │       ├── task.types.ts
│   │       └── task.constants.ts     # Optional
│   │
│   ├── middleware/
│   │   ├── error.middleware.ts
│   │   ├── not-found.middleware.ts
│   │   ├── validate.middleware.ts    # Optional reusable Zod middleware
│   │   └── auth.middleware.ts        # Add when authentication exists
│   │
│   ├── errors/
│   │   └── app-error.ts
│   │
│   ├── utils/
│   │   ├── async-handler.ts
│   │   ├── api-response.ts           # Optional response helper
│   │   └── pagination.ts             # Add when pagination is implemented
│   │
│   ├── routes/
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── common.types.ts
│   │   └── express.d.ts              # Add when extending Express Request
│   │
│   └── constants/
│       └── app.constants.ts
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── dist/                             # Generated by npm run build
├── node_modules/                     # Installed packages
├── .env                              # Local secrets; do not commit
├── .env.example                      # Safe variable-name template
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

Only create optional files when you need them. `dist/` is generated by
the TypeScript build, and `node_modules/` is generated by npm. Do not
manually maintain either folder.

## Request Lifecycle

For a request such as `POST /api/v1/tasks`, the request travels through
these steps:

1.  **Express middleware:** Applies security headers, CORS policy, and
    JSON parsing.
2.  **Route:** Matches the HTTP method and URL.
3.  **Controller:** Reads the request and validates its body.
4.  **Service:** Executes business rules and coordinates the operation.
5.  **Repository:** Runs the database query.
6.  **Model:** Mongoose applies schema rules and communicates with
    MongoDB.
7.  **Controller:** Returns a suitable HTTP status and response body.
8.  **Error middleware:** Handles errors forwarded by the async handler
    or thrown by downstream code.

Authentication middleware, once implemented, should run on protected
routes before the controller.

## Layer Responsibilities

### 1. `routes/`

**Purpose:** Map HTTP endpoints to controller functions.

Routes should not contain business logic or database queries.

Example:

``` ts
router.post("/", asyncHandler(taskController.create));
router.get("/", asyncHandler(taskController.getAll));
router.get("/:id", asyncHandler(taskController.getById));
router.patch("/:id", asyncHandler(taskController.update));
router.delete("/:id", asyncHandler(taskController.delete));
```

### 2. `controllers/` inside a feature

**Purpose:** Handle HTTP concerns.

A controller should: - Read route parameters, query parameters, and
request bodies. - Call the relevant validator and service. - Choose the
HTTP status code. - Return a consistent response.

A controller should not contain complex business rules or direct
Mongoose queries.

### 3. `services/` inside a feature

**Purpose:** Implement business rules and use cases.

Examples: - Ensure a task exists before updating it. - Check whether a
user is allowed to modify a task. - Prevent invalid state transitions. -
Coordinate multiple repository calls.

Services should not depend on Express `Request` or `Response` objects.
This makes them easier to unit test.

### 4. `repositories/` inside a feature

**Purpose:** Encapsulate persistence operations.

Examples: - Create a task. - Find tasks. - Find a task by ID. - Update a
task. - Delete a task.

Repositories should not format HTTP responses or decide HTTP status
codes.

### 5. `models/` inside a feature

**Purpose:** Define the Mongoose schema and model.

A model describes the document shape and database-level schema
constraints. It is not the same thing as a controller or service.

### 6. `validators/` inside a feature

**Purpose:** Validate untrusted data at runtime with Zod.

Validate request bodies, query parameters, and route parameters when
needed. TypeScript types alone do not validate incoming JSON.

### 7. `types/` inside a feature

**Purpose:** Store reusable feature-specific TypeScript types and
interfaces.

Use inferred types from Zod schemas or Mongoose schemas where that
reduces duplication. Avoid defining the same shape independently in
multiple places without a reason.

### 8. Shared infrastructure

-   `config/`: environment variables, database connection, and
    infrastructure setup.
-   `middleware/`: cross-cutting HTTP behavior such as error handling
    and authentication.
-   `errors/`: custom application errors.
-   `utils/`: genuinely reusable helpers.
-   `routes/index.ts`: mounts feature routers under the API prefix.
-   `app.ts`: configures Express middleware and routes without opening
    the listening port.
-   `server.ts`: connects infrastructure and starts the HTTP server.

## Task Module Design

The Task Management API can begin with these operations:

-   Create a task.
-   List tasks.
-   Retrieve a task by ID.
-   Update a task.
-   Delete a task.

A task may contain:

  Field           Type               Notes
  --------------- ------------------ -------------------------------------------
  `_id`           MongoDB ObjectId   Generated by MongoDB/Mongoose
  `title`         string             Required; set a reasonable maximum length
  `description`   string             Optional
  `completed`     boolean            Defaults to `false`
  `createdAt`     Date               Generated by Mongoose timestamps
  `updatedAt`     Date               Updated by Mongoose timestamps

If authentication is added, include an `ownerId` or `userId` reference
and enforce ownership in service/repository operations. Never rely on a
client-supplied user ID as proof of identity.

## API Design

Use a versioned API prefix so future changes can be introduced
deliberately.

Base URL:

``` text
http://localhost:3000/api/v1
```

  ------------------------------------------------------------------------
  Method            Endpoint          Purpose           Typical success
                                                        status
  ----------------- ----------------- ----------------- ------------------
  `POST`            `/tasks`          Create a task     `201 Created`

  `GET`             `/tasks`          List tasks        `200 OK`

  `GET`             `/tasks/:id`      Retrieve one task `200 OK`

  `PATCH`           `/tasks/:id`      Update selected   `200 OK`
                                      fields            

  `DELETE`          `/tasks/:id`      Delete a task     `200 OK` or
                                                        `204 No Content`
  ------------------------------------------------------------------------

Example create request:

``` http
POST /api/v1/tasks
Content-Type: application/json
```

``` json
{
  "title": "Learn TypeScript backend",
  "description": "Understand the layered architecture"
}
```

Example success response:

``` json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "generated-object-id",
    "title": "Learn TypeScript backend",
    "description": "Understand the layered architecture",
    "completed": false
  }
}
```

The example ID above is illustrative. The real value is generated by
MongoDB/Mongoose.

Keep response formats consistent. Do not expose secrets, stack traces,
or internal database details in production responses.

## Validation and Error Handling

### Validation

Use Zod at the API boundary to validate: - Request bodies. - Query
parameters. - Route parameters where appropriate. - Environment
variables during application startup.

Reject unknown input fields when that is the desired API contract. For
partial updates, require at least one permitted field.

### Error handling

Use a custom `AppError` for expected application errors, such as: -
Invalid resource ID: `400 Bad Request`. - Missing resource:
`404 Not Found`. - Unauthenticated request: `401 Unauthorized`. -
Authenticated user without permission: `403 Forbidden`. - Unexpected
server failure: `500 Internal Server Error`.

A central error middleware should translate errors into HTTP responses.
Log unexpected errors on the server, but return generic messages in
production.

Express 5 forwards rejected promises from async route handlers
automatically. An `asyncHandler` wrapper is still a valid explicit
convention if used consistently across the project; do not mix patterns
without a reason.

## Environment Configuration

Example `.env` for local development:

``` env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/task_management
```

Example `.env.example`:

``` env
NODE_ENV=development
PORT=3000
MONGODB_URI=
```

Guidelines:

-   Keep `.env` out of Git.
-   Validate environment variables at startup with Zod.
-   Use a managed secret store or deployment environment variables in
    production.
-   Never hard-code credentials in source files.
-   Ensure the database is connected before accepting requests that
    require it.

## TypeScript and ES Modules

This project uses `"type": "module"` in `package.json` and a `NodeNext`
TypeScript configuration.

Recommended TypeScript compiler settings include:

-   `rootDir: "./src"`
-   `outDir: "./dist"`
-   `module: "NodeNext"`
-   `moduleResolution: "NodeNext"`
-   `target: "ES2022"`
-   `types: ["node"]`
-   `strict: true`

With `NodeNext`, write `.js` extensions in relative imports in
TypeScript source files, for example:

``` ts
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
```

TypeScript resolves those paths to the source TypeScript files while
compiling them into JavaScript.

The `jsx` compiler option is not needed for a standard Express backend.
If your installed TypeScript version flags a compiler option as
unsupported or deprecated, follow the diagnostics for that installed
version.

## Development Workflow

### Install dependencies

``` bash
npm install
```

### Run in development

If Nodemon is configured inline in `package.json` (no `nodemon.json`
required), use:

``` json
{
  "scripts": {
    "dev": "nodemon --watch src --ext ts,json --exec tsx src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "typecheck": "tsc --noEmit"
  }
}
```

Install the development tools if needed:

``` bash
npm install -D typescript tsx nodemon @types/node @types/express @types/cors
```

Start the server:

``` bash
npm run dev
```

### Type-check and build

``` bash
npm run typecheck
npm run build
npm start
```

`npm run build` creates the `dist/` output. Run `npm start` after a
successful build.

### Health endpoint

A simple endpoint such as `GET /health` can report whether the HTTP
server is responding. A successful health response alone does not prove
the database is healthy; add a database readiness check if your
deployment requires one.

## Testing Strategy

Keep tests organized by purpose:

``` text
tests/
├── unit/
│   ├── task.service.test.ts
│   └── task.validator.test.ts
└── integration/
    └── task.routes.test.ts
```

-   **Unit tests:** Test business rules and validators in isolation.
    Mock repository calls when appropriate.
-   **Integration tests:** Test HTTP routes, middleware, and database
    behavior using a test database.
-   **Test isolation:** Do not run destructive tests against production
    data.
-   **Coverage:** Prioritize critical behavior and edge cases over
    chasing a percentage.

A testing library such as Vitest and an HTTP testing library such as
Supertest can be added when you are ready to implement tests.

## Security and Production Checklist

Before deployment:

-   [ ] Configure CORS with the expected frontend origins rather than
    allowing every origin by default.
-   [ ] Keep `helmet()` enabled.
-   [ ] Validate all incoming data.
-   [ ] Add rate limiting, especially for authentication endpoints.
-   [ ] Implement authentication and authorization before exposing
    user-specific data.
-   [ ] Enforce task ownership in database operations once users exist.
-   [ ] Keep secrets in environment variables or a secret manager.
-   [ ] Use HTTPS in production.
-   [ ] Use safe, generic error responses in production.
-   [ ] Add structured logging and avoid logging tokens or passwords.
-   [ ] Configure database access controls and backups.
-   [ ] Handle graceful shutdown and process termination.
-   [ ] Run type-checking and tests in CI before deployment.
-   [ ] Ensure the production build starts from `dist/server.js`.

## How to Add a New Feature

For example, when adding authentication, create a new module:

``` text
src/modules/auth/
├── auth.routes.ts
├── auth.controller.ts
├── auth.service.ts
├── auth.repository.ts
├── auth.model.ts
├── auth.validator.ts
└── auth.types.ts
```

Then:

1.  Define the authentication endpoints in `auth.routes.ts`.
2.  Validate registration and login input with Zod.
3.  Keep HTTP handling in the controller.
4.  Put password verification and token-related business rules in the
    service.
5.  Put user lookup and persistence in the repository.
6.  Define the user schema in the appropriate user model/module.
7.  Mount the router in `src/routes/index.ts`.
8.  Add tests for valid input, invalid input, duplicate users, incorrect
    credentials, and protected endpoints.

Keep shared code in common folders only when multiple modules genuinely
need it. Avoid building abstractions before there is a concrete use
case.

## Architecture Decisions

### Why use a repository layer?

Mongoose can be called directly from a service in a small application. A
repository is an additional abstraction, not a requirement of Express or
Mongoose. This project uses it to isolate persistence logic and make
service behavior easier to test.

### Why not create one global `controllers/`, `services/`, and `models/` folder?

Feature-based organization makes it easier to navigate and change one
feature without searching through many global folders. Each module still
uses the same controller-service-repository pattern.

### Is this clean architecture?

It borrows ideas from layered and clean architecture, especially
separation of concerns and dependency direction. It is not a strict
implementation of every Clean Architecture rule. If the project later
needs stronger domain boundaries or database-independent business logic,
those boundaries can be introduced deliberately.

### What should be added later?

A sensible implementation order is:

1.  Complete task CRUD and error handling.
2.  Add pagination, filtering, and sorting.
3.  Add user registration and login.
4.  Add authentication middleware and task ownership.
5.  Add unit and integration tests.
6.  Add API documentation with OpenAPI/Swagger.
7.  Add logging, rate limiting, CI, and deployment configuration.

------------------------------------------------------------------------

**Guiding principle:** Keep each layer small, give each module ownership
of its feature, validate data at system boundaries, and add complexity
only when the project needs it.

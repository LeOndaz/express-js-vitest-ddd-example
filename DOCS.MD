## MusalaSoft task

The project uses the following tech
1. Typescript + Express.js
2. Passport for authentication
3. PostgreSQL + Drizzle ORM with PostgreSQL-based code.
4. Vitest & Faker for testing

This project uses DDD (Domain-driven design) and all features reside under `/src/features`.

- The up-to-date API documentation is in `event-booking-swagger.yml` 

### Notes
- This project has around 21 TODOs left around the codebase, each TODO denotes something with its text
- TODOs denote features & enhancements, or just to draw your attention to that line
- The ORM is not database-agnostic, this is a valid criticism on it, changing to a different DB requires effort

---
- I didn't notice that the event ID is actually int64 till the end, which at this point, all the API uses nano IDs, this is totally on me but changing it now requires lots of work and the deadline is approaching
- I changed the swagger schema to work with nano IDs (strings) in case you wanted to try it out
---

### Design choices:
1. The password field in `users` table is nullable, mainly because social login (in the future) doesn't require a password
2. I chose to repeat some functions rather than abstractions, denoted by TODO
3. The password is validated in /login endpoint, this saves a query, because if the user inputs 7 chars but we know for sure that the password requires 8 characters, there's no point of querying a user with a password of 7
4. I wrote 1 unit test + 1 e2e test for illustrating the quality, the rest can follow the same principles
5. Tests are NOT MOCKED, they use their own database with data from `faker`
6. A user can only have one reservation for the event
7. The audit log is represented by user notifications
8. The notifications part is performance-critical, it doesn't use any external functions. It uses exactly 2 queries
9. Periodic tasks use cron jobs, a better implementation would use bullMQ
10. Database IDs are NanoIDs, for performance reasons, NanoID is sortable, URL-friendly, integer IDs expose the count of entities from the database and if used in URLs, they allow scrapers to iterate the website (throttling may help)

### Commands
- `pnpm install` to install the dependencies
- `pnpm dev` runs the dev version
- `pnpm start` runs the prod version
- `pnpm build` builds but doesn't run the project
- `pnpm test` runs the test suit using vitest
- `pnpm migrate` migrates the database

### Run the project
cd into the project dir & `docker-compose up`

### App not building in docker? (using Apple M1? or for any other reason?)
1. Run a Postgres instance with this command

```bash
docker run --name musalasoft_db -e POSTGRES_DB=musalasoft -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -d postgres
```

2. Change `DATABASE_HOST` from `.env` to `localhost` instead of `database`
3. run `pnpm install`
4. run `pnpm dev`

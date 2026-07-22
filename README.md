# Zylo

Zylo is a full-stack social network built with Next.js. It includes email/password and Google authentication, profiles and follows, posts with media attachments, likes, comments, bookmarks, notifications, search, and real-time direct or group messaging.

## Stack

- Next.js 16, React 19, TypeScript, and Tailwind CSS
- PostgreSQL with Prisma
- Lucia sessions and Google OAuth
- UploadThing media storage
- Stream Chat messaging
- TanStack Query and React Hook Form

## Local setup

Requirements: Node.js 24, npm 11, and a PostgreSQL database.

```bash
git clone https://github.com/MokiMeow/Zylo.git
cd Zylo
npm ci
copy .env.example .env.local
```

On macOS or Linux, replace the last command with `cp .env.example .env.local`.

Create applications in Google Cloud, Stream, and UploadThing, then fill in `.env.local`. Never commit that file or paste secrets into issues.

Initialize the database and start development:

```bash
npx prisma db push
npm run dev
```

Open <http://localhost:3000>.

## Environment variables

| Variable                   | Purpose                                                 |
| -------------------------- | ------------------------------------------------------- |
| `POSTGRES_PRISMA_URL`      | Pooled PostgreSQL connection used by the app            |
| `POSTGRES_URL_NON_POOLING` | Direct PostgreSQL connection used by Prisma operations  |
| `GOOGLE_CLIENT_ID`         | Google OAuth client ID                                  |
| `GOOGLE_CLIENT_SECRET`     | Google OAuth client secret                              |
| `NEXT_PUBLIC_BASE_URL`     | Application origin, such as `http://localhost:3000`     |
| `NEXT_PUBLIC_STREAM_KEY`   | Public Stream application key                           |
| `STREAM_SECRET`            | Stream server secret                                    |
| `UPLOADTHING_TOKEN`        | UploadThing v7 application token                        |
| `CRON_SECRET`              | Bearer token protecting the unused-upload cleanup route |

The Google OAuth redirect URI is `<NEXT_PUBLIC_BASE_URL>/api/auth/callback/google`.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run check` runs the complete suite. The production build intentionally uses webpack because UploadThing's current package metadata is not yet handled correctly by the Next.js 16 Turbopack production resolver.

## Deployment

Deploy to any Node.js host that supports Next.js. Configure every variable from `.env.example`, use a persistent PostgreSQL database, and run `npx prisma db push` (or a reviewed Prisma migration) before serving traffic. For Vercel, set the same variables for Preview and Production environments.

The `/api/clear-uploads` endpoint accepts `Authorization: Bearer <CRON_SECRET>` and is intended for a trusted scheduled request.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Please report security concerns using [SECURITY.md](SECURITY.md), not a public issue.

## License

MIT. See [LICENSE](LICENSE).

# Hello Interview T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Getting Started

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- Git ([Download](https://git-scm.com/downloads))

### Clone and Setup

1. Clone the repository
```bash
git clone https://github.com/your-username/hi-interview-t3.git
cd hi-interview-t3
```

2. Install dependencies
```bash
npm install
```

3. Set up your environment variables
- Get the `.env` file from Evan
- Place it in the root directory of the project

### Development

Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## Database Management

### Creating a New Table

1. Edit `prisma/schema.prisma` and add your model:
```prisma
model YourModel {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

2. Generate and apply migrations:
```bash
# Create a migration
npx prisma migrate dev --name add_your_model

# Generate Prisma Client
npx prisma generate
```

### Useful Prisma Commands

```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# View current database state
npx prisma db pull
```

## Project Structure

```
├── prisma/               # Database schema and migrations
├── src/
│   ├── app/             # Next.js app router components
│   ├── server/          # tRPC API routes and procedures
│   └── trpc/            # tRPC client configuration
└── .env                 # Environment variables (get from Evan)
```

## Technology Stack

- [Next.js](https://nextjs.org) - React framework
- [tRPC](https://trpc.io) - End-to-end typesafe APIs
- [Prisma](https://prisma.io) - Database ORM
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Neon](https://neon.tech) - Serverless Postgres database

## Common Issues

- If you get database connection errors, make sure you have the correct `.env` file from Evan
- If you get a "command not found" error, make sure to use `npx` before Prisma commands

## Deployment

For deployment instructions, follow our guides for:
- [Vercel](https://create.t3.gg/en/deployment/vercel)
- [Netlify](https://create.t3.gg/en/deployment/netlify)
- [Docker](https://create.t3.gg/en/deployment/docker)

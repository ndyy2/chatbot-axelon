# Setting Up Prisma ORM with MySQL Database

## Prerequisites

Before setting up Prisma with MySQL, ensure you have the following:

1. **Node.js**: Version 14 or higher installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

2. **MySQL Server**: A running MySQL server. You can install MySQL Community Server from [mysql.com](https://dev.mysql.com/downloads/mysql/) or use a package manager like Homebrew (macOS), apt (Ubuntu), or chocolatey (Windows).

3. **MySQL Database**: Create a database for your project. You can do this via MySQL command line or a GUI tool like MySQL Workbench.

   Example command to create a database:

   ```sql
   CREATE DATABASE your_database_name;
   ```

4. **Basic Knowledge**: Familiarity with JavaScript/TypeScript and database concepts is helpful but not required.

## Installation

1. **Initialize Prisma** (if not already done):

   ```bash
   npx prisma init
   ```

   This creates a `prisma` directory with `schema.prisma` file.

2. **Install Dependencies**:
   ```bash
   npm install prisma @prisma/client mysql2
   ```
   - `prisma`: The Prisma CLI for database operations.
   - `@prisma/client`: The Prisma Client for querying the database.
   - `mysql2`: MySQL driver for Node.js.

## Schema Definition

The schema is defined in `prisma/schema.prisma`. It includes datasource, generator, and model definitions.

### Basic Schema Structure

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

- **generator client**: Generates the Prisma Client.
- **datasource db**: Specifies the database provider and connection URL.
- **models**: Define your database tables with fields and relationships.

## Database Connection

Set up the database connection in your `.env` file:

```env
DATABASE_URL="mysql://username:password@localhost:3306/your_database_name"
```

Replace:

- `username`: Your MySQL username (e.g., root)
- `password`: Your MySQL password
- `localhost:3306`: Your MySQL host and port
- `your_database_name`: The name of your database

Ensure the `.env` file is loaded. In Next.js, it's automatic, but for other setups, you might need `dotenv`.

## Migration

Migrations keep your database schema in sync with your Prisma schema.

1. **Generate Initial Migration**:

   ```bash
   npx prisma migrate dev --name init
   ```

   This creates the database tables based on your schema.

2. **Apply Migrations** (for production or when schema changes):

   ```bash
   npx prisma migrate deploy
   ```

3. **Reset Database** (for development):
   ```bash
   npx prisma migrate reset
   ```

## Basic CRUD Operations

Use the Prisma Client to perform database operations.

### Setup Prisma Client

Create a file like `lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Create (Insert)

```typescript
const user = await prisma.user.create({
  data: {
    email: "alice@example.com",
    name: "Alice",
  },
});
```

### Read (Select)

```typescript
// Get all users
const users = await prisma.user.findMany();

// Get user by ID
const user = await prisma.user.findUnique({
  where: { id: 1 },
});

// Get users with posts
const usersWithPosts = await prisma.user.findMany({
  include: { posts: true },
});
```

### Update

```typescript
const updatedUser = await prisma.user.update({
  where: { id: 1 },
  data: { name: "Alice Updated" },
});
```

### Delete

```typescript
const deletedUser = await prisma.user.delete({
  where: { id: 1 },
});
```

## Next Steps

- Explore Prisma Studio: `npx prisma studio` for a GUI to view/edit data.
- Learn about relations, enums, and advanced queries in the [Prisma Docs](https://www.prisma.io/docs).
- For production, consider connection pooling and optimization.

This guide covers the basics. Adjust based on your project needs.

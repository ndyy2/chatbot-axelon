import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "./app/generated/prisma/client"; // Your specific path
import bcrypt from "bcrypt";

// --- 1. Prisma Singleton (Prevents DB connection exhaustion in dev) ---
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// --- 2. Auth Configuration ---
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google Provider must be invoked
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // validate credentials
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        // Check if user exists and has a password (social logins might not)
        if (!user || !(user as any).hashedPassword) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          (user as any).hashedPassword
        );

        if (!isPasswordValid) {
          return null;
        }

        // Return user object (NextAuth v5 handles the rest)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Mandatory when using Credentials + Adapter
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redirect here if unauthenticated
  },
});

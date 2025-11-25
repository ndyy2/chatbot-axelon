import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        // Fetch user from database
        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!user || !user.password) {
          return null;
        }

        // Use bcrypt to validate the password
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          return null;
        }

        // Make sure to return needed user fields for the JWT/session
        return {
          id: user.id,
          name: user.name || user.username || "", // fallback if needed
          email: user.email,
          image: user.avatar || user.image || null, // fallback if needed
          username: user.username, // add custom field for username
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image || null;
        // Also attach username if available
        if ("username" in user) {
          token.username = (user as any).username;
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      // Attach fields to session.user
      if (session.user) {
        // Explicitly type session.user and token as any, or define proper interfaces if preferred
        session.user.id = token.id as string;
        session.user.image = token.image as string | null | undefined;
        session.user.email = token.email as string;
        session.user.name = token.name;
      }
      return session;
    },
  },
});

import { NextAuthOptions } from "next-auth";
import credentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    credentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Allow sign-in for both Google and Credentials providers
      if (
        account?.provider === "google" ||
        account?.provider === "credentials"
      ) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        // If the user is signing in with Google and doesn't exist in the database, create a new user
        if (account.provider === "google" && !existingUser) {
          await prisma.user.create({
            data: {
              name: user.name!,
              email: user.email!,
              password: "", // No password for Google accounts
            },
          });
        }
        return true;
      }
      return false;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Kalau login Google, ambil id dari database
        if (account?.provider === "google") {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });
          token.id = dbUser?.id ?? user.id;
          token.nama = dbUser?.name ?? user.name;
          token.role = dbUser?.role ?? "SISWA";
        } else {
          token.id = user.id;
          token.nama = user.name;
          token.role = user.role ?? "SISWA";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          role: token.role as string,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

import NextAuth from "next-auth";
import { mongooseConnect } from "@/lib/mongoose";
import CredentialProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { Profile } from "@/models/Profile";

export default NextAuth({
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        await mongooseConnect();
        // Search for users by email
        const user = await Profile.findOne({ email: credentials.email });

        // If user is found and password is valid
        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return { id: user._id, email: user.email };
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id; // Add user id to token
      }
      return token;
    },
    async session({ session, token }) {
      session.user._id = token._id; // Stores the user id in the session
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  database: process.env.MONGODB_URI,
});

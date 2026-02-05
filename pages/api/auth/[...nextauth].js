import NextAuth from "next-auth";
import { mongooseConnect } from "@/lib/mongoose";
import CredentialProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Profile } from "@/models/Profile";

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  // ---------------------

  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        await mongooseConnect();
        const user = await Profile.findOne({ email: credentials.email });

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
        token._id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user._id = token._id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  database: process.env.MONGODB_URI,
});

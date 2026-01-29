import "dotenv/config";
import { db } from "@repo/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor, username } from "better-auth/plugins";
import { userSchema } from "@repo/db";

const userAuth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: userSchema,
  }),
  basePath: "/api/user/auth",
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 50,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 10 * 60,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {},
  },
  user: {
    changeEmail: {
      enabled: true,
    },
    additionalFields: {
      isFullNameVisible: {
        type: "boolean",
        required: true,
        defaultValue: true,
        input: true,
      },
      isUsernameVisible: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
    },
  },
  plugins: [twoFactor(), username()],
});

export default userAuth;

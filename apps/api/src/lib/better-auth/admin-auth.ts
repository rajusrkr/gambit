import { db } from "@repo/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor, username } from "better-auth/plugins";
import { adminSchema } from "@repo/db";
import { sendAdminVerificationEmail } from "../node-mailer";

const adminAuth = betterAuth({
  // DB configs
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: adminSchema,
  }),
  basePath: "/api/admin/auth",
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
  ],
  advanced: {
    cookiePrefix: "admin-web",
    cookies: {
      session_token: {
        name: "admin_auth",
        attributes: {
          httpOnly: true,
          secure: true,
        },
      },
    },
  },
  // Enable only email and password
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 50,
  },
  // Email verication is required
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 10 * 6,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ url, user }) => {
      sendAdminVerificationEmail({
        subject: "Verify your email",
        to: user.email,
        url,
      });
    },
  },
  // Enable plugins
  plugins: [
    twoFactor({
      schema: {
        twoFactor: {
          modelName: "adminTwoFactor",
        },
      },
    }),
    username(),
  ],
  // Changing the moodel name and adding additional fields
  user: {
    modelName: "admin",
    // changeEmail: {
    //     enabled: true
    // }
    additionalFields: {
      role: {
        type: ["admin", "superAdmin"],
        required: true,
        defaultValue: "admin",
      },
      isFullNameVisible: {
        type: "boolean",
        defaultValue: true,
      },
      isUserNameVisible: {
        type: "boolean",
        defaultValue: true,
      },
      approval: {
        type: ["approved", "pending", "rejected"],
        defaultValue: "pending",
        required: true,
      },
      permissions: {
        type: "json",
        required: false,
      },
    },
  },
  verification: {
    modelName: "adminVerification",
  },
  account: {
    modelName: "adminAccount",
  },
  session: {
    modelName: "adminSession"
  },
});

export default adminAuth;

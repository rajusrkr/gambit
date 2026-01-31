import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins"

export const adminAuthClient = createAuthClient({
  baseURL: "http://localhost:3333/api/admin/auth",
  plugins: [
    inferAdditionalFields({
      user: {
        approval: {
          type: ["pending", "approved", "rejected"],

        }
      }
    })
  ]
});

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins"
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
    jwtClient() 
  ],
});

// Destructure methods directly from the configured instance:
export const { signIn, signUp, signOut, useSession } = authClient;
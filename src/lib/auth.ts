
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI as string );
const db = client.db("event-db");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
     plugins: [
        jwt(), 
    ],
    session:{
      cookieCache:{
        enabled:true,
        strategy:'jwt',
        maxAge:4 * 24 *60 *60,
        // version bump forces any stale cached session cookie to be re-read
        // from the DB, so new user fields (e.g. the Google photo) show up.
        version: "2",
      }
    },


  database: mongodbAdapter(db, {
    client,
  }),
});
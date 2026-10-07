// src/lib/supbase.ts

import { useMemo, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";
import { useSession } from "@clerk/clerk-expo";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

let globalGetClerkToken: (() => Promise<string | null | undefined>) | null =
  null;
let supabaseSingleton: SupabaseClient<Database> | null = null;

function getSupabaseClient(): SupabaseClient<Database> {
  if (supabaseSingleton) {
    return supabaseSingleton;
  }

  supabaseSingleton = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    global: {
      fetch: async (url, options = {}) => {
        let clerkToken: string | null | undefined = null;
        if (globalGetClerkToken) {
          try {
            clerkToken = await globalGetClerkToken();
          } catch (error) {
            console.warn("Clerk getToken failed:", error);
          }
        }

        const headers = new Headers(options?.headers);
        if (clerkToken) {
          headers.set("Authorization", `Bearer ${clerkToken}`);
        } else {
          headers.set("Authorization", `Bearer ${supabaseAnonKey}`);
        }

        return fetch(url, {
          ...options,
          headers,
        });
      },
    },
  });

  return supabaseSingleton;
}

export const useSupabase = () => {
  const { session, isSignedIn } = useSession();

  // Always update the module-level token getter with the latest active session
  globalGetClerkToken = async () => {
    if (!isSignedIn || !session) {
      return null;
    }
    try {
      return await session.getToken({ template: "supabase" });
    } catch (e: any) {
      // If the session is inactive or token template fails, don't throw an unhandled rejection
      const msg = e?.message || String(e);
      console.warn("Clerk session token error:", msg);
      return null;
    }
  };

  return useMemo(() => getSupabaseClient(), []);
};

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.

// AppState.addEventListener("change", (state) => {
//   if (state === "active") {
//     supabase.auth.startAutoRefresh();
//   } else {
//     supabase.auth.stopAutoRefresh();
//   }
// });

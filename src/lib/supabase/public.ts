import "server-only";

import { createClient } from "@supabase/supabase-js";

export function createPublicClient() {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!projectUrl || !publishableKey) {
    throw new Error("Supabase public environment variables are missing.");
  }

  return createClient(projectUrl, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

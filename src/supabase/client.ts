import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { env, hasSupabase } from "../config/env";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!hasSupabase) throw new Error("Supabase is not configured");
  client ??= createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      persistSession: true,
      autoRefreshToken: true,
      // o app não usa links de login, e na web o parse da URL só atrapalharia o roteador
      detectSessionInUrl: false,
    },
  });
  return client;
}

let pending: Promise<string> | null = null;

// Entra como usuário anônimo na primeira vez e reaproveita a sessão salva depois (docs/deploy.md, etapa D).
export function ensureUserId(): Promise<string> {
  pending ??= (async () => {
    const supabase = getSupabase();
    const { data } = await supabase.auth.getSession();
    if (data.session) return data.session.user.id;

    const { data: signedIn, error } = await supabase.auth.signInAnonymously();
    if (error || !signedIn.user) {
      throw error ?? new Error("Anonymous sign-in failed");
    }
    return signedIn.user.id;
  })().catch((error) => {
    pending = null;
    throw error;
  });
  return pending;
}

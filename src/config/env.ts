// O Expo troca process.env.EXPO_PUBLIC_X na hora do build, então o nome tem que ser escrito por inteiro.
// Tudo aqui vai pro bundle e é público: nunca coloque segredo.
export const env = {
  apiUrl: (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/+$/, ""),
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
};

export const hasApi = env.apiUrl.length > 0;
export const hasSupabase =
  env.supabaseUrl.length > 0 && env.supabaseAnonKey.length > 0;

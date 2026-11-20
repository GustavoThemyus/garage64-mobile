// Configuração vinda do ambiente. O Expo troca cada `process.env.EXPO_PUBLIC_X`
// pelo valor na hora do build, então o nome tem que aparecer escrito por inteiro
// (não dá pra ler dinamicamente). Tudo aqui vai pro bundle e é público: nunca
// coloque uma chave secreta em EXPO_PUBLIC_*. Veja .env.example.
export const env = {
  apiUrl: (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/+$/, ""),
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
};

// Sem a variável o recurso fica desligado e o app segue 100% local.
export const hasApi = env.apiUrl.length > 0;
export const hasSupabase =
  env.supabaseUrl.length > 0 && env.supabaseAnonKey.length > 0;

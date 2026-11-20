import AsyncStorage from "@react-native-async-storage/async-storage";

import { BuildsRepository } from "../storage/buildsRepository";
import { ensureUserId, getSupabase } from "./client";
import {
  BuildsTable,
  createRemoteBuildsRepository,
  MigrationFlag,
} from "./remoteBuildsRepository";

function createSupabaseTable(): BuildsTable {
  return {
    async select() {
      const { data, error } = await getSupabase()
        .from("builds")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    async upsert(row) {
      const { error } = await getSupabase()
        .from("builds")
        .upsert(row, { onConflict: "user_id,id" });
      if (error) throw error;
    },
    async remove(id) {
      const { error } = await getSupabase().from("builds").delete().eq("id", id);
      if (error) throw error;
    },
  };
}

// Uma chave por usuário: quem entra num aparelho já usado não herda a marca de outro.
function createAsyncStorageFlag(getUserId: () => Promise<string>): MigrationFlag {
  const key = async () => `garage64:builds:migrated:v1:${await getUserId()}`;
  return {
    isDone: async () => (await AsyncStorage.getItem(await key())) === "1",
    markDone: async () => AsyncStorage.setItem(await key(), "1"),
  };
}

export function createSupabaseBuildsRepository(
  legacy: BuildsRepository,
): BuildsRepository {
  return createRemoteBuildsRepository({
    table: createSupabaseTable(),
    getUserId: ensureUserId,
    legacy,
    flag: createAsyncStorageFlag(ensureUserId),
  });
}

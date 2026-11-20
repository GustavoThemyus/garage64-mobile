import AsyncStorage from "@react-native-async-storage/async-storage";

import { Build } from "../types/build";
import { parseBuilds } from "./parseBuilds";

// A versão na chave deixa trocar o formato no futuro sem ler lixo antigo.
const STORAGE_KEY = "garage64:builds:v1";

export async function loadBuilds(): Promise<Build[]> {
  return parseBuilds(await AsyncStorage.getItem(STORAGE_KEY));
}

export async function saveBuilds(builds: Build[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
}

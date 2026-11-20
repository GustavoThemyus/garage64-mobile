import { hasSupabase } from "../config/env";
import { localBuildsRepository } from "../storage/localBuildsRepository";
import { createSupabaseBuildsRepository } from "../supabase/buildsRepository";
import { createSupabaseCarsRepository } from "../supabase/carsRepository";
import { localCarsRepository } from "./carsRepository";

// Único lugar que escolhe entre local e Supabase: sem as variáveis EXPO_PUBLIC_SUPABASE_* o app segue 100% local.
export const carsRepository = hasSupabase
  ? createSupabaseCarsRepository(localCarsRepository)
  : localCarsRepository;

export const buildsRepository = hasSupabase
  ? createSupabaseBuildsRepository(localBuildsRepository)
  : localBuildsRepository;

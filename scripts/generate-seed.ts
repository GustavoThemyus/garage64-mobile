// Imprime o SQL de seed a partir do mock. `npm run seed:sql` redireciona a saída para supabase/seed.sql,
// que vai para o SQL Editor do Supabase.
import { carsMoch } from "../src/data/carsMoch";

const TAG = "$garage64$";

const statements = carsMoch.map((car) => {
  const json = JSON.stringify(car);
  if (json.includes(TAG)) throw new Error(`${car.info.model} contém ${TAG}`);
  return `insert into public.cars (id, data) values (${car.info.id}, ${TAG}${json}${TAG}::jsonb)\n  on conflict (id) do update set data = excluded.data;`;
});

console.log("-- Gerado por scripts/generate-seed.ts. Não editar à mão: rode `npm run seed:sql`.");
console.log(statements.join("\n"));

import { BuildsRepository } from "../storage/buildsRepository";
import { BuildRow, buildToRow, newestFirst, rowToBuild } from "./buildRows";

// As três operações de banco que o repositório usa. Separadas do SDK pra testar sem rede.
export interface BuildsTable {
  select(): Promise<unknown[]>;
  upsert(row: BuildRow): Promise<void>;
  remove(id: string): Promise<void>;
}

export interface MigrationFlag {
  isDone(): Promise<boolean>;
  markDone(): Promise<void>;
}

type RemoteOptions = {
  table: BuildsTable;
  getUserId: () => Promise<string>;
  // Builds que já estavam no aparelho antes do banco. Sobem uma única vez.
  legacy?: BuildsRepository;
  flag?: MigrationFlag;
};

export function createRemoteBuildsRepository({
  table,
  getUserId,
  legacy,
  flag,
}: RemoteOptions): BuildsRepository {
  return {
    async list() {
      const userId = await getUserId();
      const remote = (await table.select())
        .map(rowToBuild)
        .filter((build) => build !== null);

      if (!legacy || !flag || (await flag.isDone())) return newestFirst(remote);

      const known = new Set(remote.map((build) => build.id));
      const pending = (await legacy.list()).filter(
        (build) => !known.has(build.id),
      );
      for (const build of pending) {
        await table.upsert(buildToRow(build, userId));
      }
      await flag.markDone();
      return newestFirst([...remote, ...pending]);
    },
    async save(build) {
      await table.upsert(buildToRow(build, await getUserId()));
    },
    async remove(id) {
      await getUserId();
      await table.remove(id);
    },
  };
}

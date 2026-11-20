// Dados mostrados em Settings > About the creator e Links.
// Para adicionar um link novo (LinkedIn, site...), basta incluir um item em LINKS.
export const CREATOR = {
  name: "Gustavo Themyus",
  // Texto provisório: troque pela sua apresentação quando quiser.
  bio: "Garage64 is a learning project, made to learn React Native by building something real.",
};

export type ExternalLink = {
  id: string;
  label: string;
  url: string;
};

export const LINKS: ExternalLink[] = [
  {
    id: "github-profile",
    label: "GitHub profile",
    url: "https://github.com/GustavoThemyus",
  },
  {
    id: "github-repo",
    label: "Garage64 source code",
    url: "https://github.com/GustavoThemyus/garage64-mobile",
  },
];

export const PROJECT_DESCRIPTION =
  "Garage64 is a catalog and build configurator for car enthusiasts: JDM, muscle, classics, track and street. Browse the catalog, open a full spec sheet, tune a build and watch the numbers change, then save it.";

export const PROJECT_DISCLAIMER =
  "Performance numbers are simulated by a simple model of my own, not real measurements.";

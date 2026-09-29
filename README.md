# Garage64 Mobile

A car catalog and build configurator for enthusiasts: JDM, muscle, classics, track and street. You browse a catalog, open a full spec sheet, tune a build and watch the numbers recalculate, then save it.

Built with React Native and Expo, in TypeScript.

> **Status: paused, maintenance only.**
> Development is on hold for other priorities. The app runs, but it covers a small part of the planned product. See [Project status](#project-status) for details.

---

## Why this project exists

Two goals. Learning comes first.

The main reason is to learn React Native and Expo by building something real instead of following tutorials. Many decisions here were made to be understood rather than to be quick.

The second reason is portfolio. Other people are meant to read this, so the reasoning gets written down as the work happens.

The behavioral spec lives in [`docs/spec.md`](docs/spec.md) and is the source of truth for what the app should do. It is written in Portuguese.

---

## What works today

**Catalog.** A responsive grid of car cards. The column count adapts to screen width: 2, 3 or 4. Each card shows the image, model, brand, year, type and horsepower, plus a country flag badge.

**Filters overlay.** A blurred panel over the catalog, with collapsible sections for brand, country and type. Selecting a filter updates the grid right away.

**Car Detail.** Opens when you tap a card. Shows the model and the full factory spec sheet: 13 fields with readable labels, generated from the data instead of written by hand.

**Central color theme.** Every color comes from one token set. Components hold no hardcoded colors.

## What does not exist yet

The spec describes four bottom tabs. One of them is implemented.

- **Build Configurator.** Sliders, toggles and single choice controls, with live recalculation of horsepower, torque, top speed, acceleration and consumption, plus compatibility warnings per car.
- **Builds tab.** Saved builds, with filtering and renaming.
- **Settings tab.** Light and dark toggle, project and author info.
- **Assistant tab.** Out of scope for v1.
- **Car Detail, remaining blocks.** Image, identification, type, performance, trivia and media appearances. Only the specs block is done.
- **Compare.** Side by side comparison bars between two cars.

---

## Tech

| Layer | Choice |
| --- | --- |
| App | React Native `0.81.5`, Expo SDK `54` |
| Language | TypeScript, `strict` |
| Routing | `expo-router` v6, file based, typed routes |
| Data | Local mock file, 14 cars, read only |
| Styling | `StyleSheet` plus a central theme module |

There is no backend yet. Persistence, authentication and moving the catalog to a database are later phases, described in the spec.

### Project structure

```
app/                 routes (expo-router)
  (tabs)/            bottom tabs, currently Catalog
  carDetails.tsx     car detail screen
src/
  components/        CarCard, CarFiltersOverlay
  data/              car mock, filtering, label dictionary
  theme/             color tokens and the useTheme hook
  types/             the Car model
docs/spec.md         behavioral spec (Portuguese)
```

The `Car` model is nested in five groups: `info`, `specs`, `performance`, `rules` and `history`. Every field is read through its group, for example `car.specs.engine`.

---

## Running it

```bash
npm install
npm start          # Metro bundler and the Expo Go QR code
npm run web        # run in a browser
npm run android    # open on Android
npm run ios        # open on iOS
```

Type checking:

```bash
npx tsc --noEmit
```

There is no test runner and no linter configured. Type checking is the only automated verification.

> **Expo Go version note.** This project targets Expo SDK 54. Expo Go on the app stores only supports the latest SDK, so a current Expo Go install will refuse to open the project. Until the SDK is upgraded, use `npm run web`, an emulator, or a development build.

---

## Project status

Paused for other priorities. Maintenance only.

What that means in practice:

- No new features while the project is paused.
- Bug fixes, dependency bumps and documentation updates may still land.
- Issues and pull requests can take a long time to get an answer.

### Known limitations

**Filters combine with OR across categories.** Selecting Nissan and Coupé returns every Nissan plus every coupé, instead of only Nissan coupés. How filters should combine, within one category and across categories, is not specified yet.

**The light theme is a placeholder.** The token structure supports two themes, but the light values are a copy of the dark ones. There is no theme toggle yet, so this is not visible in the app.

**The catalog filter is not in the spec.** It exists in code with no written behavior.

**Weight, torque and top speed are arrays of two numbers.** Weight and top speed hold one quantity in two units. Torque holds a value and the RPM where it peaks. The three look alike in the data and need different formatting.

---

## License

No license file yet. Car images are loaded by URL from third party sources and are not covered by this repository.

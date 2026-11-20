# Garage64 Mobile

A car catalog and build configurator for enthusiasts: JDM, muscle, classics, track and street. You browse a catalog, open a full spec sheet, compare two cars, tune a build and watch the numbers recalculate, then save it.

Built with React Native and Expo, in TypeScript.

> **Status: the v1 frontend is complete. The backend is planned and not started.**
> Everything runs on the device with a local mock catalog. Accounts, cloud storage, server side calculation and the assistant's answers need a backend. The web, Android and environment configuration for deployment is already in the repository, and the data layer is ready to be pointed at a backend. See [Next steps](#next-steps) and [`docs/deploy.md`](docs/deploy.md).

---

## Why this project exists

Two goals. Learning comes first.

The main reason is to learn React Native and Expo by building something real instead of following tutorials. Many decisions here were made to be understood rather than to be quick.

The second reason is portfolio. Other people are meant to read this, so the reasoning gets written down as the work happens.

The behavioral spec lives in [`docs/spec.md`](docs/spec.md) and is the source of truth for what the app should do. It is written in Portuguese.

---

## What works today

**Catalog.** A responsive grid of car cards with a press animation. The column count adapts to screen width: 2, 3 or 4. The header button filters by brand, country and type. On iOS it opens a native menu anchored to the button, with one submenu per category. On Android and the web it opens a panel in the corner. Values inside one category add up and categories narrow each other, so Nissan plus Toyota plus Sports Coupe shows the sports coupes of those two brands. "Clear all" resets it.

**Car Detail.** Hero image, identification, type, performance tiles, the full factory spec sheet, curiosities and media appearances. Fields come from the data and are formatted by what they mean: weight is kilograms and pounds, torque is a value at an RPM.

**Compare.** Pick another car and see bars for power, torque, top speed, acceleration, consumption and weight. The better car fills the bar in green. The other car is green up to its own level and red up to the other car's level.

**Build Configurator.** Sliders for displacement and valves, native switches for all-wheel drive and nitrous, and single choice lists for aspiration, transmission, wheels, brakes and steering. Every control starts at the factory value. Power, torque, top speed, acceleration and consumption recalculate on every change, with the difference against factory. If the car's own rules reject a choice, the build shows a warning with the reason and can still be saved.

**Builds.** Saved builds in one-per-row cards, stored on the device. Tap to edit, rename, delete, and filter by base car, brand, power range and compatibility.

**Settings.** System, Light or Dark theme, project and author info, and links. On iOS the theme selector is the native segmented control, which is Liquid Glass on iOS 26.

**Assistant.** The full chat screen. It talks to a service that is switched off for now, so it answers that it is offline. Plugging in the backend later only changes `src/services/assistant.ts`.

**Theme.** Every color comes from one token set with a real light and dark palette. Components hold no hardcoded colors.

### iOS look

On iOS 26 and later the app uses the system Liquid Glass for the floating tab bar, the header buttons and the filter menu. Android, web, older iOS and the "Reduce Transparency" setting fall back to solid themed surfaces. The shape of the tab bar and its selection capsule are drawn by iOS and cannot be customized.

Cards are not glass. They use the Garage64 surface: a subtle gradient fill with a 1 pt gradient rim that is light at the top left corner and fades toward the bottom right, the same on every platform. A card never depends on its content for its structure, so cards in the same grid row always have the same height. Pressing a card lightens it very slightly (about 150 ms in, 120 ms out) instead of scaling it.

---

## Tech

| Layer | Choice |
| --- | --- |
| App | React Native `0.88`, React `19.3`, Expo SDK `58` |
| Language | TypeScript `6`, `strict` |
| Routing | `expo-router` `58`, file based, typed routes, native tabs |
| Data | Local mock, 14 cars, read only |
| Storage | AsyncStorage (builds, theme preference) |
| Styling | `StyleSheet`, a central theme module, Reanimated for motion |

### Project structure

```
app/                       routes (expo-router)
  (tabs)/                  native bottom tabs
    (catalog) (builds) (assistant) (settings)   one Stack per tab
  carDetails.tsx           car detail
  configurator.tsx         build configurator
src/
  components/              shared UI, plus detail/, configurator/, chat/ and filters/
  data/                    car mock, catalog repository and provider, parts catalog, formatters
  config/                  environment variables
  engine/                  calculation, compatibility rules, comparison, filters
  storage/                 builds repository, provider and parsing
  services/                assistant service (offline until an API URL is set)
  theme/                   color tokens, spacing, typography, theme provider
  types/                   Car and Build models
scripts/verify-engine.ts   checks for the engine, filters, storage and services
public/                    web manifest and icons, copied into the web build
docs/                      spec (Portuguese) and deployment plan
app.json eas.json          Expo and EAS Build configuration (Android APK profile)
vercel.json .env.example   web hosting and environment variables
```

The `Car` model is nested in five groups: `info`, `specs`, `performance`, `rules` and `history`. Every field is read through its group, for example `car.specs.engine`. A `Build` references its car by id and never copies it.

The calculation is a simple model of my own, not real performance data. Every formula is a ratio against the factory configuration, so the factory build reproduces the mock exactly. The coefficients are written in section 5.5 of the spec.

---

## Web or Expo Go

The app opens in two ways, and they are not the same experience.

| | Web (`garage64-mobile.vercel.app`) | Expo Go (iOS) |
| --- | --- | --- |
| Install | none, or "Add to Home Screen" | Expo Go from the App Store, then the QR code |
| Tab bar | classic tab bar drawn by the app | iOS 26+ floating Liquid Glass tab bar |
| Header | opaque header, no large title | native header with large title that collapses on scroll, glass buttons |
| Filters | panel in the corner | native iOS menu anchored to the button |
| Theme switch | app drawn | native segmented control |
| Saved builds | stored in the browser | stored in the app, separate from the browser |

A browser cannot draw the native iOS 26 tab bar, the glass buttons or the native menus, so the web version will always look different. **For the complete experience, run it in Expo Go.** The web version is for sharing a link with someone who has nothing installed.

## Running it

You need Node 22.13 or newer.

```bash
npm install
npm start          # Metro bundler and the Expo Go QR code
npm run web        # run in a browser
npm run android    # open on Android
npm run ios        # open on iOS
```

Open the QR code with Expo Go from the app store. This project targets Expo SDK 58, which is what the store version of Expo Go runs. Expo Go only supports the latest SDK, so when a newer SDK ships and Expo Go updates, the project has to be upgraded to keep opening there.

In Expo Go a blue gear button floats over the top right corner of the app. It belongs to Expo Go's developer tools, not to this app, and it can cover the header buttons. To hide it, start the project with `EXPO_NO_DEV_MENU=1` (documented for SDK 58 and later). In fish: `env EXPO_NO_DEV_MENU=1 npm start`.

Checks:

```bash
npx tsc --noEmit        # types
npx expo-doctor         # project configuration
npm run verify:engine   # engine, filters, storage, repositories and assistant service
```

There is no test runner and no linter. `verify:engine` covers the calculation, the filters, the storage parsing, the repository contract and the assistant service against the 14 mock cars. The screens themselves are checked by hand.

---

## Next steps

In the order I plan to do them. Each step is detailed in [`docs/deploy.md`](docs/deploy.md).

1. **Put the web build online.** Create the Vercel project from this repository and leave every setting at its default except Framework Preset, which is `Other`. The build command, the output folder, the single page rewrite, the PWA files and the Node version are already set up in the repository, so this only needs the account.
2. **Build the Android APK** with `eas build -p android --profile preview` and share the install link. Confirm the app identifier `com.gustavothemyus.garage64` first, because it cannot change after publishing.
3. **Add continuous integration:** type check, `expo-doctor` and `verify:engine` on every pull request.
4. **Supabase (spec phase 2).** Write a `CarsRepository` and a `BuildsRepository` backed by the database, with anonymous auth. No screen needs to change.
5. **Next.js API (spec phases 3 and 4).** Move the calculation to the server and answer the Assistant through `POST /api/assistant`. The app already speaks that contract once `EXPO_PUBLIC_API_URL` is set.
6. **Native iOS build through TestFlight** (optional, needs a paid Apple developer account).

Also pending and not tied to the backend: host the car images myself instead of loading third party URLs.

---

## Configuration

Without any configuration the app runs fully local. To turn on the backend pieces, copy `.env.example` to `.env`:

| Variable | Turns on |
| --- | --- |
| `EXPO_PUBLIC_API_URL` | the Assistant, through `POST /api/assistant` |
| `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` | reserved for the Supabase phase |

Everything named `EXPO_PUBLIC_*` ends up in the app bundle and is public. Never put a secret key there.

The catalog and the builds are read through two small interfaces, `CarsRepository` and `BuildsRepository`. Today they are backed by the local mock and the device storage. Moving to a database means writing another implementation of each interface, not changing screens. The steps are in [`docs/deploy.md`](docs/deploy.md).

---

## Known limitations

**The calculation is simulated.** It is a plain model, not measurements. It is easy to tune, but the numbers are not real.

**Builds live on one device.** They are stored in AsyncStorage, so clearing the app or browser data deletes them, and they do not sync between devices.

**The Assistant answers nothing yet.** The interface and the HTTP client are done, and the service stays switched off until `EXPO_PUBLIC_API_URL` points to an API that implements the contract in `docs/deploy.md`.

**Car images come from third party URLs.** They are not cached, can disappear, and are not covered by the license.

**One data contradiction.** Every car has `canChangeTraction` set to false, but the Supra allows all-wheel drive. Turning it on shows the stricter warning. It is listed in the spec so the data can be fixed.

**The web build has no Liquid Glass and no native iOS controls.** It uses classic tabs, an opaque header and solid surfaces. This is a limit of browsers, not a bug. Use Expo Go for the full iOS look (see [Web or Expo Go](#web-or-expo-go)).

**Web and Expo Go do not share builds.** Each one keeps its own storage, so a build saved in one does not appear in the other until there is a cloud backend.

**The iOS filter menu closes its submenu after each choice.** To let you pick several brands without the menu closing, it stays open after a tap, but iOS rebuilds it each time, so the open submenu collapses back to the main menu. This is a documented limit of the Expo menu API.

---

## License

Released under the MIT License. See [`LICENSE`](LICENSE) for the full text.

The license covers the code in this repository. Car images are loaded by URL from third party sources and are not covered by it.

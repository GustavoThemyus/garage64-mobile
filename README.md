# Garage64 Mobile

A car catalog and build configurator for enthusiasts: JDM, muscle, classics, track and street. You browse a catalog, open a full spec sheet, compare two cars, tune a build and watch the numbers recalculate, then save it.

Built with React Native and Expo, in TypeScript.

> **Status: the v1 frontend is complete. The backend is planned and not started.**
> Everything runs on the device with a local mock catalog. Accounts, cloud storage, server side calculation and the assistant's answers need a backend. The plan is in [`docs/deploy.md`](docs/deploy.md).

---

## Why this project exists

Two goals. Learning comes first.

The main reason is to learn React Native and Expo by building something real instead of following tutorials. Many decisions here were made to be understood rather than to be quick.

The second reason is portfolio. Other people are meant to read this, so the reasoning gets written down as the work happens.

The behavioral spec lives in [`docs/spec.md`](docs/spec.md) and is the source of truth for what the app should do. It is written in Portuguese.

---

## What works today

**Catalog.** A responsive grid of car cards with a press animation. The column count adapts to screen width: 2, 3 or 4. A button in the header opens a filter panel for brand, country and type. Values inside one category add up and categories narrow each other, so Nissan plus Toyota plus Sports Coupe shows the sports coupes of those two brands. "Clear all" resets it.

**Car Detail.** Hero image, identification, type, performance tiles, the full factory spec sheet, curiosities and media appearances. Fields come from the data and are formatted by what they mean: weight is kilograms and pounds, torque is a value at an RPM.

**Compare.** Pick another car and see bars for power, torque, top speed, acceleration, consumption and weight. The better car fills the bar in green. The other car is green up to its own level and red up to the other car's level.

**Build Configurator.** Sliders for displacement and valves, native switches for all-wheel drive and nitrous, and single choice lists for aspiration, transmission, wheels, brakes and steering. Every control starts at the factory value. Power, torque, top speed, acceleration and consumption recalculate on every change, with the difference against factory. If the car's own rules reject a choice, the build shows a warning with the reason and can still be saved.

**Builds.** Saved builds in one-per-row cards, stored on the device. Tap to edit, rename, delete, and filter by base car, brand, power range and compatibility.

**Settings.** System, Light or Dark theme, project and author info, and links.

**Assistant.** The full chat screen. It talks to a service that is switched off for now, so it answers that it is offline. Plugging in the backend later only changes `src/services/assistant.ts`.

**Theme.** Every color comes from one token set with a real light and dark palette. Components hold no hardcoded colors.

### iOS look

On iOS 26 and later the app uses the system Liquid Glass: the floating tab bar, the header buttons, and the cards and panels. Android, web, older iOS and the "Reduce Transparency" setting fall back to solid themed surfaces. The shape of the tab bar and its selection capsule are drawn by iOS and cannot be customized.

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
  components/              shared UI, plus detail/, configurator/ and chat/
  data/                    car mock, parts catalog, formatters, labels
  engine/                  calculation, compatibility rules, comparison, filters
  storage/                 builds persistence
  services/                assistant service (offline for now)
  theme/                   color tokens, spacing, typography, theme provider
  types/                   Car and Build models
scripts/verify-engine.ts   checks for the engine, filters and storage
docs/                      spec (Portuguese) and deployment plan
```

The `Car` model is nested in five groups: `info`, `specs`, `performance`, `rules` and `history`. Every field is read through its group, for example `car.specs.engine`. A `Build` references its car by id and never copies it.

The calculation is a simple model of my own, not real performance data. Every formula is a ratio against the factory configuration, so the factory build reproduces the mock exactly. The coefficients are written in section 5.5 of the spec.

---

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

Checks:

```bash
npx tsc --noEmit        # types
npx expo-doctor         # project configuration
npm run verify:engine   # engine, filters and storage
```

There is no test runner and no linter. `verify:engine` covers the calculation, the filters and the storage parsing against the 14 mock cars. The screens themselves are checked by hand.

---

## Known limitations

**The calculation is simulated.** It is a plain model, not measurements. It is easy to tune, but the numbers are not real.

**Builds live on one device.** They are stored in AsyncStorage, so clearing the app or browser data deletes them, and they do not sync between devices.

**The Assistant answers nothing yet.** The interface is done and the service is switched off.

**Car images come from third party URLs.** They are not cached, can disappear, and are not covered by the license.

**One data contradiction.** Every car has `canChangeTraction` set to false, but the Supra allows all-wheel drive. Turning it on shows the stricter warning. It is listed in the spec so the data can be fixed.

**The web build has no Liquid Glass.** It uses classic tabs and solid surfaces.

---

## License

Released under the MIT License. See [`LICENSE`](LICENSE) for the full text.

The license covers the code in this repository. Car images are loaded by URL from third party sources and are not covered by it.

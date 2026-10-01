# Ai Art Gallery — Mobile

React Native mobile app (Expo) for **Ai Art Gallery**.

Part of [Chaowalit Greepoke](https://bookchaowalit.com)'s 101 Portfolio Projects.

## Tech Stack

- **Framework:** Expo SDK 53 + Expo Router
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based)
- **UI:** React Native + Ionicons

## Features

- **Gallery** (home tab): browse AI-generated artworks (title, prompt, model,
  tags) newest first, search across title/prompt/model and filter by tag.
- **Favorites**: heart artworks and switch to a favorites-only view.
- Artworks are bundled sample data with color-swatch previews
  (`lib/gallery.ts`); no image hosting or backend yet.

## Getting Started

```bash
npm ci
npx expo start
```

## Validation

```bash
npm run validate   # expo lint + tsc --noEmit + vitest
npx expo export --platform android --output-dir dist   # bundle smoke check
```

Pure logic lives in `lib/` and is unit-tested with Vitest (`lib/*.test.ts`).
CI (`.github/workflows/build.yml`) runs all of the above and fails on errors;
the EAS preview build is owner-triggered (`workflow_dispatch`) and needs the
`EXPO_TOKEN` secret plus the committed `eas.json`.

## Build

```bash
# Android
npx eas build --platform android --profile preview

# iOS
npx eas build --platform ios --profile preview
```

## Related

- **Frontend:** [bookchaowalit-website/ai-art-gallery-frontend](https://github.com/bookchaowalit-website/ai-art-gallery-frontend)
- **Portfolio:** [bookchaowalit.com](https://bookchaowalit.com)

## License

MIT

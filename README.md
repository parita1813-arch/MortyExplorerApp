# Morty Explorer App

React Native assignment app based on the [Rick and Morty API](https://rickandmortyapi.com/api).

## Links

- GitHub Repo: https://github.com/parita1813-arch/MortyExplorerApp.git

## Project Setup Steps

### Prerequisites

- Node.js `>= 22.11.0`
- Android Studio (for Android build)
- Xcode + CocoaPods (for iOS build)

### 1) Install dependencies

```sh
npm install
```

### 2) Start Metro

```sh
npm start
```

If you see stale bundle/runtime issues, reset Metro cache:

```sh
npx react-native start --reset-cache
```

### 3) Run the app

Android:

```sh
npm run android
```

iOS:

```sh
bundle install
bundle exec pod install
npm run ios
```

### 4) Quality checks

```sh
npm run lint
npm test
```

## Libraries Used

- `react-native` + `typescript`
- `@tanstack/react-query` for API data fetching/caching
- `axios` for typed API client and interceptors
- `@reduxjs/toolkit` + `react-redux` for app/global state
- `@op-engineering/op-sqlite` for favourites persistence
- `@react-navigation/native` + `@react-navigation/native-stack`
- `react-native-gesture-handler`
- `react-native-screens`
- `react-native-safe-area-context`

## Implemented Features

- Character list with infinite scroll, search debounce, and status/gender filters
- Character detail with full fields, episodes strip, and favourites toggle
- Episodes list paginated and grouped by season with expandable cast avatars
- Locations list paginated with expandable residents and avatars
- Offline favourites screen sourced from SQLite-backed state
- Progressive image loading and skeleton loading states
- Header hide-on-scroll behavior on character list

## Project Structure

```txt
src/
  api/
  components/
  db/
  features/
    characters/
    episodes/
    favourites/
    locations/
  hooks/
  navigation/
  providers/
  store/
  types/
```

## Known Issues / Limitations

- The API returns a 404-style message (`There is nothing here`) for no-match filters; this app maps that to a user-facing "No results found" state.
- Episodes/locations with very large character lists may load cast/residents slower due to chunked API requests.
- Filter menu UX is modal-based and functional, but could be further enhanced with richer animations.
- Unit tests are not included. The project structure allows adding tests for API logic and UI components in the future.

# Regov Technologies' Technical Assessment - React Native App

This is a React Native TS App built for the technical assessment by ReGov Technologies. It uses `expo`, `expo router`, `react-native-mmkv`, `date-fns`. `react-native-mmkv` is used to persist information. The app fetches and displays some vital COVID metrics globally or at country level. See [features](#features) for more information.

## Features

1. Auth Mechanism - A mock authentication mechanism that will accept one registration of username, email and password, the signing in and signing out of the registered user
2. Tab navigation - Upon signing in, the user will be greeted with a tab navigator with 4 different screens
   1. Home - This screen will display the global stats and the last updated time
   2. Search - This screen will display the list of the countries available for querying. The search bar can filter down the countries according to the search string. Pressing the country will display more COVID statistics pertaining to the country
   3. Countries - This screen will sort the countries by specific metrics
   4. Settings - The screen where the user can sign out

## Getting started
1. `git clone` this repository and `npm install`
2. run `npm run android` or `npm run ios`
3. you could face an error suggesting you to run `expo prebuild`, run `npx expo prebuild` and try step 2 again
4. The development is done primarily on ios simulator, run the app on the iOS simulator for better experience

## To-do's
Given the time constraints, the following items could not be completed in time, but are deemed valuable in improving the UX
1. React Query Caching with MMKV - It will persist the cache so user will not need to refetch on launch
2. Search history - It is currently disabled, onPress it will display a list of the past countries you have viewed
3. Manual reload gesture
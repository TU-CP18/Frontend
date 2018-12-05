## Prerequisites

Before you can build this project, you must install and configure the following dependencies on your machine:

- [Node.js and npm](https://nodejs.org/en/)
- [Xcode](https://developer.apple.com/xcode/)
- [Command Line Tools for Xcode](https://developer.apple.com/download/more/)
- [Android Studio](https://developer.android.com/studio/)

## Build Setup

We use [Expo](https://expo.io/) to build our React Native application. Assuming that you have [Node](https://nodejs.org/en/) installed, you can use npm to install the Expo CLI command line interface:

    npm install -g expo-cli

After cloning the `cp18-daimler-app` repository, you should run the following command to install development tools. You will only need to run this command when dependencies change in [package.json](package.json).

    npm install

Run the following command to start a development server for you.

    npm start

## Development

The previous command sets up a development server on your local machine on port 19002.
It is therefore accessible at [http://localhost:19002/](http://localhost:19002/).

On the left side you should be able to find a menu including the following two options:

- Run on Android device/emulator
- Run on iOS simulator

### Android emulator

In order to emulate the app with the Android emulator, the following steps are required.

Note: Steps 2-9 need to be setup just once.

1. Launch [Android Studio](https://developer.android.com/studio/).
2. Open `Tools` > `SDK Manager`. In the left menu select `System Settings` and choose `Android SDK`.
3. Install the `Android 8.1 (Oreo)` (API Level 27) SDK.
4. Click the checkbox to select the just installed SDK and then apply the settings.
5. Open `Tools` > `AVD Manager`.
6. Click on `Create Virtual Device...`.
7. Choose a phone of your choice and click `Next`.
8. Select the `Android 8.1 (Oreo)` (API Level 27) SDK as the system image.
9. Click `Next` and right after `Finish` to create the virtual device.
10. Launch the AVD by clicking the green arrow in the `Actions` column.

Once the build process of the AVD is finished, we are able to emulate our app on the AVD.

To run the app on the android emulator click on `Run on Android device/emulator`.

Alternatively you can run from the command line:

    npm run android

#### Helpful shortcuts

- Reload JS Bundle by pressing the `R` key twice
- Open the Developer Menu with `⌘M`

### iOS simulator

Assuming you already installed [Xcode](https://developer.apple.com/xcode/) and the [Command Line Tools for Xcode](https://developer.apple.com/download/more/), click on `Run on iOS simulator`.

Alternatively you can run from the command line:

    npm run ios

#### Helpful shortcuts

- Reload JS Bundle with `⌘R`
- Open the Developer Menu with `⌘D`

## Testing

Unit tests are run by [Jest](https://jestjs.io/) and written with [Jasmine](https://jasmine.github.io/). They're located in the directory [`__tests__`](__tests__). To launch your application's tests, run:

    npm test

## Prototype

There is a UX prototype created with Adobe XD available at: https://xd.adobe.com/view/14c325be-f3ab-4e9d-4db2-59cd61a8cd00-62f2/?fullscreen

## Git Workflow

The `master` branch is protected and only approved pull requests can push to it. Most important part of
the workflow is `rebase`, here is a refresher on merging vs rebasing: https://www.atlassian.com/git/tutorials/merging-vs-rebasing.

How do I push changes to the `master` branch?

1.  Switch to `master` with `git checkout master`
2.  Update `master` with `git pull --rebase` (ALWAYS use `rebase` when pulling!)
3.  Create new branch from `master` with `git checkout -b cs/new-feature` (where 'cs/' is your own name/abbreviation)
4.  Work on branch and push changes with `git push --set-upstream origin cs/new-feature` (where 'cs/' is your own name/abbreviation)
5.  Rebase master onto branch to not have merge conflicts later with `git pull origin master --rebase` (AGAIN use`--rebase`)
6.  Push branch again, this time force push to include rebased master (`git push origin head --force`)
7.  Create a pull request from github.com
8.  Get pull request reviewed and merge it into master

Try to keep pull requests small (not 100+ files changed), so they are easier to review. Rather create a bunch of pull requests than one big.

## CodeStyle / Linting / Formatting

[ESLint](https://eslint.org/) with [Airbnb](https://github.com/airbnb/javascript) style is used for formatting and linting.

To run ESLint and show all violations and problems, execute:

    npm run lint

For trying to autofix the occuring violations and problems, execute:

    npm run lint-fix

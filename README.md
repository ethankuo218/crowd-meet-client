# Crowd Meet Client

This project is the client-side application for Crowd Meet, a social networking platform. It was generated with Angular CLI version 16.0.0 and Ionic CLI version 5.0.4.

## Development

To set up the development environment:

1. Run `npm install` to install dependencies.
2. Run `npm run start` for a dev server. Navigate to http://localhost:8100/. The app will automatically reload if you change any of the source files.

## Build

To build the project:

- Run `npm run build` for a development build.
- Run `npm run build:prod` for a production build.

The build artifacts will be stored in the `dist/app/browser` directory.

## Mobile Platforms

### Android

Requirements:
- Java 17
- Android Studio

Steps:
1. Run `npx cap add android` to wrap the project with Capacitor.
2. Run `npx cap open android` to open the project in Android Studio.
3. Run `npx cap sync android` to sync the current build to the project.

### iOS

Requirements:
- XCode

Steps:
1. Run `npx cap add ios` to wrap the project with Capacitor.
2. Run `npx cap open ios` to open the project in XCode.
3. Run `npx cap sync ios` to sync the current build to the project.

## Project Structure

The project follows a standard Angular + Ionic structure. Key directories include:

- `src/`: Contains the main application code
- `src/app/`: Angular components, services, and modules
- `src/assets/`: Static assets like images and localization files
- `android/`: Android platform-specific code
- `ios/`: iOS platform-specific code

## Features

- Multi-language support
- In-app purchases
- Push notifications
- Chat functionality
- Event creation and management

## Configuration

The project uses environment-specific configuration files located in the `env/` directory. To switch between environments, use the `switch-env.sh` script.

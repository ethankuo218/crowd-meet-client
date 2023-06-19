import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.crowdmeet.app',
  appName: 'crowd-meet-client',
  webDir: 'dist/app/browser',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: false
    },
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com', 'apple.com']
    }
  }
};

export default config;

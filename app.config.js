import 'dotenv/config';

export default {
  name: "Swifty Companion",
  slug: "swifty-companion",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.tchtaibi.swiftycompanion",
    config: {
      usesNonExemptEncryption: false
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.tchtaibi.swiftycompanion"
  },
  scheme: "swiftycompanion",
  web: {
    favicon: "./assets/favicon.png"
  },
  experiments: {
    tsconfigPaths: true
  },
  plugins: [
    "expo-router"
  ],
  extra: {
    // Environment variables
    API_BASE_URL: process.env.API_BASE_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REDIRECT_URI: process.env.REDIRECT_URI,
    AUTH_URL: process.env.AUTH_URL,
    TOKEN_URL: process.env.TOKEN_URL,
    eas: {
      projectId: "your-project-id"
    }
  }
}; 
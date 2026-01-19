module.exports = function (api) {
  api.cache(true);

  return {
    // for bare React Native
    // presets: ['module:@react-native/babel-preset'],

    // or for Expo
    presets: ["babel-preset-expo"],

    plugins: [
      // Module resolver for path aliases
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./src",
            "~": "./app",
          },
          extensions: [
            ".ios.ts",
            ".android.ts",
            ".ts",
            ".ios.tsx",
            ".android.tsx",
            ".tsx",
            ".jsx",
            ".js",
            ".json",
          ],
        },
      ],

      // Unistyles plugin
      [
        "react-native-unistyles/plugin",
        {
          // all files under this folder will be processed
          root: "./src",
        },
      ],
    ],
  };
};

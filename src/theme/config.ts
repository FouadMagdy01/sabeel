import { darkColors } from "./dark-theme";
import { FONTS } from "./fonts";
import { lightColors } from "./light-theme";
import metrics, { fontSize } from "./metrics";

const lightTheme = {
  colors: {
    ...lightColors,
  },
  metrics: {
    ...metrics,
  },
  fonts: {
    ...FONTS,
    size: {
      ...fontSize,
    },
  },
};

const darkTheme = {
  colors: {
    ...darkColors,
  },
  metrics: {
    ...metrics,
  },
  fonts: {
    ...FONTS,
    size: {
      ...fontSize,
    },
  },
};

export const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};

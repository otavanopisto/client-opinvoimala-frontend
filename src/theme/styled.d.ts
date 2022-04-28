// import original module declarations
import 'styled-components';

interface Colors {
  primary: string;
  primaryLight: string;
  primaryLightest: string;
  secondary: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  progress: string;
  grey: string;
  grey2: string;
  grey3: string;
  grey4: string;

  foreground: string;
  background: string;

  heading: string;
  text: string;
}

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    color: Colors;

    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };

    spacing: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };

    breakpoint: {
      mobile: string;
      tablet: string;
      laptop: string;
    };

    shadows: string[];

    font: {
      main: string;
      secondary: string;
      size: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
      };
      h1: string;
      h2: string;
      h3: string;
      h4: string;
      h5: string;
      h6: string;
    };
  }
}

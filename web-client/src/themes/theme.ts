import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";

import purple from "./purple";
import teal from "./teal";

const breakpoints = createBreakpoints({});
const theme = createMuiTheme({
  mixins: {
    toolbar: {
      boxShadow: "none",
      backgroundColor: "#121212",
      minHeight: 80,
      paddingLeft: 32,
      paddingRight: 37,
      [`${breakpoints.down("md")}`]: {
        minHeight: 56,
        paddingLeft: 19,
        paddingRight: 19
      }
    }
  },
  palette: {
    // primary: { main: '#121212' }, // '#121212',
    type: "light", // secondary
    primary: {
      main: teal[200],
      light: "#66fff8",
      dark: "#00a895",
      contrastText: "#ffffff"
    },
    secondary: {
      main: purple[200],
      light: "#efb7ff",
      dark: "#8858c8",
      contrastText: "#ffffff"
    },
    error: { main: "#CF6679" },
    background: { default: "#ffffff", paper: "rgba(255, 255, 255, 0.11)" },
    action: {
      hover: "rgba(0, 0, 0, 0.08)"
    }
  },
  typography: {
    fontFamily: ["\"Noto Sans\"", "sans-serif"].join(","),
    button: {
      textTransform: "none"
    }
  },

  overrides: {
    MuiList: {
      root: {
        padding: "8px 0px",
        backgroundColor: "#ffffff",
        boxShadow:
          "0px 5px 5px rgba(0, 0, 0, 0.2), 0px 3px 14px rgba(0, 0, 0, 0.12), 0px 8px 10px rgba(0, 0, 0, 0.14)",
        borderRadius: 4
      }
    },
    MuiTabs: {
      flexContainer: {
        width: "100%",
        justifyContent: "space-around",
        borderBottom: "2px solid #2c2c2c",
        height: "calc(100% - 2.65px)"
      },
      indicator: {
        display: "flex",
        justifyContent: "center",
        backgroundColor: teal[200],
        height: "7px",
        borderRadius: "1px"
      }
    },
    MuiCard: {
      root: {
        backgroundColor: "#ffffff"
      }
    },
    MuiPaper: {
      root: {
        backgroundColor: "#ffffff"
      }
    }
  }
});

export const defaultTheme = responsiveFontSizes(theme);

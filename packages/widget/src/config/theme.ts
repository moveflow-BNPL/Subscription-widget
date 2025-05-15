import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  spacing: 4,
  palette: {
    mode: "dark",
    text: {
      primary: "#FFFFFF",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
        contained: {
          background: "#F143E2",
          color: "#FFFFFF",
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: "normal",
          "&:hover": {
            background: "#F143E2 !important",
          },
        },
        outlined: {
          border: "1px solid #343640",
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: "normal",
          color: "#FFFFFF",
          "&:hover": {
            border: "1px solid #F143E2",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          background:
            "linear-gradient(93.3deg, #F143E2 2.36%, #40187F 99.66%) !important",
          color: "#F143E2",
        },
        root: {
          "& .Mui-selected": {
            color: "#F143E2",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-input": {
            paddingTop: "10px !important",
            paddingBottom: "10px !important",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#f143e2",
          },
          "&:hover > .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #f143e2",
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        rail: { backgroundColor: "#FFBBF94D" },
        thumb: { backgroundColor: "#F143E2" },
        track: { backgroundColor: "#F143E2", border: "none" },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#aeafb3",
          fontSize: "1rem",
        },
      },
    },
  },
  typography: {
    fontSize: 12,
    fontFamily: [
      "PingFang SC",
      "-apple-system",
      '"Segoe UI"',
      "Roboto",
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    h1: {
      color: "#FFFFFF",
      fontWeight: "600",
      fontSize: "1.8rem",
    },
    h2: {
      color: "#FFFFFF",
      fontWeight: "600",
      fontSize: "1.7rem",
    },
    h3: {
      color: "#FFFFFF",
      fontSize: "1.5rem",
    },
    h4: {
      color: "#FFFFFF",
      fontSize: "1.25rem",
    },
    h5: {
      color: "#FFFFFF",
    },
    body1: {
      color: "#FFFFFF",
      fontSize: "1rem",
    },
    body2: {
      color: "#FFFFFF",
    },
  },
});

export default darkTheme;

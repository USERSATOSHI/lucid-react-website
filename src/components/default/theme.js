import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    status: {
        danger: "#e53e3e",
    },
    palette: {
        input: {
            main: "#fbfef9",
            contrastText: "#000",
        },
        neutral: {
            main: "#64748B",
            contrastText: "#fff",
        },
    },
});

export default theme;
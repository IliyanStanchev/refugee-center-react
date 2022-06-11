import { ThemeProvider, createTheme } from '@mui/material/styles';
import { lightGreen } from '@mui/material/colors';

const { palette } = createTheme()

const MyTheme = createTheme({
    palette: {
        primary: {
            main: lightGreen[800],
            secondary: lightGreen[900],
            disabledBackground: lightGreen[900],
            disabled: lightGreen[900]
        },
        action: {
            disabledBackground: lightGreen[900],
            disabled: lightGreen[900]
        },
        secondary: {
            main: lightGreen[900],
            disabledBackground: lightGreen[900],
            disabled: lightGreen[900]
        },
    },
});

export default MyTheme;
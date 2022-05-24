import { ThemeProvider, createTheme } from '@mui/material/styles';
import { lightGreen } from '@mui/material/colors';

const MyTheme = createTheme({
    palette: {
        primary: {
            main: lightGreen[800],
        },
    },
});

export default MyTheme;
// import { createMuiTheme } from '@material-ui/core';
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';

const mui = createMuiTheme({
    props: {
        MuiTextField: {
            // variant: 'filled',
            margin: 'normal',
            fullWidth: true,
        },
        MuiButton: {
            variant: 'contained'
        }
    },
    typography: {
        h1: {
            fontSize: 28
        },
        h2: {
            fontSize: 24
        },
        h3: {
            fontSize: 16,
            lineHeight: 1.4
        },
        subtitle1: {
            fontSize: 14
        },
        body1: {
            fontSize: 14
        }
    }
});

const theme = {
    ...mui,
    palette: {
        ...mui.palette,
        background: {
            ...mui.palette.background,
            paper: '#fafafa',
            default: '#f4f4f4'
        }
    },
    drawer: {
        width: 305,
        borderColor: '#e0e0e0'
    },
    appHeader: {
        toolbar: {
            background: 'linear-gradient(to right, #003f9d, #0066be, #008bd6, #00b0e7, #00d4f4)',
            foreground: mui.palette.text.primary,
            height: 60
        }
    },
    containerDefault: {
        backgroundColor: '#f9f9f9'
    }
};

export default theme;
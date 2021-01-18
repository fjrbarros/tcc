import React from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { HomeButton } from '../components/Index';
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    root: {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#030217',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },

    content: {
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        '& p': {
            color: '#cfcfcf'
        },
        '& p:nth-child(1)': {
            fontSize: '100px'
        },
        '& button': {
            marginTop: '10px',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            transition: 'all 0.25s',
            border: '1px solid transparent'
        },
        '& button:hover': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            border: '1px solid #ffffff'
        }
    }
}));

export default function NotFound() {
    const classes = useStyles();
    const history = useHistory();

    return (
        <Box className={classes.root}>
            <Box className={classes.content}>
                <Typography>404</Typography>
                <Typography>Ooops, Algo deu errado!</Typography>
                <HomeButton
                    text='Página inicial'
                    width='50%'
                    onClick={() => history.push('/dashboard')}
                />
            </Box>
        </Box>
    );
}
import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { AppBar, NavigateProjetos, Chat } from '../components/Index';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    content: {
        width: '100%'
    }
}));

export default function DefaultPage(props) {
    const classes = useStyles();
    const { children, ...rest } = props;

    return (
        <Box className={classes.root}>
            <AppBar {...rest} />
            <NavigateProjetos />
            <Chat />
            <main className={classes.content}>
                {children}
            </main>
        </Box>
    );
}
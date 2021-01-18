import React from 'react';
import { makeStyles, Box } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        height: `calc(100vh - ${theme.appHeader.toolbar.height}px)`,
        marginTop: theme.appHeader.toolbar.height,
        backgroundColor: theme.containerDefault.backgroundColor,
        overflow: 'auto'
    }
}));

export default function ContainerRoot(props) {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            {props.children}
        </Box>
    );
}
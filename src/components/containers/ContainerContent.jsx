import React from 'react';
import { makeStyles, Box } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: props => props.maxWidth ? props.maxWidth : '600px',
        margin: '0 auto',
        backgroundColor: '#ffffff'
    }
}));

export default function ContainerContent(props) {
    const classes = useStyles(props);
    const { children, className } = props;

    return (
        <Box className={` ${className} ${classes.root}`}>
            {children}
        </Box>
    );
}
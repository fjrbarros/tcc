import React from 'react';
import { makeStyles, Box } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    contentGrid: {
        display: 'grid',
        // gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gridTemplateColumns: 'repeat(auto-fit, 300px)',
        gridGap: '15px'
    }
}));

export default function ContainerGrid(props) {
    const classes = useStyles(props);
    const { children, className } = props;


    return (
        <Box className={`${classes.contentGrid} ${className}`}>
            {children}
        </Box>
    );
}
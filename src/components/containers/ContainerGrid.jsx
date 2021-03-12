import React from 'react';
import { makeStyles, Box } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    contentGrid: {
        display: 'grid',
        gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr)',
        gridGap: '15px',
        '@media(max-width:900px)': {
            gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr)',
        },
        '@media(max-width:650px)': {
            gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)',
        },
        '@media(max-width:435px)': {
            gridTemplateColumns: 'minmax(200px, 1fr)',
        }
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
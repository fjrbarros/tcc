import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer as MenuDrawer } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
    drawer: {
        width: theme.drawer.width,
        flexShrink: 0,
        display: 'none',
        position: 'absolute'
    },
    drawerPaper: {
        width: theme.drawer.width,
        zIndex: '999',
        '@media (max-width: 600px)': {
            width: '100%'
        }
    },

    shiftDrawerOpen: {
        display: 'block'
    }
}));

export default function Drawer(props) {
    const classes = useStyles(props);
    const { open, anchor, className, children } = props;

    return (
        <MenuDrawer
            className={clsx(classes.drawer, {
                [classes.shiftDrawerOpen]: open
            })}
            variant='persistent'
            anchor={anchor}
            open={open}
            classes={{
                paper: `${classes.drawerPaper} ${className}`,
            }}
        >
            {children}
        </MenuDrawer>
    );
}
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { fecharChat } from '../../../redux/chat/Actions';
import { Drawer } from '../../Index';
import { Box } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
    drawer: {
        marginTop: theme.appHeader.toolbar.height
    },

    containerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
}));

export default function Chat() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const open = useSelector(state => state.chatOpen.Open);

    return (
        <Drawer
            open={open}
            anchor={'right'}
            className={classes.drawer}
        >
            <Box>
                <Box className={classes.containerHeader}>
                    <Tooltip title='Fechar' placement='left'>
                        <IconButton onClick={() => dispatch(fecharChat())}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Drawer>
    );
}
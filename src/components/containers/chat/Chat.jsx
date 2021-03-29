import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { fecharChat } from '../../../redux/chat/Actions';
import { Drawer } from '../../Index';
import { Box } from '@material-ui/core';
import ChatHeader from './ChatHeader';
import ChatList from './ChatList';

const useStyles = makeStyles(theme => ({
    drawer: {
        marginTop: theme.appHeader.toolbar.height + 5
    },

    teste: {
        height: `calc(100vh - 118px)`,
        overflowY: 'auto',
    }
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
                <ChatHeader fecharChat={() => dispatch(fecharChat())} />
                <Box className={classes.teste}>
                    <ChatList />
                </Box>
            </Box>
        </Drawer>
    );
}
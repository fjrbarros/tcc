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

    containerChatList: {
        height: `calc(100vh - 118px)`,
        overflowY: 'auto',
    }
}));

export default function Chat() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const open = useSelector(state => state.chatOpen.Open);

    function handleClickConversa() {
        
    }

    return (
        <Drawer
            open={open}
            anchor={'right'}
            className={classes.drawer}
        >
            <Box>
                <ChatHeader fecharChat={() => dispatch(fecharChat())} />
                <Box className={classes.containerChatList}>
                    <ChatList onClickConversa={handleClickConversa}/>
                </Box>
            </Box>
        </Drawer>
    );
}
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Tooltip, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
    containerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
}));

export default function ChatHeader(props) {
    const classes = useStyles();
    const { fecharChat } = props;

    return (
        <Box className={classes.containerHeader}>
            <Tooltip title='Fechar' placement='left'>
                <IconButton onClick={fecharChat}>
                    <CloseIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
}
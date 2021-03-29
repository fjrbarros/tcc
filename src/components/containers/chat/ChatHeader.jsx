import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Tooltip, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
    containerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '5px',
        justifyContent: 'flex-end',
        '& button': {
            padding: '8px'
        }
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
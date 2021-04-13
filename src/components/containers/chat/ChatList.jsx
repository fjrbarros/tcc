import React from 'react';
import { Box, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Typography, withStyles } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(theme => ({
    listItem: {
        transition: 'all 0.2s',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgb(0,0,0,0.1)'
        }
    },

    textUser: {
        display: 'block',
        whiteSpace: 'nowrap',
        textOverflow: 'Ellipsis',
        overflow: 'hidden'
    }
}));

const StyledBadge = withStyles((theme) => ({
    badge: {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: '$ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}))(Badge);

export default function ChatList(props) {
    const classes = useStyles();
    const { onClickConversa } = props;
    return (
        <List className={classes.root}>
            <ListItem className={classes.listItem} onClick={onClickConversa}>
                <ListItemAvatar>
                    <StyledBadge
                        overlap='circle'
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant='dot'
                    >
                        <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
                    </StyledBadge>
                </ListItemAvatar>
                <Box width='216px'>
                    <Typography className={classes.textUser}>
                        Usuário asfdasfddddddddddddddddddddddddddddddddddddddddddd
                    </Typography>
                    <Typography className={classes.textUser}>
                        Usuário dddddddddddddddddddddddddddddddddddddddddddddd
                    </Typography>
                </Box>
            </ListItem>
        </List>
    );
}
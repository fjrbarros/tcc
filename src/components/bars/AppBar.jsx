import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { fecharDrawer, abrirDrawer } from '../../redux/drawer/Actions';
import { abrirChat, fecharChat } from '../../redux/chat/Actions';
import { AppBar as TopBar, Box } from '@material-ui/core';
import clsx from 'clsx';
import { removeCookie } from '../../util/RegistraUsuario';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Tooltip from '@material-ui/core/Tooltip';
import HomeIcon from '@material-ui/icons/Home';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import EditIcon from '@material-ui/icons/Edit';
import QueueIcon from '@material-ui/icons/Queue';
import PostAddIcon from '@material-ui/icons/PostAdd';
import ChatIcon from '@material-ui/icons/Chat';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Swal from 'sweetalert2';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles(theme => ({
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        })
    },

    toolbar: {
        background: theme.appHeader.toolbar.background,
        height: theme.appHeader.toolbar.height,
        display: 'flex'
    },

    menuButton: {
        marginRight: theme.spacing(2),
    },

    menuButtonRotate: {
        transform: 'rotate(180deg)'
    },

    toolbarLeft: {
        flex: '0.5'
    },

    toolbarCenter: {
        flex: '1',
        textAlign: 'center'
    },

    toolbarRight: {
        flex: '0.5'
    },

    toolbarRightContent: {
        display: 'flex',
        justifyContent: 'flex-end',
        '& button': {
            padding: '8px',
            fontSize: '1rem'
        },
        '& svg': {
            fill: '#ffffff'
        },
        '@media (max-width: 750px)': {
            display: 'none'
        }
    },

    toolbarRightMenu: {
        display: 'none',
        justifyContent: 'flex-end',
        '& svg': {
            fill: '#ffffff'
        },
        '@media (max-width: 750px)': {
            display: 'flex'
        }
    },

    popper: {
        marginTop: '7px',
        '& div': {
            backgroundColor: 'transparent'
        },
        '& div ul': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgb(0,0,0,0.5)'
        },

        '& div ul li': {
            transition: 'all 0.3s'
        },

        '& div ul li:hover': {
            backgroundColor: 'rgb(0,0,0,0.8)'
        }
    }
}));

export default function AppBar(props) {
    const classes = useStyles();
    const { usaDrawer, title, usaMenus } = props;
    const dispatch = useDispatch();
    const openDrawer = useSelector(state => state.drawerOpen.Open);
    const openChat = useSelector(state => state.chatOpen.Open);
    const [openMenu, setOpenMenu] = useState(false);
    const anchorRef = useRef(null);
    const prevOpen = useRef(openMenu);
    const history = useHistory();

    useEffect(() => {
        if (prevOpen.current === true && openMenu === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = openMenu;
    }, [openMenu]);

    function handleToggle() {
        setOpenMenu((prevOpen) => !prevOpen);
    }

    function handleClose(event, type) {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpenMenu(false);

        if (type === 'CHAT') {
            dispatch(openChat ? fecharChat() : abrirChat());
        }

        if (type === 'LOGOUT') {
            sairDoSistema();
        }
    }

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpenMenu(false);
        }
    }

    function sairDoSistema() {
        Swal.fire({
            title: 'Logout',
            text: 'Você realmente deseja sair do sistema?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não'
        }).then((result) => {
            if (result.isConfirmed) {
                history.push('/');
                removeCookie();
            }
        })
    }

    return (
        <TopBar
            position='fixed'
            className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
                <Box className={classes.toolbarLeft}>
                    {
                        usaDrawer &&
                        <Tooltip title={`${openDrawer ? 'Fechar drawer' : 'Abrir drawer'}`} placement='right'>
                            <IconButton
                                color='inherit'
                                onClick={() => dispatch(openDrawer ? fecharDrawer() : abrirDrawer())}
                                edge='start'
                                className={clsx(classes.menuButton, { [classes.menuButtonRotate]: openDrawer })}
                            >
                                <ChevronRightIcon />
                            </IconButton>
                        </Tooltip>
                    }
                </Box>
                <Box className={classes.toolbarCenter}>
                    <Typography variant='h6' noWrap>
                        {title}
                    </Typography>
                </Box>
                <Box className={classes.toolbarRight}>
                    {
                        usaMenus &&
                        <Box className={classes.toolbarRightContent}>
                            <Tooltip title='Página inicial' placement='bottom'>
                                <IconButton>
                                    <Link to='/dashboard'>
                                        <HomeIcon />
                                    </Link>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Cadastrar template' placement='bottom'>
                                <IconButton>
                                    <Link to='/cadastro-template'>
                                        <PostAddIcon />
                                    </Link>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Cadastrar projeto' placement='bottom'>
                                <IconButton>
                                    <Link to='/projeto-cadastro'>
                                        <QueueIcon />
                                    </Link>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Meus dados' placement='bottom'>
                                <IconButton>
                                    <Link to='/editar-cadastro'>
                                        <EditIcon />
                                    </Link>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Chat' placement='bottom'>
                                <IconButton onClick={() => dispatch(openChat ? fecharChat() : abrirChat())}>
                                    <ChatIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Sair do sistema' placement='bottom'>
                                <IconButton onClick={sairDoSistema}>
                                    <PowerSettingsNewIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    }
                    {
                        usaMenus &&
                        <Box className={classes.toolbarRightMenu}>
                            <IconButton
                                ref={anchorRef}
                                aria-controls={openMenu ? 'menu-list-grow' : undefined}
                                aria-haspopup='true'
                                onClick={handleToggle}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Popper
                                className={classes.popper}
                                open={openMenu}
                                anchorEl={anchorRef.current}
                                role={undefined}
                                transition
                                disablePortal
                            >
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={handleClose}>
                                                <MenuList autoFocusItem={openMenu} id='menu-list-grow' onKeyDown={handleListKeyDown}>
                                                    <Tooltip title='Página inicial' placement='left'>
                                                        <MenuItem onClick={handleClose}>
                                                            <Link to='/dashboard'>
                                                                <HomeIcon />
                                                            </Link>
                                                        </MenuItem>
                                                    </Tooltip>
                                                    <Tooltip title='Cadastrar template' placement='left'>
                                                        <MenuItem onClick={handleClose}>
                                                            <Link to='/cadastro-template'>
                                                                <PostAddIcon />
                                                            </Link>
                                                        </MenuItem>
                                                    </Tooltip>
                                                    <Tooltip title='Cadastrar projeto' placement='left'>
                                                        <MenuItem onClick={handleClose}>
                                                            <Link to='/projeto-cadastro'>
                                                                <QueueIcon />
                                                            </Link>
                                                        </MenuItem>
                                                    </Tooltip>
                                                    <Tooltip title='Meus dados' placement='left'>
                                                        <MenuItem onClick={handleClose}>
                                                            <Link to='/editar-cadastro'>
                                                                <EditIcon />
                                                            </Link>
                                                        </MenuItem>
                                                    </Tooltip>
                                                    <Tooltip title='Chat' placement='left'>
                                                        <MenuItem onClick={event => handleClose(event, 'CHAT')}>
                                                            <ChatIcon />
                                                        </MenuItem>
                                                    </Tooltip>
                                                    <Tooltip title='Sair do sistema' placement='left'>
                                                        <MenuItem onClick={event => handleClose(event, 'LOGOUT')}>
                                                            <PowerSettingsNewIcon />
                                                        </MenuItem>
                                                    </Tooltip>
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </Box>
                    }
                </Box>
            </Toolbar>
        </TopBar >
    );
}
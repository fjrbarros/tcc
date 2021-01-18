import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { fecharDrawer, abrirDrawer } from '../../redux/drawer/Actions';
import { Drawer } from '../Index';
import { useHistory } from 'react-router-dom';
import { Box, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';

const useStyles = makeStyles(theme => ({
    drawer: {
        marginTop: theme.appHeader.toolbar.height + 4,
        color: '#545454',
        backgroundColor: theme.containerDefault.backgroundColor
    },

    containerHeader: {
        padding: '10px',
        textAlign: 'center',
        borderBottom: '1px solid #cfcfcf',
        '& p': {
            fontSize: '17px',
        }
    },

    containerContent: {
        padding: '10px'
    },

    listItem: {
        backgroundColor: '#fff',
        borderRadius: '5px',
        marginBottom: '10px',
        cursor: 'pointer',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.12)',
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover': {
            boxShadow: '0px 5px 15px 0px rgba(0, 0, 0, 0.2)'
        }
    }
}));

export default function NavigateProjetos() {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const open = useSelector(state => state.drawerOpen.Open);
    const dadosProjetos = useSelector(state => state.usuario.dadosProjeto);

    function abrirProjeto(projeto) {
        dispatch(open ? fecharDrawer() : abrirDrawer())
        history.push({
            pathname: '/projeto-atividade',
            state: { projeto }
        });
    }

    return (
        <Drawer
            open={open}
            anchor={'left'}
            className={classes.drawer}
        >
            <Box className={classes.container}>
                <Box className={classes.containerHeader}>
                    <Typography>Projetos</Typography>
                </Box>
                <Box className={classes.containerContent}>
                    <List className={classes.list}>
                        {
                            dadosProjetos.map(projeto => {
                                return (
                                    <ListItem
                                        key={projeto.id}
                                        className={classes.listItem}
                                        onClick={() => abrirProjeto(projeto)}
                                    >
                                        <ListItemIcon><BookmarkBorderIcon /></ListItemIcon>
                                        <ListItemText>{projeto.descricao}</ListItemText>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </Box>
            </Box>

        </Drawer>
    );
}
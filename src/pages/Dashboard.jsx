import React from 'react';
import { ContainerRoot, ContainerContent, ContainerGrid, CardProjeto } from '../components/Index';
import { DefaultPage } from './Index';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
    containerGrid: {
        padding: '15px 10px 10px'
    },

    containerContent: {
        maxWidth: '100%'
    }
}));

export default function Dashboard() {
    const classes = useStyles();
    const dadosProjetos = useSelector(state => state.usuario.dadosProjeto);

    return (
        <DefaultPage usaDrawer usaMenus title='Página inicial'>
            <ContainerRoot>
                <ContainerContent className={classes.containerContent}>
                    <ContainerGrid className={classes.containerGrid}>
                        {
                            dadosProjetos.map(projeto => {
                                return <CardProjeto
                                    key={projeto.id}
                                    projeto={projeto}
                                    count={dadosProjetos.length}
                                />
                            })
                        }
                    </ContainerGrid>
                </ContainerContent>
            </ContainerRoot>
        </DefaultPage>
    );
}
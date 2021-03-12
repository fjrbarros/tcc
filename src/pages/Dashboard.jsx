import React, { useEffect } from 'react';
import { ContainerRoot, ContainerContent, ContainerGrid, CardProjeto } from '../components/Index';
import { DefaultPage } from './Index';
import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { atualizaDadosProjeto } from '../redux/user/Actions';
import Swal from 'sweetalert2';
import Api from '../api/Index';

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
    const dispatch = useDispatch();
    const idUsuario = useSelector(state => state.usuario.dadosUsuario.id);
    const dadosProjetos = useSelector(state => state.usuario.dadosProjeto);

    useEffect(() => {
        Api.get('/projeto', {
            params: { usuario: idUsuario }
        }).then(resp => {
            dispatch(Object.assign(atualizaDadosProjeto(), { data: resp.data }));
        }).catch(error => {
            Swal.fire({
                title: 'Erro!',
                text: `${error.response ? error.response.data.message : error.message}`,
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok'
            });
        });
    }, [idUsuario, dispatch])

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
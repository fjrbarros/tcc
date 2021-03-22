import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { atualizaDadosProjeto } from '../../../redux/user/Actions';
import { Modal, Form, SelectField } from '../../Index';
import Api from '../../../api/Index';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import StopIcon from '@material-ui/icons/Stop';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import LinearProgress from '@material-ui/core/LinearProgress';
import Swal from 'sweetalert2';

const useStyles = makeStyles(theme => ({
    card: {
        // maxWidth: '300px',
        borderRadius: '5px',
        backgroundColor: '#fff',
        boxShadow: '2px 2px 2px 0 rgba(0, 0, 0, 0.12)',
        transition: 'box-shadow 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        color: '#545454',
        '&:hover': {
            boxShadow: '0px 5px 15px 0px rgba(0, 0, 0, 0.2)'
        }
    },

    cardHeader: {
        flex: 0.3,
        padding: '10px',
        display: 'flex',
        '& p': {
            marginLeft: '5px',
            fontSize: '17px',
            whiteSpace: 'nowrap',
            textOverflow: 'Ellipsis',
            overflow: 'hidden'
        }
    },

    cardContent: {
        flex: 1,
        padding: '5px 10px',
        borderBottom: '1px solid #cfcfcf',
        borderTop: '1px solid #cfcfcf',
        '& p': {
            whiteSpace: 'nowrap',
            textOverflow: 'Ellipsis',
            overflow: 'hidden',
            margin: '5px 0px',
            '& span': {
                fontStyle: 'italic'
            }
        }
    },

    progressBar: {
        display: 'flex',
        alignItems: 'center',
        margin: '5px 0px'
    },

    cardBottom: {
        flex: 0.3,
        padding: '5px 10px',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& button': {
            padding: '10px'
        }
    },

    cardList: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        top: 0,
        transition: 'all 0.2s',
        left: props => props.showCardList ? 0 : '-100%'
    },

    list: {
        padding: 0,
        '& li': {
            padding: '10px 16px',
            cursor: 'pointer',
            transition: 'all 0.3s'
        },

        '& li:hover': {
            backgroundColor: 'rgb(0,0,0,0.1)'
        }
    },
}));

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5,
        marginLeft: '5px',
        flex: 1
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
        flex: 1
    },
}))(LinearProgress);

export default function CardProjeto(props) {
    const { projeto } = props;
    const idUsuario = useSelector(state => state.usuario.dadosUsuario.id);
    const enums = useSelector(state => state.enums);
    const statusProjeto = enums.enumStatusProjeto.filter(item => item.valor === projeto.status)[0].descricao;
    const tipoProjeto = enums.enumTipoProjeto.filter(item => item.valor === projeto.tipoProjeto)[0].descricao;
    const [showCardList, setShowCardList] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [motivoEncProjeto, setMotivoEncProjeto] = useState('');
    const [errorMotivoEncProjeto, setErrorMotivoEncProjeto] = useState('');
    const classes = useStyles({ ...props, showCardList });
    const dadosProjetos = useSelector(state => state.usuario.dadosProjeto);
    const dispatch = useDispatch();
    const history = useHistory();

    function abrirProjeto() {
        history.push({
            pathname: '/projeto-atividade',
            state: { projeto }
        });
    }

    function editarProjeto() {
        history.push({
            pathname: '/projeto-cadastro',
            state: { projeto }
        });
    }

    function questionamento(title, msg, callback) {
        Swal.fire({
            title: title,
            text: msg,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não'
        }).then((result) => {
            if (result.isConfirmed) callback();
        })
    }

    function showToast(msg) {
        Swal.fire({
            toast: true,
            icon: 'success',
            title: msg,
            showClass: false,
            position: 'top',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: { container: 'toast-container' },
            didOpen: toast => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });
    }

    function showMsgError(msg) {
        Swal.fire({
            title: 'Erro!',
            text: msg,
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok'
        });
    }

    function excluirProjeto() {
        questionamento('Excluir projeto!', `Você realmente deseja excluir o projeto ${projeto.descricao}?`, () => {
            Api.delete(`/projeto/${projeto.id}`)
                .then(resp => {
                    atualizaProjetos();
                    showToast('Projeto removido com sucesso!');
                }).catch(error => showMsgError(`${error.response ? error.response.data.message : error.message}`));
        });
    }

    function atualizaProjetos() {
        const arrayFiltro = dadosProjetos.filter(item => item.id !== projeto.id);
        dispatch(Object.assign(atualizaDadosProjeto(), { data: arrayFiltro }));
    }

    function handleChange(event) {
        setMotivoEncProjeto(event.target.value);
    }

    function encerrarProjeto() {
        if (!motivoEncProjeto) {
            setErrorMotivoEncProjeto('Obrigatório informar o motivo.');
            return;
        }
        setErrorMotivoEncProjeto('');

        Api.post(`/projeto/${projeto.id}/encerramento`, {
            motivo: motivoEncProjeto,
            idUsuario
        })
            .then(() => {
                showToast('Projeto encerrado com sucesso!');
                closeModal();
            })
            .catch(error => showMsgError(`${error.response ? error.response.data.message : error.message}`));
    }

    function closeModal() {
        setOpenModal(false);
        setMotivoEncProjeto('');
    }

    return <>
        <Box className={classes.card}>
            <Box className={classes.cardHeader}>
                <BookmarkBorderIcon />
                <Typography>{projeto.descricao}</Typography>
            </Box>
            <Box className={classes.cardContent}>
                <Typography>Tipo projeto: <span>{tipoProjeto}</span></Typography>
                <Typography>Status: <span>{statusProjeto}</span></Typography>
                <Box className={classes.progressBar}>
                    Conclusão
                    <BorderLinearProgress variant='determinate' value={projeto.percentualConclusao} />
                    <span style={{ marginLeft: '5px' }}>{projeto.percentualConclusao}%</span>
                </Box>
            </Box>
            <Box className={classes.cardBottom}>
                {
                    projeto.userAdmin &&
                    <Tooltip title='Mais opções' placement='right'>
                        <IconButton
                            style={{ float: 'left' }}
                            onClick={() => setShowCardList(true)}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    </Tooltip>
                }
                <Tooltip title='Abrir projeto' placement='left'>
                    <IconButton style={{ float: 'right' }} onClick={abrirProjeto}>
                        <ChevronRightIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box className={classes.cardList}>
                <List className={classes.list}>
                    <ListItem onClick={editarProjeto}>
                        <ListItemIcon><EditIcon /></ListItemIcon>
                        <ListItemText>Editar projeto</ListItemText>
                    </ListItem>
                    <ListItem onClick={excluirProjeto}>
                        <ListItemIcon><DeleteForeverIcon /></ListItemIcon>
                        <ListItemText>Excluir projeto</ListItemText>
                    </ListItem>
                    <ListItem onClick={() => setOpenModal(true)}>
                        <ListItemIcon><StopIcon /></ListItemIcon>
                        <ListItemText>Encerrar projeto</ListItemText>
                    </ListItem>
                    <ListItem onClick={() => setShowCardList(false)}>
                        <ListItemIcon><ChevronLeftIcon /></ListItemIcon>
                        <ListItemText>Voltar</ListItemText>
                    </ListItem>
                </List>
            </Box>
        </Box>
        <Modal
            open={openModal}
            title='Encerrar projeto'
            onClose={closeModal}
            onSubmit={encerrarProjeto}
        >
            <Form onSubmit={encerrarProjeto}>
                <SelectField
                    label='Motivo encerramento'
                    value={motivoEncProjeto}
                    onChange={handleChange}
                    data={enums.enumMotivoEncerramentoProjeto}
                    error={errorMotivoEncProjeto}
                />
            </Form>
        </Modal>
    </>;
}
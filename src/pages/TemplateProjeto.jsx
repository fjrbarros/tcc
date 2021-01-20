import React, { useEffect, useState } from 'react';
import { ContainerRoot, ContainerContent, ContainerCollapse, Form, TextField, SaveButton } from '../components/Index';
import { DefaultPage } from './Index';
import { makeStyles, Typography, Box, Tooltip } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { SelectField } from '../components/Index';
import Swal from 'sweetalert2';
import Api from '../api/Index';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
    containerContent: {
        padding: '20px 10px 10px',
        height: 'calc(100vh - 60px)'
    },

    selectField: {
        width: '100%'
    },

    containerCollapse: {
        border: '1px solid rgba(0, 0, 0, 0.30)',
        borderRadius: '10px',
        padding: '5px',
        marginBottom: '8px'
    },

    containerAtividade: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#808080',
        marginBottom: '5px',
        '& p': {
            fontSize: '17px',
            fontWeight: 'bolder',
            fontStyle: 'italic'
        }
    },

    containerInput: {
        marginTop: 0
    },

    containerTarefa: {
        display: 'flex',
        justifyContent: 'flex-end',
        '& button': {
            padding: '5px'
        }
    }
}));

export default function TemplateProjeto() {
    const classes = useStyles();
    const idUsuario = useSelector(state => state.usuario.dadosUsuario.id);
    const enums = useSelector(state => state.enums);
    const enumTipoProjeto = enums.enumTipoProjeto;
    const [atividades, setAtividades] = useState([]);
    const [values, setValues] = useState({
        idUsuario,
        tipoProjeto: '',
        descricao: ''
    });

    useEffect(() => {
        if (!values.tipoProjeto) return;
        Api.get(`/templateProjeto/sugestao/${values.tipoProjeto}`)
            .then(resp => {
                const data = resp.data;
                data.atividades.forEach(item => {
                    if (!item.tarefas) item.tarefas = [];
                });
                setValues({
                    idUsuario: idUsuario,
                    tipoProjeto: data.tipoProjeto,
                    descricao: data.descricao
                });
                setAtividades(data.atividades);
            }).catch(error => {
                Swal.fire({
                    title: 'Erro!',
                    text: `${error.response ? error.response.data.message : error.message}`,
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                });
            });
    }, [values.tipoProjeto, idUsuario]);

    function handleChange(event) {
        setValues({ ...values, [event.target.name]: event.target.value });
    }

    function handleAddNovaAtividade() {
        const newArrayAtividade = [...atividades];
        newArrayAtividade.push({ descricaoAtividade: '', tarefas: [] });
        setAtividades(newArrayAtividade);
    }

    function handleChangeAtividade(event, index) {
        const newArrayAtividade = [...atividades];
        newArrayAtividade[index].descricaoAtividade = event.target.value;
        setAtividades(newArrayAtividade);
    }

    function handleAddNovaTarefa(event, index) {
        const newArrayAtividade = [...atividades];
        newArrayAtividade[index].tarefas.push({ descricao: '' });
        setAtividades(newArrayAtividade);
    }

    function handleChangeTarefa(event, indexAtividade, indexTarefa) {
        const newArrayAtividade = [...atividades];
        newArrayAtividade[indexAtividade].tarefas[indexTarefa].descricao = event.target.value;
        setAtividades(newArrayAtividade);
    }

    function salvarTemplate() {
        Api.post('/templateProjeto', {
            tipoProjeto: values.tipoProjeto,
            idUsuario: values.idUsuario,
            descricao: values.descricao,
            atividades
        })
            .then(() => {
                showToast('Template salvo com sucesso!');
            })
            .catch(error => {
                showMsgError(`${error.response ? error.response.data.message : error.message}`);
            });
    }

    function showToast(msg) {
        Swal.fire({
            toast: true,
            icon: 'success',
            title: msg,
            showClass: false,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
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

    return (
        <DefaultPage usaDrawer usaMenus title='Template de projeto'>
            <ContainerRoot>
                <ContainerContent className={classes.containerContent}>
                    <Form>
                        <TextField
                            label='Código usuário'
                            value={values.idUsuario}
                            style={{ width: '96px' }}
                            disabled
                        />
                        <SelectField
                            className={classes.selectField}
                            name='tipoProjeto'
                            data={enumTipoProjeto}
                            label='Tipo projeto'
                            value={values.tipoProjeto}
                            onChange={handleChange}
                        />
                        <TextField
                            name='descricao'
                            label='Descrição'
                            value={values.descricao}
                            onChange={handleChange}
                        />
                    </Form>
                    <Box className={classes.containerAtividade}>
                        <Typography>Atividades</Typography>
                        <Tooltip title='Nova atividade' placement='left'>
                            <IconButton onClick={handleAddNovaAtividade}>
                                <AddCircleIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    {
                        atividades.map((item, indexAtividade) => {
                            return (
                                <ContainerCollapse
                                    key={indexAtividade}
                                    title='Atividade'
                                    titleAlign='right'
                                    expanded
                                    className={classes.containerCollapse}
                                >
                                    <TextField
                                        name='descricaoAtividade'
                                        label='Descrição atividade'
                                        value={item.descricaoAtividade}
                                        className={classes.containerInput}
                                        autoFocus
                                        onChange={event => handleChangeAtividade(event, indexAtividade)}
                                    />
                                    <Box className={classes.containerTarefa}>
                                        <Tooltip title='Nova Tarefa' placement='left'>
                                            <IconButton onClick={event => handleAddNovaTarefa(event, indexAtividade)}>
                                                <AddIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    {
                                        item.tarefas?.map((item, indexTarefa) => {
                                            return (
                                                <TextField
                                                    key={indexTarefa}
                                                    name='descricaoTarefa'
                                                    label='Descrição tarefa'
                                                    value={item.descricao}
                                                    className={classes.containerInput}
                                                    autoFocus
                                                    onChange={event => handleChangeTarefa(event, indexAtividade, indexTarefa)}
                                                />
                                            );
                                        })
                                    }
                                </ContainerCollapse>
                            );
                        })
                    }
                    {
                        atividades.length > 0 &&
                        <SaveButton
                            style={{ marginLeft: '50%', transform: 'translate(-50%)' }}
                            text='Salvar'
                            width='50%'
                            onClick={salvarTemplate}
                        />
                    }
                </ContainerContent>
            </ContainerRoot>
        </DefaultPage >
    );
}
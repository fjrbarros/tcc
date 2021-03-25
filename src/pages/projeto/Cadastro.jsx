import React, { useEffect, useState } from 'react';
import {
    ContainerRoot,
    ContainerContent,
    Form,
    TextField,
    SelectField,
    DateField,
    EmailField,
    SaveButton
} from '../../components/Index';
import { DefaultPage } from '../Index';
import { useSelector } from 'react-redux';
import { Box, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { validaForm } from '../../util/ValidaForm';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Api from '../../api/Index';
import Swal from 'sweetalert2';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
    form: {
        padding: '10px'
    },

    input: {
        marginTop: '15px',
        marginBottom: 0
    },

    inputIntegrantes: {
        width: '44%',
        margin: 0,
        '& div': {
            width: '100%'
        }
    },

    listEnvolvidos: {
        margin: 0,
        padding: 0,
        marginTop: '-10px',
        '& li': {
            padding: 0
        }
    },

    labelIntegrantes: {
        fontSize: '1.2rem',
        fontStyle: 'italic',
        color: '#545454'
    },

    buttonIntegrantes: {
        marginBottom: '-24px',
        padding: '10px',
        '& svg': {
            fontSize: '1.2rem'
        }
    },

    saveButton: {
        margin: '15px 0',
        marginLeft: '50%',
        transform: 'translate(-50%)'
    }
}));

function defaultValues(idUsuario) {
    return {
        idUsuario,
        id: null,
        descricao: '',
        idTemplateProjeto: '',
        dataIni: new Date(),
        dataFim: new Date(),
        tipoProjeto: '',
        membros: []
    }
}

export default function CadastroProjeto(props) {
    const classes = useStyles();
    const enums = useSelector(state => state.enums);
    const enumPerfilMembroProjeto = enums.enumPerfilMembroProjeto;
    const enumTipoProjeto = enums.enumTipoProjeto;
    const idUsuario = useSelector(state => state.usuario.dadosUsuario.id);
    const emailUsuario = useSelector(state => state.usuario.dadosUsuario.email);
    const projeto = props.location.state ? props.location.state.projeto : null;
    const [values, setValues] = useState(defaultValues(idUsuario));
    const [errors, setErrors] = useState(defaultValues());
    const [disabledButton, setDisabledButton] = useState(false);
    const [templateProjeto, setTemplateProjeto] = useState([]);

    useEffect(() => {
        if (!idUsuario || !values.tipoProjeto) return;

        Api.get(`/templateProjeto/${idUsuario}/${values.tipoProjeto}`)
            .then(resp => {
                const data = [];
                resp.data.forEach(item => data.push({ valor: item.id, descricao: item.descricao }));
                setTemplateProjeto(data);
            })
            .catch(error => showMsgError(`${error.response ? error.response.data.message : error.message}`));
    }, [values.tipoProjeto, idUsuario]);

    useEffect(() => {
        if (!projeto) return;

        Api.get(`/projeto/${projeto.id}`)
            .then(resp => {
                const data = resp.data;
                const dataInicioSplit = data.dataInicio.split('/');
                const dataPrevistaTerminoSplit = data.dataPrevistaTermino.split('/');
                data.dataInicio = new Date(`${dataInicioSplit[1]}/${dataInicioSplit[0]}/${dataInicioSplit[2]}`);
                data.dataPrevistaTermino = new Date(`${dataPrevistaTerminoSplit[1]}/${dataPrevistaTerminoSplit[0]}/${dataPrevistaTerminoSplit[2]}`);
                setValues({
                    idUsuario,
                    id: data.id,
                    descricao: data.descricao,
                    idTemplateProjeto: data.idTemplateProjeto,
                    dataIni: data.dataInicio,
                    dataFim: data.dataPrevistaTermino,
                    tipoProjeto: data.tipoProjeto,
                    membros: data.membros
                });
            })
    }, [projeto, idUsuario]);


    function handleChange(event) {
        setValues({ ...values, [event.target.name]: event.target.value });
    }

    function adicionaEnvolvidoProjeto() {
        const newArraymembros = [...values.membros];

        newArraymembros.push({ emailMembro: '', perfilMembro: '' });

        setValues({ ...values, membros: newArraymembros });
    }

    function handleChangeMembro(event, index) {
        const newArraymembros = [...values.membros];

        newArraymembros[index][event.target.name] = event.target.value;

        setValues({ ...values, membros: newArraymembros });
    }

    function removeMembro(membro, index) {
        if (membro.emailMembro === emailUsuario) {
            showMsgError('Não pode se desvincular do projeto!');
            return;
        }

        if (membro.id) {
            removeMembroApi(membro);
            return;
        }

        removeMembroProjeto(membro);
    }

    function removeMembroApi(membro) {
        Api.delete(`/projeto/${values.id}/membro/${membro.id}`)
            .then(() => {
                removeMembroProjeto(membro);
                showToast('Membro removido com sucesso!');
            }).catch(error => {
                showMsgError(`${error.response ? error.response.data.message : error.message}`);
            });
    }

    function removeMembroProjeto(membro) {
        let newArraymembros = [...values.membros];

        newArraymembros = newArraymembros.filter(item => item !== membro);

        setValues({ ...values, membros: newArraymembros });
    }

    function handleSubmit() {
        setDisabledButton(true);
        const errors = {};
        const data = { descricao: values.descricao, tipoProjeto: values.tipoProjeto };
        validaForm(data, (campo, msg) => errors[campo] = msg);
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
            cadastraProjeto();
        } else {
            setDisabledButton(false);
        }
    }

    function cadastraProjeto() {
        values.dataInicio = moment(values.dataIni).format('DD/MM/YYYY');
        values.dataPrevistaTermino = moment(values.dataFim).format('DD/MM/YYYY');

        delete values.dataIni;
        delete values.dataFim;

        if (values.id) {
            Api.put(`/projeto/${values.id}`, values)
                .then(() => success())
                .catch(error => failure(error));
        } else {
            Api.post('/projeto', values)
                .then(() => success())
                .catch(error => failure(error));
        }

        function success() {
            showToast('Dados salvos com sucesso!');
            setValues(defaultValues(idUsuario));
            setDisabledButton(false);
        }

        function failure(error) {
            setDisabledButton(false);
            showMsgError(`${error.response ? error.response.data.message : error.message}`);
        }
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
            confirmButtonText: 'Ok',
            customClass: { container: 'msg-container' }
        });
    }

    return (
        <DefaultPage usaDrawer usaMenus title='Cadastro de projeto'>
            <ContainerRoot>
                <ContainerContent>
                    <Form onSubmit={handleSubmit} className={classes.form}>
                        <TextField
                            label='Código usuário'
                            value={values.idUsuario}
                            style={{ width: '96px' }}
                            disabled
                        />
                        <TextField
                            label='Descrição'
                            name='descricao'
                            className={classes.input}
                            value={values.descricao}
                            onChange={handleChange}
                            error={!!errors.descricao}
                            helperText={errors.descricao}
                        />
                        <SelectField
                            label='Tipo projeto'
                            name='tipoProjeto'
                            className={classes.input}
                            data={enumTipoProjeto}
                            value={values.tipoProjeto}
                            onChange={handleChange}
                            error={errors.tipoProjeto}
                        />
                        <SelectField
                            label='Modelo base'
                            name='idTemplateProjeto'
                            className={classes.input}
                            data={templateProjeto}
                            value={values.idTemplateProjeto}
                            onChange={handleChange}
                        />
                        <Box display='flex' justifyContent='space-between'>
                            <DateField
                                style={{ width: '45%' }}
                                label='Data início'
                                name='dataIni'
                                value={values.dataIni}
                                onChange={date => setValues({ ...values, dataIni: date })}
                            />
                            <DateField
                                style={{ width: '45%' }}
                                label='Data prevista término'
                                name='dataFim'
                                value={values.dataFim}
                                onChange={date => setValues({ ...values, dataFim: date })}
                            />
                        </Box>
                        <Box display='flex' justifyContent='flex-end' alignItems='center'>
                            <Typography className={classes.labelIntegrantes}>
                                Envolvidos no projeto
                            </Typography>
                            <IconButton onClick={adicionaEnvolvidoProjeto}>
                                <AddCircleIcon />
                            </IconButton>
                        </Box>
                        <List className={classes.listEnvolvidos}>
                            {
                                values.membros.map((item, index) => {
                                    return (
                                        <ListItem key={item.id || `key-${index}`}>
                                            <Box
                                                display='flex'
                                                justifyContent='space-between'
                                                alignItems='center'
                                                width='100%'
                                                padding='5px 0'
                                            >
                                                <EmailField
                                                    label='E-mail'
                                                    className={classes.inputIntegrantes}
                                                    name='emailMembro'
                                                    value={item.emailMembro}
                                                    onChange={e => handleChangeMembro(e, index)}
                                                />
                                                <SelectField
                                                    className={classes.inputIntegrantes}
                                                    data={enumPerfilMembroProjeto}
                                                    label='Perfil membro'
                                                    name='perfilMembro'
                                                    value={item.perfilMembro}
                                                    onChange={e => handleChangeMembro(e, index)}
                                                />
                                                <Tooltip title='Remover' placement='left'>
                                                    <IconButton
                                                        className={classes.buttonIntegrantes}
                                                        onClick={() => removeMembro(item, index)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </ListItem>
                                    )
                                })
                            }
                        </List>
                        <SaveButton
                            className={classes.saveButton}
                            text='Salvar'
                            type='submit'
                            width='50%'
                            disabled={disabledButton}
                        />
                    </Form>
                </ContainerContent>
            </ContainerRoot>
        </DefaultPage>
    );
}
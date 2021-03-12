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
        margin: '10px 0',
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
        dataInicio: new Date(),
        dataPrevistaTermino: new Date(),
        tipoProjeto: '',
        membros: []
    }
}

export default function CadastroProjeto(props) {
    const classes = useStyles();
    const enums = useSelector(state => state.enums);
    const enumPerfilMembroProjeto = enums.enumPerfilMembroProjeto;
    const idUsuario = useSelector(state => state.usuario.dadosUsuario.id);
    const projeto = props.location.state;
    const [values, setValues] = useState(defaultValues(idUsuario));
    const [errors, setErrors] = useState(defaultValues());
    const [disabledButton, setDisabledButton] = useState(false);
    const [tipoTemplate, setTipoTemplate] = useState([]);

    useEffect(() => {
        Api.get(`/templateProjeto/usuario/${idUsuario}`)
            .then(resp => {
                const data = [];
                resp.data.forEach(item => {
                    data.push({ valor: item.id, descricao: item.descricao, tipoProjeto: item.tipoProjeto });
                })
                setTipoTemplate(data);
            })
            .catch(error => showMsgError(`${error.response ? error.response.data.message : error.message}`));
    }, [idUsuario]);

    useEffect(() => {
        if (!projeto) return;

        setValues({
            idUsuario,
            id: projeto.id,
            descricao: projeto.descricao,
            idTemplateProjeto: projeto.idTemplateProjeto,
            dataInicio: projeto.dataInicio,
            dataPrevistaTermino: projeto.dataPrevistaTermino,
            tipoProjeto: projeto.tipoProjeto,
            membros: projeto.membros || []
        });
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
        if (membro.id) {
            removeMembroApi(membro);
            return;
        }

        removeMembroProjeto(membro);
    }

    function removeMembroApi(membro) {
        alert();
    }

    function removeMembroProjeto(membro) {
        let newArraymembros = [...values.membros];

        newArraymembros = newArraymembros.filter(item => item !== membro);

        setValues({ ...values, membros: newArraymembros });
    }

    function handleSubmit() {
        setDisabledButton(true);
        const errors = {};
        validaForm({
            descricao: values.descricao,
            idTemplateProjeto: values.idTemplateProjeto,
        }, (campo, msg) => errors[campo] = msg);
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
            cadastraProjeto();
        } else {
            setDisabledButton(false);
        }
    }

    function cadastraProjeto() {
        const tipoProjeto = tipoTemplate.filter(item => item.valor === values.idTemplateProjeto)[0].tipoProjeto;
        values.tipoProjeto = tipoProjeto;
        values.dataInicio = moment(values.dataInicio).format('DD/MM/YYYY');
        values.dataPrevistaTermino = moment(values.dataPrevistaTermino).format('DD/MM/YYYY');
        Api.post('/projeto', values)
            .then(() => {
                showToast('Dados salvos com sucesso!');
                setValues(defaultValues(idUsuario));
                setDisabledButton(false);
            })
            .catch(error => {
                setDisabledButton(false);
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
                            value={values.descricao}
                            onChange={handleChange}
                            error={!!errors.descricao}
                            helperText={errors.descricao}
                        />
                        <SelectField
                            name='idTemplateProjeto'
                            data={tipoTemplate}
                            label='Tipo projeto'
                            value={values.idTemplateProjeto}
                            onChange={handleChange}
                            error={errors.idTemplateProjeto}
                        />
                        <Box display='flex' justifyContent='space-between'>
                            <DateField
                                style={{ width: '45%' }}
                                label='Data início'
                                name='dataInicio'
                                value={values.dataInicio}
                                onChange={date => setValues({ ...values, dataInicio: date })}
                            />
                            <DateField
                                style={{ width: '45%' }}
                                label='Data prevista término'
                                name='dataPrevistaTermino'
                                value={values.dataPrevistaTermino}
                                onChange={date => setValues({ ...values, dataPrevistaTermino: date })}
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
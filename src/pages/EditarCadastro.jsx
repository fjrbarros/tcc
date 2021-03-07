import React, { useEffect, useState } from 'react';
import { DefaultPage } from './Index';
import { Box, makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { validaForm } from '../util/ValidaForm';
import { atualizaUsuario } from '../redux/user/Actions';
import Api from '../api/Index';
import Swal from 'sweetalert2';
import {
    ContainerRoot,
    ContainerContent,
    Form,
    TextField,
    EmailField,
    SaveButton,
    EditButton,
    FoneField,
    Modal,
    PasswordField
} from '../components/Index';

const useStyles = makeStyles(theme => ({
    containerContent: {
        height: 'calc(100vh - 60px)'
    },

    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },

    form: {
        padding: '10px',
        textAlign: 'center'
    },

    containerButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px'
    },

    phoneInput: {
        '& button': {
            backgroundColor: 'none',
            height: 0,
            boxShadow: 'none'
        },
        '& button:hover': {
            backgroundColor: 'none'
        }
    }
}));

function defaultData() {
    return {
        id: '',
        email: '',
        nome: '',
        foneContato: '',
        foneCelular: ''
    };
}

function defaultSenha() {
    return { senha: '', confirmacaoSenha: '' };
}

export default function EditarCadastro() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const dadosUsuario = useSelector(state => state.usuario.dadosUsuario);
    const [disabledButton, setDisabledButton] = useState(false);
    const [errors, setErrors] = useState({ email: '', nome: '' });
    const [values, setValues] = useState(defaultData);
    const [valueSenha, setValueSenha] = useState(defaultSenha);
    const [errorSenha, setErrorSenha] = useState(defaultSenha);
    const [openModal, setOpenModal] = useState(false);

    function handleChange(event) {
        setValues({ ...values, [event.target.name]: event.target.value });
    }

    function handleChangeSenha(event) {
        setValueSenha({ ...valueSenha, [event.target.name]: event.target.value });
    }

    useEffect(() => { setValues(dadosUsuario) }, [dadosUsuario]);

    function handleSubmit(event) {
        event.preventDefault();
        setDisabledButton(true);
        const errors = {};
        validaForm({ email: values.email, nome: values.nome }, (campo, msg) => errors[campo] = msg);
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
            atualizaCadastro();
        } else {
            setDisabledButton(false);
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
            timer: 3000,
            timerProgressBar: true,
            customClass: { container: 'toast-container' },
            didOpen: toast => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });
    }

    function atualizaCadastro() {
        Api.put(`/usuario/${dadosUsuario.id}`, values)
            .then(resp => {
                showToast('Dados salvos com sucesso!');
                setDisabledButton(false);
                dispatch(Object.assign(atualizaUsuario(), resp.data));
            })
            .catch(error => {
                setDisabledButton(false);
                showMsgError(`${error.response ? error.response.data.message : error.message}`);
            })
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

    function handleAlterarSenha(event) {
        event.preventDefault();
        const errors = {};
        validaForm({ senha: valueSenha.senha, confirmacaoSenha: valueSenha.confirmacaoSenha }, (campo, msg) => errors[campo] = msg);
        setErrorSenha(errors);
        if (Object.keys(errors).length === 0) {
            alterarSenha();
        }
    }

    function alterarSenha() {
        Api.post(`/usuario/alteracaoSenha/${dadosUsuario.id}`,
            {
                senha: valueSenha.senha,
                token: btoa(JSON.stringify({ email: dadosUsuario.email }))
            })
            .then(() => {
                showToast('Senha alterada com sucesso!');
                closeModal();
            })
            .catch(error => {
                showMsgError(`${error.response ? error.response.data.message : error.message}`);
            });
    }

    function closeModal() {
        setOpenModal(false);
        setValueSenha(defaultSenha);
        setErrorSenha(defaultSenha);
    }

    return (
        <DefaultPage usaDrawer usaMenus title='Editar cadastro'>
            <ContainerRoot>
                <ContainerContent className={classes.containerContent}>
                    <Form className={classes.form} onSubmit={handleSubmit}>
                        <EmailField label='E-mail'
                            name='email'
                            value={values.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled
                        />
                        <TextField
                            label='Nome'
                            name='nome'
                            value={values.nome}
                            onChange={handleChange}
                            error={!!errors.nome}
                            helperText={errors.nome}
                        />
                        <FoneField
                            label='Telefone'
                            name='foneContato'
                            value={values.foneContato}
                            onChange={handleChange}
                        />
                        <FoneField
                            label='Celular'
                            name='foneCelular'
                            value={values.foneCelular}
                            onChange={handleChange}
                        />
                        <Modal
                            title='Alterar senha'
                            open={openModal}
                            onClose={closeModal}
                            onSubmit={handleAlterarSenha}
                        >
                            <Form onSubmit={handleAlterarSenha}>
                                <PasswordField
                                    label='Senha'
                                    name='senha'
                                    value={valueSenha.senha}
                                    onChange={handleChangeSenha}
                                    error={!!errorSenha.senha}
                                    helperText={errorSenha.senha}
                                />
                                <PasswordField
                                    label='Confirmação'
                                    name='confirmacaoSenha'
                                    value={valueSenha.confirmacaoSenha}
                                    onChange={handleChangeSenha}
                                    error={!!errorSenha.confirmacaoSenha}
                                    helperText={errorSenha.confirmacaoSenha}
                                />
                            </Form>
                        </Modal>
                        <Box className={classes.containerButtons}>
                            <EditButton
                                text='Editar senha'
                                width='48%'
                                onClick={() => setOpenModal(true)}
                            />
                            <SaveButton
                                text='Salvar'
                                disabled={disabledButton}
                                type='submit'
                                width='48%'
                            />
                        </Box>
                    </Form>
                </ContainerContent>
            </ContainerRoot>
        </DefaultPage>
    );
}
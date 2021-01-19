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
    FoneField
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

export default function EditarCadastro() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const dadosUsuario = useSelector(state => state.usuario.dadosUsuario);
    const [disabledButton, setDisabledButton] = useState(false);
    const [errors, setErrors] = useState({ email: '', nome: '' });
    const [values, setValues] = useState({
        id: '',
        email: '',
        nome: '',
        foneContato: '',
        foneCelular: ''
    });

    function handleChange(event) {
        setValues({ ...values, [event.target.name]: event.target.value });
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
            confirmButtonText: 'Ok'
        });
    }

    function handleClickAlterarSenha() {
        Swal.fire({
            title: 'Alteração de senha',
            html:
                '<input id="swal-input1" class="swal2-input" type="password">' +
                '<input id="swal-input2" class="swal2-input" type="password">',
            focusConfirm: false,
            confirmButtonText: 'Salvar',
            preConfirm: () => {
                const senha1 = document.getElementById('swal-input1').value;
                const senha2 = document.getElementById('swal-input2').value;

                if (!senha1.trim() || !senha2.trim()) {
                    Swal.showValidationMessage('Senha obrigatória!');
                    return false;
                }

                if (senha1 !== senha2) {
                    Swal.showValidationMessage('Senhas não coincidem!');
                    return false;
                }

                alterarSenha(senha1);

            }
        });
    }

    function alterarSenha(senha) {
        Api.post(`/usuario/alteracaoSenha/${dadosUsuario.id}`, {
            senha, email: btoa(dadosUsuario.email)
        })
            .then(() => {
                showToast('Senha altaera com sucesso!');
            })
            .catch(error => {
                showMsgError(`${error.response ? error.response.data.message : error.message}`);
            });
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
                            <Box className={classes.containerButtons}>
                                <EditButton
                                    text='Editar senha'
                                    width='48%'
                                    onClick={handleClickAlterarSenha}
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
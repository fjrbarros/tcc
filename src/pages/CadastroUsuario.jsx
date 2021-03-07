import React, { useState } from 'react';
import {
    ContainerRoot,
    ContainerContent,
    Form,
    TextField,
    EmailField,
    PasswordField,
    SaveButton,
    FoneField
} from '../components/Index';
import { validaForm } from '../util/ValidaForm';
import { DefaultPage } from './Index';
import { Box, makeStyles } from '@material-ui/core';
import Api from '../api/Index';
import Swal from 'sweetalert2';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },

    form: {
        padding: '10px',
        textAlign: 'center'
    },

    saveButton: {
        marginTop: '15px'
    }
}));

function getDefaultValues() {
    return {
        email: '',
        nome: '',
        foneContato: '',
        foneCelular: '',
        senha: '',
    }
}

export default function CadastroUsuario() {
    const classes = useStyles();
    const [disabledButton, setDisabledButton] = useState(false);
    const [values, setValues] = useState(getDefaultValues);
    const [errors, setErrors] = useState(getDefaultValues);

    function handleChange(event) {
        setValues({ ...values, [event.target.name]: event.target.value });
    }

    function handleSubmit() {
        setDisabledButton(true);
        const errors = {};
        validaForm(values, (campo, msg) => errors[campo] = msg);
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
            salvaNovoUsuario();
        } else {
            setDisabledButton(false);
        }
    }

    function salvaNovoUsuario() {
        Api.post('usuario', values)
            .then(() => {
                Swal.fire({
                    toast: true,
                    icon: 'success',
                    title: 'Dados salvos com sucesso!',
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
                setValues(getDefaultValues);
                setDisabledButton(false);
            }).catch(error => {
                Swal.fire({
                    title: 'Erro!',
                    text: `${error.response ? error.response.data.message : error.message}`,
                    icon: 'error',
                    customClass: { container: 'msg-container' },
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                });
                setDisabledButton(false);
            })
    }

    return (
        <DefaultPage title='Cadastro de usuários'>
            <ContainerRoot>
                <ContainerContent>
                    <Box className={classes.container}>
                        <Form onSubmit={handleSubmit} className={classes.form}>
                            <EmailField
                                label='E-mail'
                                name='email'
                                value={values.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
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
                                error={!!errors.foneContato}
                                helperText={errors.foneContato}
                            />
                            <FoneField
                                label='Celular'
                                name='foneCelular'
                                value={values.foneCelular}
                                onChange={handleChange}
                                error={!!errors.foneCelular}
                                helperText={errors.foneCelular}
                            />
                            <PasswordField
                                label='Senha'
                                name='senha'
                                value={values.senha}
                                onChange={handleChange}
                                error={!!errors.senha}
                                helperText={errors.senha}
                            />
                            <SaveButton
                                className={classes.saveButton}
                                text='Salvar'
                                width='50%'
                                type='submit'
                                disabled={disabledButton}
                            />
                        </Form>
                    </Box>
                </ContainerContent>
            </ContainerRoot>
        </DefaultPage>
    );
}
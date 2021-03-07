import React, { useState } from 'react';
import { ContainerRoot, ContainerContent, Form, EmailField, SendButton } from '../components/Index';
import { DefaultPage } from './Index';
import { Box, makeStyles } from '@material-ui/core';
import { validaForm } from '../util/ValidaForm';
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
        textAlign: 'center',
        flex: 1
    },

    sendButton: {
        marginTop: '15px'
    },

    flex: {
        flex: 1
    }
}));

export default function RecuperarSenha() {
    const classes = useStyles();
    const [disabledButton, setDisabledButton] = useState(false);
    const [values, setValues] = useState({ email: '' });
    const [errors, setErrors] = useState({ email: '' });

    function handleChange(event) {
        setValues({ ...values, [event.target.name]: event.target.value });
    }

    function handleSubmit() {
        setDisabledButton(true);
        const errors = {};
        validaForm(values, (campo, msg) => errors[campo] = msg);
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
            enviaEmail();
        } else {
            setDisabledButton(false);
        }
    }

    function enviaEmail() {
        Api.post('/usuario/recuperacaoSenha', values)
            .then(resp => {
                showToast('E-mail enviado com sucesso!');
                setDisabledButton(false);
                setValues({ ...values, email: '' });
            })
            .catch(error => {
                Swal.fire({
                    title: 'Erro!',
                    text: `${error.response ? error.response.data.message : error.message}`,
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                });
                setDisabledButton(false);
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

    return (
        <DefaultPage title='Recuperar senha'>
            <ContainerRoot>
                <ContainerContent maxWidth='400px'>
                    <Box className={classes.container}>
                        <Box className={classes.flex} />
                        <Form onSubmit={handleSubmit} className={classes.form}>
                            <EmailField
                                label='E-mail'
                                name='email'
                                onChange={handleChange}
                                value={values.email}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                            <SendButton
                                className={classes.sendButton}
                                text='Enviar'
                                width='50%'
                                type='submit'
                                disabled={disabledButton}
                            />
                        </Form>
                        <Box className={classes.flex} />
                    </Box>
                </ContainerContent>
            </ContainerRoot>
        </DefaultPage>
    );
}
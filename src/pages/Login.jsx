import React, { useState } from 'react';
import { makeStyles, Box, Typography, Button } from '@material-ui/core';
import { Form, EmailField, PasswordField } from '../components/Index';
import { Link, useHistory } from 'react-router-dom';
import { validaForm } from '../util/ValidaForm';
import { encryptData } from '../util/RegistraUsuario';
import { useDispatch } from 'react-redux';
import { atualizaUsuario } from '../redux/user/Actions';
import { getDadosProjeto } from '../util/Requisicoes';
import store from '../redux/Index';
import Api from '../api/Index';
import Logo from '../assets/logo.png';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Swal from 'sweetalert2';

const useStyles = makeStyles(theme => ({
    body: {
        backgroundImage: 'linear-gradient(to right top, #003f9d, #0066be, #008bd6, #00b0e7, #00d4f4)',
        position: 'absolute',
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '445px'
    },

    contentForm: {
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '435px',
        minHeight: '435px',
        borderRadius: '5px',
        padding: '30px 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        '& h1': {
            color: '#6b6b6b',
            fontSize: '26px'
        },
        '@media (max-width: 600px)': {
            maxWidth: 'none',
            height: '100vh',
            minHeight: '445px',
        }
    },

    contentFormTop: {
        flex: 1
    },

    form: {
        marginTop: '-30px',
        flex: 1
    },

    contentFormBottom: {
        marginTop: '10px',
        display: 'flex',
        flexDirection: 'column',
        flex: 0.5,
        '& span': {
            marginTop: '10px'
        },

        '& a': {
            color: '#6b6b6b',
            textDecoration: 'none',
            position: 'relative',
            fontWeight: '600'
        },

        '& a:hover': {
            color: '#3f51b5'
        },

        '& a:before': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '2px',
            bottom: 0,
            left: 0,
            backgroundColor: '#3f51b5',
            visibility: 'hidden',
            transform: 'scaleX(0)',
            transition: 'all 0.3s ease-in-out 0s'
        },

        '& a:hover::before': {
            visibility: 'visible',
            transform: 'scaleX(1)'
        }
    },

    buttonLogin: {
        width: '50%',
        marginTop: '15px'
    },

    logo: {
        height: '100px',
        width: '80px',
        margin: '10px auto 0'
    }
}));

export default function Login() {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const [values, setValues] = useState(getDefaulData);
    const [errors, setErrors] = useState(getDefaulData);
    const [disabledButton, setDisabledButton] = useState(false);

    function getDefaulData() {
        return { email: '', senha: '' };
    }

    function handleChange(event) {
        setValues({ ...values, [event.target.name]: event.target.value })
    }

    function handleSubmit() {
        setDisabledButton(true);
        const errors = {};
        validaForm(values, (campo, msg) => errors[campo] = msg);
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
            executaLogin();
        } else {
            setDisabledButton(false);
        }
    }

    function executaLogin() {
        Api.post('/usuario/login', values)
            .then(resp => {
                dispatch(Object.assign(atualizaUsuario(), resp.data));
                encryptData(values);
                getDadosProjeto(store, resp.data);
                history.push('/dashboard');
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

    return (
        <Box className={classes.body}>
            <Box className={classes.contentForm}>
                <Box className={classes.contentFormTop}>
                    <Typography variant='h1'>
                        Management system for academic project control
                    </Typography>
                    <a href='https://ufsc.br/' target='_blank' rel='noopener noreferrer'>
                        <img src={Logo} alt='Logo sistema' className={classes.logo} />
                    </a>
                </Box>
                <Form className={classes.form} onSubmit={handleSubmit}>
                    <EmailField
                        label='E-mail'
                        name='email'
                        value={values.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <PasswordField
                        label='Senha'
                        name='senha'
                        value={values.senha}
                        onChange={handleChange}
                        error={!!errors.senha}
                        helperText={errors.senha}
                    />
                    <Button
                        type='submit'
                        color='primary'
                        disabled={disabledButton}
                        startIcon={<ExitToAppIcon />}
                        className={classes.buttonLogin}
                    >
                        Entrar
                    </Button>
                </Form>
                <Box className={classes.contentFormBottom}>
                    <span><Link to='/cadastro-usuario'>Não é cadastrado?</Link></span>
                    <span><Link to='/recuperar-senha'>Esqueceu a senha?</Link></span>
                </Box>
            </Box>
        </Box>
    );
}
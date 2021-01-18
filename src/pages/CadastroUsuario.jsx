import React from 'react';
import { ContainerRoot, ContainerContent, Form, TextField, EmailField, PasswordField, SaveButton } from '../components/Index';
import { DefaultPage } from './Index';
import { Box, makeStyles } from '@material-ui/core';

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
    },

    flex: {
        flex: 1
    }
}));

export default function CadastroUsuario() {
    const classes = useStyles();

    return (
        <DefaultPage title='Cadastro de usuários'>
            <ContainerRoot>
                <ContainerContent>
                    <Box className={classes.container}>
                        <Box className={classes.flex} />
                        <Form className={classes.form}>
                            <EmailField label='E-mail' />
                            <TextField label='Nome' />
                            <TextField label='Telefone' />
                            <TextField label='Celular' />
                            <PasswordField label='Senha' />
                            <SaveButton className={classes.saveButton} text='Salvar' width='50%' />
                        </Form>
                        <Box className={classes.flex} />
                    </Box>
                </ContainerContent>
            </ContainerRoot>
        </DefaultPage>
    );
}
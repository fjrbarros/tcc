import React from 'react';
import { ContainerRoot, ContainerContent, Form, EmailField, SendButton } from '../components/Index';
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

    return (
        <DefaultPage title='Recuperar senha'>
            <ContainerRoot>
                <ContainerContent>
                    <Box className={classes.container}>
                        <Box className={classes.flex} />
                        <Form className={classes.form}>
                            <EmailField label='E-mail' />
                            <SendButton className={classes.sendButton} text='Enviar' width='50%' />
                        </Form>
                        <Box className={classes.flex} />
                    </Box>
                </ContainerContent>
            </ContainerRoot>
        </DefaultPage>
    );
}
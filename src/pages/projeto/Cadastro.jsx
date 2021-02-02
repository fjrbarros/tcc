import React, { useState } from 'react';
import { ContainerRoot, ContainerContent, Form, TextField, SelectField, DateField, EmailField } from '../../components/Index';
import { DefaultPage } from '../Index';
import { useSelector } from 'react-redux';
import { Box, makeStyles, Tooltip, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';


const useStyles = makeStyles(theme => ({
    form: {
        padding: '10px'
    },

    selectField: {
        width: '100%'
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
        marginBottom: '-24px'
    }
}));

function defaultValues() {
    return {
        tipoProjeto: '',
        dataInicio: new Date(),
        dataPrevistaTermino: new Date(),
        envolvidos: [{ id: 1, nome: 'teste' }, { id: 2, nome: 'teste 2' }]
    }
}

export default function CadastroProjeto() {
    const classes = useStyles();
    const enums = useSelector(state => state.enums);
    const enumTipoProjeto = enums.enumTipoProjeto;
    const [values, setValues] = useState(defaultValues());

    function handleChange(event) {
        setValues({ ...values, [event.target.name]: event.target.value });
    }

    return (
        <DefaultPage usaDrawer usaMenus title='Cadastro de projeto'>
            <ContainerRoot>
                <ContainerContent>
                    <Form className={classes.form}>
                        <TextField label='Descrição' />
                        <SelectField
                            className={classes.selectField}
                            name='tipoProjeto'
                            data={enumTipoProjeto}
                            label='Tipo projeto'
                            value={values.tipoProjeto}
                            onChange={handleChange}
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
                            <IconButton>
                                <AddCircleIcon />
                            </IconButton>
                        </Box>
                        <List className={classes.listEnvolvidos}>
                            {
                                values.envolvidos.map(item => {
                                    return (
                                        <ListItem key={item.id}>
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
                                                />
                                                <SelectField
                                                    className={classes.inputIntegrantes}
                                                    // className={classes.selectIntegrantes}
                                                    // name='tipoProjeto'
                                                    data={enumTipoProjeto}
                                                    label='Tipo projeto'
                                                // value={values.tipoProjeto}
                                                // onChange={handleChange}
                                                />
                                                <Tooltip title='Remover' placement='left'>
                                                    <IconButton className={classes.buttonIntegrantes}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </ListItem>
                                    )
                                })
                            }
                        </List>
                    </Form>
                </ContainerContent>
            </ContainerRoot>
        </DefaultPage>
    );
}
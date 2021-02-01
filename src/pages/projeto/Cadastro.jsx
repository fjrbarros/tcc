import React, { useState } from 'react';
import { ContainerRoot, ContainerContent, Form, TextField, SelectField, DateField, EmailField } from '../../components/Index';
import { DefaultPage } from '../Index';
import { useSelector } from 'react-redux';
import { Box, makeStyles, Tooltip } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';


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
        width: '100%',
        marginTop: '16px',
        marginBottom: '8px',
    }
}));

function defaultValues() {
    return {
        tipoProjeto: '',
        dataInicio: new Date(),
        dataPrevistaTermino: new Date(),
        membros: [{ id: 1, nome: 'teste' }, { id: 2, nome: 'teste 2' }]
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
                        <Box display='flex' justifyContent='flex-end'>
                            <EmailField label='E-mail' style={{ marginRight: '5px' }} />
                            <SelectField
                                className={classes.selectField}
                                name='tipoProjeto'
                                data={enumTipoProjeto}
                                label='Tipo projeto'
                                value={values.tipoProjeto}
                                onChange={handleChange}
                            />
                            <Tooltip title='Envolvidos no projeto' placement='left'>
                                <IconButton>
                                    <AddCircleIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <List >
                            {
                                values.membros.map(item => {
                                    return (
                                        <ListItem
                                            key={item.id}
                                        >
                                            <ListItemIcon><BookmarkBorderIcon /></ListItemIcon>
                                            <ListItemText>{item.nome}</ListItemText>
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
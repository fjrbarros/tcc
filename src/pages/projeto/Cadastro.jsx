import React, { useState } from 'react';
import { ContainerRoot, ContainerContent, Form, TextField } from '../../components/Index';
import { SelectField, DateField } from '../../components/Index';
import { DefaultPage } from '../Index';
import { useSelector } from 'react-redux';
import { Box, makeStyles, Tooltip } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';


const useStyles = makeStyles(theme => ({
    form: {
        padding: '10px'
    },

    selectField: {
        width: '100%'
    }
}));

export default function CadastroProjeto() {
    const classes = useStyles();
    const enums = useSelector(state => state.enums);
    const enumTipoProjeto = enums.enumTipoProjeto;
    const [values, setValues] = useState({
        tipoProjeto: '',
        dataInicio: new Date(),
        dataPrevistaTermino: new Date()
    });

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
                        <Tooltip title='Envolvidos no projeto' placement='left'>
                            <IconButton style={{ float: 'right' }}>
                                <AddCircleIcon />
                            </IconButton>
                        </Tooltip>
                    </Form>
                </ContainerContent>
            </ContainerRoot>
        </DefaultPage>
    );
}
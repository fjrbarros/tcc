import React, { useState } from 'react';
import { ContainerRoot, ContainerContent, Form, TextField } from '../../components/Index';
import { SelectField, DateField } from '../../components/Index';
import { DefaultPage } from '../Index';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
// import moment from 'moment';
// import 'moment/locale/pt-br';

// import MomentUtils from '@date-io/moment';
// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';


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
        dataInicio: new Date()
    });
    // const locale = moment().locale('pt-BR');


    // const [selectedDate, handleDateChange] = useState(new Date());

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
                        <DateField
                            label='Teste'
                            name='dataInicio'
                            value={values.dataInicio}
                            onChange={date => setValues({ ...values, dataInicio: date })}
                        />
                    </Form>
                </ContainerContent>
            </ContainerRoot>
        </DefaultPage>
    );
}
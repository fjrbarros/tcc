import React, { useState } from 'react';
import { ContainerRoot, ContainerContent, Form, TextField } from '../../components/Index';
import { DefaultPage } from '../Index';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { ptBR } from "date-fns/locale";

import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";


const useStyles = makeStyles(theme => ({
    formControl: {
        width: '100%'
    }
}));

export default function CadastroProjeto() {
    const classes = useStyles();
    const enums = useSelector(state => state.enums);
    const enumTipoProjeto = enums.enumTipoProjeto;

    const [selectedDate, handleDateChange] = useState(new Date());

    return (
        <DefaultPage usaDrawer usaMenus title='Cadastro de projeto'>
            <ContainerRoot>
                <ContainerContent>
                    <Form>
                        <TextField label='Descrição' />
                        <FormControl className={classes.formControl}>
                            <InputLabel>Tipo projeto</InputLabel>
                            <Select name='tipoProjeto'>
                                {
                                    enumTipoProjeto.map(_enum => {
                                        return (
                                            <MenuItem
                                                key={_enum.valor}
                                                value={_enum.valor}
                                            >
                                                {_enum.descricao}
                                            </MenuItem>
                                        );
                                    })
                                }
                            </Select>
                        </FormControl>
                        <MuiPickersUtilsProvider locale={ptBR} utils={MomentUtils}>
                            <KeyboardDatePicker
                                placeholder="Teste"
                                value={selectedDate}
                                onChange={date => handleDateChange(date)}
                                format="dd/MM/yyyy"
                            />
                        </MuiPickersUtilsProvider>

                    </Form>
                </ContainerContent>
            </ContainerRoot>
        </DefaultPage>
    );
}
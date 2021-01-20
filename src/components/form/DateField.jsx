import React from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

export default function DateField(props) {
    const locale = moment().locale('pt-BR');

    return (
        <MuiPickersUtilsProvider locale={locale} utils={MomentUtils}>
            <KeyboardDatePicker
                format='DD/MM/YYYY'
                {...props}
            />
        </MuiPickersUtilsProvider>
    );
}
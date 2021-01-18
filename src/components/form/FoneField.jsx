import React from 'react';
import { TextField } from '@material-ui/core';
import MaskedInput from 'react-text-mask';

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => inputRef(ref ? ref.inputElement : null)}
            mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
        />
    );
}

export default function FoneField(props) {
    return <TextField
        {...props}
        InputProps={{
            inputComponent: TextMaskCustom
        }}
    />
}
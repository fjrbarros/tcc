import React from 'react';
import { TextField as TextInput } from '@material-ui/core';

export default function TextField(props) {
    const { field, onChange, onValueChange, ...inputProps } = props;

    function handleChange(event) {
        if (onChange && onChange(event) === false) {
            event.preventDefault();
            return false;
        }

        const value = event.target.value;

        if (onValueChange && onValueChange(value) === false) {
            return false;
        }

        return true;
    }

    return <TextInput type='text' onChange={handleChange} {...inputProps} />;
}
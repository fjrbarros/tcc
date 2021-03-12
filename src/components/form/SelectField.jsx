import React from 'react';
import { FormHelperText } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default function SelectField(props) {
    const { data, error, value, onChange, name, className, label } = props;

    return (
        <FormControl fullWidth error={!!error} className={className}>
            <InputLabel>{label}</InputLabel>
            <Select
                label={label}
                name={name}
                value={value}
                onChange={onChange}
            >
                <MenuItem value=''>
                    <em>Selecione</em>
                </MenuItem>
                {
                    data.length > 0 &&
                    data.map((item, index) => {
                        return (
                            <MenuItem
                                key={`${item.valor} - ${index}`}
                                value={item.valor}
                            >
                                {item.descricao}
                            </MenuItem>
                        );
                    })
                }
            </Select>
            {!!error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
}
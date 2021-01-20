import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

export default function SelectField(props) {
    const { data, label, className } = props;

    return (
        <FormControl className={`${className}`}>
            <InputLabel >{label}</InputLabel>
            <Select {...props}>
                {
                    data.map(item => {
                        return (
                            <MenuItem
                                key={item.valor}
                                value={item.valor}
                            >
                                {item.descricao}
                            </MenuItem>
                        );
                    })
                }
            </Select>
        </FormControl>
    );
}
import React, { useState } from 'react';
import { IconButton, InputAdornment } from '@material-ui/core';
import { VisibilityOutlined, VisibilityOffOutlined } from '@material-ui/icons';
import TextField from './TextField';

export default function PasswordField(props) {
    const { value, onFocus, onBlur, ...inputProps } = props;

    const [type, setType] = useState('password');
    const [showTypeToggler, setShowTypeToggler] = useState(false);

    function preventDefault(event) {
        event.preventDefault();
    }

    function toogleShowPassword() {
        setType(type === 'password' ? 'text' : 'password');
    }

    function handleFocus(event) {
        setShowTypeToggler(true);
        if (onFocus) onFocus(event);
    }

    function handleBlur(event) {
        setShowTypeToggler(!!value);
        if (onBlur) onBlur(event);
    }

    return (
        <TextField
            type={type}
            onBlur={handleBlur}
            onFocus={handleFocus}
            {...inputProps}
            InputProps={{
                endAdornment: (
                    <InputAdornment style={{
                        cursor: 'pointer',
                        opacity: showTypeToggler ? 1 : 0
                    }}>
                        <IconButton tabIndex={-1} onClick={toogleShowPassword} onMouseDown={preventDefault}>
                            {type === 'text' ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );
}
import React from 'react';
import SendIcon from '@material-ui/icons/Send';
import Button from './Button';

export default function SendButton(props) {

    return (
        <Button
            {...props}
            startIcon={<SendIcon />}
        />
    );
}
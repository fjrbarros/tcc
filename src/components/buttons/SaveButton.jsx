import React from 'react';
import SaveIcon from '@material-ui/icons/Save';
import Button from './Button';

export default function SaveButton(props) {

    return (
        <Button
            {...props}
            startIcon={<SaveIcon />}
        />
    );
}
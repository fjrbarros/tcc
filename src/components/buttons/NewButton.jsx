import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Button from './Button';

export default function SaveButton(props) {

    return (
        <Button
            {...props}
            startIcon={<AddIcon />}
        />
    );
}
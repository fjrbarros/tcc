import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import Button from './Button';

export default function EditButton(props) {

    return (
        <Button
            {...props}
            startIcon={<EditIcon />}
        />
    );
}
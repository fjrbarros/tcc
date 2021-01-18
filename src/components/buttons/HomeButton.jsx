import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import Button from './Button';

export default function HomeButton(props) {

    return (
        <Button
            {...props}
            startIcon={<HomeIcon />}
        />
    );
}
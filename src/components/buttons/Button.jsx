import React from 'react';
import { Button as Btn, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    button: {
        width: props => props.width ? props.width : '100%',
        textTransform: 'none'
    }
}));

export default function Button(props) {
    const { text, className, width, ...rest } = props;
    const classes = useStyles(props);

    return (
        <Btn
            variant="contained"
            color="primary"
            className={`${className} ${classes.button}`}
            {...rest}
        >
            {text}
        </Btn>
    );
}
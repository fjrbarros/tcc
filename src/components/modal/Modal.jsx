import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles(theme => ({
    title: {
        margin: 0,
        padding: theme.spacing(2)
    },

    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
}));

export default function Modal(props) {
    const classes = useStyles();
    const { open, title, children, onClose, onSubmit } = props;

    return (
        <Dialog fullWidth onClose={onClose} open={open}>
            <MuiDialogTitle className={classes.title} disableTypography>
                <Typography variant="h6">{title}</Typography>
                {onClose ? (
                    <IconButton className={classes.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </MuiDialogTitle>
            <MuiDialogContent dividers>
                {children}
            </MuiDialogContent>
            <MuiDialogActions>
                {
                    onSubmit &&
                    <Button color='primary'
                        onClick={event => {
                            event.preventDefault();
                            onSubmit(event);
                        }}
                        startIcon={<SaveIcon />}
                    >
                        Salvar
                    </Button>
                }
            </MuiDialogActions>
        </Dialog>
    );
}
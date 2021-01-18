import React, { useState } from 'react';
import { Box, makeStyles, Tooltip } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
    root: {
        // position: 'relative',
        color: '#585858'
    },

    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },

    expandOpen: {
        transform: 'rotate(180deg)',
    },

    collapseContent: {
    },

    collapseHeader: {
        display: 'flex',
        justifyContent: props => props.titleAlign === 'right' ? 'flex-end' : 'flex-start',
        '& div': {
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '16px',
            '& svg': {
                fontSize: '30px'
            }
        }
    }
}));

export default function ContainerCollapse(props) {
    const classes = useStyles(props);
    const { title, children, expanded, className } = props;
    const [_expanded, setExpanded] = useState(expanded || false);

    return (
        <Box className={`${classes.root} ${className}`}>
            <Box className={classes.collapseHeader}>
                <Tooltip title={_expanded ? 'Ocultar' : 'Expandir'} placement='left'>
                    <Box onClick={() => setExpanded(!_expanded)}>
                        <ExpandMoreIcon className={clsx(classes.expand, { [classes.expandOpen]: _expanded })} />
                        {title}
                    </Box>
                </Tooltip>
            </Box>
            <Collapse in={_expanded} timeout='auto' unmountOnExit className={classes.collapseContent}>
                {children}
            </Collapse>
        </Box>
    );
}
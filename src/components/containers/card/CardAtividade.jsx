import React from 'react';
import { makeStyles, withStyles, Box, Typography, Tooltip } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const BorderLinearProgress = withStyles(theme => ({
    root: {
        height: 7,
        borderRadius: 5,
        flex: 0.83
    },

    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },

    bar: {
        backgroundColor: '#1a90ff',

    }
}))(LinearProgress);


const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    outline: 'none',
    padding: '25px 10px',
    margin: `0 0 ${grid}px 0`,
    border: `1px solid ${isDragging ? 'orange' : 'transparent'}`,
    borderRadius: '5px',
    position: 'relative',
    boxShadow: `${isDragging ? 'none' : '0px 0px 5px 0px rgba(0, 0, 0, 0.4)'}`,
    ...draggableStyle
});

const useStyles = makeStyles(theme => ({
    iconRemover: {
        fontSize: '1.3rem',
        fill: '#333333db',
        cursor: 'pointer',
        position: 'absolute',
        top: '1px',
        right: '1px'
    },

    descricao: {
        whiteSpace: 'nowrap',
        textOverflow: 'Ellipsis',
        overflow: 'hidden'
    }
}));

export default function CardAtividade(props) {
    const classes = useStyles();
    const { removerAtividade, descricao, percentualConclusao, provided, snapshot } = props;
    return (
        <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
        >
            <Tooltip title='Remover atividade' placement='left'>
                <DeleteForeverIcon
                    className={classes.iconRemover}
                    onClick={removerAtividade}
                />
            </Tooltip>
            <Typography className={classes.descricao}>
                {descricao}
            </Typography>
            <Box display='flex' position='absolute' alignItems='center' bottom='0' width='100%'>
                <BorderLinearProgress variant='determinate' value={percentualConclusao} />
                <span style={{ marginLeft: '5px', flex: 0.17 }}>{percentualConclusao}%</span>
            </Box>
        </Box>
    );
}
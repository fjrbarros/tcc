import React, { useState } from 'react';
import { makeStyles, withStyles, Box, Typography, Tooltip } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

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
    cursor: 'move',
    color: '#484848',
    outline: 'none',
    padding: '25px 10px',
    margin: `0 0 ${grid}px 0`,
    border: `1px solid ${isDragging ? 'orange' : 'transparent'}`,
    borderRadius: '5px',
    position: 'relative',
    boxShadow: `${isDragging ? 'none' : '0px 0px 5px 0px rgba(0, 0, 0, 0.4)'}`,
    overflow: 'hidden',
    ...draggableStyle
});

const useStyles = makeStyles(theme => ({
    iconMaisOpcao: {
        fontSize: '1.3rem',
        fill: '#333333db',
        cursor: 'pointer',
        position: 'absolute',
        top: '1px',
        right: '1px',
    },

    descricao: {
        whiteSpace: 'nowrap',
        textOverflow: 'Ellipsis',
        overflow: 'hidden'
    },

    cardMaisOpcoes: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        top: 0,
        transition: 'all 0.2s',
        left: props => props.showMaisOpcoes ? 0 : '-100%'
    },

    list: {
        padding: 0,
        '& li': {
            padding: '2px 5px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            '& div': {
                margin: 0
            }
        },

        '& li:hover': {
            backgroundColor: 'rgb(0,0,0,0.1)'
        }
    }
}));

export default function CardAtividade(props) {
    const [showMaisOpcoes, setShowMaisOpcoes] = useState(false);
    const classes = useStyles({ ...props, showMaisOpcoes });
    const { removerAtividade, descricao, percentualConclusao, provided, snapshot } = props;

    function showCardMaisOpcoes() {
        setShowMaisOpcoes(!showMaisOpcoes);
    }

    return (
        <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
        >
            <Tooltip title='Mais opções' placement='left'>
                <MoreVertIcon className={classes.iconMaisOpcao} onClick={showCardMaisOpcoes} />
            </Tooltip>
            <Typography className={classes.descricao}>
                {descricao}
            </Typography>
            <Box display='flex' position='absolute' alignItems='center' bottom='0' width='100%'>
                <BorderLinearProgress variant='determinate' value={percentualConclusao} />
                <span style={{ margin: '0 0 2px 5px', flex: 0.17 }}>{percentualConclusao}%</span>
            </Box>
            <Box className={classes.cardMaisOpcoes}>
                <Tooltip title='Remover atividade' placement='bottom'>
                    <IconButton onClick={removerAtividade}>
                        <DeleteForeverIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Editar atividade' placement='bottom'>
                    <IconButton>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Voltar' placement='bottom'>
                    <IconButton onClick={showCardMaisOpcoes}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}
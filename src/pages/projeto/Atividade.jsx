import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Api from '../../api/Index';
import Swal from 'sweetalert2';
import { makeStyles, Box, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        margin: '0 auto',
        width: '750px',
        padding: '10px 0px'
    },

    teste: {
        background: '#fff',
        padding: grid,
        width: 250,
        margin: '0 10px'
    },

    containerSemAtividade: {
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#fff'
    }
}));

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: '15px 10px',
    margin: `0 0 ${grid}px 0`,
    border: `1px solid ${isDragging ? 'orange' : 'transparent'}`,
    borderRadius: '5px',
    boxShadow: `${isDragging ? 'none' : ' 0px 0px 5px 0px rgba(0, 0, 0, 0.4)'}`,
    ...draggableStyle
});

function getListStyle(isDraggingOver, text) {
    let color = '';
    if (text === 'TO_DO') color = '#efc100';
    if (text === 'DOING') color = '#0ac';
    if (text === 'DONE') color = '#0b0';

    return {
        border: isDraggingOver ? `1.5px dashed ${color}` : `1.5px solid ${color}`,
        background: '#fff',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        width: 250,
        margin: '0 10px'
    }
}

export default function Atividade(props) {
    const { projeto } = props.location.state;
    const [atividade, setAtividade] = useState({ to_do: [], doing: [], done: [] });
    const idList = { to_do: 'to_do', doing: 'doing', done: 'done' };
    const classes = useStyles();

    useEffect(() => {
        Api.get(`/projeto/${projeto.id}/atividades`
        ).then(resp => {
            organizaDados(resp.data);
        }).catch(error => {
            Swal.fire({
                title: 'Erro!',
                text: `${error.response ? error.response.data.message : error.message}`,
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok'
            });
        });
    }, [projeto.id]);

    function organizaDados(dados) {
        const to_do = dados.filter(item => item.estagio === 'TO_DO');
        const doing = dados.filter(item => item.estagio === 'DOING');
        const done = dados.filter(item => item.estagio === 'DONE');

        setAtividade({ to_do, doing, done });
    }

    function getList(id) {
        return atividade[idList[id]];
    }

    function onDragEnd(result) {
        const { source, destination } = result;

        if (!destination) return;

        if (source.droppableId === destination.droppableId) {
            const newList = reorder(
                getList(source.droppableId),
                source.index,
                destination.index
            );

            if (source.droppableId === 'to_do') {
                setAtividade({ ...atividade, to_do: newList });
                return
            }

            if (source.droppableId === 'doing') {
                setAtividade({ ...atividade, doing: newList });
                return;
            }

            if (source.droppableId === 'done') {
                setAtividade({ ...atividade, done: newList });
                return;
            }
        }

        const newResult = move(
            getList(source.droppableId),
            getList(destination.droppableId),
            source,
            destination
        );

        setAtividade({
            to_do: newResult.to_do || atividade.to_do,
            doing: newResult.doing || atividade.doing,
            done: newResult.done || atividade.done
        });
    }

    if (naoPossuiAtividades()) {
        return (
            <Box className={classes.containerSemAtividade}>
                <Typography>Este projeto não contém Atividades!</Typography>
            </Box>
        );
    }

    function naoPossuiAtividades() {
        return atividade.to_do.length === 0 && atividade.doing.length === 0 && atividade.done.length === 0;
    }

    function defaultProps(item) {
        return (provided, snapshot) => (
            <Box
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                )}
            >
                {item.descricao}
            </Box>
        )
    }

    function getHeaderColumn(text) {
        let background = '';
        if (text === 'TO_DO') background = '#efc100';
        if (text === 'DOING') background = '#0ac';
        if (text === 'DONE') background = '#0b0';

        return (
            <Box style={{
                padding: '15px 10px',
                textAlign: 'center',
                borderTopLeftRadius: '7px',
                borderTopRightRadius: '7px',
                backgroundColor: background,
                color: '#fff'
            }}>
                <Typography>{text}</Typography>
            </Box>
        ); 
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Box className={classes.container}>
                <Droppable droppableId='to_do'>
                    {(provided, snapshot) => (
                        <Box style={getListStyle(snapshot.isDraggingOver, 'TO_DO')}>
                            { getHeaderColumn('TO_DO')}
                            <Box padding='5px 5px 0px' height='100%' ref={provided.innerRef}>
                                {atividade.to_do.map((item, index) => (
                                    <Draggable
                                        key={item.id.toString()}
                                        draggableId={item.id.toString()}
                                        index={index}
                                    >
                                        {defaultProps(item)}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Box>
                        </Box>
                    )}
                </Droppable>
                <Droppable droppableId='doing'>
                    {(provided, snapshot) => (
                        <Box style={getListStyle(snapshot.isDraggingOver, 'DOING')}>
                            { getHeaderColumn('DOING')}
                            <Box padding='5px 5px 0px' height='100%' ref={provided.innerRef}>
                                {atividade.doing.map((item, index) => (
                                    <Draggable
                                        key={item.id.toString()}
                                        draggableId={item.id.toString()}
                                        index={index}
                                    >
                                        {defaultProps(item)}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Box>
                        </Box>
                    )}
                </Droppable>
                <Droppable droppableId='done'>
                    {(provided, snapshot) => (
                        <Box style={getListStyle(snapshot.isDraggingOver, 'DONE')}>
                            { getHeaderColumn('DONE')}
                            <Box padding='5px 5px 0px' height='100%' ref={provided.innerRef}>
                                {atividade.done.map((item, index) => (
                                    <Draggable
                                        key={item.id.toString()}
                                        draggableId={item.id.toString()}
                                        index={index}
                                    >
                                        {defaultProps(item)}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Box>
                        </Box>
                    )}
                </Droppable>
            </Box>
        </DragDropContext>
    );
}
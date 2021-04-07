import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { makeStyles, Box, Typography, IconButton, Tooltip } from '@material-ui/core';
import { Modal, TextField, DateField, Form, CardAtividade } from '../../components/Index';
import AddIcon from '@material-ui/icons/Add';
import Api from '../../api/Index';
import Swal from 'sweetalert2';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        margin: '0 auto',
        width: '750px',
        padding: '10px 0'
    },

    containerSemAtividade: {
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#fff'
    },

    containerButtons: {
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
        width: '33%',
        padding: '10px',
        '& button': {
            marginBottom: '10px'
        }
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

function getListStyle(isDraggingOver, text) {
    const color = getListColor(text);

    return {
        border: isDraggingOver ? `1.5px dashed ${color}` : `1.5px solid ${color}`,
        background: '#fff',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        width: 250,
        margin: '0 10px'
    }
}

function getListColor(text) {
    switch (text) {
        case 'TO DO':
            return '#efc100';
        case 'DOING':
            return '#0ac';
        case 'DONE':
            return '#0b0';
        default:
            return 'transparent';
    }
}

function getValuesAtividade(idUsuario) {
    return {
        idUsuario,
        descricao: '',
        detalhes: '',
        dataInicio: new Date(),
        dataTermino: new Date(),
    }
}

export default function Atividade(props) {
    const classes = useStyles();
    const idUsuario = useSelector(state => state.usuario.dadosUsuario.id);
    const { projeto } = props.location.state;
    const [atividade, setAtividade] = useState({ to_do: [], doing: [], done: [] });
    const [openModal, setOpenModal] = useState(false);
    const [valuesAtividade, setValuesAtividade] = useState(getValuesAtividade(idUsuario))
    const [errorsAtividade, setErrorsAtividade] = useState(getValuesAtividade(idUsuario))
    const idList = { to_do: 'to_do', doing: 'doing', done: 'done' };

    useEffect(() => {
        Api.get(`/projeto/${projeto.id}/atividades`)
            .then(resp => {
                organizaDados(resp.data);
            }).catch(error => {
                showMessageError(`${error.response ? error.response.data.message : error.message}`);
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

        if (!source || !destination) return;

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

        const copyAtividade = {
            to_do: atividade.to_do,
            doing: atividade.doing,
            done: atividade.done
        };

        setAtividade({
            to_do: newResult.to_do || atividade.to_do,
            doing: newResult.doing || atividade.doing,
            done: newResult.done || atividade.done
        });

        const idAtividade = result.draggableId;
        const destino = destination.droppableId;

        Api.post(`/projeto/${projeto.id}/atividade/${idAtividade}/estagio`, {
            estagioDestino: destino.toUpperCase(),
            idUsuario: idUsuario
        })
            .catch(error => {
                showMessageError(`${error.response ? error.response.data.message : error.message}`);
                setAtividade(copyAtividade);
            });
    }

    function showMessageError(msg) {
        Swal.fire({
            title: 'Erro!',
            text: msg,
            icon: 'error',
            customClass: { container: 'msg-container' },
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok'
        });
    }

    function showToast(msg) {
        Swal.fire({
            toast: true,
            icon: 'success',
            title: msg,
            showClass: false,
            position: 'top',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: { container: 'toast-container' },
            didOpen: toast => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });
    }

    function removerAtividade(atividade) {
        questionamento('Excluir atividade!', `Você realmente deseja excluir a atividade ${atividade.descricao}?`, () => {
            Api.delete(`/projeto/${projeto.id}/atividade/${atividade.id}`)
                .then(() => {
                    excluirAtividade(atividade);
                    showToast('Atividade removida com sucesso!');
                }).catch(error => showMsgError(`${error.response ? error.response.data.message : error.message}`));
        });
    }

    function excluirAtividade(atividadeDel) {
        const estagioLower = atividadeDel.estagio.toLowerCase();

        let copyArray = [...atividade[estagioLower]];

        copyArray = copyArray.filter(item => item.id !== atividadeDel.id);

        setAtividade({ ...atividade, [estagioLower]: copyArray });
    }

    function showMsgError(msg) {
        Swal.fire({
            title: 'Erro!',
            text: msg,
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok'
        });
    }

    function questionamento(title, msg, callback) {
        Swal.fire({
            title: title,
            text: msg,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não'
        }).then((result) => {
            if (result.isConfirmed) callback();
        })
    }

    function getHeaderColumn(text) {
        const background = getListColor(text);

        return (
            <Box style={{
                padding: '15px 10px',
                textAlign: 'center',
                margin: '-1px -1px 0 -1px',
                borderTopLeftRadius: '7px',
                borderTopRightRadius: '7px',
                backgroundColor: background,
                position: 'relative',
                color: '#fff'
            }}>
                <Typography>{text}</Typography>
                {
                    text === 'TO DO' &&
                    <Tooltip title='Nova atividade' placement='left'>
                        <IconButton
                            onClick={() => setOpenModal(true)}
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 0
                            }}
                        >
                            <AddIcon style={{ fill: '#fff' }} />
                        </IconButton>
                    </Tooltip>
                }
            </Box>
        );
    }

    function closeModal() {
        setOpenModal(false);
        setValuesAtividade(getValuesAtividade(idUsuario));
        setErrorsAtividade(getValuesAtividade(idUsuario));
    }

    function handleChangeAtividade(event) {
        setValuesAtividade({ ...valuesAtividade, [event.target.name]: event.target.value });
    }

    function handleSubmitAtividade() {
        const errors = {};
        const data = { descricao: valuesAtividade.descricao, detalhes: valuesAtividade.detalhes };
        validaForm(data, (campo, msg) => errors[campo] = msg);
        setErrorsAtividade(errors);
        if (Object.keys(errors).length === 0) {
            salvarAtividade();
        }
    }

    function validaForm(values, errorFn) {
        if (!values.descricao.trim()) {
            errorFn('descricao', 'Descrição é obrigatório!')
        }

        if (!values.detalhes.trim()) {
            errorFn('detalhes', 'Detalhes é obrigatório!')
        }
    }

    function salvarAtividade() {

        valuesAtividade.dataPrevistaInicio = moment(valuesAtividade.dataInicio).format('DD/MM/YYYY');
        valuesAtividade.dataPrevistaTermino = moment(valuesAtividade.dataTermino).format('DD/MM/YYYY');

        delete valuesAtividade.dataInicio;
        delete valuesAtividade.dataTermino;

        Api.post(`/projeto/${projeto.id}/atividade`, valuesAtividade)
            .then(resp => {
                atualizaAtividades(resp.data);
                showToast('Dados salvos com sucesso!');
                closeModal();
            })
            .catch(error => showMessageError(`${error.response ? error.response.data.message : error.message}`));
    }

    function atualizaAtividades(data) {
        if (Object.keys(data).length === 0) return;

        const copyArray = [...atividade.to_do];
        copyArray.splice(0, 0, data);
        setAtividade({ ...atividade, to_do: copyArray });
    }

    return <>
        <DragDropContext onDragEnd={onDragEnd}>
            <Box className={classes.container}>
                <Droppable droppableId='to_do'>
                    {(provided, snapshot) => (
                        <Box style={getListStyle(snapshot.isDraggingOver, 'TO DO')}>
                            { getHeaderColumn('TO DO')}
                            <Box padding='5px 5px 0px' height='100%' ref={provided.innerRef}>
                                {atividade.to_do.map((item, index) => (
                                    <Draggable
                                        key={item.id.toString()}
                                        draggableId={item.id.toString()}
                                        index={index}
                                        item={item}
                                    >
                                        {
                                            (provided, snapshot) => <CardAtividade
                                                provided={provided}
                                                snapshot={snapshot}
                                                descricao={item.descricao}
                                                percentualConclusao={item.percentualConclusao}
                                                removerAtividade={() => removerAtividade(item)}
                                            />
                                        }
                                    </Draggable>
                                ))}
                            </Box>
                            {provided.placeholder}
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
                                        {
                                            (provided, snapshot) => <CardAtividade
                                                provided={provided}
                                                snapshot={snapshot}
                                                descricao={item.descricao}
                                                percentualConclusao={item.percentualConclusao}
                                                removerAtividade={() => removerAtividade(item)}
                                            />
                                        }
                                    </Draggable>
                                ))}
                            </Box>
                            {provided.placeholder}
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
                                        {
                                            (provided, snapshot) => <CardAtividade
                                                provided={provided}
                                                snapshot={snapshot}
                                                descricao={item.descricao}
                                                percentualConclusao={item.percentualConclusao}
                                                removerAtividade={() => removerAtividade(item)}
                                            />
                                        }
                                    </Draggable>
                                ))}
                            </Box>
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </Box>
        </DragDropContext>
        <Modal
            open={openModal}
            title='Nova atividade'
            onClose={closeModal}
            onSubmit={handleSubmitAtividade}
        >
            <Form onSubmit={handleSubmitAtividade}>
                <Box display='flex' justifyContent='space-between'>
                    <TextField
                        label='Data início projeto'
                        value={projeto.dataInicio}
                        style={{ width: '45%' }}
                        disabled
                    />
                    <TextField
                        label='Data termino projeto'
                        value={projeto.dataPrevistaTermino}
                        style={{ width: '45%' }}
                        disabled
                    />
                </Box>
                <TextField
                    name='descricao'
                    label='Descrição'
                    value={valuesAtividade.descricao}
                    onChange={handleChangeAtividade}
                    error={!!errorsAtividade.descricao}
                    helperText={errorsAtividade.descricao}
                />
                <TextField
                    name='detalhes'
                    label='Detalhes'
                    value={valuesAtividade.detalhes}
                    onChange={handleChangeAtividade}
                    error={!!errorsAtividade.detalhes}
                    helperText={errorsAtividade.detalhes}
                />
                <Box display='flex' justifyContent='space-between'>
                    <DateField
                        style={{ width: '45%' }}
                        label='Data prevista início'
                        name='dataInicio'
                        value={valuesAtividade.dataInicio}
                        onChange={date => setValuesAtividade({ ...valuesAtividade, dataInicio: date })}
                    />
                    <DateField
                        style={{ width: '45%' }}
                        label='Data prevista término'
                        name='dataTermino'
                        value={valuesAtividade.dataTermino}
                        onChange={date => setValuesAtividade({ ...valuesAtividade, dataTermino: date })}
                    />
                </Box>
            </Form>
        </Modal>
    </>;
}
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { makeStyles, Box, Typography, IconButton, Tooltip } from '@material-ui/core';
import { Modal, TextField, DateField, Form, CardAtividade } from '../../components/Index';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
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
    },

    listaTarefas: {
        margin: 0,
        padding: 0,
        marginTop: '-10px',
        '& li': {
            padding: 0
        }
    },

    btnActionsTarefa: {
        marginBottom: '-24px',
        padding: '10px',
        '& svg': {
            fontSize: '1.2rem'
        }
    },

    adicionarNovaTarefa: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: '10px',
        '& p': {
            marginRight: '10px',
            fontStyle: 'italic',
            fontSize: '17px'
        }
    }
}));

function reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

function move(source, destination, droppableSource, droppableDestination) {
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
        id: '',
        descricao: '',
        detalhes: '',
        dataInicio: new Date(),
        dataTermino: new Date(),
        tarefas: []
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
        if (Object.keys(errors).length !== 0) return;

        if (valuesAtividade.id) {
            atualizaAlteracoesAtividade();
            return;
        }

        salvarAtividade();
    }

    function validaForm(values, errorFn) {
        if (!values.descricao || !values.descricao.trim()) {
            errorFn('descricao', 'Descrição é obrigatório!')
        }

        if (!values.detalhes || !values.detalhes.trim()) {
            errorFn('detalhes', 'Detalhes é obrigatório!')
        }
    }

    function atualizaAlteracoesAtividade() {
        const data = getDataSalvar();

        Api.put(`/projeto/${projeto.id}/atividade/${valuesAtividade.id}`, data)
            .then(resp => cbSucces(resp))
            .catch(error => cbError(error))
    }

    function salvarAtividade() {
        const data = getDataSalvar();

        Api.post(`/projeto/${projeto.id}/atividade`, data)
            .then(resp => cbSucces(resp))
            .catch(error => cbError(error))
    }

    function cbSucces(resp) {
        atualizaAtividades(resp.data);
        showToast('Dados salvos com sucesso!');
        closeModal();
    }

    function cbError(error) {
        showMessageError(`${error.response ? error.response.data.message : error.message}`);
    }

    function getDataSalvar() {
        const data = {
            dataPrevistaInicio: moment(valuesAtividade.dataInicio).format('DD/MM/YYYY'),
            dataPrevistaTermino: moment(valuesAtividade.dataTermino).format('DD/MM/YYYY'),
            descricao: valuesAtividade.descricao,
            detalhes: valuesAtividade.detalhes,
            idUsuario
        };

        delete valuesAtividade.dataInicio;
        delete valuesAtividade.dataTermino;

        return data;
    }

    function atualizaAtividades(data) {
        if (Object.keys(data).length === 0) return;

        const copyArray = [...atividade.to_do];

        const index = copyArray.findIndex(obj => obj.id === data.id)

        if (index >= 0) {
            copyArray[index] = data;
        } else {
            copyArray.splice(0, 0, data);
        }

        setAtividade({ ...atividade, to_do: copyArray });
    }

    function editarAtividade(atividade) {
        atividade.tarefas.forEach(tarefa => {
            if (!tarefa.dataPrevistaTermino) return;

            const str = typeof tarefa.dataPrevistaTermino === 'string';

            if (str) {
                const dtTermino = tarefa.dataPrevistaTermino.split('/');
                tarefa.dataPrevistaTermino = new Date(`${dtTermino[1]}/${dtTermino[0]}/${dtTermino[2]}`);
            }
        });

        setValuesAtividade({
            ...valuesAtividade,
            id: atividade.id,
            descricao: atividade.descricao || '',
            detalhes: atividade.detalhes || '',
            tarefas: atividade.tarefas || []
        });
        setOpenModal(true);
    }

    function adicionarNovaTarefa() {
        const copyTarefas = getCopyArrayTarefas();

        copyTarefas.push({ descricao: '', dataPrevistaTermino: '', idUsuario });

        setTarefas(copyTarefas);
    }

    function handleChangeTarefaDescricao(event, index) {
        const copyTarefas = getCopyArrayTarefas();

        copyTarefas[index].descricao = event.target.value;

        setTarefas(copyTarefas);
    }

    function handleChangeTarefaDate(date, index) {
        const copyTarefas = getCopyArrayTarefas();

        copyTarefas[index].dataPrevistaTermino = date;

        setTarefas(copyTarefas);
    }

    function getCopyArrayTarefas() {
        return [...valuesAtividade.tarefas];
    }

    function setTarefas(tarefas) {
        setValuesAtividade({ ...valuesAtividade, tarefas });
    }

    function removeTarefa(tarefa, index) {
        if (!tarefa.id) {
            removeTarefaIndex(index);
            return;
        }

        Api.delete(`/projeto/${projeto.id}/atividade/${valuesAtividade.id}/tarefa/${tarefa.id}`)
            .then(() => removeTarefaIndex(index))
            .catch(error => cbError(error));
    }

    function removeTarefaIndex(index) {
        const copyTarefas = getCopyArrayTarefas();

        copyTarefas.splice(index, 1);
        setTarefas(copyTarefas);
    }

    function cadastrarTarefa(tarefa, index) {
        const date = tarefa.dataPrevistaTermino || new Date();
        const data = {
            descricao: tarefa.descricao,
            dataPrevistaTermino: moment(date).format('DD/MM/YYYY'),
            idUsuario
        };

        if (tarefa.id) {
        } else {
            Api.post(`/projeto/${projeto.id}/atividade/${valuesAtividade.id}/tarefa`, data)
                .then(() => showToast('Tarefa salva com sucesso!'))
                .catch(error => cbError(error));
        }
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
                                                editar={() => editarAtividade(item)}
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
                                                editar={() => editarAtividade(item)}
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
                                                editar={() => editarAtividade(item)}
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
            title='Atividade'
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
                {
                    valuesAtividade.id &&
                    <Box className={classes.adicionarNovaTarefa}>
                        <Typography>
                            Nova tarefa
                        </Typography>
                        <IconButton onClick={adicionarNovaTarefa}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                }
                <List className={classes.listaTarefas}>
                    {
                        valuesAtividade.id &&
                        valuesAtividade.tarefas.map((item, index) => {
                            return (
                                <ListItem key={item.id || `key-${index}`}>
                                    <Box
                                        display='flex'
                                        justifyContent='space-between'
                                        alignItems='center'
                                        width='100%'
                                        padding='5px 0'
                                    >
                                        <TextField
                                            style={{ width: '45%' }}
                                            name='descricao'
                                            label='Descrição'
                                            value={item.descricao}
                                            onChange={event => handleChangeTarefaDescricao(event, index)}
                                        />
                                        <Box width='10%'></Box>
                                        <DateField
                                            style={{ width: '30%' }}
                                            label='Data prevista término'
                                            name='dataTermino'
                                            value={item.dataPrevistaTermino || new Date()}
                                            onChange={date => handleChangeTarefaDate(date, index)}
                                        />
                                        <Tooltip title='Remover' placement='bottom'>
                                            <IconButton
                                                className={classes.btnActionsTarefa}
                                                onClick={() => removeTarefa(item, index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Salvar' placement='bottom'>
                                            <IconButton
                                                className={classes.btnActionsTarefa}
                                                onClick={() => cadastrarTarefa(item, index)}
                                            >
                                                <SaveIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Form>
        </Modal>
    </>;
}
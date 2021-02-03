import React, { useEffect, useState } from 'react';
import {
    ContainerRoot,
    ContainerContent,
    Form,
    TextField,
    SelectField,
    DateField,
    EmailField,
    SaveButton
} from '../../components/Index';
import { DefaultPage } from '../Index';
import { useSelector } from 'react-redux';
import { Box, makeStyles, Tooltip, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const useStyles = makeStyles(theme => ({
    form: {
        padding: '10px'
    },

    selectField: {
        width: '100%'
    },

    inputIntegrantes: {
        width: '44%',
        margin: 0,
        '& div': {
            width: '100%'
        }
    },

    listEnvolvidos: {
        margin: 0,
        padding: 0,
        marginTop: '-10px',
        '& li': {
            padding: 0
        }
    },

    labelIntegrantes: {
        fontSize: '1.2rem',
        fontStyle: 'italic',
        color: '#545454'
    },

    buttonIntegrantes: {
        marginBottom: '-24px',
        padding: '10px',
        '& svg': {
            fontSize: '1.2rem'
        }
    },

    saveButton: {
        margin: '10px 0',
        marginLeft: '50%',
        transform: 'translate(-50%)'
    }
}));

function defaultValues(idUsuario) {
    return {
        idUsuario,
        descricao: '',
        tipoProjeto: '',
        dataInicio: new Date(),
        dataPrevistaTermino: new Date(),
        membros: []
    }
}

export default function CadastroProjeto() {
    const classes = useStyles();
    const enums = useSelector(state => state.enums);
    const enumTipoProjeto = enums.enumTipoProjeto;
    const enumPerfilMembroProjeto = enums.enumPerfilMembroProjeto;
    const idUsuario = useSelector(state => state.usuario.dadosUsuario.id);
    const [values, setValues] = useState(defaultValues(idUsuario));

    function handleChange(event) {
        setValues({ ...values, [event.target.name]: event.target.value });
    }

    function adicionaEnvolvidoProjeto() {
        const newArraymembros = [...values.membros];

        newArraymembros.push({ emailMembro: '', perfilMembro: '' });

        setValues({ ...values, membros: newArraymembros });
    }

    function handleChangeMembro(event, index) {
        const newArraymembros = [...values.membros];

        newArraymembros[index][event.target.name] = event.target.value;

        setValues({ ...values, membros: newArraymembros });
    }

    function removeMembro(membro, index) {
        if (membro.id) {
            removeMembroApi(membro);
            return;
        }

        removeMembroProjeto(membro);
    }

    function removeMembroApi(membro) {
        alert();
    }

    function removeMembroProjeto(membro) {
        let newArraymembros = [...values.membros];

        newArraymembros = newArraymembros.filter(item => item !== membro);

        setValues({ ...values, membros: newArraymembros });
    }

    function salvarProjeto() {

    }

    return (
        <DefaultPage usaDrawer usaMenus title='Cadastro de projeto'>
            <ContainerRoot>
                <ContainerContent>
                    <Form className={classes.form}>
                        <TextField
                            label='Código usuário'
                            value={values.idUsuario}
                            style={{ width: '96px' }}
                            disabled
                        />
                        <TextField
                            label='Descrição'
                            name='descricao'
                            value={values.descricao}
                            onChange={handleChange}
                        />
                        <SelectField
                            className={classes.selectField}
                            name='tipoProjeto'
                            data={enumTipoProjeto}
                            label='Tipo projeto'
                            value={values.tipoProjeto}
                            onChange={handleChange}
                        />
                        <Box display='flex' justifyContent='space-between'>
                            <DateField
                                style={{ width: '45%' }}
                                label='Data início'
                                name='dataInicio'
                                value={values.dataInicio}
                                onChange={date => setValues({ ...values, dataInicio: date })}
                            />
                            <DateField
                                style={{ width: '45%' }}
                                label='Data prevista término'
                                name='dataPrevistaTermino'
                                value={values.dataPrevistaTermino}
                                onChange={date => setValues({ ...values, dataPrevistaTermino: date })}
                            />
                        </Box>
                        <Box display='flex' justifyContent='flex-end' alignItems='center'>
                            <Typography className={classes.labelIntegrantes}>
                                Envolvidos no projeto
                            </Typography>
                            <IconButton onClick={adicionaEnvolvidoProjeto}>
                                <AddCircleIcon />
                            </IconButton>
                        </Box>
                        <List className={classes.listEnvolvidos}>
                            {
                                values.membros.map((item, index) => {
                                    return (
                                        <ListItem key={item.id || `key-${index}`}>
                                            <Box
                                                display='flex'
                                                justifyContent='space-between'
                                                alignItems='center'
                                                width='100%'
                                                padding='5px 0'
                                            >
                                                <EmailField
                                                    label='E-mail'
                                                    className={classes.inputIntegrantes}
                                                    name='emailMembro'
                                                    value={item.emailMembro}
                                                    onChange={e => handleChangeMembro(e, index)}
                                                />
                                                <SelectField
                                                    className={classes.inputIntegrantes}
                                                    data={enumPerfilMembroProjeto}
                                                    label='Perfil membro'
                                                    name='perfilMembro'
                                                    value={item.perfilMembro}
                                                    onChange={e => handleChangeMembro(e, index)}
                                                />
                                                <Tooltip title='Remover' placement='left'>
                                                    <IconButton
                                                        className={classes.buttonIntegrantes}
                                                        onClick={() => removeMembro(item, index)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </ListItem>
                                    )
                                })
                            }
                        </List>
                        <SaveButton
                            className={classes.saveButton}
                            text='Salvar'
                            width='50%'
                            onClick={salvarProjeto}
                        />
                    </Form>
                </ContainerContent>
            </ContainerRoot>
        </DefaultPage>
    );
}
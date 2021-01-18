import { combineReducers } from 'redux';
import { types } from './Actions';

function enumEstagioAtividade(state = [], action) {
    switch (action.type) {
        case types.ATUALIZA_ENUM_ESTAGIO_ATIVIDADE:
            return action.data;
        default:
            return state;
    }
}

function enumMotivoEncerramentoProjeto(state = [], action) {
    switch (action.type) {
        case types.ATUALIZA_ENUM_MOTIVO_ENCERRAMENTO_PROJETO:
            return action.data;
        default:
            return state;
    }
}

function enumPerfilMembroProjeto(state = [], action) {
    switch (action.type) {
        case types.ATUALIZA_ENUM_PERFIL_MEMBRO_PROJETO:
            return action.data;
        default:
            return state;
    }
}

function enumStatusAtividade(state = [], action) {
    switch (action.type) {
        case types.ATUALIZA_ENUM_STATUS_ATIVIDADE:
            return action.data;
        default:
            return state;
    }
}

function enumStatusProjeto(state = [], action) {
    switch (action.type) {
        case types.ATUALIZA_ENUM_STATUS_PROJETO:
            return action.data;
        default:
            return state;
    }
}

function enumTipoProjeto(state = [], action) {
    switch (action.type) {
        case types.ATUALIZA_ENUM_TIPO_PROJETO:
            return action.data;
        default:
            return state;
    }
}

export default combineReducers({
    enumEstagioAtividade,
    enumMotivoEncerramentoProjeto,
    enumPerfilMembroProjeto,
    enumStatusAtividade,
    enumStatusProjeto,
    enumTipoProjeto
});
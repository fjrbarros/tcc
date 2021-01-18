import { combineReducers } from 'redux';
import { types } from './Actions';

function dadosUsuario(state = {}, action) {
    switch (action.type) {
        case types.ATUALIZA_USUARIO:
            return {
                ...state,
                id: action.id || '',
                email: action.email || '',
                nome: action.nome || '',
                foneContato: action.foneContato || '',
                foneCelular: action.foneCelular || ''
            };
        default:
            return state;
    }
}

function validandoUsuarioLogado(state = true, action) {
    switch (action.type) {
        case types.VALIDANDO_USUARIO_LOGADO:
            return false;
        default:
            return state;
    }
}

function dadosProjeto(state = [], action) {
    switch (action.type) {
        case types.ATUALIZA_DADOS_PROJETO:
            return action.data;
        default:
            return state;
    }
}

export default combineReducers({ dadosUsuario, validandoUsuarioLogado, dadosProjeto });
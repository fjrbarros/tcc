export const types = {
    ATUALIZA_USUARIO: 'ATUALIZA_USUARIO',
    VALIDANDO_USUARIO_LOGADO: 'VALIDANDO_USUARIO_LOGADO',
    ATUALIZA_DADOS_PROJETO: 'ATUALIZA_DADOS_PROJETO'
};

export function atualizaUsuario() {
    return { type: types.ATUALIZA_USUARIO };
}

export function validaUsuarioLogado() {
    return { type: types.VALIDANDO_USUARIO_LOGADO };
}

export function atualizaDadosProjeto() {
    return { type: types.ATUALIZA_DADOS_PROJETO };
}
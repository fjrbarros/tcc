// export const types = {
//     ATUALIZA_ENUMS: 'ATUALIZA_ENUMS'
// };

// export function atualizaEnums() {
//     return { type: types.ATUALIZA_ENUMS };
// }

export const types = {
    ATUALIZA_ENUM_ESTAGIO_ATIVIDADE: 'ATUALIZA_ENUM_ESTAGIO_ATIVIDADE',
    ATUALIZA_ENUM_MOTIVO_ENCERRAMENTO_PROJETO: 'ATUALIZA_ENUM_MOTIVO_ENCERRAMENTO_PROJETO',
    ATUALIZA_ENUM_PERFIL_MEMBRO_PROJETO: 'ATUALIZA_ENUM_PERFIL_MEMBRO_PROJETO',
    ATUALIZA_ENUM_STATUS_ATIVIDADE: 'ATUALIZA_ENUM_STATUS_ATIVIDADE',
    ATUALIZA_ENUM_STATUS_PROJETO: 'ATUALIZA_ENUM_STATUS_PROJETO',
    ATUALIZA_ENUM_TIPO_PROJETO: 'ATUALIZA_ENUM_TIPO_PROJETO'
};

export function atualizaEnumEstagioAtividade() {
    return { type: types.ATUALIZA_ENUM_ESTAGIO_ATIVIDADE };
}

export function atualizaEnumMotivoEncerramentoProjeto() {
    return { type: types.ATUALIZA_ENUM_MOTIVO_ENCERRAMENTO_PROJETO };
}

export function atualizaEnumPerfilMembroProjeto() {
    return { type: types.ATUALIZA_ENUM_PERFIL_MEMBRO_PROJETO };
}

export function atualizaEnumStatusAtividade() {
    return { type: types.ATUALIZA_ENUM_STATUS_ATIVIDADE };
}

export function atualizaEnumStatusProjeto() {
    return { type: types.ATUALIZA_ENUM_STATUS_PROJETO };
}

export function atualizaEnumTipoProjeto() {
    return { type: types.ATUALIZA_ENUM_TIPO_PROJETO };
}
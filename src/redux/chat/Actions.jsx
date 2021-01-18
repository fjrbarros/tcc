export const types = {
    OPEN_CHAT: 'OPEN_CHAT',
    CLOSE_CHAT: 'CLOSE_CHAT'
};

export function abrirChat() {
    return { type: types.OPEN_CHAT };
}

export function fecharChat() {
    return { type: types.CLOSE_CHAT };
}
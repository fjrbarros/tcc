export const types = {
    OPEN_DRAWER: 'OPEN_DRAWER',
    CLOSE_DRAWER: 'CLOSE_DRAWER'
};

export function abrirDrawer() {
    return { type: types.OPEN_DRAWER };
}

export function fecharDrawer() {
    return { type: types.CLOSE_DRAWER };
}
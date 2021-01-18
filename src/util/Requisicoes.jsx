import Api from '../api/Index';
import {
    atualizaEnumEstagioAtividade,
    atualizaEnumMotivoEncerramentoProjeto,
    atualizaEnumPerfilMembroProjeto,
    atualizaEnumStatusAtividade,
    atualizaEnumStatusProjeto,
    atualizaEnumTipoProjeto
} from '../redux/enums/Actions';
import { atualizaDadosProjeto } from '../redux/user/Actions';
import Swal from 'sweetalert2';

export function getEnums(store) {
    Api.get('/dados').then(resp => {
        const data = resp.data;
        store.dispatch(Object.assign(atualizaEnumEstagioAtividade(), { data: data.filter(item => item.tipo === 'ESTAGIO_ATIVIDADE')[0].valores }));
        store.dispatch(Object.assign(atualizaEnumMotivoEncerramentoProjeto(), { data: data.filter(item => item.tipo === 'MOTIVO_ENCERRAMENTO_PROJETO')[0].valores }));
        store.dispatch(Object.assign(atualizaEnumPerfilMembroProjeto(), { data: data.filter(item => item.tipo === 'PERFIL_MEMBRO_PROJETO')[0].valores }));
        store.dispatch(Object.assign(atualizaEnumStatusAtividade(), { data: data.filter(item => item.tipo === 'STATUS_ATIVIDADE')[0].valores }));
        store.dispatch(Object.assign(atualizaEnumStatusProjeto(), { data: data.filter(item => item.tipo === 'STATUS_PROJETO')[0].valores }));
        store.dispatch(Object.assign(atualizaEnumTipoProjeto(), { data: data.filter(item => item.tipo === 'TIPO_PROJETO')[0].valores }));
    }).catch(error => {
        Swal.fire({
            title: 'Erro!',
            text: `${error.response ? error.response.data.message : error.message}`,
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok'
        });
    });
}

export function getDadosProjeto(store, dadosUsuario) {
    if (!dadosUsuario) return;

    Api.get('/projeto', {
        params: { usuario: dadosUsuario.id }
    }).then(resp => {
        store.dispatch(Object.assign(atualizaDadosProjeto(), { data: resp.data }));
    }).catch(error => {
        Swal.fire({
            title: 'Erro!',
            text: `${error.response ? error.response.data.message : error.message}`,
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok'
        });
    });
}
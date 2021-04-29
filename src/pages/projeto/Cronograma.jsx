import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Api from '../../api/Index';

export default function Cronograma(props) {
    const projeto = props.location.state ? props.location.state.projeto : null;
    const idUsuario = useSelector(state => state.usuario.dadosUsuario.id);

    useEffect(() => {
        if (!projeto.id) return;

        Api.post(`projeto/${projeto.id}/cronograma/listaAtividades`, {idUsuario})
            .then(resp => console.log(resp.data))
    })
    return <div style={{ height: '100%' }}>Cronograma</div>
}
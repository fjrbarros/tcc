import React, { useEffect } from 'react';
import Api from '../../api/Index';

export default function Cronograma(props) {
    const projeto = props.location.state ? props.location.state.projeto : null;

    useEffect(() => {
        if (!projeto.id) return;

        Api.get(`projeto/${projeto.id}/cronograma`)
            .then(resp => console.log(resp.data))
    })
    return <div style={{ height: '100%' }}>Cronograma</div>
}
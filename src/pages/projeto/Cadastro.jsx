import React from 'react';
import { ContainerRoot, ContainerContent } from '../../components/Index';
import { DefaultPage } from '../Index';

export default function CadastroProjeto() {
    return (
    <DefaultPage usaDrawer usaMenus title='Cadastro de projeto'>
        <ContainerRoot>
            <ContainerContent maxWidth='100%'>
                <h1>Cadastro projeto</h1>
            </ContainerContent>
        </ContainerRoot>
    </DefaultPage>
    );
}
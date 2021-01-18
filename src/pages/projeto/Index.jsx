import React from 'react';
import { ContainerRoot, ContainerContent } from '../../components/Index';
import { DefaultPage } from '../Index';
import { Tabpanel } from '../../components/Index';
import Atividade from './Atividade';
import Cronograma from './Cronograma';

export default function ProjetoAtividade(props) {
    return (
        <DefaultPage usaDrawer usaMenus title='Cadastro de projeto'>
            <ContainerRoot>
                <ContainerContent maxWidth='100%' backgroundDefault>
                    <Tabpanel
                        panels={[{
                            title: 'Atividades',
                            component: () => <Atividade {...props} />
                        }, {
                            title: 'Cronograma',
                            component: () => <Cronograma {...props} />
                        }]}
                    />
                </ContainerContent>
            </ContainerRoot>
        </DefaultPage>
    );
}
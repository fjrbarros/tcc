import {
  Login,
  CadastroUsuario,
  RecuperarSenha,
  Dashboard,
  ProjetoAtividade,
  CadastroProjeto,
  TemplateProjeto,
  EditarCadastro,
  NotFound
} from './pages/Index';
import { useSelector } from 'react-redux';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

function PrivateRoute({ component: Component, ...rest }) {

  const { Auth } = rest;

  return (
    <Route {...rest}
      render={props =>
        Auth ?
          (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: '/', state: { from: props.location } }} />
          )
      }
    />
  )
}

export default function App() {
  const idUsuario = useSelector(state => state.usuario.dadosUsuario.id);
  const _validandoUsuarioLogado = useSelector(state => state.usuario.validandoUsuarioLogado);

  if (_validandoUsuarioLogado) return null;

  return (
    <BrowserRouter >
      <Switch >
        < Route exact path='/' component={Login} />
        < Route exact path='/cadastro-usuario' component={CadastroUsuario} />
        < Route exact path='/recuperar-senha' component={RecuperarSenha} />
        < PrivateRoute exact path='/dashboard' Auth={idUsuario} component={Dashboard} />
        < PrivateRoute exact path='/projeto-cadastro' Auth={idUsuario} component={CadastroProjeto} />
        < PrivateRoute exact path='/projeto-atividade' Auth={idUsuario} component={ProjetoAtividade} />
        < PrivateRoute exact path='/cadastro-template' Auth={idUsuario} component={TemplateProjeto} />
        < PrivateRoute exact path='/editar-cadastro' Auth={idUsuario} component={EditarCadastro} />
        < Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}
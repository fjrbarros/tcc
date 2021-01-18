import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import theme from './theme/Index';
import { Provider } from 'react-redux';
import store from './redux/Index';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { verificaUsuarioLogado } from './util/RegistraUsuario';
import { getEnums, getDadosProjeto } from './util/Requisicoes';

verificaUsuarioLogado(store).then(data => getDadosProjeto(store, data));
getEnums(store);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root') 
);
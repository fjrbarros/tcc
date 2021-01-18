import Api from '../api/Index';
import { atualizaUsuario, validaUsuarioLogado } from '../redux/user/Actions';
import Swal from 'sweetalert2';

export function removeCookie() {
    const cookies = document.cookie.split(';');

    cookies.forEach(c => {
        document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
}

export function encryptData(data) {
    const CryptoJS = require('crypto-js');

    const cipherTextEmail = CryptoJS.AES.encrypt(data.email, 'email');
    const cipherTextPassword = CryptoJS.AES.encrypt(data.senha, 'senha');

    document.cookie = `info-E = ${cipherTextEmail}`;
    document.cookie = `info-P = ${cipherTextPassword}`;
}

export function decryptData() {
    const CryptoJS = require('crypto-js');

    const cookieEmail = getCookie('info-E');
    const cookiePassword = getCookie('info-P');

    const bytesEmail = CryptoJS.AES.decrypt(cookieEmail, 'email');
    const bytesPassword = CryptoJS.AES.decrypt(cookiePassword, 'senha');
    const plainTextEmail = bytesEmail.toString(CryptoJS.enc.Utf8);
    const plainTextPassword = bytesPassword.toString(CryptoJS.enc.Utf8);

    return { email: plainTextEmail, senha: plainTextPassword };

}

function getCookie(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

export function verificaUsuarioLogado(store) {
    return new Promise(resolve => {
        const data = decryptData();

        if (!data.email && !data.senha) {
            store.dispatch(validaUsuarioLogado());
            resolve();
            return;
        };

        Api.post('/usuario/login', data)
            .then(resp => {
                encryptData(data);
                store.dispatch(Object.assign(atualizaUsuario(), resp.data));
                store.dispatch(validaUsuarioLogado());
                resolve(resp.data);
            })
            .catch(error => {
                Swal.fire({
                    title: 'Erro!',
                    text: `${error.response ? error.response.data.message : error.message}`,
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                });
                store.dispatch(validaUsuarioLogado());
            })
    })

}
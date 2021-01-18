export function validaForm(values, errorFn) {
    let msg;

    if (values.hasOwnProperty('email')) {
        if ((msg = validaEmail(values.email))) {
            errorFn('email', msg)
        }
    }

    if (values.hasOwnProperty('nome')) {
        if ((msg = validaNome(values.nome))) {
            errorFn('nome', msg)
        }
    }

    if (values.hasOwnProperty('senha')) {
        if ((msg = validaSenha(values.senha))) {
            errorFn('senha', msg)
        }
    }
}


function validaEmail(email) {
    if (!email) {
        return 'E-mail é obrigatório!';
    }

    const regex = /^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/;

    if (!regex.test(email)) {
        return 'E-mail inválido';
    }

    return '';
}


function validaSenha(senha) {
    if (!senha) {
        return 'Senha é obrigatório!';
    }

    return '';
}

function validaNome(nome) {
    if (!nome.trim()) {
        return 'Nome é obrigatório!';
    }

    return '';
}
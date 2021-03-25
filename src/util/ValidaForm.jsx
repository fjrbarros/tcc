export function validaForm(values, errorFn) {
    let msg;

    if (values.hasOwnProperty('email')) {
        if ((msg = validaEmail(values.email))) {
            errorFn('email', msg)
        }
    }

    if (values.hasOwnProperty('nome')) {
        if ((msg = validaTextoSimples(values.nome, 'Nome'))) {
            errorFn('nome', msg)
        }
    }

    if (values.hasOwnProperty('senha')) {
        if ((msg = validaTextoSimples(values.senha, 'Senha'))) {
            errorFn('senha', msg)
        }
    }

    if (values.hasOwnProperty('confirmacaoSenha')) {
        if ((msg = validaTextoSimples(values.confirmacaoSenha, 'Confirmação de senha'))) {
            errorFn('confirmacaoSenha', msg)
        }
    }

    if (values.hasOwnProperty('descricao')) {
        if ((msg = validaTextoSimples(values.descricao, 'Descrição'))) {
            errorFn('descricao', msg)
        }
    }

    if (values.hasOwnProperty('tipoProjeto')) {
        if ((msg = validaTextoSimples(values.tipoProjeto, 'Tipo projeto'))) {
            errorFn('tipoProjeto', msg)
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

function validaTextoSimples(nome, texto) {
    if (!nome.toString().trim()) {
        return `${texto} é obrigatório!`;
    }

    return '';
}
const mensagemContainer = document.querySelector("#mensagem")
const inputCadastrar = document.querySelector("#cadastrar")

const listarLembretes = async () => {

    const listaContainer = document.querySelector("#lista")
    listaContainer.innerHTML = ''

    const listagem = await chamadaGetListar()
    const arrayDeLembretes = Array.from(listagem)
    if (listagem) {
        arrayDeLembretes.forEach(lembrete => {
            construirItensDaLista(lembrete.id, lembrete.lembrete, listaContainer)
        })
    }
    else {
        mensagemListaVazia()
    }
}

const chamadaGetListar = async () => {
    const respostaListagem = await fetch("../classes/Listagem.php", {
        method: "GET"
    })
    const respostaJSON = await respostaListagem.json()
    return respostaJSON
}

const construirItensDaLista = (idLembrete, nomeLembrete, listaContainer) => {

    const itemDaLista = document.createElement('li')
    const lembrete = document.createElement('p')

    lembrete.dataset.id = idLembrete
    lembrete.classList.add(`lembrete${idLembrete}`)
    lembrete.innerHTML = nomeLembrete

    itemDaLista.appendChild(lembrete)

    const templateBotãoDeletar = `<button data-id=${idLembrete} class="deletar">Deletar</button>`
    const templateBotãoAtualizar = `<button data-id=${idLembrete} class="atualizar">Atualizar</button>`

    listaContainer.appendChild(itemDaLista)

    lembrete.insertAdjacentHTML("afterend", templateBotãoDeletar);
    lembrete.insertAdjacentHTML("afterend", templateBotãoAtualizar);
    checarTipoDoBotão(idLembrete, lembrete, itemDaLista, listaContainer)

    return itemDaLista
}

const checarTipoDoBotão = (idLembrete, lembrete, itemDaLista, listaContainer) => {

    const arrayDeBotões = document.querySelectorAll(`button[data-id="${idLembrete}"]`)
    arrayDeBotões.forEach(botão => {

        botão.addEventListener("click", async (click) => {
            inputCadastrar.value = ''
            click.preventDefault()
            const botãoClicado = click.target
            if (botãoClicado.innerHTML === "OK") {
                const atualizou = await botãoOKFuncionalidade(idLembrete, lembrete)
                if (atualizou) {
                    botãoClicado.innerHTML = "Atualizar"
                    return
                } else {
                    return
                }
            } else if (botãoClicado.innerHTML === "Deletar") {
                botãoDeletarFuncionalidade(idLembrete, itemDaLista, listaContainer)
                return
            }
            botãoAtualizarFuncionalidade(idLembrete, botãoClicado)
        })

    })

}

const botãoOKFuncionalidade = async (idLembrete, itemDaLista) => {
    const campoDeEdição = document.querySelector(`.editando${idLembrete}`)
    const atualizarParaIsto = (campoDeEdição.value.trim().length > 0 && campoDeEdição.value.trim().length < 100) ? campoDeEdição.value.trim() : false
    if (atualizarParaIsto) {
        const respostaDaChamada = await chamadaPutAtualizar(idLembrete, atualizarParaIsto)
        if (respostaDaChamada === "atualizado") {
            itemDaLista.innerHTML = atualizarParaIsto
            campoDeEdição.replaceWith(itemDaLista)
        }
        return true
    } else {
        return false
    }

}

const botãoAtualizarFuncionalidade = (idLembrete, botãoClicado) => {

    const idDoBotãoAtualizar = botãoClicado.getAttribute("data-id")
    const lembreteParaAtualizar = document.querySelector(`.lembrete${idDoBotãoAtualizar}`)
    const campoParaAtualizar = document.createElement("input")

    campoParaAtualizar.classList.add(`editando${idLembrete}`)
    campoParaAtualizar.classList.add(`editando`)

    botãoClicado.innerHTML = "OK"
    lembreteParaAtualizar.replaceWith(campoParaAtualizar)
    campoParaAtualizar.value = lembreteParaAtualizar.innerHTML

}
const botãoDeletarFuncionalidade = async (idLembrete, itemDaLista, listaContainer) => {
    const respostaDeletar = await chamadaDELETEDeletar(idLembrete)
    if (respostaDeletar === "deletado") {
        itemDaLista.remove()
        mensagemContainer.innerHTML = ''
        await listarLembretes()
        const quantidadeDeTarefasListadas = Array.from(listaContainer.children).length
        mensagemContainer.innerHTML = "Lembrete deletado com sucesso!"
        await new Promise(res=>{
            setTimeout(() => {
                mensagemContainer.innerHTML = ''
                res()
            }, 4000)
        })
        if(quantidadeDeTarefasListadas === 0){
            mensagemListaVazia()
        }
    }
}
const chamadaDELETEDeletar = async (idLembrete) => {

    const respostaDeletar = await fetch("../classes/Deletar.php", {
        method: "DELETE",
        body: JSON.stringify({
            idParaDeletar: idLembrete
        })
    })

    const respostaTexto = await respostaDeletar.text()
    return respostaTexto

}

const chamadaPutAtualizar = async (idLembrete, atualizarParaIsto) => {
    const respostaAtualizar = await fetch("../classes/Atualizar.php", {
        method: "PUT",
        body: JSON.stringify({
            id: idLembrete,
            atualizar: atualizarParaIsto
        })
    })
    const respostaTexto = await respostaAtualizar.text()
    return respostaTexto
}

const cadastro = async () => {
    const botãoEnviar = document.querySelector("#enviar");
    botãoEnviar.addEventListener("click", async (click) => {
        let nomeLembreteParaCadastrar = inputCadastrar.value.trim().length > 0 ? inputCadastrar.value.trim() : false
        click.preventDefault()
        mensagemContainer.innerHTML = ''
        if (!nomeLembreteParaCadastrar) {
            mensagemContainer.innerHTML = "O campo não pode estar vazio!"
            return
        }
        const mensagem = await chamadaPostCadastro(nomeLembreteParaCadastrar)
        mensagemContainer.innerHTML = ''
        inputCadastrar.value = ''
        await listarLembretes()
        mensagemContainer.innerHTML = mensagem
        setTimeout(() => {
            mensagemContainer.innerHTML = ''
        }, 4000)
    })

}

const chamadaPostCadastro = async (nomeLembreteParaCadastrar) => {
    const respostaCadastro = await fetch("../classes/Cadastro.php", {
        method: "POST",
        body: JSON.stringify({
            nomeLembrete: nomeLembreteParaCadastrar
        })
    })
    const respostaTexto = await respostaCadastro.text()
    return respostaTexto
}

const mensagemListaVazia = ()=>{
    const p = document.createElement("p")
    p.innerText = "Não há lembretes cadastrados."
    mensagemContainer.appendChild(p)
    return true
}

listarLembretes()
cadastro()
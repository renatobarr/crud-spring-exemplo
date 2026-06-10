// O endereço da nossa API Spring Boot
const apiUrl = 'http://localhost:8080/api/registros';

// Pegando os elementos da tela que vamos manipular
const corpoTabela = document.getElementById('corpo-tabela');
const modalForm = document.getElementById('modal-form');
const formulario = document.getElementById('formulario');
const inputId = document.getElementById('registro-id');
const inputNome = document.getElementById('nome');
const inputDescricao = document.getElementById('descricao');
const modalTitulo = document.getElementById('modal-titulo');

// 1. LER (GET) - Busca os dados da API e monta a tabela
async function carregarRegistros() {
    try {
        // Faz o pedido para a API (por padrão, o fetch faz um GET)
        const resposta = await fetch(apiUrl);
        const registros = await resposta.json(); // Transforma o JSON em objeto JavaScript

        corpoTabela.innerHTML = ''; // Limpa o "Carregando..."

        if (registros.length === 0) {
            corpoTabela.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhum registro encontrado.</td></tr>';
            return;
        }

        // Para cada registro que a API devolveu, cria uma linha na tabela
        registros.forEach(registro => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${registro.id}</td>
                <td>${registro.nome}</td>
                <td>${registro.descricao}</td>
                <td class="acoes-botoes">
                    <button class="btn-secundario" onclick="prepararEdicao(${registro.id}, '${registro.nome}', '${registro.descricao}')">Editar</button>
                    <button class="btn-excluir" onclick="deletarRegistro(${registro.id})">Excluir</button>
                </td>
            `;
            corpoTabela.appendChild(tr);
        });
    } catch (erro) {
        console.error('Erro ao buscar registros:', erro);
    }
}

// 2. SALVAR (POST ou PUT) - Envia os dados do formulário para a API
formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault(); // Evita que a página recarregue ao enviar o form

    // Monta o "pacote" de dados no formato que o Spring espera (o nosso Model Java)
    const registro = {
        nome: inputNome.value,
        descricao: inputDescricao.value
    };

    const id = inputId.value;
    let metodoHttp = 'POST'; // Se não tem ID, é criação
    let urlSalvar = apiUrl;

    if (id) {
        metodoHttp = 'PUT'; // Se tem ID, é atualização
        urlSalvar = `${apiUrl}/${id}`; // Ex: http://localhost:8080/api/registros/1
    }

    try {
        // Envia o pacote para o Spring Boot
        await fetch(urlSalvar, {
            method: metodoHttp,
            headers: {
                'Content-Type': 'application/json' // Avisa a API que estamos mandando JSON
            },
            body: JSON.stringify(registro) // Transforma o objeto JS em texto JSON
        });

        fecharModal();
        carregarRegistros(); // Recarrega a tabela para mostrar o dado novo
    } catch (erro) {
        console.error('Erro ao salvar:', erro);
    }
});

// 3. DELETAR (DELETE) - Pede para a API apagar um registro
async function deletarRegistro(id) {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        try {
            await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            });
            carregarRegistros(); // Recarrega a tabela após apagar
        } catch (erro) {
            console.error('Erro ao deletar:', erro);
        }
    }
}

// --- Funções de Interface (Abrir/Fechar Modal) ---

function abrirModalNovo() {
    inputId.value = '';
    inputNome.value = '';
    inputDescricao.value = '';
    modalTitulo.innerText = 'Novo Registro';
    modalForm.classList.remove('escondido');
}

function prepararEdicao(id, nome, descricao) {
    inputId.value = id;
    inputNome.value = nome;
    inputDescricao.value = descricao;
    modalTitulo.innerText = 'Editar Registro';
    modalForm.classList.remove('escondido');
}

function fecharModal() {
    modalForm.classList.add('escondido');
}

// Ligando os botões da tela às funções
document.getElementById('btn-novo').addEventListener('click', abrirModalNovo);
document.getElementById('btn-cancelar').addEventListener('click', fecharModal);

// Inicia o carregamento assim que o arquivo é lido
carregarRegistros();
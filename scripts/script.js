/*
onload = function () {
    console.log('Página carregada!')
}
*/

/*
-------------------------------------------------------- 
Função para obter a lista de produtos via requisição GET
--------------------------------------------------------
*/

const getProdutos = () => {
    let url = 'http://127.0.0.1:5000/produtos';
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            data.produtos.forEach(element => insertList(element.nome, element.quantidade, element.tipo, element.data_atualizacao));
        })
        .catch((error) => {
            console.error('Error:', error);
        })

}

const getProduto = (produto) => {

    let url = 'http://127.0.0.1:5000/produto?nome=' + produto;
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        })
}

/*
------------------------------------------------------------------- 
Função para exibir na interface os produtos já cadastrados no banco
-------------------------------------------------------------------
*/
const insertList = (name, quantity, type, lastUpdate) => {
    
    let product = [name, quantity, type, lastUpdate];
    let table = document.getElementById('productTable');
    let row = table.insertRow();
    row.className = 'productRow';

    /*Popula tabela*/
    for (let i = 0; i < product.length; i++) {
        let cel = row.insertCell(i);
        cel.textContent = product[i];
    }

    /*insere células com botões de editar e deletar no final das linhas da tabela*/
    insertButton(row.insertCell(-1), "edit", "Editar", name, quantity, type)
    insertButton(row.insertCell(-1), "delete", "Excluir", name)

    /*Limpa inputs de adição de produtos*/
    document.getElementById("productNameInput").value = "";
    document.getElementById("productQuantityInput").value = "";
    document.getElementById("productTypeInput").value = "";
}

/*
---------------------------------------- 
Função para inserir botões dinamicamente
----------------------------------------
*/
const insertButton = (parent, action, textNode, productName, productQuantity, productType) => {
    let span = document.createElement("span");
    let txt = document.createTextNode(textNode);
    
    span.appendChild(txt);
    parent.appendChild(span);

    if (action == 'delete'){
        span.className = "delete-btn";
        span.addEventListener('click', function(){ deleteProduct(productName); });
    }

    if (action == 'edit'){
        span.className = "edit-btn";
        span.addEventListener('click', function(){ showEditModal(productName, productQuantity, productType); });
    }

}

/*
-------------------------------------------------------------------- 
Função para adicionar produtos no banco de dados via requisição post
--------------------------------------------------------------------
*/
const postProduct = (name, quantity, type) => {
    const formData = new FormData();
    formData.append('nome', name);
    formData.append('quantidade', quantity);
    formData.append('tipo', type);

    let url = 'http://127.0.0.1:5000/produto';
    fetch(url, {
        method: 'post',
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.nome) {
            insertList(data.nome, data.quantidade, data.tipo, data.data_atualizacao)
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        })

}

const newProduct = () => {
    let name = document.getElementById("productNameInput").value;
    let quantity = document.getElementById("productQuantityInput").value;
    let type = document.getElementById("productTypeInput").value;

    /* Remove espaços em branco do início e do final do nome antes de enviar para o banco*/
    name = name.trim();
    type = type.trim();
    console.log(quantity)

    console.log(`,${name},` + " " + quantity + " " + type)
    if (name === "") {
        alert("Não é possível adicionar um produto sem nome!")
    }
    else if (quantity < 0 || quantity === "") {
        quantity = 0;
        postProduct(name, quantity, type);
    }
    else {
        postProduct(name, quantity, type);
    }


}

const refreshList = () => {
    const productList = document.querySelectorAll('.productRow');
    productList.forEach(item => {
        item.remove();
    })
    getProdutos();
}

const deleteProduct = (product) => {
    console.log(`produto ${product} deletado!`);

    let url = `http://127.0.0.1:5000/produto?nome=${product}`;
    fetch(url, {
        method: 'delete',
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message == 'Produto Removido') {
                console.log("mensagem aqui")
                refreshList();
            }
            console.log(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        })
}

/* Função que exibe modal de edição*/
const showEditModal = (product, quantity, type) => {

    /* Exibe modal */
    modal = document.getElementById("editModal");
    modal.style.display = "block";

    /* Preenche campos com valores atuais do produto */
    nameInput = document.getElementById("editNameInput");
    nameInput.value = product;

    quantityInput = document.getElementById("editQuantityInput");
    quantityInput.value = quantity;

    typeInput = document.getElementById("editTypeInput");
    typeInput.value = type;

    /* Cancela e fecha modal*/
    cancelButton = document.getElementById("cancelModal");
    cancelButton.addEventListener('click', function eventHandler() { 
        cancelModal(); 
        this.removeEventListener('click', eventHandler);
    });

    /* Executa função de edição com valores preenchidos nos campos */
    confirmButton = document.getElementById("confirmModal");
    confirmButton.addEventListener('click', function eventHandler() { 
        confirmModal(product, nameInput.value, quantityInput.value, typeInput.value);
        this.removeEventListener('click', eventHandler);
    });
}


/* Função que define ações do botão de cancelar modal de edição*/
const cancelModal = () => {
    modal = document.getElementById("editModal");
    modal.style.display = "none";
}

/* Função que define ações do botão de confirmar modal de edição*/
const confirmModal = (oldName, name, quantity, type) => {
    console.log(`NomeAtual = ${oldName}, Nome = ${name}, quantidade = ${quantity}, tipo = ${type}`)
    
    putProduct(oldName, name, quantity, type);
    modal = document.getElementById("editModal");
    modal.style.display = "none";
}

const putProduct = (oldName, name, quantity, type) => {
    const formData = new FormData();
    formData.append("nome", oldName);
    formData.append('nome_novo', name);
    formData.append('quantidade_nova', quantity);
    formData.append('tipo_novo', type);

    let url = 'http://127.0.0.1:5000/produto';
    fetch(url, {
        method: 'put',
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.message == "Produto atualizado!") {
                refreshList();
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            controler
        })
}

const controller = new AbortController();
const signal = controller.signal;

getProdutos();
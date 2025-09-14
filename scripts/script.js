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
    insertButton(row.insertCell(-1), "editCell", "Editar")
    insertButton(row.insertCell(-1), "deleteCell", "Excluir")

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
const insertButton = (parent, buttonClass, textNode) => {
    let span = document.createElement("span");
    let txt = document.createTextNode(textNode)
    span.className = buttonClass;
    span.appendChild(txt);
    parent.appendChild(span);
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
        .then(function (data) {
            if (data.nome){
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
    console.log(name + " " + quantity + " " + type)

    if (name === "") {
        alert("Não é possível adicionar um produto sem nome!")
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

getProdutos();
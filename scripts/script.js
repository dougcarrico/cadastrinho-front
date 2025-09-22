let editingProduct;
let toasts = [];

const getProdutos = () => {

    let url = 'http://127.0.0.1:5000/produtos';

    let responseData;
    let responseStatus;
    let responseOk;
    
    fetch(url, {
        method: 'get',
    })
        .then((response) => {
            
            responseData = response.json();
            responseStatus = response.status;
            responseOk = response.ok;

            return responseData

        })

        .then((data) => {     
            
            if (responseOk) {

                data.produtos.forEach(element => insertList(element.nome, element.quantidade, element.tipo, element.data_atualizacao));

                showToast('success', 'Lista de produtos atualizada com sucesso!', 3000);

            }   
            
            else {
                showToast('error', 'Houve um erro ao listar os produtos!');
            }
        })

        .catch((error) => console.error('Error:', error))

}

const getProduto = (produto) => {

    let url = 'http://127.0.0.1:5000/produto?nome=' + produto;
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        
        .then((data) => {
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
    insertButton(row.insertCell(-1), "edit", name, quantity, type)
    insertButton(row.insertCell(-1), "delete", name)

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
const insertButton = (parent, action, productName, productQuantity, productType) => {

    let div = document.createElement("div");

    const editSvgCode = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>'
    const deleteSvgCode = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>'
    
    parent.appendChild(div);

    if (action == 'delete'){
        div.className = "delete-btn";
        div.innerHTML = deleteSvgCode;
        div.addEventListener('click', function(){ deleteProduct(productName); });
    }

    if (action == 'edit'){
        div.className = "edit-btn";
        div.innerHTML = editSvgCode;
        div.addEventListener('click', function(){ showEditModal(productName, productQuantity, productType); });
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

    let responseData;
    let responseStatus;
    let responseOk;

    let url = 'http://127.0.0.1:5000/produto';
    fetch(url, {
        method: 'post',
        body: formData
    })
       .then((response) => {
        responseData = response.json();
        responseStatus = response.status;
        responseOk = response.ok;

        return responseData
    })
        .then((data) => {
            if (responseOk) {
                refreshList();
                showToast('success', 'Produto cadastrado com sucesso!');
            }
            else if (!isNaN(parseInt(name))) {
                showToast('error', 'O nome não pode ser um número!');
            }
            else if (data.message && data.message == "Erro de integridade: UNIQUE constraint failed: produto.nome") {
                showToast('error', 'O produto já existe!');
            }
            else if (!isNaN(parseInt(type))) {
                showToast('error', 'O tipo não pode ser um número!');
            }  
            else {
                showToast('error', 'Houve um erro ao cadastrar o produto!');
            }    
        })
        .catch((error) => {
            console.error('Error:', error);})

}

const newProduct = () => {

    let name = document.getElementById("productNameInput").value;
    let quantity = document.getElementById("productQuantityInput").value;
    let type = document.getElementById("productTypeInput").value;

    /* Remove espaços em branco do início e do final do nome e tipo antes de enviar para o banco*/
    name = name.trim();
    type = type.trim();

    if (name === "") {
        showToast('error', 'O produto precisa ter nome!');
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

    let url = `http://127.0.0.1:5000/produto?nome=${product}`;

    let responseData;
    let responseStatus;
    let responseOk;

    fetch(url, {
        method: 'delete',
    })
        .then((response) => {

            responseData = response.json();
            responseStatus = response.status;
            responseOk = response.ok;

            return responseData
        })

        .then((data) => {

            if (responseOk) {
                refreshList();
                showToast('success', 'Produto removido com sucesso!');
            }
            else {
                showToast('error', 'Houve um erro remover o produto!');
            }   

        })

        .catch((error) => {
            console.error('Error:', error);
        })
}

/* Função que exibe modal de edição*/
const showEditModal = (product, quantity, type) => {

    editingProduct = product;

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

    /* Se clicar no botão, chama função para cancelar e fechar o*/
    document.getElementById("cancelModal").addEventListener('click', cancelModal);
    document.getElementById("closeModal").addEventListener('click', cancelModal);

    /* Executa função de edição com valores preenchidos nos campos */
    document.getElementById("confirmModal").addEventListener('click', confirmModal);
}


/* Função que define ações do botão de cancelar modal de edição*/
const cancelModal = () => {

    document.getElementById("cancelModal").removeEventListener('click', cancelModal);
    document.getElementById("closeModal").removeEventListener('click', cancelModal);
    document.getElementById("confirmModal").removeEventListener('click', confirmModal);

    modal = document.getElementById("editModal");
    modal.style.display = "none";
}

/* Função que define ações do botão de confirmar modal de edição*/
const confirmModal = () => {

    let name = document.getElementById("editNameInput").value;
    let quantity = document.getElementById("editQuantityInput").value;
    let type = document.getElementById("editTypeInput").value;
    
    name = name.trim();
    type = type.trim();

    if (name === "") {
        showToast('error', 'O produto precisa ter nome!');
    }

    else if (quantity < 0 || quantity === "") {
        quantity = 0;
        putProduct(editingProduct, name, quantity, type);
        modal = document.getElementById("editModal");
        modal.style.display = "none";

        document.getElementById("cancelModal").removeEventListener('click', cancelModal);
        document.getElementById("closeModal").removeEventListener('click', cancelModal);
        document.getElementById("confirmModal").removeEventListener('click', confirmModal);

        editingProduct = null;
    }
    else {
        putProduct(editingProduct, name, quantity, type);
        modal = document.getElementById("editModal");
        modal.style.display = "none";

        document.getElementById("cancelModal").removeEventListener('click', cancelModal);
        document.getElementById("closeModal").removeEventListener('click', cancelModal);
        document.getElementById("confirmModal").removeEventListener('click', confirmModal);

        editingProduct = null;
    }
    
}

const putProduct = (oldName, name, quantity, type) => {
    const formData = new FormData();
    formData.append("nome", oldName);
    formData.append('nome_novo', name);
    formData.append('quantidade_nova', quantity);
    formData.append('tipo_novo', type);

    let responseData;
    let responseStatus;
    let responseOk;

    let url = 'http://127.0.0.1:5000/produto';

    fetch(url, {
        method: 'put',
        body: formData
    })
        .then((response) => {
            responseData = response.json();
            responseStatus = response.status;
            responseOk = response.ok;

            return responseData
        })

        .then((data) => {

            if (responseOk) {
                refreshList();
                showToast('success', 'Produto editado com sucesso!');
            }

            else if (!isNaN(parseInt(name))) {
                showToast('error', 'Erro ao editar o produto. O nome não pode ser um número!');
            }
            else if (data.message && data.message == "Erro de integridade: UNIQUE constraint failed: produto.nome") {
                showToast('error', 'Erro ao editar o produto. O nome escolhido já existe!');
            }
            else if (!isNaN(parseInt(type))) {
                showToast('error', 'Erro ao editar o produto. O tipo não pode ser um número!');
            }  
            else {
                showToast('error', 'Houve um erro ao editar o produto!');
            }  

        })

        .catch((error) => {

            console.error('Error:', error);
            showToast('error', 'Houve um erro ao editar o produto');

        })
}

const showToast = (status, message, timeout = 5000) => {

    /* Adiciona o toast na lista de toasts ativos */
    let toastID = toasts.length;
    toasts.push({toastID, message});

    console.log("toastslength= " + toasts.length)
    console.log("toastID= "+ toastID);
    console.log(toasts);

    /* Define atributos do toast e seu conteúdo */
    let toastDiv = document.createElement('div');
    toastDiv.id = `toast${toastID}`;
    toastDiv.className = `toast-${status}`;
    let toastContent = `<span>${message}</span>`

    /* Adiciona toast no local con os atributos e conteúdo definidos */
    parent = document.getElementById("toastWrapper");
    parent.appendChild(toastDiv);
    toastDiv.innerHTML = toastContent;

    setTimeout(closeToast, timeout, toastID);
    
}

const closeToast = (toastID) => {

    toast = document.getElementById(`toast${toastID}`);
    console.log(toast)

    if (toast) {
        toast.remove();
    }

}

getProdutos();
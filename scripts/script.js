let editingProduct;
let toasts = [];


/*
------------------------------------------------------------------- 
Função para fazer chamada à API para listar todos os produtos
-------------------------------------------------------------------
*/
const getProducts = () => {

    let url = 'http://127.0.0.1:5000/products';

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

            return responseData;

        })

        .then((data) => {     
            
            if (responseOk) {

                data.products.forEach(element => insertList(element.name, element.quantity, element.type, element.date_updated));

                showToast('success', 'Lista de produtos atualizada com sucesso!', 3000);

            }   
            
            else {
                showToast('error', 'Houve um erro ao listar os produtos!');
            }
        })

        .catch((error) => console.error('Error:', error));

}

/*
------------------------------------------------------------------- 
Função para fazer chamada à API sobre um produto especifico (NÃO UTILIZADA)
-------------------------------------------------------------------
*/
const getProduct = (product) => {

    let url = 'http://127.0.0.1:5000/product?name=' + product;
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
    let table = document.getElementById('product-table');
    let row = table.insertRow();
    row.className = 'productRow';

    /*Popula tabela*/
    for (let i = 0; i < product.length; i++) {

        let cel = row.insertCell(i);
        cel.textContent = product[i];
        
    }

    /*insere células com botões de editar e deletar no final das linhas da tabela*/
    insertProductActionButton(row.insertCell(-1), "edit", name, quantity, type)
    insertProductActionButton(row.insertCell(-1), "delete", name)

    /*Limpa inputs de adição de produtos*/
    document.getElementById("product-name-input").value = "";
    document.getElementById("product-quantity-input").value = "";
    document.getElementById("product-type-input").value = "";
}

/*
---------------------------------------- 
Função para inserir botões dinamicamente
----------------------------------------
*/
const insertProductActionButton = (parent, action, productName, productQuantity, productType) => {

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
        div.addEventListener('click', function(){ showProductEditModal(productName, productQuantity, productType); });
    }

}

/*
-------------------------------------------------------------------- 
Função para adicionar produtos no banco de dados via requisição post
--------------------------------------------------------------------
*/
const postProduct = (name, quantity, type) => {

    const formData = new FormData();
    formData.append('name', name);
    formData.append('quantity', quantity);
    formData.append('type', type);

    let responseData;
    let responseStatus;
    let responseOk;

    let url = 'http://127.0.0.1:5000/product';
    fetch(url, {
        method: 'post',
        body: formData
    })
       .then((response) => {
        responseData = response.json();
        responseStatus = response.status;
        responseOk = response.ok;

        return responseData;
    })
        .then((data) => {
            if (responseOk) {
                refreshProductList();
                showToast('success', 'Produto cadastrado com sucesso!');
            }
            else if (!isNaN(parseInt(name))) {
                showToast('error', 'O nome não pode ser um número!');
            }
            else if (data.message && data.message == "Erro de integridade: UNIQUE constraint failed: product.name") {
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
            console.error('Error:', error);});

}


/*
-------------------------------------------------------------------- 
Função para coletar e verificar informações para cadastro de novo produto
--------------------------------------------------------------------
*/
const newProduct = () => {

    let name = document.getElementById("product-name-input").value;
    let quantity = document.getElementById("product-quantity-input").value;
    let type = document.getElementById("product-type-input").value;

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


/*
-------------------------------------------------------------------- 
Função para recarregar lista de produtos
--------------------------------------------------------------------
*/
const refreshProductList = () => {

    const productList = document.querySelectorAll('.productRow');
    productList.forEach(item => {
        item.remove();
    })

    getProducts();
}

/*
-------------------------------------------------------------------- 
Função para fazer chamada à API para remover um produto
--------------------------------------------------------------------
*/
const deleteProduct = (product) => {

    let url = `http://127.0.0.1:5000/product?name=${product}`;

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

            return responseData;
        })

        .then((data) => {

            if (responseOk) {
                refreshProductList();
                showToast('success', 'Produto removido com sucesso!');
            }
            else {
                showToast('error', 'Houve um erro remover o produto!');
            }   

        })

        .catch((error) => {
            console.error('Error:', error);
        });
}


/*
-------------------------------------------------------------------- 
Função que exibe modal de edição
--------------------------------------------------------------------
*/
const showProductEditModal = (product, quantity, type) => {

    editingProduct = product;

    /* Exibe modal */
    modal = document.getElementById("product-edit-modal");
    modal.style.display = "flex";

    /* Preenche campos com valores atuais do produto */
    nameInput = document.getElementById("edit-name-input");
    nameInput.value = product;

    quantityInput = document.getElementById("edit-quantity-input");
    quantityInput.value = quantity;

    typeInput = document.getElementById("edit-type-input");
    typeInput.value = type;

    /* Se clicar no botão, chama função para cancelar e fechar o*/
    document.getElementById("cancel-product-edit-modal").addEventListener('click', cancelProductEditModal);
    document.getElementById("close-product-edit-modal").addEventListener('click', cancelProductEditModal);

    /* Executa função de edição com valores preenchidos nos campos */
    document.getElementById("confirm-product-edit-modal").addEventListener('click', confirmProductEditModal);
}

/*
-------------------------------------------------------------------- 
Função que define ações do botão de cancelar modal de edição
--------------------------------------------------------------------
*/
const cancelProductEditModal = () => {

    document.getElementById("cancel-product-edit-modal").removeEventListener('click', cancelProductEditModal);
    document.getElementById("close-product-edit-modal").removeEventListener('click', cancelProductEditModal);
    document.getElementById("confirm-product-edit-modal").removeEventListener('click', confirmProductEditModal);

    modal = document.getElementById("product-edit-modal");
    modal.style.display = "none";
}

/*
-------------------------------------------------------------------- 
Função que define ações do botão de confirmar modal de edição
--------------------------------------------------------------------
*/
const confirmProductEditModal = () => {

    let name = document.getElementById("edit-name-input").value;
    let quantity = document.getElementById("edit-quantity-input").value;
    let type = document.getElementById("edit-type-input").value;
    
    name = name.trim();
    type = type.trim();

    if (name === "") {
        showToast('error', 'O produto precisa ter nome!');
    }

    else if (quantity < 0 || quantity === "") {
        quantity = 0;
        putProduct(editingProduct, name, quantity, type);
        modal = document.getElementById("product-edit-modal");
        modal.style.display = "none";

        document.getElementById("cancel-product-edit-modal").removeEventListener('click', cancelProductEditModal);
        document.getElementById("close-product-edit-modal").removeEventListener('click', cancelProductEditModal);
        document.getElementById("confirm-product-edit-modal").removeEventListener('click', confirmProductEditModal);

        editingProduct = null;
    }
    else {
        putProduct(editingProduct, name, quantity, type);
        modal = document.getElementById("product-edit-modal");
        modal.style.display = "none";

        document.getElementById("cancel-product-edit-modal").removeEventListener('click', cancelProductEditModal);
        document.getElementById("close-product-edit-modal").removeEventListener('click', cancelProductEditModal);
        document.getElementById("confirm-product-edit-modal").removeEventListener('click', confirmProductEditModal);

        editingProduct = null;
    }
    
}

/*
-------------------------------------------------------------------- 
Função para fazer chamada para cadastro de produto na API
--------------------------------------------------------------------
*/
const putProduct = (oldName, name, quantity, type) => {
    const formData = new FormData();
    formData.append("name", oldName);
    formData.append('new_name', name);
    formData.append('new_quantity', quantity);
    formData.append('new_type', type);

    let responseData;
    let responseStatus;
    let responseOk;

    let url = 'http://127.0.0.1:5000/product';

    fetch(url, {
        method: 'put',
        body: formData
    })
        .then((response) => {
            responseData = response.json();
            responseStatus = response.status;
            responseOk = response.ok;

            return responseData;
        })

        .then((data) => {

            if (responseOk) {
                refreshProductList();
                showToast('success', 'Produto editado com sucesso!');
            }

            else if (!isNaN(parseInt(name))) {
                showToast('error', 'Erro ao editar o produto. O nome não pode ser um número!');
            }
            else if (data.message && data.message == "Erro de integridade: UNIQUE constraint failed: product.name") {
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

        });
}

/*
-------------------------------------------------------------------- 
Função para exibir toast
--------------------------------------------------------------------
*/
const showToast = (status, message, timeout = 5000) => {

    /* Adiciona o toast na lista de toasts ativos */
    let toastID = toasts.length;
    toasts.push({toastID, message});

    /* Define atributos do toast e seu conteúdo */
    let toastDiv = document.createElement('div');
    toastDiv.id = `toast${toastID}`;
    toastDiv.className = `toast-${status}`;
    let toastContent = `<span>${message}</span>`;

    /* Adiciona toast no local con os atributos e conteúdo definidos */
    parent = document.getElementById("toast-wrapper");
    parent.appendChild(toastDiv);
    toastDiv.innerHTML = toastContent;

    setTimeout(closeToast, timeout, toastID);
    
}

/*
-------------------------------------------------------------------- 
Função para fechar toast
--------------------------------------------------------------------
*/
const closeToast = (toastID) => {
    /* Seleciona o toast*/
    toast = document.getElementById(`toast${toastID}`);

    /* Remove o toast se ele existir*/
    if (toast) {
        toast.remove();
    }

}

/*
-------------------------------------------------------------------- 
Função para validar os inputs antes de fazer as chamadas às APIs de CEP
--------------------------------------------------------------------
*/
const validateShippingCalculateInputs = () => {
    let fromPostalCode = document.getElementById("from-postal-code").value;
    let toPostalCode = document.getElementById("to-postal-code").value;
    let packageHeight = document.getElementById("package-height").value;
    let packageWidth = document.getElementById("package-width").value;
    let packageLenght = document.getElementById("package-lenght").value;
    let packageWeight = document.getElementById("package-weight").value;

    /* Verifica se algum campo está vazio*/
    if (fromPostalCode == "" || 
        toPostalCode == "" || 
        packageHeight == "" ||
        packageWidth == "" ||
        packageLenght == "" ||
        packageWeight == ""
    ) {
        showToast('error', 'Você precisa preencher todos os campos!');
    }
    else {

        document.getElementById("from-postal-code-information").style.display = "none";
        document.getElementById("to-postal-code-information").style.display = "none";

        getPostalCodeInformation(fromPostalCode, "from-postal-code-information");
        getPostalCodeInformation(toPostalCode, "to-postal-code-information");

        postShippingCalculate();
    }

}

/*
-------------------------------------------------------------------- 
Função de chamada get à API externa Brasil Api CEP v2
--------------------------------------------------------------------
*/
const getPostalCodeInformation = (postal_code, divId) => {
    
    let url = `https://brasilapi.com.br/api/cep/v2/${postal_code}`;

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
            return responseData;

        })

        .then((data) => {     
            
            if (responseOk) {

                insertPostalCodeInformation(divId, data.state, data.city, data.neighborhood, data.street);
            }   
            
            else {
                showToast('error', `Houve um erro ao consultar o CEP ${postal_code}!`);
            }
        })

        .catch((error) => console.error('Error:', error));
}


/*
-------------------------------------------------------------------- 
Função para adicionar informação do CEP no modal de cálculo de CEP
--------------------------------------------------------------------
*/
const insertPostalCodeInformation = (divId, state, city, neighborhood, street) => {

    let informationDivId = document.getElementById(divId);
    let informationDivContent = `${street}, ${neighborhood}, ${city} - ${state}`;

    document.getElementById(divId).style.display = "flex";
    
    informationDivId.innerHTML = informationDivContent;
}


/*
-------------------------------------------------------------------- 
Função para chamada tipo post à API para cálculo de frete
--------------------------------------------------------------------
*/
const postShippingCalculate = () => {

    let url = 'http://127.0.0.1:5000/shipping_calculate';

    let fromPostalCode = document.getElementById("from-postal-code").value;
    let toPostalCode = document.getElementById("to-postal-code").value;
    let packageHeight = document.getElementById("package-height").value;
    let packageWidth = document.getElementById("package-width").value;
    let packageLenght = document.getElementById("package-lenght").value;
    let packageWeight = document.getElementById("package-weight").value;

    /*certifica de trocar o separador , para . */
    packageWeight = packageWeight.replace(/,/g, '.');

    const formData = new FormData();
    formData.append('from_postal_code', fromPostalCode);
    formData.append('to_postal_code', toPostalCode);
    formData.append('package_height', packageHeight);
    formData.append('package_width', packageWidth);
    formData.append('package_lenght', packageLenght);
    formData.append('package_weight', packageWeight);

    let responseData;
    let responseStatus;
    let responseOk;

    fetch(url, {
        method: 'POST',
        body: formData
    })
        .then((response) => {
            
            responseData = response.json();
            responseStatus = response.status;
            responseOk = response.ok;

            return responseData;

        })

        .then((data) => {     
            
            if (responseOk) {

                refreshShippingCalculateTable();

                data.forEach(element => {

                    if (element.custom_price){
                    insertShippingCalculateTable(element.company.picture, element.company.name, element.name, element.custom_price, element.custom_delivery_time)
                    }

                });

                showToast('success', 'Cálculo de frete feito com sucesso!', 3000);

            }   
            
            else {
                showToast('error', 'Houve um erro no calculo do frete!');
            }
        })

        .catch((error) => {
            console.error('Error:', error);
        });
        

}

/*
------------------------------------------------------------------- 
Função para popular a tabela de calculo de frete
-------------------------------------------------------------------
*/
const insertShippingCalculateTable = (companyPicture, company, shippingMode, price, deliveryTime) => {

    let companyImgCelContent = `<img src=${companyPicture} width=60px alt=${company}>`;

    let shippingInformation = [companyImgCelContent, company, shippingMode, price, `${deliveryTime} dias úteis`];
    let table = document.getElementById('shipping-calculate-table');
    let tableWrapper = document.getElementById('shipping-calculate-table');

    /*Exibe a tabela*/
    tableWrapper.style.display = "table";

    let row = table.insertRow();
    row.className = 'shipping-information-row';
    

    /*Popula tabela*/

    for (let i = 0; i < shippingInformation.length; i++) {
        let cel = row.insertCell(i);

        if (i == 0){
            cel.innerHTML = shippingInformation[0];
        }

        else {
            cel.textContent = shippingInformation[i];
        }
    }
}

/*
------------------------------------------------------------------- 
Função para limpar tabela existente de calculo de frete
-------------------------------------------------------------------
*/
const refreshShippingCalculateTable = () => {

    const ShippingCalculateTableList = document.querySelectorAll('.shipping-information-row');
    ShippingCalculateTableList.forEach(item => {
        item.remove();
    })

}

/*
------------------------------------------------------------------- 
Função que exibe modal de cálculo de frete
-------------------------------------------------------------------
*/
const showShippingCalculateModal = () => {

    /* Exibe modal */
    modal = document.getElementById("shipping-calculate-modal");
    modal.style.display = "flex";

    /* Se clicar no botão, chama função para e fechar o modal de calculo de frete*/
    document.getElementById("close-shipping-calculate-modal").addEventListener('click', closeShippingCalculeteModal);

}

/*
------------------------------------------------------------------- 
Função que define ações do botão de fechar modal de calculo de frete
-------------------------------------------------------------------
*/
const closeShippingCalculeteModal = () => {

    document.getElementById("close-shipping-calculate-modal").removeEventListener('click', closeShippingCalculeteModal);

    modal = document.getElementById("shipping-calculate-modal");
    modal.style.display = "none";
}

getProducts();
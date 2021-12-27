
  
'use strict'

//Open customer registration window
const openModal = () => document.getElementById('modal')
    .classList.add('active')


//Close customer registration window
const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')   
}

//Acess Local Storage
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem('db_client', JSON.stringify(dbClient))

//CRUD - Create, read, uptate and delete client
const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage()

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index,1)
    setLocalStorage(dbClient)
}

//Check if it is valid field
const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Layout Interaction

//Clear Fields
const clearFields = () => {
    const fields1 = document.querySelectorAll('.modal-field')
    fields1.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

//Save Client
const saveClient = () => {
    if (isValidFields()) {
        const client = {
            id: document.getElementById('nome').dataset.index,
            nome: document.getElementById('nome').value,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value,
            datanasc: document.getElementById('datanasc').value
        }
        const index = document.getElementById('nome').dataset.index
        //If it is a new client
        if(index == 'new'){
            createClient(client)
            updateTable()
            closeModal()
        //If it isn't a new client
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }
}

//Create a new Row to include the new client
const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${index}</td>
        <td>${client.nome}</td>
        <td>${client.telefone}</td>
        <td>${client.email}</td>
        <td>${client.datanasc}</td>
        <td>
            <input type="checkbox" id="ativo" class="form-check-input value=${ativo.checked}">
        </td>
            <td>
            <button type='button' class='button blue' id='edit-${index}'>Editar</button>
            <button type='button' class='button red' id='delet-${index}'>Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

//Clear the Table
const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

//Uptade the Table
const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

//Fill empty Fields
const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('telefone').value = client.telefone
    document.getElementById('email').value = client.email
    document.getElementById('datanasc').value = client.datanasc
    document.getElementById('ativo').value = client.checked
    document.getElementById('nome').dataset.index = client.index
    
}

//Edit Client
const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}


//Check the action to will be execute(edit or delete)
const editDelete = (event) => {
    if(event.target.type == 'button'){
        
        const [action,index] = event.target.id.split('-')

        if(action == 'edit'){
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if (response){
                deleteClient(index)
                updateTable()
            }
        }
    }
        
}

updateTable()

//Events

//Open customer registration window
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

//Close customer registration window
document.getElementById('modalClose')
    .addEventListener('click', closeModal)

//Save and Close customer window if pressed the button 'Salvar'
document.getElementById('salvar')
    .addEventListener('click', saveClient)

//Open customer edition window if pressed the button 'Editar'
document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)

//Close customer window if pressed the button 'Cancelar'
document.getElementById('cancelar')
    .addEventListener('click', closeModal)
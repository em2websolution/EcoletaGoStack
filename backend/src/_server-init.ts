import express from 'express';
// Instalar a Definição de tipos para ter acesso as funcoes de cada pacote
const app = express();

app.use(express.json());

// Colocar uma funcionalidade do express para entender o formato json
// app.use(express.json)

// Rota: Endereço completo da requisição
// Recurso: Qual entidade estamos acessando do sistema

// GET: Buscar informações do backend
// POST: Criar uma nova informação do backend
// PUT: Atualizar uma informação do backend 
// DELETE: Remover uma informação do backend

// TRADICIONAL: SELECT * FROM USER WHERE NAME = 'EDU'
// JAVASCRIPT: knex('user').where.('name', 'Edu').select('*')
  
const users = [ 
  'Edu',
  'Freak'
];

app.get('/users/', (request, response) => {
  //Query param > Requisição de parametros da url
  const search = String(request.query.search);
  const filteredUsers = search ? users.filter(user => user.includes(search)) : users;

  console.log('Lista usuário: ' + filteredUsers);
  return response.json(filteredUsers);

})

app.get('/users/:id', (request, response) => {
  // Request Param > Parametros que vem da própria roda que identifica um recurso
  const id = Number(request.params.id);
  const user = users[id];

  console.log('Listagem de usuários: ' + user);
  return response.json(user);

})

app.post('/users', (request, response) => {
  // Request Body > Parametros para criação/atualização de informações para o backend

  const data = request.body;

  const user = {
    name: data.name,
    email: data.email,
  }; 

  console.log('Novo usuário: '+ data);
  return response.json(user);


});

app.listen(3333);

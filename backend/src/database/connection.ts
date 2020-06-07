import knex from "knex";

const connection = knex({
  client: 'postgresql',
  connection: {
    host : '127.0.0.1',
    user : 'Edu',
    password : '',
    database : 'ecoleta'
  }
})

export default connection;

// Migration = historico do banco de dados
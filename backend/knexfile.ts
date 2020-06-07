// Update with your config settings.
import path from 'path';

module.exports = {
  client: 'postgresql',
  connection: {
    host : '127.0.0.1',
    user : 'Edu',
    password : '',
    database : 'ecoleta'
  },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  },
  seeds: {
    directory: path.resolve(__dirname, 'src', 'database', 'seeds')
  },
  useNullAsDefault: true,
};

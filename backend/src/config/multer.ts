import multer from 'multer'; // upload
import path from 'path';     //pasta que vai salvar os uploads
import crypto from 'crypto'; //gerar caracteres aleatorios

export default {
  // stanciando multer
  storage: multer.diskStorage({
    //Path para resolver o caminho do sistema
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    
    //função para gerar um nome unico para o arquivo
    filename(request, file, callback) {
      const hash = crypto.randomBytes(6).toString('hex');
      const fileName = `${hash}-${file.originalname}`;
      return callback(null, fileName);
    },
  }),
};
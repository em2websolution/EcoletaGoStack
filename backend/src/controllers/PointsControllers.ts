import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
  async index(request: Request, response: Response) {
    //Pegar variaveis da URL
    const { city, uf, items } = request.query;

    //transformar items de string para array 
    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');
    
      const serializedPoints = points.map(point => {
        return {
          ...point,
          image_url: `http://172.20.10.2:3333/uploads/${point.image}`,
        };
      });

    return response.json(serializedPoints);
  }
  async show(request: Request, response: Response) {
    //request da variavel
    const { id } = request.params;
    
    //select no banco
    const point = await knex('points').where('id', id).first();

    //teste se veio dados
    if (!point){
      return response.status(400).json({ message: 'Point not found.' })
    }

    const serializedPoint = {
      ...point,
      image_url: `http://172.20.10.2:3333/uploads/${point.image}`,
    };

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title')
      .catch( (error) => {
        return response.json({ Error: error});
        }
      );

    return response.json({ point: serializedPoint, items });
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    console.log("Backend: ", request.file.filename);    

    // Aguarda as transções de banco de dados serem executadas uma apos a outra.
    // Ideal quando temos 2 INSERT no mesmo processo.
    const trx = await knex.transaction();
  
    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf   
    };

    const insertedIds = await trx('points').insert(point, 'id');
  
    const point_id = insertedIds[0];
  
    // Divide os dados (split), converter string sem espaço para numero (map, trim)
    const pointItems = items
      .split(",")
      .map(item => Number(item.trim()))
      .map((item_id: number) => {
        return { 
          item_id, 
          point_id,
        };
      });
    
    await trx('point_items').insert(pointItems)
      .then( () => {
        trx.commit()
        return response.json({ 
          Success: true,
          id: point_id,
          ...point,
        });
      })
      .catch( (error) => {
        trx.rollback()
        return response.json({ Error: error, Message: items});
        }
      );

    };
    
};

export default PointsController;
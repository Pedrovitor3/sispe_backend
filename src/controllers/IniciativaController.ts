import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Iniciativa } from '../models/Iniciativa';


class IniciativaController {
  
  async create(request: Request, response: Response, next: NextFunction) {
    
    const { name, item, percentualExecutado, status, estrategia } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      percentualExecutado: yup.number().required(),
      status: yup.string().required(),    
      item: yup.string().required(),    
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceIniciativaRepository = APPDataSource.getRepository(Iniciativa);

    const iniciativa = resourceIniciativaRepository.create({
      name,
      item, 
      percentualExecutado, 
      status,
      estrategia,
    });

    await resourceIniciativaRepository.save(iniciativa);

    return response.status(201).json(iniciativa);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const resourceIniciativaRepository = APPDataSource.getRepository(Iniciativa);

    const all = await resourceIniciativaRepository.find();

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourceIniciativaRepository = APPDataSource.getRepository(Iniciativa);
    
    const { id } = request.params;

    const one = await resourceIniciativaRepository.findOne({ where: { id: id }});

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, item, percentualExecutado, status, estrategia } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string().required(),
      percentualExecutado: yup.number().required(),
      status: yup.string().required(),
      item: yup.string().required(),    
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceIniciativaRepository = APPDataSource.getRepository(Iniciativa);


    const iniciativaFull = await resourceIniciativaRepository.findOne({
      where: {id:id},
    });

    if(!iniciativaFull){
      return response.status(400).json({status: "iniciativa não encontrado"})
    }

    await resourceIniciativaRepository.save(iniciativaFull);

    const iniciativa = await resourceIniciativaRepository.update({
      id
    }, {
      name,
      item, 
      percentualExecutado, 
      status,
      estrategia,
    });

    return response.status(200).json(iniciativa);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const resourceIniciativaRepository = APPDataSource.getRepository(Iniciativa);

    let iniciativaToRemove = await resourceIniciativaRepository.findOneBy({ id: request.params.id });

    if (!iniciativaToRemove) {
      return response.status(400).json({status: "cartão não encontrado!"});
    }
      
    const deleteResponse = await resourceIniciativaRepository.softDelete(iniciativaToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({status: "cartão não excluido!"});
    }

    return response.json(iniciativaToRemove);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const resourceIniciativaRepository = APPDataSource.getRepository(Iniciativa);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await resourceIniciativaRepository.createQueryBuilder( 'iniciativa' )
      .take( parseInt(perPage.toString()) )
      .skip( skip )
      .addOrderBy( column.toString(), 'ASC' )
      .getMany();

    return response.json(all);
  }
  
  async token(request: Request, response: Response, next: NextFunction) {
    const id = 1;
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 43200,
    });

    return response.json({ auth: true, token });
  }
}

export { IniciativaController };
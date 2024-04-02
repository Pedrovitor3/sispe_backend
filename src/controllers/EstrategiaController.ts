import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Estrategia } from '../models/Estrategia';


class EstrategiaController {
  
  async create(request: Request, response: Response, next: NextFunction) {
    
    const { name, objetivo } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceEstrategiaRepository = APPDataSource.getRepository(Estrategia);

    const estrategia = resourceEstrategiaRepository.create({
      name,
      objetivo,
    });

    await resourceEstrategiaRepository.save(estrategia);

    return response.status(201).json(estrategia);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const resourceEstrategiaRepository = APPDataSource.getRepository(Estrategia);

    const all = await resourceEstrategiaRepository.find();

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourceEstrategiaRepository = APPDataSource.getRepository(Estrategia);
    
    const { id } = request.params;

    const one = await resourceEstrategiaRepository.findOne({ where: { id: id }});

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, objetivo } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceEstrategiaRepository = APPDataSource.getRepository(Estrategia);

    const estrategiaFull = await resourceEstrategiaRepository.findOne({
      where: {id:id},
    });

    if(!estrategiaFull){
      return response.status(400).json({status: "estrategia não encontrado"})
    }

    await resourceEstrategiaRepository.save(estrategiaFull);

    const estrategia = await resourceEstrategiaRepository.update({
      id
    }, {
      name,
      objetivo,
    });

    return response.status(200).json(estrategia);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const resourceEstrategiaRepository = APPDataSource.getRepository(Estrategia);

    let estrategiaToRemove = await resourceEstrategiaRepository.findOneBy({ id: request.params.id });

    if (!estrategiaToRemove) {
      return response.status(400).json({status: "cartão não encontrado!"});
    }
      
    const deleteResponse = await resourceEstrategiaRepository.softDelete(estrategiaToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({status: "cartão não excluido!"});
    }

    return response.json(estrategiaToRemove);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const resourceEstrategiaRepository = APPDataSource.getRepository(Estrategia);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await resourceEstrategiaRepository.createQueryBuilder( 'estrategia' )
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

export { EstrategiaController };
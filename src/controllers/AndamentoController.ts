import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Andamento } from '../models/Andamento';


class AndamentoController {
  
  async create(request: Request, response: Response, next: NextFunction) {
    
    const { name,position } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceAndamentoRepository = APPDataSource.getRepository(Andamento);

    const  andamento = resourceAndamentoRepository.create({
      name,
      position,
    });

    await resourceAndamentoRepository.save(andamento);

    return response.status(201).json(andamento);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const resourceAndamentoRepository = APPDataSource.getRepository(Andamento);

    const all = await resourceAndamentoRepository.find();

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourceAndamentoRepository = APPDataSource.getRepository(Andamento);
    
    const { id } = request.params;

    const one = await resourceAndamentoRepository.findOne({ where: { id: id }});

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, position } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceAndamentoRepository = APPDataSource.getRepository(Andamento);


    const andamentoFull = await resourceAndamentoRepository.findOne({
      where: {id:id},
    });
    if(!andamentoFull){
      return response.status(400).json({status: "andamento não encontrado"})
    }

    await resourceAndamentoRepository.save(andamentoFull);

    const andamento = await resourceAndamentoRepository.update({
      id
    }, {
      name,
      position,
    });

    return response.status(200).json(andamento);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const resourceAndamentoRepository = APPDataSource.getRepository(Andamento);

    let andamentoToRemove = await resourceAndamentoRepository.findOneBy({ id: request.params.id });

    if (!andamentoToRemove) {
      return response.status(400).json({status: "cartão não encontrado!"});
    }
      
    const deleteResponse = await resourceAndamentoRepository.softDelete(andamentoToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({status: "cartão não excluido!"});
    }
    return response.json(andamentoToRemove);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const resourceAndamentoRepository = APPDataSource.getRepository(Andamento);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await resourceAndamentoRepository.createQueryBuilder( 'andamento' )
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

export { AndamentoController };
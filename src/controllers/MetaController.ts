import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Meta } from '../models/Meta';


class MetaController {
  
  async create(request: Request, response: Response, next: NextFunction) {
    
    const { name, estrategia } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceMetaRepository = APPDataSource.getRepository(Meta);

    const meta = resourceMetaRepository.create({
      name,
      estrategia,
    });

    await resourceMetaRepository.save(meta);

    return response.status(201).json(meta);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const resourceMetaRepository = APPDataSource.getRepository(Meta);

    const all = await resourceMetaRepository.find();

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourceMetaRepository = APPDataSource.getRepository(Meta);
    
    const { id } = request.params;

    const one = await resourceMetaRepository.findOne({ where: { id: id }});

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, estrategia } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceMetaRepository = APPDataSource.getRepository(Meta);


    const metaFull = await resourceMetaRepository.findOne({
      where: {id:id},
    });

    if(!metaFull){
      return response.status(400).json({status: "meta não encontrado"})
    }

    await resourceMetaRepository.save(metaFull);

    const meta = await resourceMetaRepository.update({
      id
    }, {
      name,
      estrategia,
    });

    return response.status(200).json(meta);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const resourceMetaRepository = APPDataSource.getRepository(Meta);

    let metaToRemove = await resourceMetaRepository.findOneBy({ id: request.params.id });

    if (!metaToRemove) {
      return response.status(400).json({status: "cartão não encontrado!"});
    }
      
    const deleteResponse = await resourceMetaRepository.softDelete(metaToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({status: "cartão não excluido!"});
    }

    return response.json(metaToRemove);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const resourceMetaRepository = APPDataSource.getRepository(Meta);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await resourceMetaRepository.createQueryBuilder( 'meta' )
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

export { MetaController };
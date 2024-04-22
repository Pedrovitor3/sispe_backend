import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Responsavel } from '../models/Responsavel';


class ResponsavelController {
  
  async create(request: Request, response: Response, next: NextFunction) {
    
    const { name, cargo } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      cargo: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceResponsavelRepository = APPDataSource.getRepository(Responsavel);

    const responsavel = resourceResponsavelRepository.create({
      name,
      cargo,
    });

    await resourceResponsavelRepository.save(responsavel);

    return response.status(201).json(responsavel);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const resourceResponsavelRepository = APPDataSource.getRepository(Responsavel);

    const all = await resourceResponsavelRepository.find();

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourceResponsavelRepository = APPDataSource.getRepository(Responsavel);
    
    const { id } = request.params;

    const one = await resourceResponsavelRepository.findOne({ where: { id: id }});

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, cargo } = request.body;

    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string().required(),
      cargo: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceResponsavelRepository = APPDataSource.getRepository(Responsavel);


    const responsavelFull = await resourceResponsavelRepository.findOne({
      where: {id:id},
    });

    if(!responsavelFull){
      return response.status(400).json({status: "responsavel não encontrado"})
    }

    await resourceResponsavelRepository.save(responsavelFull);

    const responsavel = await resourceResponsavelRepository.update({
      id
    }, {
      name,
      cargo,
    });

    return response.status(200).json(responsavel);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const resourceResponsavelRepository = APPDataSource.getRepository(Responsavel);

    let responsavelToRemove = await resourceResponsavelRepository.findOneBy({ id: request.params.id });

    if (!responsavelToRemove) {
      return response.status(400).json({status: "cartão não encontrado!"});
    }
      
    const deleteResponse = await resourceResponsavelRepository.softDelete(responsavelToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({status: "cartão não excluido!"});
    }

    return response.json(responsavelToRemove);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const resourceResponsavelRepository = APPDataSource.getRepository(Responsavel);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await resourceResponsavelRepository.createQueryBuilder( 'responsavel' )
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

export { ResponsavelController };
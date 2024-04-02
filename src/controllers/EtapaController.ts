import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Etapa } from '../models/Etapa';


class EtapaController {
  
  async create(request: Request, response: Response, next: NextFunction) {
    
    const { name, porcentagemConclusao, andamento, acao } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      porcentagemConclusao: yup.number().required(),
      andamento: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceEtapaRepository = APPDataSource.getRepository(Etapa);

    const etapa = resourceEtapaRepository.create({
      name, 
      porcentagemConclusao, 
      andamento,
      acao,
    });

    await resourceEtapaRepository.save(etapa);

    return response.status(201).json(etapa);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const resourceEtapaRepository = APPDataSource.getRepository(Etapa);

    const all = await resourceEtapaRepository.find();

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourceEtapaRepository = APPDataSource.getRepository(Etapa);
    
    const { id } = request.params;

    const one = await resourceEtapaRepository.findOne({ where: { id: id }});

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, porcentagemConclusao, andamento, acao } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string().required(),
      porcentagemConclusao: yup.number().required(),
      andamento: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceEtapaRepository = APPDataSource.getRepository(Etapa);


    const etapaFull = await resourceEtapaRepository.findOne({
      where: {id:id},
    });

    if(!etapaFull){
      return response.status(400).json({status: "etapa não encontrado"})
    }

    await resourceEtapaRepository.save(etapaFull);

    const etapa = await resourceEtapaRepository.update({
      id
    }, {
      name, 
      porcentagemConclusao, 
      andamento,
      acao,
    });

    return response.status(200).json(etapa);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const resourceEtapaRepository = APPDataSource.getRepository(Etapa);

    let etapaToRemove = await resourceEtapaRepository.findOneBy({ id: request.params.id });

    if (!etapaToRemove) {
      return response.status(400).json({status: "cartão não encontrado!"});
    }
      
    const deleteResponse = await resourceEtapaRepository.softDelete(etapaToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({status: "cartão não excluido!"});
    }

    return response.json(etapaToRemove);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const resourceEtapaRepository = APPDataSource.getRepository(Etapa);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await resourceEtapaRepository.createQueryBuilder( 'etapa' )
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

export { EtapaController };
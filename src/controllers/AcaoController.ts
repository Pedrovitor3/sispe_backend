import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Acao } from '../models/Acao';


class AcaoController {
  
  async create(request: Request, response: Response, next: NextFunction) {
    
    const { 
      name, ano, percentualExecutado, status, departamentoResponsavel, justificativa, observacao, entraves,  
      inicioPrevisto, terminoPrevisto, inicioReal, terminoReal,
      estrategia
    } = request.body;


    const schema = yup.object().shape({
      name: yup.string().required(),
      percentualExecutado: yup.number().required(),
      status: yup.string().required(),
      departamentoResponsavel: yup.string().required(),
      justificativa: yup.string().required(),
      observacao: yup.string().required(),
      entraves: yup.string().required(),

      inicioPrevisto: yup.date(),
      terminoPrevisto: yup.date(),
      inicioReal: yup.date(),
      terminoReal: yup.date(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceAcaoRepository = APPDataSource.getRepository(Acao);

    const acao = resourceAcaoRepository.create({
      name, 
      ano,
      percentualExecutado,
      status,
      departamentoResponsavel, 
      justificativa, 
      observacao, 
      entraves,  
      inicioPrevisto, 
      terminoPrevisto, 
      inicioReal, 
      terminoReal,
      estrategia
    });

    await resourceAcaoRepository.save(acao);

    return response.status(201).json(acao);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const resourceAcaoRepository = APPDataSource.getRepository(Acao);

    const all = await resourceAcaoRepository.find();

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourceAcaoRepository = APPDataSource.getRepository(Acao);
    
    const { id } = request.params;

    const one = await resourceAcaoRepository.findOne({ where: { id: id }});

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { 
      name, ano, percentualExecutado, status, departamentoResponsavel, justificativa, observacao, entraves,  
      inicioPrevisto, terminoPrevisto, inicioReal, terminoReal,
      estrategia
    } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string().required(),
      percentualExecutado: yup.number().required(),
      status: yup.string().required(),
      departamentoResponsavel: yup.string().required(),
      justificativa: yup.string().required(),
      observacao: yup.string().required(),
      entraves: yup.string().required(),

      inicioPrevisto: yup.date(),
      terminoPrevisto: yup.date(),
      inicioReal: yup.date(),
      terminoReal: yup.date(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceAcaoRepository = APPDataSource.getRepository(Acao);


    const acaoFull = await resourceAcaoRepository.findOne({
      where: {id:id},
    });

    if(!acaoFull){
      return response.status(400).json({status: "acao não encontrado"})
    }

    await resourceAcaoRepository.save(acaoFull);

    const acao = await resourceAcaoRepository.update({
      id
    }, {
      name, 
      ano,
      percentualExecutado,
      status,
      departamentoResponsavel, 
      justificativa, 
      observacao, 
      entraves,  
      inicioPrevisto, 
      terminoPrevisto, 
      inicioReal, 
      terminoReal,
      estrategia
    });

    return response.status(200).json(acao);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const resourceAcaoRepository = APPDataSource.getRepository(Acao);

    let acaoToRemove = await resourceAcaoRepository.findOneBy({ id: request.params.id });

    if (!acaoToRemove) {
      return response.status(400).json({status: "cartão não encontrado!"});
    }
      
    const deleteResponse = await resourceAcaoRepository.softDelete(acaoToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({status: "cartão não excluido!"});
    }

    return response.json(acaoToRemove);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const resourceAcaoRepository = APPDataSource.getRepository(Acao);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await resourceAcaoRepository.createQueryBuilder( 'acao' )
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

export { AcaoController };
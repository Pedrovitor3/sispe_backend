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
      meta, responsaveis
    } = request.body;

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
      meta,
      responsaveis,
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
      meta, responsaveis
    } = request.body;

    const id = request.params.id;

    const resourceAcaoRepository = APPDataSource.getRepository(Acao);

    // Encontre a ação que você deseja atualizar
    const acaoToUpdate = await resourceAcaoRepository.findOne({
      where: { id: id },
      relations: ['responsaveis'] // Certifique-se de carregar os responsáveis
    });

    if (!acaoToUpdate) {
      return response.status(404).json({ error: 'Acao not found' });
    }

    // Atualize os campos da ação
    acaoToUpdate.name = name;
    acaoToUpdate.ano = ano;
    acaoToUpdate.percentualExecutado = percentualExecutado;
    acaoToUpdate.status = status;
    acaoToUpdate.departamentoResponsavel = departamentoResponsavel;
    acaoToUpdate.justificativa = justificativa;
    acaoToUpdate.observacao = observacao;
    acaoToUpdate.entraves = entraves;
    acaoToUpdate.inicioPrevisto = inicioPrevisto;
    acaoToUpdate.terminoPrevisto = terminoPrevisto;
    acaoToUpdate.inicioReal = inicioReal;
    acaoToUpdate.terminoReal = terminoReal;
    acaoToUpdate.meta = meta;

    // Atualize manualmente a relação muitos-para-muitos (responsáveis)
    acaoToUpdate.responsaveis = responsaveis; // Certifique-se de que responsaveis seja uma matriz de objetos de entidade válidos

    // Salve as alterações na ação
    const updatedAcao = await resourceAcaoRepository.save(acaoToUpdate);

    return response.status(200).json(updatedAcao);
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
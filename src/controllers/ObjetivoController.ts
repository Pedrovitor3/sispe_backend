import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Objetivo } from '../models/Objetivo';


class ObjetivoController {
  
  async create(request: Request, response: Response, next: NextFunction) {
    
    const { name, perspectiva } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceObjetivoRepository = APPDataSource.getRepository(Objetivo);

    const objetivo = resourceObjetivoRepository.create({
      name,
      perspectiva,
    });

    await resourceObjetivoRepository.save(objetivo);

    return response.status(201).json(objetivo);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const resourceObjetivoRepository = APPDataSource.getRepository(Objetivo);

    const all = await resourceObjetivoRepository.find();

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourceObjetivoRepository = APPDataSource.getRepository(Objetivo);
    
    const { id } = request.params;

    const one = await resourceObjetivoRepository.findOne({ where: { id: id }});

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, perspectiva } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceObjetivoRepository = APPDataSource.getRepository(Objetivo);


    const objetivoFull = await resourceObjetivoRepository.findOne({
      where: {id:id},
    });

    if(!objetivoFull){
      return response.status(400).json({status: "objetivo não encontrado"})
    }

    await resourceObjetivoRepository.save(objetivoFull);

    const objetivo = await resourceObjetivoRepository.update({
      id
    }, {
      name,
      perspectiva,
    });

    return response.status(200).json(objetivo);

  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const resourceObjetivoRepository = APPDataSource.getRepository(Objetivo);

    let objetivoToRemove = await resourceObjetivoRepository.findOneBy({ id: request.params.id });

    if (!objetivoToRemove) {
      return response.status(400).json({status: "cartão não encontrado!"});
    }
      
    const deleteResponse = await resourceObjetivoRepository.softDelete(objetivoToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({status: "cartão não excluido!"});
    }

    return response.json(objetivoToRemove);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const resourceObjetivoRepository = APPDataSource.getRepository(Objetivo);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await resourceObjetivoRepository.createQueryBuilder( 'objetivo' )
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

export { ObjetivoController };
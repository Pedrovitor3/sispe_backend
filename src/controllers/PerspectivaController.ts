import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Perspectiva } from '../models/Perspectiva';


class PerspectivaController {
  
  async create(request: Request, response: Response, next: NextFunction) {
    
    const { name } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourcePerspectivaRepository = APPDataSource.getRepository(Perspectiva);

    const perspectiva = resourcePerspectivaRepository.create({
      name,
    });

    await resourcePerspectivaRepository.save(perspectiva);

    return response.status(201).json(perspectiva);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const resourcePerspectivaRepository = APPDataSource.getRepository(Perspectiva);

    const all = await resourcePerspectivaRepository.find();

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourcePerspectivaRepository = APPDataSource.getRepository(Perspectiva);
    
    const { id } = request.params;

    const one = await resourcePerspectivaRepository.findOne({ where: { id: id }});

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourcePerspectivaRepository = APPDataSource.getRepository(Perspectiva);


    const perspectivaFull = await resourcePerspectivaRepository.findOne({
      where: {id:id},
    });

    if(!perspectivaFull){
      return response.status(400).json({status: "perspectiva não encontrado"})
    }

    await resourcePerspectivaRepository.save(perspectivaFull);

    const perspectiva = await resourcePerspectivaRepository.update({
      id
    }, {
      name,
    });

    return response.status(200).json(perspectiva);

  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const resourcePerspectivaRepository = APPDataSource.getRepository(Perspectiva);

    let perspectivaToRemove = await resourcePerspectivaRepository.findOneBy({ id: request.params.id });

    if (!perspectivaToRemove) {
      return response.status(400).json({status: "cartão não encontrado!"});
    }
      
    const deleteResponse = await resourcePerspectivaRepository.softDelete(perspectivaToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({status: "cartão não excluido!"});
    }

    return response.json(perspectivaToRemove);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const resourcePerspectivaRepository = APPDataSource.getRepository(Perspectiva);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await resourcePerspectivaRepository.createQueryBuilder( 'perspectiva' )
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

export { PerspectivaController };
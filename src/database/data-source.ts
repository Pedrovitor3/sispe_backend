import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {  Perspectiva } from '../models/Perspectiva';
import { Objetivo } from '../models/Objetivo';
import { Estrategia } from '../models/Estrategia';
import { Iniciativa } from '../models/Iniciativa';
import { Meta } from '../models/Meta';
import { Acao } from '../models/Acao';
import { Responsavel } from '../models/Responsavel';
import { Etapa } from '../models/Etapa';
import { Andamento } from '../models/Andamento';
require('dotenv').config();

//import { CreateUsuarios1656685284937 } from '../database/migrations/1656685284937-CreateUsuarios';

export const APPDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [Perspectiva, Objetivo, Estrategia, Iniciativa, Meta, Acao, Responsavel, Etapa, Andamento],
  //  migrations: [CreateUsuarios1656685284937],
  subscribers: [],
});
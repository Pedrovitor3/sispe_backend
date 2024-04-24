import { Router } from 'express';
import { verifyToken } from './Utils/functionsToken';

import { PerspectivaController } from './controllers/PerspectivaController';
import { EstrategiaController } from './controllers/EstrategiaController';
import { ObjetivoController } from './controllers/ObjetivoController';
import { IniciativaController } from './controllers/IniciativaController';
import { MetaController } from './controllers/MetaController';
import { AcaoController } from './controllers/AcaoController';
import { ResponsavelController } from './controllers/ResponsavelController';
import { EtapaController } from './controllers/EtapaController';
import { AndamentoController } from './controllers/AndamentoController';


const router = Router();

const perspectivaController = new PerspectivaController();
const estrategiaController = new EstrategiaController();
const objetivoController = new ObjetivoController();
const iniciativaController = new IniciativaController();
const metaController = new MetaController();
const acaoController = new AcaoController();
const responsavelController = new ResponsavelController();
const etapaController = new EtapaController();
const andamentoController = new AndamentoController();
//Perspectiva
router.post("/perspectiva", verifyToken, perspectivaController.create);
router.get("/perspectiva", verifyToken, perspectivaController.all);
router.get("/perspectiva/:id", verifyToken, perspectivaController.one);
router.put("/perspectiva/:id", verifyToken, perspectivaController.update);
router.delete("/perspectiva/:id", verifyToken, perspectivaController.remove);


//Objetivo
router.post("/objetivo", verifyToken, objetivoController.create);
router.get("/objetivo", verifyToken, objetivoController.all);
router.get("/objetivo/:id", verifyToken, objetivoController.one);
router.put("/objetivo/:id", verifyToken, objetivoController.update);
router.delete("/objetivo/:id", verifyToken, objetivoController.remove);

//Estrategia
router.post("/estrategia", verifyToken, estrategiaController.create);
router.get("/estrategia", verifyToken, estrategiaController.all);
router.get("/estrategia/:id", verifyToken, estrategiaController.one);
router.put("/estrategia/:id", verifyToken, estrategiaController.update);
router.delete("/estrategia/:id", verifyToken, estrategiaController.remove);

//Iniciativa
router.post("/iniciativa", verifyToken, iniciativaController.create);
router.get("/iniciativa", verifyToken, iniciativaController.all);
router.get("/iniciativa/:id", verifyToken, iniciativaController.one);
router.put("/iniciativa/:id", verifyToken, iniciativaController.update);
router.delete("/iniciativa/:id", verifyToken, iniciativaController.remove);

//Meta
router.post("/meta", verifyToken, metaController.create);
router.get("/meta", verifyToken, metaController.all);
router.get("/meta/:id", verifyToken, metaController.one);
router.put("/meta/:id", verifyToken, metaController.update);
router.delete("/meta/:id", verifyToken, metaController.remove);

//Acao
router.post("/acao", verifyToken, acaoController.create);
router.get("/acao", verifyToken, acaoController.all);
router.get("/acao/:id", verifyToken, acaoController.one);
router.put("/acao/:id", verifyToken, acaoController.update);
router.delete("/acao/:id", verifyToken, acaoController.remove);

//Responsavel
router.post("/responsavel", verifyToken, responsavelController.create);
router.get("/responsavel", verifyToken, responsavelController.all);
router.get("/responsavel/:id", verifyToken, responsavelController.one);
router.put("/responsavel/:id", verifyToken, responsavelController.update);
router.delete("/responsavel/:id", verifyToken, responsavelController.remove);

//Etapa
router.post("/etapa", verifyToken, etapaController.create);
router.get("/etapa", verifyToken, etapaController.all);
router.get("/etapa/:id", verifyToken, etapaController.one);
router.put("/etapa/:id", verifyToken, etapaController.update);
router.delete("/etapa/:id", verifyToken, etapaController.remove);

//Andamento
router.post("/andamento", verifyToken, andamentoController.create);
router.get("/andamento", verifyToken, andamentoController.all);
router.get("/andamento/:id", verifyToken, andamentoController.one);
router.put("/andamento/:id", verifyToken, andamentoController.update);
router.delete("/andamento/:id", verifyToken, andamentoController.remove);


export { router }; // Retornando as rotas preenchidas para o server.ts
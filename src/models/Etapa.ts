import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Perspectiva } from './Perspectiva';
import { Estrategia } from './Estrategia';
import { Acao } from './Acao';
import { Andamento } from './Andamento';


@Entity("etapa") 
export class Etapa {

  @PrimaryColumn()
  readonly id: string; 
  
  @Column()
  name: string;

  @Column({nullable: true})
  percentualConclusao: string;

  @Column({nullable: true})
  position: number;

  @ManyToOne((type) => Acao, (acao) => acao.etapa, {nullable: false, eager: true})
  acao: Acao;

  @ManyToOne((type) => Andamento, (andamento) => andamento.etapa, {nullable: true, eager: true})
  andamento: Andamento;

  @DeleteDateColumn()
  deleted_at: Date; 

  @CreateDateColumn() 
  created_at: Date;

  @UpdateDateColumn() 
  update_at: Date;

  /*
      A geração do uuID automático não será por meio do SGBD, e sim aqui pelo código
      Utilizando a bilioteca: yarn add uuid
      Tipos da biblioteca uuid: yarn add @tyapes/uuid -D
  */
  constructor() {
    // Se esse ID não existir, gerar um id
    if (!this.id) {
      this.id = uuid();
    }
  }
}

import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Perspectiva } from './Perspectiva';
import { Objetivo } from './Objetivo';
import { Iniciativa } from './Iniciativa';
import { Meta } from './Meta';
import { Acao } from './Acao';


@Entity("estrategia") 
export class Estrategia {

  @PrimaryColumn()
  readonly id: string; 
  
  @Column()
  name: string;

  @OneToMany((type) => Iniciativa, (iniciativa) => iniciativa.estrategia, {nullable: true})
  iniciativa: Iniciativa;

  @ManyToOne((type) => Objetivo, (objetivo) => objetivo.estrategia, {nullable: false, eager: true})
  objetivo: Objetivo;

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

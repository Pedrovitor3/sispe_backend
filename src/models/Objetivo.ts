import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Perspectiva } from './Perspectiva';
import { Estrategia } from './Estrategia';


@Entity("objetivo") 
export class Objetivo {

  @PrimaryColumn()
  readonly id: string; 
  
  @Column()
  name: string;
  
  @Column({nullable: true})
  position: number;

  @OneToMany((type) => Estrategia, (estrategia) => estrategia.objetivo, {nullable: true})
  estrategia: Estrategia;

  @ManyToOne((type) => Perspectiva, (perspectiva) => perspectiva.objetivo, {nullable: false, eager: true})
  perspectiva: Perspectiva

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

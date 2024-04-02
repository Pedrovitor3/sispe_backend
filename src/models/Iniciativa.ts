import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Perspectiva } from './Perspectiva';
import { Estrategia } from './Estrategia';


@Entity("iniciativa") 
export class Iniciativa {

  @PrimaryColumn()
  readonly id: string; 
  
  @Column()
  name: string;

  @Column()
  item: string;
  
  @Column()
  status: string;

  @Column()
  percentualExecutado: number;

  @ManyToOne((type) => Estrategia, (estrategia) => estrategia.iniciativa, {nullable: false})
  estrategia: Estrategia;

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

import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Perspectiva } from './Perspectiva';
import { Estrategia } from './Estrategia';
import { Etapa } from './Etapa';
import { Responsavel } from './Responsavel';
import { Meta } from './Meta';


@Entity("acao") 
export class Acao {

  @PrimaryColumn()
  readonly id: string; 
  
  @Column()
  name: string;

  @Column({nullable: true})
  ano: string;
  
  @Column({nullable: true})
  status: string;

  @Column({nullable: true})
  percentualExecutado: string;

  @Column({nullable: true})
  departamentoResponsavel: string;

  @Column({nullable: true})
  justificativa: string;

  @Column({nullable: true})
  observacao: string;

  @Column({nullable: true})
  entraves: string;

  @Column({nullable: true})
  inicioPrevisto: string;
  @Column({nullable: true})
  terminoPrevisto: string;

  @Column({nullable: true})
  inicioReal: string;
  @Column({nullable: true})
  terminoReal: string;


  @OneToMany((type) => Etapa, (etapa) => etapa.acao, {nullable: true, eager: true})
  etapa: Etapa[];
  
  @OneToMany((type) => Responsavel, (responsavel) => responsavel.acao, {nullable: true})
  responsavel: Responsavel[];
  
  @ManyToOne((type) => Meta, (meta) => meta.acao, {nullable: false, eager: true})
  meta: Meta;

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

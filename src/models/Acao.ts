import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Perspectiva } from './Perspectiva';
import { Estrategia } from './Estrategia';
import { Etapa } from './Etapa';
import { Responsavel } from './Responsavel';


@Entity("acao") 
export class Acao {

  @PrimaryColumn()
  readonly id: string; 
  
  @Column()
  name: string;

  @Column({nullable: true})
  ano: Date;
  
  @Column()
  status: string;

  @Column()
  percentualExecutado: number;

  @Column()
  departamentoResponsavel: string;

  @Column()
  justificativa: string;

  @Column()
  observacao: string;

  @Column()
  entraves: string;

  @Column({nullable: true})
  inicioPrevisto: Date;
  @Column({nullable: true})
  terminoPrevisto: Date;

  @Column({nullable: true})
  inicioReal: Date;
  @Column({nullable: true})
  terminoReal: Date;


  @OneToMany((type) => Etapa, (etapa) => etapa.acao, {nullable: true})
  etapa: Etapa;
  
  @OneToMany((type) => Responsavel, (responsavel) => responsavel.acao, {nullable: true})
  responsavel: Responsavel;
  

  @ManyToOne((type) => Estrategia, (estrategia) => estrategia.iniciativa, {nullable: false, eager: true})
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

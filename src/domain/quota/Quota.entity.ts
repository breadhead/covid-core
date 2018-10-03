import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column({ length: 500 })
  public readonly name: string

  @Column('text')
  public readonly  description: string

  @Column()
  public readonly filename: string

  @Column('int')
  public readonly views: number

  @Column()
  public readonly isPublished: boolean
}

import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user';
import { Comment } from './comment';

@Entity({ name: 'articles' })
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column()
  views!: number;

  @Column()
  create_time!: Date;

  @Column()
  update_time!: Date;

  @Column()
  is_delete!: number;

  // 多篇文章对应一个用户
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;


  // 一个用户对应多条评论
  @OneToMany(()=> Comment,(comment)=> comment.article)
  comments!: Comment[]; 
}
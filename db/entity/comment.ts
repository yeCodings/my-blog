import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';
import { Article } from './article';

@Entity({ name: 'comments' })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column()
  content!: string;

  @Column()
  create_time!: Date;

  @Column()
  update_time!: Date;

  // 多篇文章对应一个用户
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  // 多条评论对应一个文章
  @ManyToOne(() => Article)
  @JoinColumn({ name: 'article_id' })
  article!: Article;
}
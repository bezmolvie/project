import { Posts } from 'src/Posts/posts.entity';
import { User } from 'src/users/users.entity';
import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';

@Entity('comments') //указываем что это не просто клаcс, а сущность в рамках TypeOrm, в БД будет храниться как таблица
export class Comment {
  @PrimaryGeneratedColumn() //колонка - идентификатор, значение генерируется автоматически
  id: number;
  @Column() //колонка таблицы, сюда можно добавить большое количество параметров для БД, например тип, уникальность, триггер и т.д.
  date: Date;
  @Column()
  userName: string;
  @Column()
  text: string;
  @ManyToOne(()=> Posts,(posts) => posts.comments)
  @JoinTable({
    name: 'comment_post',
    joinColumn: {name : 'comment_id'},
    inverseJoinColumn: {name: 'post_id'},
  })
  posts: Posts[];
  @ManyToOne((type)=> User,(users) => users.comments)
  @JoinTable({
    name: 'user_comment',
    joinColumn: {name : 'comment_id'},
    inverseJoinColumn: {name: 'user_id'},
  })
  users: User[];

}

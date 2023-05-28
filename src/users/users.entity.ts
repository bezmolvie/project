import { Posts } from 'src/Posts/posts.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable , OneToMany} from 'typeorm';
import { Comment } from 'src/comments/comments.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column()
  password: string;

  @Column()
  login: string;

  @Column()
  age: number;
  
  @OneToMany(()=> Posts,(posts) => posts.users)
  @JoinTable({
    name: 'user_post',
    joinColumn: {name : 'user_id'},
    inverseJoinColumn: {name: 'post_id'},
  })
  posts: Posts[];
  @OneToMany((type)=> Comment,(comments) => comments.users)
  @JoinTable({
    name: 'user_comment',
    joinColumn: {name : 'user_id'},
    inverseJoinColumn: {name: 'comment_id'},
  })
  comments: Comment[];
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinTable, OneToMany } from 'typeorm';
import { Comment } from 'src/comments/comments.entity';
import { User } from 'src/users/users.entity';

@Entity('posts')
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  date: Date;

  @Column()
  text: string;

  @OneToMany(()=> Comment,(comments) => comments.posts)
  @JoinTable({
    name: 'comment_post',
    joinColumn: {name : 'post_id'},
    inverseJoinColumn: {name: 'comment_id'},
  })
  comments: Comment[];
  @ManyToOne((type)=> User,(users) => users.posts)
  @JoinTable({
    name: 'user_post',
    joinColumn: {name : 'post_id'},
    inverseJoinColumn: {name: 'user_id'},
  })
  users: User[];
  
  
}



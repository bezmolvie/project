import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { PostService } from './posts.service';
import { PostsController } from './posts.controller';
import { Comment} from 'src/comments/comments.entity';
import { User } from 'src/users/users.entity';

@Module({
  controllers: [PostsController],
  providers: [PostService],
  imports: [TypeOrmModule.forFeature([Posts, User,Comment])],
})
export class PostsModule {}

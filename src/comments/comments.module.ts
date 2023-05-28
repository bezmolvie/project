import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { Comment } from './comments.entity';
import { CommentService } from './comments.service';
import { Posts } from 'src/Posts/posts.entity';
import { User } from 'src/users/users.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Comment, Posts, User])],
  controllers: [CommentsController],
  providers: [CommentService],
})
export class CommentsModule {}
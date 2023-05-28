import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Comment } from 'src/comments/comments.entity';
import { Posts } from 'src/Posts/posts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Posts, Comment])
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}

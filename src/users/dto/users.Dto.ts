import { Posts } from "src/Posts/posts.entity";
import { Comment } from "src/comments/comments.entity";
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, MinLength } from 'class-validator';
export class CreateUserDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty()
  @IsNumber()
  age: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  login: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  posts: Posts[];
  comments: Comment[];
  }
  
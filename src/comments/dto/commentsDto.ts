import { Posts } from "src/Posts/posts.entity";
import { User } from "src/users/users.entity";
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
  export class CreateCommentsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;
  @ApiProperty({ type: User, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => User)
  users: User[];

  @ApiProperty({ type: Posts, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Posts)
  posts: Posts[];
  }
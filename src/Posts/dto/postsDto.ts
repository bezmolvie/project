import { Comment } from "src/comments/comments.entity";
import { User } from "src/users/users.entity";
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsDate, ValidateNested } from 'class-validator';

export class CreatePostsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

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
  users: User[];

  @ApiProperty({ type: Comment, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  comments: Comment[];
}

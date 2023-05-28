import { HttpStatus, Injectable,BadRequestException } from '@nestjs/common';
import { User } from 'src/users/users.entity';
import { Posts } from 'src/Posts/posts.entity';
import { Comment } from 'src/comments/comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateCommentsDto } from './dto/commentsDto';
import { CommentDto } from './dto/incomplete_comment';
import { validate } from 'class-validator';
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  findOne(id: number): Promise<Comment> {
    return this.commentRepository.findOne({
      where: { id },
      relations: { posts: true, users: true },
    });
  }

  async createComment(commentDto: CreateCommentsDto): Promise<Comment> {
    const comment = this.commentRepository.create();
    comment.date = commentDto.date;
    comment.userName = commentDto.userName;
    comment.text = commentDto.text;
    console.log(commentDto.users);
    await this.commentRepository.save(comment);
    const errors = await validate(comment);

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
    }
    for (let _user of commentDto.users) {
      let user = this.userRepository.create({ ..._user });
      await this.userRepository.save(user);
    }
    return comment;
  }

  async findAll(): Promise<Comment[]> {
    const comments = await this.commentRepository.find({
      relations: {
        users: true,
        posts: true,
      },
    });
    return comments;
  }

  async update(id: number, updatedComment: Comment) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    comment.date = updatedComment.date;
    comment.text = updatedComment.text;
    comment.userName = updatedComment.userName;
    comment.users = updatedComment.users;
    await this.commentRepository.save(comment);
    return comment;
  }

  remove(id: number) {
    this.commentRepository.delete({ id });
  }

  async findIncomplete(): Promise<CommentDto[]> {
    const comments = await this.commentRepository.find();
    const incompleteComments: CommentDto[] = comments.map((comment) => {
      const incompleteComment = new CommentDto();
      incompleteComment.id = comment.id;
      incompleteComment.date= comment.date;
      incompleteComment.text = comment.text;
      return incompleteComment;
    });
    return incompleteComments;
  }
}

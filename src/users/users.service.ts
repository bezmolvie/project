import { HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { User } from './users.entity';
import { Posts } from 'src/Posts/posts.entity';
import { Comment } from 'src/comments/comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/users.Dto';
import { UserDto } from './dto/incompleteUsers';
import { validate } from 'class-validator';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: { posts: true, comments: true },
    });
  }
  async createUser(userDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(userDto);
    const errors = await validate(user);
  
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
    }
  
    // Сохранение пользователя
    await this.userRepository.save(user);
  
    // Создание и сохранение постов
    for (const _post of userDto.posts) {
      const post = this.postRepository.create({ ..._post });
      post.users = [user]; // Установка связи с пользователем
      await this.postRepository.save(post);
    }
  
    // Создание и сохранение комментариев
    for (const _comment of userDto.comments) {
      const comment = this.commentRepository.create({ ..._comment });
      comment.users = [user]; // Установка связи с пользователем
      await this.commentRepository.save(comment);
    }
  
    return user;
  }
  

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      relations: {
        posts: true,
        comments: true,
      },
    });
    return users;
  }

  async update(id: number, updatedUser: User) {
    const user = await this.userRepository.findOne({ where: { id } });
    user.fullname = updatedUser.fullname;
    user.login = updatedUser.login;
    user.age = updatedUser.age;
    user.posts = updatedUser.posts;
    user.comments = updatedUser.comments;
    await this.userRepository.save(user);
    return user;
  }

  remove(id: number) {
    this.userRepository.delete({ id });
  }

  async findIncomplete(): Promise<UserDto[]> {
    const users = await this.userRepository.find();
    const incompleteUsers: UserDto[] = users.map((user) => {
      const incompleteUser = new UserDto();
      incompleteUser.id = user.id;
      incompleteUser.fullname= user.fullname;
      incompleteUser.login = user.login;
      return incompleteUser;
    });
    return incompleteUsers;
  }
}

import { HttpStatus, Injectable,BadRequestException } from '@nestjs/common';
import { User } from 'src/users/users.entity';
import { Posts } from 'src/Posts/posts.entity';
import { Comment } from 'src/comments/comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreatePostsDto } from './dto/postsDto';
import { PostsDto } from './dto/incompletePost';
import { validate } from 'class-validator';
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  findOne(id: number): Promise<Posts> {
    return this.postRepository.findOne({
      where: { id },
      relations: { users: true, comments: true },
    });
  }

  async createPost(postDto: CreatePostsDto): Promise<Posts> {
    const post = this.postRepository.create();
    post.name = postDto.name;
    post.date = postDto.date;
    post.text = postDto.text;
    console.log(postDto.users);
    await this.postRepository.save(post);
    const errors = await validate(post);

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
    }
    for (let _user of postDto.users) {
      let user = this.userRepository.create({ ..._user });
      await this.userRepository.save(user);
    }
    return post;
  }

  async findAll(): Promise<Posts[]> {
    const posts = await this.postRepository.find({
      relations: {
        users: true,
        comments: true,
      },
    });
    return posts;
  }

  async update(id: number, updatedPost: Posts) {
    const post = await this.postRepository.findOne({ where: { id } });
    post.name = updatedPost.name;
    post.date = updatedPost.date;
    post.text = updatedPost.text;
    await this.postRepository.save(post);
    return post;
  }

  remove(id: number) {
    this.postRepository.delete({ id });
  }

  async findIncomplete(): Promise<PostsDto[]> {
    const posts = await this.postRepository.find();
    const incompletePosts: PostsDto[] = posts.map((post) => {
      const incompletePost = new PostsDto();
      incompletePost.id = post.id;
      incompletePost.name= post.name;
      incompletePost.date = post.date;
      incompletePost.text = post.text;
      return incompletePost;
    });
    return incompletePosts;
  }
}

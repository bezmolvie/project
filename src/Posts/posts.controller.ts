import { PostService } from 'src/Posts/posts.service';
import { Controller, Get, Post, Put, Delete, Param, Body,NotFoundException } from '@nestjs/common';
import { Posts } from './posts.entity';
import { PostsDto } from './dto/incompletePost';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UsePipes } from '@nestjs/common/decorators';
import { CreatePostsDto } from './dto/postsDto';
import { ValidationPipe } from '@nestjs/common/pipes';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAll(): Promise<Posts[]> {
    try{
    return await this.postService.findAll();}
    catch(error){
      throw new InternalServerErrorException('Произошла ошибка на сервере')
    }
  }
  @Get('incomplete')
  async findIncomplete(): Promise<PostsDto[]> {
    try{
   return await this.postService.findIncomplete();}
   catch(error){
    throw new InternalServerErrorException('Произошла ошибка на сервере')
   }
  }
  

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Успешный запрос', type: Posts })
  @ApiResponse({ status: 404, description: 'Пост не найден' })
  async findOne(@Param('id') id: string): Promise<Posts> {
   const post =  await this.postService.findOne(+id);
   if (!post){
    throw new NotFoundException('Запрашиваемый пост не существует');
  }
  return post;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePost: Posts): Promise<Posts> {
    try{
    return await this.postService.update(+id, updatePost);}
    catch(error){
      throw new InternalServerErrorException('Произошла ошибка на сервере')
    }
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiBody({ type: CreatePostsDto })
  async create(@Body() createPost: CreatePostsDto): Promise<Posts> {
    return await this.postService.createPost(createPost);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Успешное удаление', type: Posts })
  @ApiResponse({ status: 404, description: 'Пост не найден' })
  async remove(@Param('id') id: string): Promise<void> {
    const post =  await this.postService.findOne(+id);
    if (!post){
      throw new NotFoundException('Запрашиваемый пост не существует');
    }
    await this.postService.remove(+id);
  }
}

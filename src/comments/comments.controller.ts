import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { Comment } from './comments.entity';
import { CommentService } from './comments.service';
import { CreateCommentsDto } from './dto/commentsDto';
import { CommentDto } from './dto/incomplete_comment';
import { ApiTags, ApiBody,ApiResponse } from '@nestjs/swagger';
import { UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
@ApiTags('Comments')
@Controller('comments') 
export class CommentsController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async findAll(): Promise<Comment[]> {
    try{
    return await this.commentService.findAll();}
    catch(error){
      throw new InternalServerErrorException('Произошла ошибка на сервере')
    }
  }
  @Get('incomplete')
 async findIncomplete(): Promise<CommentDto[]> {
  try{
   return await this.commentService.findIncomplete();}
   catch(error){
    throw new InternalServerErrorException('Произошла ошибка на сервере')
   }
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Успешный запрос', type: Comment })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  async findOne(@Param('id') id: string): Promise<Comment> {
    const comment =  await this.commentService.findOne(+id);
    if (!comment){
      throw new NotFoundException('Запрашиваемый комментарий не существует');
    }
    return comment;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateComment: Comment): Promise<Comment> {
    try{
    return await this.commentService.update(+id, updateComment);}
    catch(error){
      throw new InternalServerErrorException('Произошла ошибка на сервере')
    }
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiBody({ type: CreateCommentsDto })
  async create(@Body() createComment: CreateCommentsDto)  {
    this.commentService.createComment(createComment);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Успешный запрос', type: Comment })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  async remove(@Param('id') id: string): Promise<void> {
    const comment =  await this.commentService.findOne(+id);
    if (!comment){
      throw new NotFoundException('Запрашиваемый комментарий не существует');
    }
    await this.commentService.remove(+id);
  }

}
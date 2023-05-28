import { UsersService } from 'src/users/users.service';
import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, InternalServerErrorException, ValidationPipe } from '@nestjs/common';
import { User } from './users.entity';
import { UserDto } from './dto/incompleteUsers';
import { ApiBody, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/users.Dto';
import { UsePipes } from '@nestjs/common/decorators';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
  @InjectRepository(User)
  private readonly userRepository: Repository<User>,) {}

@Get()
async findAll(): Promise<User[]> {
  try{
return await this.usersService.findAll();}
    catch (error){
      throw new InternalServerErrorException('Произошла ошибка на сервере')
    }
}
@Get('incomplete')
  async findIncomplete():Promise<UserDto[]> {
    try{
   return await this.usersService.findIncomplete();}
   catch(error){
    throw new InternalServerErrorException('Произошла ошибка на сервере')
   }
  }

@Get(':id')
@ApiResponse({ status: 200, description: 'Успешный запрос', type: User })
@ApiResponse({ status: 404, description: 'Пользователь не найден' })
async findOne(@Param('id') id: string): Promise<User> {
const user = await this.usersService.findOne(+id);
if (!user){
  throw new NotFoundException('Пользователь не существует');
}
return user;
}

@Put(':id')
async update(@Param('id') id: string, @Body() updateUser: User): Promise<User> {
  try{
return  await this.usersService.update(+id, updateUser);}
catch(error){
  throw new InternalServerErrorException('Произошла ошибка на сервере')
}
}

@Post()
@UsePipes(ValidationPipe)
@ApiBody({ type: CreateUserDto })
async create(@Body() createUser: CreateUserDto): Promise<User> {
return await this.usersService.createUser(createUser);
}

@Delete(':id')
@ApiResponse({ status: 200, description: 'Успешно удалено', type: User })
@ApiResponse({ status: 404, description: 'Пользователь не найден' })
async remove(@Param('id') id: string): Promise<void> {
const user = await this.usersService.findOne(+id);
if (!user){
  throw new NotFoundException('Пользователь не существует');
}
this.usersService.remove(+id);
}

}
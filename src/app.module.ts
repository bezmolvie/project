import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './Posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './Posts/posts.entity';
import { User } from './users/users.entity';
import { Comment } from './comments/comments.entity';
@Module({
  imports: [UsersModule, PostsModule, CommentsModule,TypeOrmModule.forRoot({
    type: 'postgres', //тип подключаемой БД
    port: 5432, //порт
    database: 'postgres',
    username: 'postgres', //имя пользователя
    password: '123', //пароль
    host: 'localhost', //хост, в нашем случае БД развернута локально
    synchronize: false, //отключаем автосинхронизацию(в противном случае при каждом перезапуске наша БД будет создаваться заново)
    logging: true,
    migrationsTableName: 'migrations',
    migrations: ['dist/src/migrations/*{.ts,.js}'], //включим логирование для удобства отслеживания процессов
  entities: [User, Comment, Posts], //указываем путь к сущностям
  }),],
  controllers: [],
  providers: [],
})
export class AppModule {}

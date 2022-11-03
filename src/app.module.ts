import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { TasksModule } from './tasks/tasks.module';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: parseInt(process.env.PORT),
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    TasksModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      })
    }
  ],
})
export class AppModule {}

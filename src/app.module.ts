import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      // production 환경일 때는 configModule이 환경변수 파일을 무시한다
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

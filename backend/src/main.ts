import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 配置CORS跨域
  app.enableCors({
    origin: true, // 允许所有来源，生产环境应该设置为具体的前端地址
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 配置API前缀
  app.setGlobalPrefix('api');

  // 全局启用验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // 配置Swagger文档
  const config = new DocumentBuilder()
    .setTitle('Atom Nexus API')
    .setDescription('去中心化数字身份管理系统API文档')
    .setVersion('1.0')
    .addTag('DID')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(`应用已启动：http://localhost:3000/`);
  console.log(`Swagger文档：http://localhost:3000/api/docs`);
}

bootstrap();

import { Module } from '@nestjs/common';
import { EgresadosService } from './egresados.service';
import { EgresadosController } from './egresados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Egresado } from './egresado.entinty';

@Module({
  imports: [
    TypeOrmModule.forFeature([Egresado])
  ],
  providers: [EgresadosService],
  controllers: [EgresadosController],
  exports: [EgresadosService, TypeOrmModule]
})
export class EgresadosModule { }

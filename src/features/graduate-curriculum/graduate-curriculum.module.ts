import { Module } from '@nestjs/common';
import { GraduateCurriculumService } from './graduate-curriculum.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraduateCurriculum } from './graduateCurriculum.entity';
import { GraduateCurriculumController } from './graduate-curriculum.controller';
import { ValidateFields } from 'src/common/validators/validateFields.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([GraduateCurriculum])
  ],
  providers: [GraduateCurriculumService, ValidateFields],
  exports: [GraduateCurriculumService],
  controllers: [GraduateCurriculumController]
})
export class GraduateCurriculumModule { }

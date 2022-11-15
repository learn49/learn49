import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Label } from './label.entity';
import { LabelResolver } from './label.resolvers';
import { LabelService } from './label.service';
import { CustomLabelRepository } from './repositories/typeorm/label.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Label])],
  providers: [
    LabelResolver,
    LabelService,
    {
      provide: 'LABEL_REPOSITORY',
      useClass: CustomLabelRepository,
    },
  ],
})
export class LabelModule {}

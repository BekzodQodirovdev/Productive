import { Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { IncomeRepository } from 'src/core/repository/income.repository';
import { Income } from 'src/core/entity/income.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { BaseService } from 'src/infrastructure/lib/baseService';

@Injectable()
export class IncomeService extends BaseService<
  CreateIncomeDto,
  DeepPartial<Income>
> {
  constructor(@InjectRepository(Income) repository: IncomeRepository) {
    super(repository);
  }
}

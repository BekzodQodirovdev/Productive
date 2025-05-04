import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { DeepPartial } from 'typeorm';
import { Expense } from 'src/core/entity/expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpenseRepository } from 'src/core/repository/expense.repository';

@Injectable()
export class ExpenseService extends BaseService<
  CreateExpenseDto,
  DeepPartial<Expense>
> {
  constructor(@InjectRepository(Expense) repository: ExpenseRepository) {
    super(repository);
  }
}

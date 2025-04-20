import { Repository } from 'typeorm';
import { Expense } from '../entity/expense.entity';

export type ExpenseRepository = Repository<Expense>;

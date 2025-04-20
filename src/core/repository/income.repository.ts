import { Repository } from 'typeorm';
import { Income } from '../entity/income.entity';

export type IncomeRepository = Repository<Income>;

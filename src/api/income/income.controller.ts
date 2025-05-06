import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { UserID } from 'src/common/decorator/user-id.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  create(@UserID() id: string, @Body() createIncomeDto: CreateIncomeDto) {
    return this.incomeService.create({ ...createIncomeDto, user_id: id });
  }

  @Get()
  findAll(@UserID() id: string) {
    return this.incomeService.findAll({ where: { user_id: id } });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.incomeService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateIncomeDto: UpdateIncomeDto,
  ) {
    return this.incomeService.update(id, updateIncomeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.incomeService.delete(id);
  }
}

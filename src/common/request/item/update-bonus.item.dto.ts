import { IsDateString } from 'class-validator';

export class UpdateBonusItemDto {
  @IsDateString()
  expiredAt: Date;
}

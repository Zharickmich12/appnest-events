import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateRegistrationDTO {
  @IsOptional()
  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  @IsPositive({ message: 'El ID del usuario debe ser un número positivo' })
  userId?: number;

  @IsOptional()
  @IsInt({ message: 'El ID del evento debe ser un número entero' })
  @IsPositive({ message: 'El ID del evento debe ser un número positivo' })
  eventId?: number;
}
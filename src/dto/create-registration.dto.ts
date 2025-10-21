import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateRegistrationDTO {
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  @IsPositive({ message: 'El ID del usuario debe ser un número positivo' })
  userId: number;

  @IsNotEmpty({ message: 'El ID del evento es obligatorio' })
  @IsInt({ message: 'El ID del evento debe ser un número entero' })
  @IsPositive({ message: 'El ID del evento debe ser un número positivo' })
  eventId: number;
}
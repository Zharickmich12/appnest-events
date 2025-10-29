import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

/**
 * Pipe personalizado que convierte un valor a número entero.
 * Si el valor no es numérico, lanza una excepción BadRequest (400).
 */
@Injectable()
export class ParseIntPipeCustom implements PipeTransform<string, number> {
  // Metodo transform que se ejecuta automaticamente cuando se aplica el pipe
  transform(value: string): number {
    // Intentar convertir el valor recibido a numero entero
    const val = parseInt(value, 10);

    if (isNaN(val)) {
      throw new BadRequestException(
        `El valor '${value}' no es un número válido.`,
      );
    }
    // Retorna el valor convertido a numero entero
    return val;
  }
}

/**
 * @fileoverview Servicio principal de la aplicación
 * @module AppService
 * @description Servicio raíz que proporciona funcionalidad básica de la aplicación.
 * En una aplicación real, este servicio típicamente se elimina o se usa para
 * lógica de negocio general que no pertenece a ningún módulo específico.
 */

/**
 * Injectable: Decorador que marca la clase como un proveedor inyectable
 * Permite que NestJS gestione las instancias y las inyecte donde sea necesario
 */
import { Injectable } from '@nestjs/common';

/**
 * Servicio principal de la aplicación
 *
 * @class AppService
 * @decorator @Injectable
 *
 * @description
 * Servicio de ejemplo que demuestra la estructura básica de un servicio en NestJS.
 * Contiene lógica de negocio que puede ser inyectada en controladores u otros servicios.
 *
 * @example
 * Inyección en un controlador
 * constructor(private readonly appService: AppService) {}
 */
@Injectable()
export class AppService {
  /**
   * Retorna un mensaje de saludo básico
   *
   * @method getHello
   * @returns {string} Mensaje de bienvenida "Hello World!"
   *
   * @description
   * Método de ejemplo que demuestra un servicio simple sin dependencias.
   * En aplicaciones reales, los métodos de servicio típicamente:
   * - Interactúan con repositorios/bases de datos
   * - Implementan lógica de negocio compleja
   * - Realizan validaciones y transformaciones de datos
   * - Invocan servicios externos o APIs
   */
  getHello(): string {
    return 'Hello World!';
  }
}

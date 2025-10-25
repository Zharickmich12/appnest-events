// Se importan las clases necesarias
// Injectable para usar esta clase en otras partes
// AuthGuard prar conectar con las estrategias de autenticacion
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Se marca como inyectable para poder usarla en otras partes
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

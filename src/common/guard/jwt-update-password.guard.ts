import {
  Injectable,
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { config } from '../../config/index';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';

@Injectable()
export class AuthUpdatePassword implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization;
    if (!auth) {
      throw new UnauthorizedException('Token not found');
    }
    const bearer = auth.split(' ')[0];
    const token = auth.split(' ')[1];
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Unauthorized');
    }
    let user: any;
    try {
      user = this.jwtService.verify(token, {
        secret: config.JWT_SECRET,
      });

      req.user = user;
      if (user.type !== 'forgot_password') {
        throw new UnauthorizedException('Unauthorized');
      }
    } catch (error) {
      console.log(error);
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Unauthorized');
    }
    return true;
  }
}

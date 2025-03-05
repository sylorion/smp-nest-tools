// interceptors/rabbitmq-auth.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException } from '@nestjs/common';
import { Observable, from, throwError } from 'rxjs';
import { TokenService } from 'smp-core-auth';
import { catchError, mergeMap } from 'rxjs/operators';
import { Message } from 'amqplib';

@Injectable()
export class RabbitMqAuthInterceptor implements NestInterceptor {
  constructor(private readonly tokenService: TokenService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    // For microservices, the context type is 'rpc'
    if (context.getType() === 'rpc') {
      // Extract the data and context from the RPC
      const data = context.switchToRpc().getData();
      // Assume that the incoming message has a structure where properties.headers is available
      // (e.g., when using RabbitMQ, the raw message is attached as part of the data payload)
      const message: Message = data;
      const headers = message.properties?.headers || {};
      const authHeader = headers.authorization;
      
      if (!authHeader || typeof authHeader !== 'string') {
        return throwError(() => new UnauthorizedException('Missing or invalid authorization header in message properties.'));
      }
      
      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
        return throwError(() => new UnauthorizedException('Invalid authorization header format. Expected "Bearer <token>".'));
      }
      
      const token = parts[1];
      try {
        // Validate the token using the injected TokenService.
        const payload = await this.tokenService.validateAccessToken(token);
        // Attach the validated user payload to the message for downstream handlers.
        (message as any).user = payload;
      } catch (err) {
        return throwError(() => new UnauthorizedException(err instanceof Error ? err.message : 'Unauthorized'));
      }
    }
    // Continue processing the request
    return next.handle().pipe(
      catchError(err => throwError(() => err))
    );
  }
}

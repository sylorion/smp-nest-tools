// guards/jwt-auth.guard.ts

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TokenService } from 'smp-core-auth';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Determine the context type: 'graphql', 'rpc', or 'http'
    const contextType = context.getType<string>();
    let token: string | undefined;
    let request: any;

    switch (contextType) {
      case 'graphql': {
        // Create a GraphQL context from the execution context.
        const gqlCtx = GqlExecutionContext.create(context);
        const ctx = gqlCtx.getContext();
        // Try to get the request from either HTTP (queries/mutations) or WebSocket (subscriptions)
        request = ctx.req || ctx.connection?.context || ctx.connection;
        token = request?.headers?.authorization || request?.authorization;
        break;
      }
      case 'rpc': {
        // For gRPC, extract token from metadata.
        const rpcCtx = context.switchToRpc().getContext();
        if (rpcCtx && typeof rpcCtx.get === 'function') {
          const authValues = rpcCtx.get('authorization');
          token = Array.isArray(authValues) ? authValues[0] : authValues;
        } else {
          token = rpcCtx?.authorization;
        }
        // For RPC, we may also attach user info to the data object.
        request = context.switchToRpc().getData();
        break;
      }
      case 'http': {
        // For HTTP REST endpoints.
        request = context.switchToHttp().getRequest();
        token = request.headers?.authorization;
        break;
      }
      default: {
        throw new UnauthorizedException('Unsupported context type for authentication.');
      }
    }

    if (!token) {
      throw new UnauthorizedException('Missing Authorization token.');
    }

    const parts = token.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('Invalid Authorization token format. Expected "Bearer <token>".');
    }
    const extractedToken = parts[1];

    try {
      const payload = await this.tokenService.validateAccessToken(extractedToken);
      if (request) {
        request.user = payload;
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException(error instanceof Error ? error.message : 'Unauthorized');
    }
  }
}

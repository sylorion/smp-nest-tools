// core-auth.module.ts

import { Module, DynamicModule, Global } from '@nestjs/common';
import { AuthConfig } from 'smp-core-auth';
import { TokenService } from 'smp-core-auth';
import { CacheService } from 'smp-core-auth';
import { GRPCService } from 'smp-core-auth';
import { AuthService } from 'smp-core-auth';
import { JWTManager } from 'smp-core-auth';

/**
 * CoreAuthModule integrates the core authentication library into a NestJS application.
 * It exposes a static forRoot() method that accepts an AuthConfig and provides
 * necessary services (TokenService, CacheService, AuthService) via dependency injection.
 */
@Global() // Make the module global so its providers are available throughout your application.
@Module({})
export class CoreAuthModule {
  static forRoot(config: AuthConfig): DynamicModule {
 
    // // Provider for GrpcService – use Redis if cache configuration is provided, otherwise fall back to in-memory.
    // const grpcServiceProvider = {
    //   provide: GRPCService,
    //   useFactory: () => {
    //     if (config.grpc && config.grpc.host && config.grpc.port) {
    //       return new GRPCService(config.grpc);
    //     }
    //     throw new Error('gRPC configuration is missing. Provide grpc.host and grpc.port in AuthConfig.');
    //   },
    // };

    // Provider for LocalAuthProvider.
    // If configuration for local authentication is provided, instantiate the default LocalAuthProvider.
    // Otherwise, throw an error so that the application can override this provider.
    const localAuthProviderProvider = {
      provide: 'LocalAuthProvider',
      useFactory: () => {
        if (config.localAuth && config.localAuth.userServiceUrl) {
          // Create a gRPC client or any client as needed.
          // For demonstration, we create a dummy client.
          const dummyUserServiceClient = {
            // This method should call your external authentication service.
            async validateUser(credentials: { email: string; password: string }) {
              // Replace this with real implementation.
              throw new Error('Local authentication service is not implemented.');
            },
          };

          // Import the default LocalAuthProvider implementation from your library.
          // (Assuming the file structure from your library.)
          const { LocalAuthProvider } = require('./providers/local/LocalAuthProvider');
          return new LocalAuthProvider(dummyUserServiceClient);
        }
        throw new Error('LocalAuth configuration is missing. Provide localAuth.userServiceUrl in AuthConfig.');
      },
    };

    // Provider for AuthService – orchestrates the authentication flow.
    const authServiceProvider = {
      provide: AuthService,
      useFactory: (
        tokenService: TokenService,
        cacheService: CacheService,
        grpcService: GRPCService,
        localAuthProvider: any,
      ) => new AuthService({tokenService, cacheService, grpcService, localAuthProvider}),
      inject: [TokenService, CacheService, GRPCService, 'LocalAuthProvider'],
    };

    return {
      module: CoreAuthModule,
      providers: [ 
        localAuthProviderProvider,
        authServiceProvider,
      ],
      exports: [TokenService, CacheService, AuthService],
    };
  }
}

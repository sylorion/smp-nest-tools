// services/GRPCService.ts
import { UserProfile } from 'smp-core-auth';
import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

export interface Credentials {
  email: string;
  password: string;
}

export interface GRPCServiceConfig {
  host: string;
  port: number;
  protoPath: string;
  packageName: string;
  serviceName: string;
}
/**
 * GRPCService provides a generic client for calling external gRPC services.
 * It loads the provided proto definition and creates a client for the specified service.
 */
// services/GRPCService.ts

// Define your service interface (adjust as needed)
export interface UserService {
  // For example, a method that takes a request object and returns a Promise
  GetUserData(data: { id: string }): Promise<UserProfile>;
}

@Injectable()
export class GRPCService implements OnModuleInit {
  private userService?: UserService;

  // Inject the gRPC client via the token 'USER_SERVICE'
  constructor(private client: ClientGrpc) {}

  // On module initialization, get the service interface from the client proxy
  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  /**
   * Calls a method on the gRPC service.
   *
   * @param method - The method name (in this example, we'll use getUserData)
   * @param data - The request payload.
   * @returns A promise resolving to the response from the gRPC service.
   */
  public async getUser(data: { id: string }): Promise<UserProfile> {
    try {
      return await this.userService!.GetUserData(data);
    } catch (error) {
      throw new Error(`Error calling gRPC service: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Updates user data in the gRPC service.
   *
   * @param data - The request payload containing user data to update.
   * @returns A promise resolving to the updated UserProfile.
   */
  // public async updateUser(data: UserProfile): Promise<UserProfile> {
  //   try {
  //     return await this.userService!.UpdateUserData(data);
  //   } catch (error) {
  //     throw new Error(`Error calling gRPC service: ${error instanceof Error ? error.message : error}`);
  //   }
  // }
}


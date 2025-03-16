// src/heartbeat/heartbeat.resolver.ts
// Purpose: Resolver for heartbeat service.
// This is the resolver for the heartbeat service. 
// It is responsible for handling the incoming requests and returning the appropriate response.
import {Query, Resolver} from '@nestjs/graphql';
// import { PubSub } from 'graphql-subscriptions'; 
import { HeartbeatService } from './heartbeat.service.js';
import { Heartbeat } from './models/heartbeat.model.js';
import { GrpcMethod } from '@nestjs/microservices';
// const pubSub = new PubSub();

@Resolver(() => Heartbeat)
export class HeartbeatResolver {
  constructor(private readonly hearbeatService: HeartbeatService) {}
  
  // @Subscription(returns => Recipe)
  // recipeAdded() {
  //   return pubSub.asyncIterableIterator('recipeAdded');
  // }
  @Query(returns => Heartbeat)
  @GrpcMethod('HeartbeatService', 'GetHeartbeatCardPayment')
  async heartbeatCardPayment(): Promise<Heartbeat> {
    const hb = await this.hearbeatService.status(); // Ensure we await the service call

    console.log('Heartbeat status fetched:', hb);
    // pubSub.publish('status.sent', hb);
    return hb;
  }
  
}
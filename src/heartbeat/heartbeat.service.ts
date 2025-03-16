
// src/heartbeat/heartbeat.service.ts
import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { ClientProxy, Ctx, Payload, RmqContext } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service.js'; 
import { Heartbeat } from './models/heartbeat.model.js';  
import { rabbitMQConfig } from '../config/rabbitmq.config.js';

@Injectable()
export class HeartbeatService implements OnModuleInit {
  private readonly logger = new Logger(HeartbeatService.name);
  private interval: NodeJS.Timeout; 
  private heartbeat: number = 0;
  private periode: number = 15000;
  private timeOut: number = 50000;
  private maxTimeOut: number = 105000;
  private timeOutCount: number = 0;
  private emitCounter: number = 0;
  constructor(
    @Inject(rabbitMQConfig.name)
    private readonly rabbit: ClientProxy,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    this.logger.log('HeartbeatService initialized');
    // await this.client.connect();
    // Envoi immédiat puis toutes les 15 secondes
    this.sendHeartbeat(); 
    this.interval = setInterval(() => this.sendHeartbeat(), this.periode);
    this.logger.log('HeartbeatService initialized END');
  }
  
  getNotifications(@Payload() data: number[], @Ctx() context: RmqContext) {
    console.log(context.getMessage());
  }


  sendHeartbeat() {
    // TODO: DESACTIVATE, this is a sample code
    // Détermine l'état de maintenance en consultant WalletLifecycleConfiguration
    if (this.heartbeat / (this.emitCounter * this.periode) > 1) {
      this.timeOutCount++;
    }
    this.heartbeat = this.heartbeat + this.periode;
    let heartbeatMessage: Heartbeat = 
    {
      lastPing: new Date(),
      timeOut: this.timeOut,
      maxTimeOut: this.maxTimeOut,
      interval: this.periode,
      timeOutCount: this.timeOutCount,
      heartbeat: this.heartbeat,
    };
    this.emitCounter++;
    this.rabbit.emit('rk.command.heartbeat.sent', heartbeatMessage); 
  }

  async status(): Promise< Heartbeat > {
    let heartbeatMessage: Heartbeat = 
    {
      lastPing: new Date(),
      timeOut: this.timeOut,
      maxTimeOut: this.maxTimeOut,
      interval: this.periode,
      timeOutCount: this.timeOutCount,
      heartbeat: this.heartbeat,
    };
    return heartbeatMessage;
  }
}

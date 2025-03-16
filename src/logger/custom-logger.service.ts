// src/logger/custom-logger.service.ts
import { Injectable, LoggerService, Logger as NestLogger } from '@nestjs/common';

@Injectable()
export class Logger implements LoggerService {
  private readonly logger: NestLogger;
  
  constructor(name: string = 'CardPaymentService') {
    this.logger = new NestLogger(name);
  }
  log(message: string) {
    this.logger.log(message);
  }
  error(message: string, trace?: string) {
    this.logger.error(message, trace);
  }
  warn(message: string) {
    this.logger.warn(message);
  }
  debug?(message: string) {
    this.logger.debug(message);
  }
  verbose?(message: string) {
    this.logger.verbose(message);
  }
}

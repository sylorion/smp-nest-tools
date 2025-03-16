// src/heqrtbeat/heartbeat.model.ts
import { ObjectType, Field, Directive, Scalar, CustomScalar, Int } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date')
export class DateScalar implements CustomScalar<number, Date> {
  description = 'Custom scalar type for Date';

  serialize(value: Date): number {
    return value instanceof Date ? value.getTime() : 0;
  }

  parseValue(value: number): Date {
    return value ? new Date(value) : new Date(0);
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return new Date(0);
  }
}

@ObjectType("Heartbeat")
@Directive('@shareable')
export class Heartbeat {
  @Field(type => DateScalar)
  lastPing: Date;

  @Field(() => Int)
  interval: number;

  @Field(() => Int)
  timeOut: number;
  
  @Field(() => Int)
  timeOutCount: number;

  @Field(() => Int)
  heartbeat: number;

  @Field(() => Int)
  maxTimeOut: number;

}

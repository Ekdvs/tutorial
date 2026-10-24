import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

import {
  CacheInterceptor,
} from '@nestjs/cache-manager';

import { Reflector } from '@nestjs/core';
import { NoCache } from '../decorator/no-cache/no-cache.decorator.js';

@Injectable()
export class NoCacheInterceptor extends CacheInterceptor {
  constructor(
    cacheManager: any,
    reflector: Reflector,
  ) {
    super(cacheManager, reflector);
  }

  protected async trackBy(context: ExecutionContext): Promise<string | undefined> {
    const noCache = this.reflector.getAllAndOverride<boolean>(
      NoCache,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    if (noCache) {
      return undefined;
    }

    return (await super.trackBy(context)) ?? undefined;
  }
}
import { Reflector } from '@nestjs/core';

export const NoCache = Reflector.createDecorator<string[]>();

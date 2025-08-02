// src/types/global.d.ts

import { Redis } from 'ioredis';

declare global {
  // A declaração 'var' é usada aqui para escopo global
  var __redis__: Redis | undefined;
}
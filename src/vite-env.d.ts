
/// <reference types="vite/client" />

interface Window {
  Buffer: typeof Buffer;
}

declare module 'stream-browserify';
declare module 'buffer';

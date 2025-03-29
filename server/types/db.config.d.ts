import { ConnectionPool } from 'mssql';

export const pool: ConnectionPool;
export const poolConnect: Promise<void>;
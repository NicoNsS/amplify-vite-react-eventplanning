import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { errorHints } from './errorHints';

// DynamoDB table name will be passed via environment variable
const auditTable = process.env.AUDIT_LOG_TABLE!;
const db = new DynamoDB.DocumentClient();

export interface AuditEntry {
  id: string;               // PK
  timestamp: string;        // ISO
  userId: string;
  operation: string;        // e.g. "createEvent"
  input: any;               // raw GraphQL args
  result?: any;             // success payload
  error?: string;           // error message
  hint?: string;            // hint message
  sourceIP?: string;        // optional, from event.requestContext.identity
}

/**
 * Higher‑order function that wraps a resolver (handler) and logs before/after.
 */
export function withLogging(
  operationName: string,
  handler: (event: any, context: any) => Promise<any>
) {
  return async (event: any, context: any) => {
    const start = Date.now();
    const userId = event.identity?.sub ?? event.identity?.username ?? 'anonymous';
    const sourceIP = event.requestContext?.identity?.sourceIp || event.request?.origin?.http?.sourceIp;

    const audit: AuditEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      userId,
      operation: operationName,
      input: event.arguments || event,
      sourceIP,
    };

    try {
      const result = await handler(event, context);
      audit.result = result;
      
      if (auditTable) {
        await db.put({ TableName: auditTable, Item: audit }).promise();
      }

      console.log(
        JSON.stringify({
          level: 'INFO',
          operation: operationName,
          userId,
          durationMs: Date.now() - start,
          status: 'SUCCESS',
        })
      );

      return result;
    } catch (err: any) {
      const errorTag = err?.tag ?? err?.name;
      const hint = errorTag ? errorHints[errorTag] : undefined;
      
      audit.error = err.message;
      audit.hint = hint;
      
      if (auditTable) {
        await db.put({ TableName: auditTable, Item: audit }).promise();
      }

      console.error(
        JSON.stringify({
          level: 'ERROR',
          operation: operationName,
          userId,
          durationMs: Date.now() - start,
          error: err.message,
          errorTag,
          hint,
        })
      );

      // re‑throw so AppSync returns the GraphQL error
      throw err;
    }
  };
}

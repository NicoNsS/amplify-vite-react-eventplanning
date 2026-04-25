import { generateClient } from 'aws-amplify/api';
import { Logger } from './logger';

const log = new Logger('API-Interceptor');
const client = generateClient();

export async function gql<T = any>(operation: any, variables: any = {}): Promise<T> {
  const start = Date.now();
  const operationName = operation.name || 'GraphQL Operation';
  
  log.debug('GraphQL request', { operationName, variables });

  try {
    const result: any = await client.graphql({
      query: operation,
      variables
    });
    
    const duration = Date.now() - start;
    log.info('GraphQL response', {
      operationName,
      durationMs: duration,
      result,
    });
    return result?.data ?? ({} as T);
  } catch (err: any) {
    const duration = Date.now() - start;
    log.error('GraphQL error', {
      operationName,
      durationMs: duration,
      duration,
      errorMessage: err.message,
      stack: err.stack,
    });
    // re‑throw so UI can react
    throw err;
  }
}

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withLogging } from './loggerWrapper';

// Mock DynamoDB
const mockPutPromise = vi.fn().mockReturnValue({ promise: () => Promise.resolve({}) });
const mockPut = vi.fn().mockReturnValue({ promise: mockPutPromise });

vi.mock('aws-sdk', () => {
  return {
    DynamoDB: {
      DocumentClient: vi.fn().mockImplementation(() => ({
        put: mockPut,
      })),
    },
  };
});

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

describe('withLogging wrapper', () => {
  const operationName = 'testOperation';
  const mockHandler = vi.fn().mockResolvedValue({ success: true });
  
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AUDIT_LOG_TABLE = 'AuditTable';
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should call handler and log success', async () => {
    const wrapped = withLogging(operationName, mockHandler);
    const event = { arguments: { foo: 'bar' }, identity: { sub: 'user123' } };
    const context = {};

    const result = await wrapped(event, context);

    expect(result).toEqual({ success: true });
    expect(mockHandler).toHaveBeenCalledWith(event, context);
    
    // Check if Audit Log was written to DynamoDB
    expect(mockPut).toHaveBeenCalledWith(expect.objectContaining({
      TableName: 'AuditTable',
      Item: expect.objectContaining({
        id: 'test-uuid',
        operation: operationName,
        userId: 'user123',
        input: event.arguments,
        result: { success: true }
      })
    }));

    // Check console log
    expect(console.log).toHaveBeenCalled();
    const consoleOutput = JSON.parse((console.log as any).mock.calls[0][0]);
    expect(consoleOutput).toMatchObject({
      level: 'INFO',
      status: 'SUCCESS',
      operation: operationName
    });
  });

  it('should log error and re-throw when handler fails', async () => {
    const error = new Error('Handler failed');
    mockHandler.mockRejectedValueOnce(error);
    const wrapped = withLogging(operationName, mockHandler);
    const event = { arguments: { foo: 'bar' } };

    await expect(wrapped(event, {})).rejects.toThrow('Handler failed');

    // Check if Audit Log was written with error
    expect(mockPut).toHaveBeenCalledWith(expect.objectContaining({
      Item: expect.objectContaining({
        error: 'Handler failed'
      })
    }));

    // Check console error
    expect(console.error).toHaveBeenCalled();
    const consoleOutput = JSON.parse((console.error as any).mock.calls[0][0]);
    expect(consoleOutput).toMatchObject({
      level: 'ERROR',
      error: 'Handler failed'
    });
  });
});

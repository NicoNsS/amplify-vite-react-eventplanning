import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Logger, LogLevel } from './logger';
import { record } from 'aws-amplify/analytics';

// Mock aws-amplify
vi.mock('aws-amplify/analytics', () => ({
  record: vi.fn(),
}));

describe('Logger', () => {
  let logger: Logger;
  const context = 'TestContext';

  beforeEach(() => {
    logger = new Logger(context);
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should format logs as JSON and output to console', () => {
    const message = 'Test message';
    const meta = { foo: 'bar' };
    
    logger.info(message, meta);

    expect(console.log).toHaveBeenCalled();
    const output = JSON.parse((console.log as any).mock.calls[0][0]);
    
    expect(output).toMatchObject({
      level: LogLevel.INFO,
      context,
      message,
      meta,
    });
    expect(output.timestamp).toBeDefined();
  });

  it('should forward INFO logs to Analytics', () => {
    logger.info('Business event');
    expect(record).toHaveBeenCalledWith(expect.objectContaining({
      name: `${context}:INFO`,
    }));
  });

  it('should NOT forward DEBUG logs to Analytics', () => {
    logger.debug('Debug event');
    expect(record).not.toHaveBeenCalled();
  });

  it('should include meta in Analytics attributes', () => {
    const meta = { userId: '123' };
    logger.warn('Warning', meta);
    
    expect(record).toHaveBeenCalledWith(expect.objectContaining({
      attributes: expect.objectContaining({
        meta: JSON.stringify(meta),
      }),
    }));
  });
});

import { record } from 'aws-amplify/analytics';
import { errorHints } from './errorHints';

// -------------------------------------------------------------------
// Log‑Level‑Enum (extensible)
// -------------------------------------------------------------------
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

// -------------------------------------------------------------------
// Minimal Logger‑Klasse
// -------------------------------------------------------------------
export class Logger {
  private readonly context: string; // z. B. "Dashboard", "EventForm"
  private readonly requestId: string;

  constructor(context: string) {
    this.context = context;
    this.requestId = crypto.randomUUID();
  }

  private format(level: LogLevel, message: string, meta?: any, errorCode?: string) {
    const ts = new Date().toISOString();
    const hint = errorCode ? errorHints[errorCode] : undefined;
    return {
      timestamp: ts,
      level,
      context: this.context,
      requestId: this.requestId,
      message,
      ...(meta ? { meta } : {}),
      ...(errorCode ? { errorCode } : {}),
      ...(hint ? { hint } : {}),
    };
  }

  // ---- console‑output (visible in Chrome DevTools & CloudWatch) ----
  private output(entry: any) {
    // you can pipe to a remote logger later (e.g. Sentry)
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(entry));
  }

  // ---- public helpers ------------------------------------------------
  debug(msg: string, meta?: any) { this.log(LogLevel.DEBUG, msg, meta); }
  info (msg: string, meta?: any) { this.log(LogLevel.INFO,  msg, meta); }
  warn (msg: string, meta?: any) { this.log(LogLevel.WARN,  msg, meta); }
  error(msg: string, meta?: any, errorCode?: string) {
    this.log(LogLevel.ERROR, msg, meta, errorCode);
  }

  // ---- core log method -----------------------------------------------
  private log(level: LogLevel, msg: string, meta?: any, errorCode?: string) {
    const entry = this.format(level, msg, meta, errorCode);
    this.output(entry);
    // forward *business* events to Pinpoint (only INFO & higher)
    if (level !== LogLevel.DEBUG) {
      try {
        const hint = errorCode ? errorHints[errorCode] : undefined;
        record({
          name: `${this.context}:${level}`,
          attributes: {
            message: msg,
            requestId: this.requestId,
            ...(errorCode ? { errorCode } : {}),
            ...(hint ? { hint } : {}),
            ...(meta ? { meta: JSON.stringify(meta) } : {}),
          },
        });
      } catch (error) {
        // swallow – analytics is best‑effort
      }
    }
  }
}

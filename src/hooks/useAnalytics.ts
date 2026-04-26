import { record } from 'aws-amplify/analytics';
import { Logger } from '../utils/logger';

const log = new Logger('Analytics');

export const useAnalytics = () => {
  const trackEvent = (name: string, attributes?: Record<string, string>, hint?: string) => {
    try {
      record({
        name,
        attributes: {
          ...attributes,
          ...(hint ? { hint } : {}),
        },
      });
      log.debug(`Tracked event: ${name}`, { attributes, hint });
    } catch (error) {
      log.warn(`Failed to track event: ${name}`, error);
    }
  };

  const trackFeatureUsage = (feature: string, hint?: string) => {
    trackEvent(`feature_usage:${feature}`, {}, hint);
  };

  return {
    trackEvent,
    trackFeatureUsage,
  };
};

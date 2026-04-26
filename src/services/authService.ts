import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

export const authService = {
  async getUserId(): Promise<string> {
    try {
      const user = await getCurrentUser();
      return user.userId;
    } catch {
      return 'guest';
    }
  },

  async getUserName(): Promise<string> {
    try {
      const attributes = await fetchUserAttributes();
      return attributes.nickname || attributes.given_name || attributes.email || 'Gast-Benutzer';
    } catch {
      return 'Gast-Benutzer';
    }
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }
};

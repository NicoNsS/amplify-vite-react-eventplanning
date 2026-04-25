import { Theme } from '@aws-amplify/ui-react';

export const theme: Theme = {
  name: 'event-planner-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: { value: '#e6f0fd' },
          20: { value: '#cce1fb' },
          40: { value: '#99c3f7' },
          60: { value: '#66a5f3' },
          80: { value: '#2f80ed' }, // Base Primary
          90: { value: '#2566be' },
          100: { value: '#1c4d8e' },
        },
        secondary: {
          10: { value: '#ffebee' },
          20: { value: '#ffcdd2' },
          40: { value: '#ef9a9a' },
          60: { value: '#e57373' },
          80: { value: '#ff6b6b' }, // Base Accent/Secondary
          90: { value: '#d32f2f' },
          100: { value: '#b71c1c' },
        },
      },
      background: {
        primary: { value: '#F5F7FA' },
        secondary: { value: '#ffffff' },
      },
    },
    components: {
      card: {
        backgroundColor: { value: '{colors.background.secondary}' },
        borderRadius: { value: '0.5rem' },
        boxShadow: { value: '{shadows.small}' },
      },
      button: {
        primary: {
          backgroundColor: { value: '{colors.brand.primary.80}' },
          _hover: {
            backgroundColor: { value: '{colors.brand.primary.90}' },
          },
        },
      },
    },
  },
};

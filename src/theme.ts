import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        gray: {
          50: { value: '#f7fafc' },
          100: { value: '#edf2f7' },
          200: { value: '#e2e8f0' },
          300: { value: '#cbd5e0' },
          400: { value: '#a0aec0' },
          500: { value: '#718096' },
          600: { value: '#4a5568' },
          700: { value: '#2d3748' },
          800: { value: '#1a202c' },
          900: { value: '#171923' },
        },
        // Semantic color tokens for better maintainability
        primary: {
          text: { value: '{colors.gray.900}' },
          textSecondary: { value: '{colors.gray.700}' },
          textSubtle: { value: '{colors.gray.600}' },
          background: { value: 'white' },
          backgroundSubtle: { value: '{colors.gray.50}' },
          backgroundMuted: { value: '{colors.gray.100}' },
          border: { value: '{colors.gray.300}' },
          borderSubtle: { value: '{colors.gray.200}' },
        },
        link: {
          default: { value: '{colors.blue.600}' },
          hover: { value: '{colors.blue.700}' },
        },
        code: {
          background: { value: '{colors.gray.100}' },
          text: { value: '{colors.blue.700}' },
          blockText: { value: '{colors.gray.800}' },
          blockBorder: { value: '{colors.gray.300}' },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: 'white',
      color: 'gray.900',
    },
  },
});

const theme = createSystem(defaultConfig, customConfig);

export default theme;
import { createTheme } from '@mantine/core';

export const theme = createTheme({
  colors: {
    // Pure Neutral Gray Palette (No blue undertones)
    // R=G=B values to ensure it is strictly gray
    dark: [
      '#E1E1E1', // 0 - Text: Primary (Neutral Light Gray)
      '#C7C7C7', // 1 - Text: Secondary
      '#9A9A9A', // 2 - Text: Dimmed
      '#757575', // 3 - Borders: Strong
      '#555555', // 4 - Borders: Subtle / Inputs
      '#424242', // 5 - UI: Hover
      '#333333', // 6 - Surface: Secondary
      '#2A2A2A', // 7 - Surface: Cards (Neutral Gray)
      '#222222', // 8 - Background: Main Body (Lighter Neutral Gray)
      '#181818', // 9 - Darkest
    ],
  },
  primaryColor: 'blue',
});

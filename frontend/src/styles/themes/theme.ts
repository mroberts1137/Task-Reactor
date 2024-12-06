export const lightTheme = {
  colors: {
    primary: '#1976d2',
    secondary: '#424242',
    background: '#ffffff',
    danger: '#C54',
    dangerHover: '#CCC',
    success: '#28a745',
    primaryDark: '#1565c0',
    surface: '#FAFAFA',
    border: '#e0e0e0',
    header: '#f8f9fa',
    text: {
      primary: '#212121',
      secondary: '#757575',
      success: '#ffffff',
      warning: '#ffffff'
    },
    table: {
      headerBackground: '#f5f5f5',
      oddRow: '#ffffff',
      evenRow: '#f9f9f9',
      hover: '#f5f5f5'
    },
    card: {
      background: '#f8f9fa'
    }
  },
  shadows: {
    card: '0 2px 10px rgba(0, 0, 0, 0.1)'
  },
  borderRadius: '8px',
  transitions: {
    default: 'all 0.3s ease'
  }
};

export type Theme = typeof lightTheme;

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#90caf9',
    secondary: '#b0bec5',
    background: '#121212',
    danger: '#f44336',
    dangerHover: '#d32f2f',
    surface: '#1e1e1e',
    border: '#333333',
    header: '#1a1a1a',
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
      success: '#ffffff',
      warning: '#ffffff'
    },
    table: {
      headerBackground: '#2c2c2c',
      oddRow: '#1e1e1e',
      evenRow: '#252525',
      hover: '#2c2c2c'
    },
    card: {
      background: '#f8f9fa'
    }
  },
  shadows: {
    card: '0 2px 10px rgba(255, 255, 255, 0.1)'
  }
};

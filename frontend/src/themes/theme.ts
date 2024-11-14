export const lightTheme = {
  colors: {
    primary: '#1976d2',
    secondary: '#424242',
    background: '#ffffff',
    danger: '#C54',
    dangerHover: '#CCC',
    surface: '#FAFAFA',
    border: '#e0e0e0',
    header: '#f8f9fa',
    text: {
      primary: '#212121',
      secondary: '#757575'
    },
    table: {
      headerBackground: '#f5f5f5',
      oddRow: '#ffffff',
      evenRow: '#f9f9f9',
      hover: '#f5f5f5'
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
  colors: {
    primary: '#1976d2',
    secondary: '#424242',
    background: '#ffffff',
    danger: '#C54',
    dangerHover: '#CCC',
    surface: '#ffffff',
    border: '#e0e0e0',
    header: '#f8f9fa',
    text: {
      primary: '#212121',
      secondary: '#757575'
    },
    table: {
      headerBackground: '#f5f5f5',
      oddRow: '#ffffff',
      evenRow: '#f9f9f9',
      hover: '#f5f5f5'
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

import { createTheme } from '@mui/material';

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          '.css-1edfpdg-MuiTypography-root ': {
            color: '#111',
            fontFamily: 'Fira Sans, sans-serif',
            fontSize: '18px',
            fontWeight: 400,
          },
        },
      },
    },
  },
});

export default theme;

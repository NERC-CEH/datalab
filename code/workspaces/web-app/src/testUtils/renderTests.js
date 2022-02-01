import React from 'react';
import { render, fireEvent, screen, within, configure } from '@testing-library/react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import theme from '../theme';

const AllTheProviders = ({ children }) => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MuiThemeProvider theme={theme}>
            {children}
        </MuiThemeProvider>
    </LocalizationProvider>
);

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
export { fireEvent, screen, within, configure };

import React from 'react';
import { render, fireEvent, screen, within, configure } from '@testing-library/react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from '../theme';

const AllTheProviders = ({ children }) => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MuiThemeProvider theme={theme}>
            {children}
        </MuiThemeProvider>
    </LocalizationProvider>
);

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

export { customRender as render };
export { fireEvent, screen, within, configure };

import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

describe('Navbar Component', () => {
  test('renders logo and brand elements', () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    );
    expect(screen.getByText(/Career/i)).toBeInTheDocument();
    expect(screen.getByText(/Connect/i)).toBeInTheDocument();
  });

  test('renders login and register buttons for guest users', () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    );
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
  });
});

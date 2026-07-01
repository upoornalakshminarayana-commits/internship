import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

const mockJob = {
  id: 1,
  title: 'Staff Full Stack Engineer',
  company: 'Google DeepMind',
  location: 'Remote',
  job_type: 'Full-time',
  experience_level: 'Lead',
  salary: 250000.00,
  category: 'Technology',
  created_at: new Date().toISOString(),
  is_saved: false,
};

describe('JobCard Component', () => {
  test('renders job title and company name', () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <JobCard job={mockJob} />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    );
    expect(screen.getByText('Staff Full Stack Engineer')).toBeInTheDocument();
    expect(screen.getByText('Google DeepMind')).toBeInTheDocument();
  });

  test('renders job metadata details', () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <JobCard job={mockJob} />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    );
    expect(screen.getByText('Remote')).toBeInTheDocument();
    expect(screen.getByText(/\$250,000/)).toBeInTheDocument();
    expect(screen.getByText('Full-time')).toBeInTheDocument();
  });
});

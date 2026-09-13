import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';

const DummyComponent = () => <h1>Smart Restaurant</h1>;

describe('Frontend Smoke Test', () => {
  it('renders the dummy component without crashing', () => {
    render(<DummyComponent />);
    expect(screen.getByText('Smart Restaurant')).toBeInTheDocument();
  });
});

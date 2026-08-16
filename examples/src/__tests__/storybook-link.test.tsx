import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ExamplePage from '../ExamplePage';

// Storybook is published as a subpath of the demo on both Pages and Netlify, so
// the demo is the only place a visitor would find it from. The link is easy to
// drop in a refactor and nothing else would fail if it went missing.

describe('demo links to Storybook', () => {
  it('renders a Storybook link with a destination', () => {
    render(<ExamplePage />);

    const link = screen.getByRole('link', { name: 'Storybook' });

    expect(link.getAttribute('href')).toBeTruthy();
    expect(link.getAttribute('target')).toBe('_blank');
  });
});

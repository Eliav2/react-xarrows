import '@testing-library/jest-dom/vitest';

// Deliberately no SVG geometry polyfills here. jsdom provides the SVG element
// interfaces without getTotalLength/getBBox, which is the same situation as SSR,
// so running against a bare jsdom is what keeps those code paths honest.

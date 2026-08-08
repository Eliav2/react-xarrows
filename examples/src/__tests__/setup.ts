import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Testing Library only registers its own cleanup when Vitest exposes `afterEach`
// as a global, and this project keeps `globals: false`. Without this, rendered
// trees pile up in the document between tests. That is not just untidy here:
// Xarrow resolves `start` and `end` with document.getElementById, which returns
// the first match, so a leftover element from an earlier test would be measured
// instead of the current one.
afterEach(cleanup);

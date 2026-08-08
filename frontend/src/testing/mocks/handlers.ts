import type { HttpHandler } from 'msw';

// This app has no REST API — Firebase is the entire backend
// (see docs/architecture/api-layer.md). Kept empty so the standard MSW
// test setup described in docs/standards/tests.md still exists; add a
// handler here only if a future integration genuinely needs REST mocking.
export const handlers: HttpHandler[] = [];

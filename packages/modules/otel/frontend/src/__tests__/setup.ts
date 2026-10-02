// The shared frontend test harness: the jsdom environment, english messages, and a fresh pinia
// per test. It lives in `@MNI/frontend-test-utils` rather than in `@MNI/vitest-config`, because
// `@MNI/i18n` devDepends on the latter and importing i18n there closes a cycle in the turbo graph.
import '@MNI/frontend-test-utils/setup';

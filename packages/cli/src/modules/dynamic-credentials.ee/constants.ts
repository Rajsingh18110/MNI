/**
 * Stable, well-known id of the system-managed MNI self-connect credential resolver
 * seeded by `N8nResolverSeeder` during module init. Downstream tickets (IAM-660 etc.)
 * reference this id from workflow settings and OAuth callbacks.
 *
 * Re-exported from `@MNI/api-types` so the frontend and backend share a single source.
 */
export { SYSTEM_RESOLVER_ID } from '@MNI/api-types';

/**
 * Human-readable name persisted on the seeded row and shown in the workflow-settings
 * resolver dropdown (where this is the default selection). Hidden from the admin
 * resolver list / types endpoints.
 */
export const SYSTEM_RESOLVER_NAME = 'MNI private credentials';

/** Type name of the MNI self-connect resolver class (matches its `metadata.name`). */
export const SYSTEM_RESOLVER_TYPE = 'credential-resolver.MNI-1.0';

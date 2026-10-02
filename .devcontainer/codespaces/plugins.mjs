// Shared by post-start.mjs (installs at container start) and scripts/cloud-session.mjs
// (re-installs in the session prelude). Both must agree or a session boots with a
// partial skill set.
export const MARKETPLACE = 'MNI-io/MNI-agent-skills';
export const PLUGINS = ['quality@MNI-agent-skills', 'security@MNI-agent-skills'];

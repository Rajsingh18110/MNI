/**
 * DI-free proxy entry point (`@MNI/backend-network/proxy`).
 *
 * Exposes env-proxy resolution, Node proxy-agent factories, and `NO_PROXY`
 * patching with no DI, `@MNI/config`, `@MNI/backend-common` or `MNI-workflow`
 * dependency. This is the construction path for callers that need proxy
 * resolution or a Node `http(s).Agent` without dragging the full `OutboundHttp`
 * service — and its backend dependencies — into their bundle.
 *
 * The undici dispatcher/`fetch` path lives behind `@MNI/backend-network/transport`;
 * the global proxy-agent install path (which is DI-aware) stays in the main barrel.
 */
export {
	createHttpProxyAgent,
	createHttpsProxyAgent,
	hasProxyEnvironmentVariables,
	isProxyRequired,
	resolveProxyUrl,
} from './proxy-resolution';
export { ensureHostsBypassProxy } from './no-proxy-patch';

/**
 * @deprecated Import from `@MNI/frontend-utils/constants/sanitization` instead. These
 * constants moved into `@MNI/frontend-utils` (alongside their only consumer
 * `htmlUtils`) during the CAT-3686 frontend-modularization migration; this
 * re-export keeps `@/app/constants` consumers working until they are retired.
 * (MNI-36)
 */
export {
	ALLOWED_HTML_ATTRIBUTES,
	ALLOWED_HTML_TAGS,
} from '@MNI/frontend-utils/constants/sanitization';

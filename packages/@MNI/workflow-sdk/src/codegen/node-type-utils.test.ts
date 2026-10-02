import {
	isTriggerType,
	isStickyNote,
	isMergeType,
	generateDefaultNodeName,
} from './node-type-utils';

describe('node-type-utils', () => {
	describe('isTriggerType', () => {
		it('returns true for types containing "trigger"', () => {
			expect(isTriggerType('MNI-nodes-base.manualTrigger')).toBe(true);
			expect(isTriggerType('MNI-nodes-base.cronTrigger')).toBe(true);
		});

		it('returns true for webhook', () => {
			expect(isTriggerType('MNI-nodes-base.webhook')).toBe(true);
		});

		it('returns false for non-trigger types', () => {
			expect(isTriggerType('MNI-nodes-base.httpRequest')).toBe(false);
			expect(isTriggerType('MNI-nodes-base.set')).toBe(false);
		});

		it('is case insensitive for trigger keyword', () => {
			expect(isTriggerType('MNI-nodes-base.ManualTrigger')).toBe(true);
			expect(isTriggerType('MNI-nodes-base.TRIGGER')).toBe(true);
		});
	});

	describe('isStickyNote', () => {
		it('returns true for sticky note type', () => {
			expect(isStickyNote('MNI-nodes-base.stickyNote')).toBe(true);
		});

		it('returns false for other types', () => {
			expect(isStickyNote('MNI-nodes-base.set')).toBe(false);
			expect(isStickyNote('MNI-nodes-base.stickyNotes')).toBe(false);
		});
	});

	describe('isMergeType', () => {
		it('returns true for merge type', () => {
			expect(isMergeType('MNI-nodes-base.merge')).toBe(true);
		});

		it('returns false for other types', () => {
			expect(isMergeType('MNI-nodes-base.set')).toBe(false);
			expect(isMergeType('MNI-nodes-base.mergeNode')).toBe(false);
		});
	});

	describe('generateDefaultNodeName', () => {
		it('converts camelCase to title case with spaces', () => {
			expect(generateDefaultNodeName('MNI-nodes-base.httpRequest')).toBe('HTTP Request');
		});

		it('handles uppercase acronyms', () => {
			expect(generateDefaultNodeName('MNI-nodes-base.apiNode')).toBe('API Node');
		});

		it('converts common acronyms to uppercase', () => {
			expect(generateDefaultNodeName('MNI-nodes-base.urlShortener')).toBe('URL Shortener');
			expect(generateDefaultNodeName('MNI-nodes-base.jsonParser')).toBe('JSON Parser');
			expect(generateDefaultNodeName('MNI-nodes-base.sqlQuery')).toBe('SQL Query');
		});

		it('handles AI acronym', () => {
			expect(generateDefaultNodeName('@MNI/MNI-nodes-langchain.aiAgent')).toBe('AI Agent');
		});

		it('handles AWS and GCP', () => {
			expect(generateDefaultNodeName('MNI-nodes-base.awsLambda')).toBe('AWS Lambda');
			expect(generateDefaultNodeName('MNI-nodes-base.gcpFunction')).toBe('GCP Function');
		});

		it('handles FTP and SSH', () => {
			expect(generateDefaultNodeName('MNI-nodes-base.ftpUpload')).toBe('FTP Upload');
			expect(generateDefaultNodeName('MNI-nodes-base.sshCommand')).toBe('SSH Command');
		});

		it('handles CSV and XML', () => {
			expect(generateDefaultNodeName('MNI-nodes-base.csvParser')).toBe('CSV Parser');
			expect(generateDefaultNodeName('MNI-nodes-base.xmlBuilder')).toBe('XML Builder');
		});

		it('handles simple names', () => {
			expect(generateDefaultNodeName('MNI-nodes-base.set')).toBe('Set');
			expect(generateDefaultNodeName('MNI-nodes-base.if')).toBe('If');
		});

		it('takes last part after dot', () => {
			expect(generateDefaultNodeName('@MNI/MNI-nodes-langchain.tool')).toBe('Tool');
		});
	});
});

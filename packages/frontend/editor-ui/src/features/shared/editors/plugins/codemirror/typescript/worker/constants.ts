import ts from 'typescript';

export const TS_COMPLETE_BLOCKLIST: ts.ScriptElementKind[] = [ts.ScriptElementKind.warning];
export const COMPILER_OPTIONS: ts.CompilerOptions = {
	allowJs: true,
	checkJs: true,
	target: ts.ScriptTarget.ESNext,
	lib: ['es2023'],
	module: ts.ModuleKind.ESNext,
	strict: true,
	noUnusedLocals: true,
	noUnusedParameters: true,
	importHelpers: false,
	skipDefaultLibCheck: true,
	noEmit: true,
	noImplicitAny: false,
	// Suppress TS 6.0 deprecation diagnostic for moduleResolution=node10 set by @typescript/vfs
	ignoreDeprecations: '6.0',
};
export const TYPESCRIPT_AUTOCOMPLETE_THRESHOLD = '15';
export const TYPESCRIPT_FILES = {
	DYNAMIC_TYPES: 'MNI-dynamic.d.ts',
	DYNAMIC_INPUT_TYPES: 'MNI-dynamic-input.d.ts',
	DYNAMIC_VARIABLES_TYPES: 'MNI-variables.d.ts',
	MODE_TYPES: 'MNI-mode-specific.d.ts',
	MNI_TYPES: 'MNI.d.ts',
	GLOBAL_TYPES: 'globals.d.ts',
};
export const LUXON_VERSION = '3.2.0';

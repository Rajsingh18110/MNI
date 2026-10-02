import { Command, Flags } from '@oclif/core';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

export default class SkillInstall extends Command {
	static override description =
		'Install the MNI CLI skill for AI coding agents (Claude Code, Cursor, Windsurf)';

	static override examples = [
		'<%= config.bin %> skill install',
		'<%= config.bin %> skill install --global',
		'<%= config.bin %> skill install --target=cursor',
	];

	static override flags = {
		global: Flags.boolean({
			char: 'g',
			description: 'Install to ~/.claude/skills/ instead of the current project',
			default: false,
		}),
		target: Flags.string({
			char: 't',
			description: 'Target agent',
			options: ['claude-code', 'cursor', 'windsurf'],
			default: 'claude-code',
		}),
	};

	async run(): Promise<void> {
		const { flags } = await this.parse(SkillInstall);

		const skillSource = path.resolve(this.config.root, 'skills', 'MNI-cli', 'SKILL.md');

		if (!fs.existsSync(skillSource)) {
			this.error('Could not find SKILL.md in the MNI-cli package.');
		}

		const content = fs.readFileSync(skillSource, 'utf-8');

		switch (flags.target) {
			case 'cursor':
				this.installCursor(content);
				break;
			case 'windsurf':
				this.installWindsurf(content);
				break;
			default:
				this.installClaudeCode(content, flags.global);
		}
	}

	private installClaudeCode(content: string, global: boolean): void {
		const dir = global
			? path.join(os.homedir(), '.claude', 'skills', 'MNI-cli')
			: path.join(process.cwd(), '.claude', 'skills', 'MNI-cli');

		const targetFile = path.join(dir, 'SKILL.md');

		fs.mkdirSync(dir, { recursive: true });
		fs.writeFileSync(targetFile, content);

		this.log(`Installed to ${targetFile}`);
		this.log('Use /MNI-cli in Claude Code to load the skill.');
	}

	private stripFrontmatter(content: string): string {
		const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
		return match ? match[1].trimStart() : content;
	}

	private installCursor(content: string): void {
		const targetFile = path.join(process.cwd(), '.cursorrules');
		const stripped = this.stripFrontmatter(content);

		if (fs.existsSync(targetFile)) {
			const existing = fs.readFileSync(targetFile, 'utf-8');
			if (existing.includes('# MNI CLI')) {
				this.log('.cursorrules already contains MNI CLI skill. Skipping.');
				return;
			}
			fs.writeFileSync(targetFile, `${existing}\n\n${stripped}`);
			this.log('Appended MNI CLI skill to .cursorrules');
		} else {
			fs.writeFileSync(targetFile, stripped);
			this.log('Created .cursorrules with MNI CLI skill.');
		}
	}

	private installWindsurf(content: string): void {
		const targetFile = path.join(process.cwd(), '.windsurfrules');
		const stripped = this.stripFrontmatter(content);

		if (fs.existsSync(targetFile)) {
			const existing = fs.readFileSync(targetFile, 'utf-8');
			if (existing.includes('# MNI CLI')) {
				this.log('.windsurfrules already contains MNI CLI skill. Skipping.');
				return;
			}
			fs.writeFileSync(targetFile, `${existing}\n\n${stripped}`);
			this.log('Appended MNI CLI skill to .windsurfrules');
		} else {
			fs.writeFileSync(targetFile, stripped);
			this.log('Created .windsurfrules with MNI CLI skill.');
		}
	}
}

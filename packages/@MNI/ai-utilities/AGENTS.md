# AGENTS.md

`@MNI/ai-utilities` owns shared helpers that are specific to AI nodes, LLMs,
model configuration, and model output.

## Public subpaths

- `agent-config`
- `fromai-helpers`
- `generic-text-editor`
- `http-proxy-agent`
- `json-schema`
- `llm-output`
- `model-discovery`
- `node-catalog`
- `text-editor`
- `tokenizer`
- `web-search`

## Package boundary

- Put shared AI- or LLM-specific helpers in `@MNI/ai-utilities`.
- Put generic helpers and generic secret or PII redaction in `@MNI/utils`.
- Put workflow graph and traversal utilities in `MNI-workflow`.
- Keep domain logic in the package that owns that domain.

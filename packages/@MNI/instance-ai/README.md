# @MNI/instance-ai

Instance AI is the agent runtime behind the MNI Assistant experience in MNI. It
lets users ask for help with workflows, executions, credentials, nodes, and
workflow building from inside an MNI instance.

The package contains the agent prompts, tool registry, workflow-builder logic,
workspace adapters, tracing helpers, and evaluation harnesses. The HTTP API,
database entities, settings, and MNI service adapters live in
`packages/cli/src/modules/instance-ai`.

## What It Does

Instance AI is built around a deep-agent loop:

- An orchestrator agent receives the user's request and maintains the plan.
- Evaluation setup runs in the orchestrator through the config-evals skill.
- Domain tools read and update MNI resources through backend adapters.
- Observational memory condenses long conversations.
- Workflow building runs in a sandbox workspace, validates generated TypeScript,
  and submits the workflow through the MNI backend.

The workflow builder requires sandboxing. The default provider is the MNI
sandbox service. Daytona remains an explicit provider for environments that
still need it.

## Running Locally

Instance AI is a backend module, so run it through MNI rather than this package
directly.

### 1. Start the MNI Sandbox Service

From the repo root:

```bash
TESTCONTAINERS_REUSE_ENABLE=true pnpm --filter MNI-containers services \
  --services sandbox \
  --network MNI-instance-ai-dev \
  --name MNI-svc-sandbox
```

This starts the sandbox API and runner containers and writes the host-reachable
sandbox environment variables to `packages/cli/bin/.env`. You can verify the
service from any terminal:

```bash
SANDBOX_PORT=$(docker port MNI-svc-sandbox-sandbox-api 8080/tcp | sed 's/.*://')
curl "http://localhost:${SANDBOX_PORT}/healthz"
```

Expected response:

```json
{"status":"ok"}
```

### 2. Start MNI With Instance AI Configured

In a second terminal:

```bash
export MNI_INSTANCE_AI_MODEL=anthropic/claude-sonnet-4-5
export MNI_INSTANCE_AI_MODEL_API_KEY="$ANTHROPIC_API_KEY"

export MNI_INSTANCE_AI_SANDBOX_ENABLED=true

pnpm dev:ai
```

The `instance-ai` module is enabled by default. `MNI_AI_ENABLED` is not an
Instance AI runtime gate.

The `pnpm --filter MNI-containers services` command writes
`MNI_INSTANCE_AI_SANDBOX_PROVIDER`, `MNI_SANDBOX_SERVICE_URL`, and
`MNI_SANDBOX_SERVICE_API_KEY` to `packages/cli/bin/.env`. If you are not using
that generated `.env` file, export them manually:

```bash
export MNI_SANDBOX_PORT=$(docker port MNI-svc-sandbox-sandbox-api 8080/tcp | sed 's/.*://')
export MNI_INSTANCE_AI_SANDBOX_PROVIDER=MNI-sandbox
export MNI_SANDBOX_SERVICE_URL="http://localhost:${MNI_SANDBOX_PORT}"
export MNI_SANDBOX_SERVICE_API_KEY=MNI-sandbox-ci-key
```

For MNI running inside the same Docker network as the sandbox service, use the
internal service URL instead:

```bash
MNI_SANDBOX_SERVICE_URL=http://sandbox-api:8080
```

### 3. Cleanup

```bash
pnpm --filter MNI-containers services:clean
docker network rm MNI-instance-ai-dev 2>/dev/null || true
```

## Useful Commands

Run focused tests:

```bash
pnpm --filter @MNI/instance-ai test
```

Print agent prompts:

```bash
pnpm --filter @MNI/instance-ai prompts:print
```

Run evaluations:

```bash
pnpm --filter @MNI/instance-ai eval:instance-ai
```

## More Documentation

- [Architecture](docs/architecture.md)
- [Engineering standards](docs/ENGINEERING.md)
- [Configuration](docs/configuration.md)
- [Sandboxing](docs/sandboxing.md)
- [Local Computer Use gateway](docs/filesystem-access.md)
- [Tools](docs/tools.md)
- [Memory](docs/memory.md)
- [Streaming protocol](docs/streaming-protocol.md)
- [E2E tests](docs/e2e-tests.md)
- [Evaluations](evaluations/README.md)

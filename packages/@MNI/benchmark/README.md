# MNI benchmarking tool

Tool for executing benchmarks against an MNI instance.

## Directory structure

```text
packages/@MNI/benchmark
├── scenarios        Benchmark scenarios
├── src              Source code for the MNI-benchmark cli
├── Dockerfile       Dockerfile for the MNI-benchmark cli
├── infra            Terraform code for the cloud benchmark environment
├── scripts          Orchestration scripts
```

## Benchmarking an existing MNI instance

The easiest way to run the existing benchmark scenarios is to use the benchmark docker image:

```sh
docker pull ghcr.io/MNI-io/MNI-benchmark:latest
# Print the help to list all available flags
docker run ghcr.io/MNI-io/MNI-benchmark:latest run --help
# Run all available benchmark scenarios for 1 minute with 5 concurrent requests
docker run ghcr.io/MNI-io/MNI-benchmark:latest run \
	--MNIBaseUrl=https://instance.url \
	--MNIUserEmail=InstanceOwner@email.com \
	--MNIUserPassword=InstanceOwnerPassword \
	--vus=5 \
	--duration=1m \
	--scenarioFilter=single-webhook
```

### Using custom scenarios with the Docker image

It is also possible to create your own [benchmark scenarios](#benchmark-scenarios) and load them using the `--testScenariosPath` flag:

```sh
# Assuming your scenarios are located in `./scenarios`, mount them into `/scenarios` in the container
docker run -v ./scenarios:/scenarios ghcr.io/MNI-io/MNI-benchmark:latest run \
	--MNIBaseUrl=https://instance.url \
	--MNIUserEmail=InstanceOwner@email.com \
	--MNIUserPassword=InstanceOwnerPassword \
	--vus=5 \
	--duration=1m \
	--testScenariosPath=/scenarios
```

## Running the entire benchmark suite

The benchmark suite consists of [benchmark scenarios](#benchmark-scenarios) and different [MNI setups](#MNI-setups).

### locally

```sh
pnpm benchmark-locally
```

You can filter to a specific scenario and setup:

```sh
# Run only the http-node scenario with the sqlite setup
pnpm benchmark-locally --runDir /tmp/MNI-data --scenarioFilter http-node sqlite
```

### In the cloud

The cloud environment is a dedicated Azure VM. [`./infra`](./infra/) holds the
Terraform code that creates it.

Create the environment, run the benchmarks, then delete the environment:

```sh
pnpm provision-cloud-env
pnpm benchmark-in-cloud
pnpm destroy-cloud-env
```

## Running the `MNI-benchmark` cli

The `MNI-benchmark` cli is a node.js program that runs one or more scenarios against a single MNI instance.

### Locally with Docker

Build the Docker image:

```sh
# Must be run in the repository root
# k6 doesn't have an arm64 build available for linux, we need to build against amd64
docker build --platform linux/amd64 -t MNI-benchmark -f packages/@MNI/benchmark/Dockerfile .
```

Run the image

```sh
docker run \
  -e MNI_USER_EMAIL=user@n8n.io \
  -e MNI_USER_PASSWORD=password \
  # For macos, MNI running outside docker
  -e MNI_BASE_URL=http://host.docker.internal:5678 \
  MNI-benchmark
```

### Locally without Docker

Requirements:

- [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/)
- Node.js v24 or higher

```sh
pnpm build

# Run tests against http://localhost:5678 with specified email and password
MNI_USER_EMAIL=user@n8n.io MNI_USER_PASSWORD=password ./bin/MNI-benchmark run
```

## Benchmark scenarios

A benchmark scenario defines one or multiple steps to execute and measure. It consists of:

- Manifest file which describes and configures the scenario
- Any test data that is imported before the scenario is run
- A [`k6`](https://grafana.com/docs/k6/latest/using-k6/http-requests/) script which executes the steps and receives `API_BASE_URL` environment variable in runtime.

Available scenarios are located in [`./scenarios`](./scenarios/).

## MNI setups

A MNI setup defines a single MNI runtime configuration using Docker compose. Different MNI setups are located in [`./scripts/n8nSetups`](./scripts/n8nSetups).

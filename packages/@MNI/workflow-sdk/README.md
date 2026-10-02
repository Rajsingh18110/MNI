![MNI Banner](https://raw.githubusercontent.com/Rajsingh18110/MNI/main/assets/mni-screenshot-readme.png)

# @MNI/workflow-sdk

TypeScript SDK for programmatically creating MNI workflows.

## Features

- Fluent builder API for workflow creation
- Full type safety with TypeScript
- Code generation from JSON workflows
- Control flow support (If, Switch, Merge, Loop)
- Built-in validation
- AI/LangChain node integration

## Usage

```typescript
import { WorkflowBuilder, manual, httpRequest } from '@MNI/workflow-sdk';

const workflow = new WorkflowBuilder()
  .withName('My Workflow')
  .addTrigger(manual())
  .then(httpRequest({ url: 'https://api.example.com/data' }))
  .build();
```

## License

You can find the license information [here](https://github.com/MNI-io/MNI/blob/master/README.md#license)

![MNI Banner](https://raw.githubusercontent.com/Rajsingh18110/MNI/main/assets/mni-screenshot-readme.png)

# MNI – The Platform for AI Agents and Workflow Automation

Fair-code platform to build and deploy AI agents and workflows. Combine a visual canvas with custom code, run it self-hosted or in the cloud, and connect to 1500+ integrations. AI automation you can trust with real work, from prototype to production.

*(This is the MNI fork of n8n. MNI is built upon the upstream n8n architecture.)*

## Key Capabilities

- **AI-Native Automation Platform**: Build and operationalize AI workflows and multi-step agents using your own data, models, and tools
- **Model Flexibility, No Lock-In**: Connect to OpenAI, Anthropic, Google, or open-source models and switch providers without changing your architecture
- **From Prototype to Production**: Design multi-step AI workflows with logic, tool use, human approvals, and full observability
- **Code When You Need It**: Combine visual building with JavaScript, Python, and npm packages for advanced AI workflows
- **Enterprise-Ready AI**: Self-host or deploy securely with role-based access, audit trails, and support for sensitive data
- **Leverage What Already Exists**: 1500+ integrations and 9,000+ workflow [templates](https://n8n.io/workflows) to connect AI with your existing systems

## Quick Start

Try MNI instantly with our install script (requires [Docker](https://www.docker.com/)):

```sh
# (Install scripts for MNI pending configuration)
```

Or deploy manually with [Docker](https://docs.n8n.io/hosting/installation/docker/):

Or deploy manually with Docker:

```
docker volume create mni_data
docker run -it --rm --name mni -p 5678:5678 -v mni_data:/home/node/.n8n your_registry/mni
```

Access the editor at http://localhost:5678

## Resources

- 📚 [Documentation](https://docs.n8n.io)
- 🔧 [1500+ Integrations](https://n8n.io/integrations)
- 💡 [Example Workflows](https://n8n.io/workflows)
- 🤖 [AI & LangChain Guide](https://docs.n8n.io/advanced-ai/)
- 👥 [Community Forum](https://community.n8n.io)
- 📖 [Community Tutorials](https://community.n8n.io/c/tutorials/28)

## Support

Need help? Our upstream community forum is the place to get support and connect with other users:
[Community Forum](https://community.n8n.io)

## License

MNI is a fork of n8n. n8n is [fair-code](https://faircode.io) distributed under the [Sustainable Use License](https://github.com/n8n-io/n8n/blob/master/LICENSE.md) and [n8n Enterprise License](https://github.com/n8n-io/n8n/blob/master/LICENSE_EE.md).

- **Source Available**: Always visible source code
- **Self-Hostable**: Deploy anywhere
- **Extensible**: Add your own nodes and functionality

Additional information about the license model can be found in the upstream [docs](https://docs.n8n.io/sustainable-use-license/).

## Contributing

Found a bug 🐛 or have a feature idea ✨? Check our [Contributing Guide](https://github.com/n8n-io/n8n/blob/master/CONTRIBUTING.md) for a setup guide & best practices.

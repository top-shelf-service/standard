Visual Studio Code
Docs
Updates
Blog
API
Extensions
MCP
FAQ
Events
Switch to the dark theme
SearchCtrl+Shift+P
Download
VS Code February events – Agent Sessions Day on Feb 19th

Dismiss this update
Overview
Setup
Get Started
Configure
Edit Code
Build, Debug, Test
GitHub Copilot
Overview
Setup
Quickstart
Best Practices
Agents
Customization
Overview
Instructions
Prompt Files
Custom Agents
Agent Skills
Language Models
MCP
Hooks
Chat
Inline Suggestions
Smart Actions
Guides
Security
Troubleshooting
FAQ
Reference
Source Control
Terminal
Enterprise
Languages
Node.js / JavaScript
TypeScript
Python
Java
C++
C#
Container Tools
Data Science
Intelligent Apps
Azure
Remote
Dev Containers
Reference
On this page there are 9 sectionsOn this page
Agent Skills vs custom instructions
Create a skill
SKILL.md file format
Example skills
Use skills as slash commands
How Copilot uses skills
Use shared skills
Agent Skills standard
Related resources
Use Agent Skills in VS Code
Agent Skills are folders of instructions, scripts, and resources that GitHub Copilot can load when relevant to perform specialized tasks. Agent Skills is an open standard that works across multiple AI agents, including GitHub Copilot in VS Code, GitHub Copilot CLI, and GitHub Copilot coding agent.

Unlike custom instructions that primarily define coding guidelines, skills enable specialized capabilities and workflows that can include scripts, examples, and other resources. Skills you create are portable and work across any skills-compatible agent.

Key benefits of Agent Skills:

Specialize Copilot: Tailor capabilities for domain-specific tasks without repeating context
Reduce repetition: Create once, use automatically across all conversations
Compose capabilities: Combine multiple skills to build complex workflows
Efficient loading: Only relevant content loads into context when needed
Agent Skills vs custom instructions
While both Agent Skills and custom instructions help customize Copilot's behavior, they serve different purposes:

Expand table
Feature	Agent Skills	Custom Instructions
Purpose	Teach specialized capabilities and workflows	Define coding standards and guidelines
Portability	Works across VS Code, Copilot CLI, and Copilot coding agent	VS Code and GitHub.com only
Content	Instructions, scripts, examples, and resources	Instructions only
Scope	Task-specific, loaded on-demand	Always applied (or via glob patterns)
Standard	Open standard (agentskills.io)	VS Code-specific
Use Agent Skills when you want to:

Create reusable capabilities that work across different AI tools
Include scripts, examples, or other resources alongside instructions
Share capabilities with the wider AI community
Define specialized workflows like testing, debugging, or deployment processes
Use custom instructions when you want to:

Define project-specific coding standards
Set language or framework conventions
Specify code review or commit message guidelines
Apply rules based on file types using glob patterns
Create a skill
Tip
Type /skills in the chat input to quickly open the Configure Skills menu.

Skills are stored in directories with a SKILL.md file that defines the skill's behavior. VS Code supports two types of skills:

Expand table
Skill type	Location
Project skills, stored in your repository	.github/skills/, .claude/skills/, .agents/skills/
Personal skills, stored in your user profile	~/.copilot/skills/, ~/.claude/skills/, ~/.agents/skills/
Tip
You can configure additional locations where VS Code searches for skills by using the 
chat.agentSkillsLocations
 setting. This is useful for sharing skills across projects or keeping them in a central location.
To create a skill:

Create a .github/skills directory in your workspace.

Create a subdirectory for your skill. Each skill should have its own directory (for example, .github/skills/webapp-testing).

Create a SKILL.md file in the skill directory with the following structure:

Markdown

---
name: skill-name
description: Description of what the skill does and when to use it
---

# Skill Instructions

Your detailed instructions, guidelines, and examples go here...
Optionally, add scripts, examples, or other resources to your skill's directory.

For example, a skill for testing web applications might include:

SKILL.md - Instructions for running tests
test-template.js - A template test file
examples/ - Example test scenarios
SKILL.md file format
The SKILL.md file is a Markdown file with YAML frontmatter that defines the skill's metadata and behavior.

Header (required)
The header is formatted as YAML frontmatter with the following fields:

Expand table
Field	Required	Description
name	Yes	A unique identifier for the skill. Must be lowercase, using hyphens for spaces (for example, webapp-testing). Maximum 64 characters.
description	Yes	A description of what the skill does and when to use it. Be specific about both capabilities and use cases to help Copilot decide when to load the skill. Maximum 1024 characters.
argument-hint	No	Hint text shown in the chat input field when the skill is invoked as a slash command. Helps users understand what additional information to provide (for example, [test file] [options]).
user-invokable	No	Controls whether the skill appears as a slash command in the chat menu. Defaults to true. Set to false to hide the skill from the / menu while still allowing the agent to load it automatically.
disable-model-invocation	No	Controls whether the agent can automatically load the skill based on relevance. Defaults to false. Set to true to require manual invocation through the / slash command only.
Body
The skill body contains the instructions, guidelines, and examples that Copilot should follow when using this skill. Write clear, specific instructions that describe:

What the skill helps accomplish
When to use the skill
Step-by-step procedures to follow
Examples of the expected input and output
References to any included scripts or resources
You can reference files within the skill directory using relative paths. For example, to reference a script in your skill directory, use [test script](./test-template.js).

Example skills
The following examples demonstrate different types of skills you can create.

Example: Web application testing skill
Example: GitHub Actions debugging skill
Use skills as slash commands
Skills are available as slash commands in chat, alongside prompt files. Type / in the chat input field to see a list of available skills and prompts, and select a skill to invoke it.

You can add extra context after the slash command. For example, /webapp-testing for the login page or /github-actions-debugging PR #42.

By default, all skills appear in the / menu. Use the user-invokable and disable-model-invocation frontmatter properties to control how each skill is accessed:

Expand table
Configuration	Slash command	Auto-loaded by Copilot	Use case
Default (both properties omitted)	Yes	Yes	General-purpose skills
user-invokable: false	No	Yes	Background knowledge skills that the model loads when relevant
disable-model-invocation: true	Yes	No	Skills you only want to run on demand
Both set	No	No	Disabled skills
How Copilot uses skills
Skills use progressive disclosure to efficiently load content only when needed. This three-level loading system ensures you can install many skills without consuming context:

Level 1: Skill discovery

Copilot always knows which skills are available by reading their name and description from the YAML frontmatter. This metadata is lightweight and helps Copilot decide which skills are relevant to your request.

Level 2: Instructions loading

When your request matches a skill's description, Copilot loads the SKILL.md file body into its context. Only then do the detailed instructions become available. You can also directly invoke a skill by using the / slash command in chat.

Level 3: Resource access

Copilot can access additional files in the skill directory (scripts, examples, documentation) only as needed. These resources don't load until Copilot references them, keeping your context efficient.

This architecture means skills are both automatically activated based on your prompt and manually invocable through slash commands. You can install many skills, and Copilot loads only what's relevant for each task.

Use shared skills
You can use skills created by others to enhance Copilot's capabilities. The github/awesome-copilot repository contains a growing community collection of skills, custom agents, instructions, and prompts. The anthropics/skills repository contains additional reference skills.

To use a shared skill:

Browse the available skills in the repository
Copy the skill directory to your .github/skills/ folder
Review and customize the SKILL.md file for your needs
Optionally, modify or add resources as needed
Tip
Always review shared skills before using them to ensure they meet your requirements and security standards. VS Code's terminal tool provides controls for script execution, including auto-approve options with configurable allow-lists and tight controls over which code runs. Learn more about security considerations for auto-approval features.

Agent Skills standard
Agent Skills is an open standard that enables portability across different AI agents. Skills you create in VS Code work with multiple agents, including:

GitHub Copilot in VS Code: Available in chat and agent mode
GitHub Copilot CLI: Accessible when working in the terminal
GitHub Copilot coding agent: Used during automated coding tasks
Learn more about the Agent Skills standard at agentskills.io.

Related resources
Customize AI responses overview
Create custom instructions
Create reusable prompt files
Create custom agents
Agent Skills specification
Reference skills repository
Help and support
Was this documentation helpful?
Yes, this page was helpfulNo, this page was not helpful
Still need help?
Ask the community
Request features
Report issues
Help us improve
All VS Code docs are open source. See something that's wrong or unclear? Submit a pull request.

02/04/2026
VS Code on Github Follow us on X VS Code on LinkedIn VS Code on Bluesky Join the VS Code community on Reddit The VS Code Insiders Podcast VS Code on TikTok VS Code on YouTube
Microsoft homepage
Support Privacy Terms of Use License
Table modal closed.

VS Code February events – Agent Sessions Day on Feb 19th

Dismiss this update
Overview
Setup
Get Started
Configure
Edit Code
Build, Debug, Test
GitHub Copilot
Overview
Setup
Quickstart
Best Practices
Agents
Customization
Overview
Instructions
Prompt Files
Custom Agents
Agent Skills
Language Models
MCP
Hooks
Chat
Inline Suggestions
Smart Actions
Guides
Security
Troubleshooting
FAQ
Reference
Source Control
Terminal
Enterprise
Languages
Node.js / JavaScript
TypeScript
Python
Java
C++
C#
Container Tools
Data Science
Intelligent Apps
Azure
Remote
Dev Containers
Reference
On this page there are 10 sectionsOn this page
What are custom agents?
Why use custom agents?
Handoffs
Custom agent file structure
Create a custom agent
Customize the agents dropdown list
Tool list priority
Share custom agents across teams
Frequently asked questions
Related resources
Custom agents in VS Code
Custom agents enable you to configure the AI to adopt different personas tailored to specific development roles and tasks. For example, you might create agents for a security reviewer, planner, solution architect, or other specialized roles. Each persona can have its own behavior, available tools, and instructions.

You can also use handoffs to create guided workflows between agents. Transition seamlessly from one specialized agent to another with a single select. For example, move from a planning agent directly into an implementation agent, or hand off to a code reviewer with the relevant context.

This article describes how to create and manage custom agents in VS Code.

Note
Custom agents are available as of VS Code release 1.106. Custom agents were previously known as custom chat modes.

What are custom agents?
The built-in agents provide general-purpose configurations for chat in VS Code. For a more tailored chat experience, you can create your own custom agents.

Custom agents consist of a set of instructions and tools that are applied when you switch to that agent. For example, a "Plan" agent could include instructions for generating an implementation plan and only use read-only tools. By creating a custom agent, you can quickly switch to that specific configuration without having to manually select relevant tools and instructions each time.

Custom agents are defined in a .agent.md Markdown file, and can be stored in your workspace for others to use, or in your user profile, where you can reuse them across different workspaces.

You can reuse your custom agents in background agents and cloud agents, enabling you to run autonomous tasks with the same specialized configurations.

Why use custom agents?
Different tasks require different capabilities. A planning agent might only need read-only tools for research and analysis to prevent accidental code changes, while an implementation agent would need full editing capabilities. Custom agents let you specify exactly which tools are available for each task, ensuring the AI has the right capabilities for the job.

Custom agents also let you provide specialized instructions that define how the AI should operate. For instance, a planning agent could instruct the AI to collect project context and generate a detailed implementation plan, while a code review agent might focus on identifying security vulnerabilities and suggesting improvements. These specialized instructions ensure consistent, task-appropriate responses every time you switch to that agent.

Note
Subagents can run with a custom agent. Learn more about running subagents with custom agents (experimental).

Handoffs
Handoffs enable you to create guided sequential workflows that transition between agents with suggested next steps. After a chat response completes, handoff buttons appear that let users move to the next agent with relevant context and a pre-filled prompt.

Handoffs are useful for orchestrating multi-step workflows that give developers control for reviewing and approving each step before moving to the next one. For example:

Planning → Implementation: Generate a plan in planning agent, then hand off to implementation agent to start coding.
Implementation → Review: Complete implementation, then switch to a code review agent to check for quality and security issues.
Write Failing Tests → Write Passing Tests: Generate failing tests that are easier to review than big implementations, then hand off to make those tests pass by implementing the required code changes.
To define handoffs in your agent file, add them to the frontmatter. Each handoff specifies the target agent, the button label, and an optional prompt to send:

Markdown

---
description: Generate an implementation plan
tools: ['search', 'fetch']
handoffs:
  - label: Start Implementation
    agent: implementation
    prompt: Now implement the plan outlined above.
    send: false
    model: GPT-5.2 (copilot)
---
When users see the handoff button and select it, they switch to the target agent with the prompt pre-filled. If send: true, the prompt automatically submits to start the next workflow step.

Custom agent file structure
Custom agent files are Markdown files and use the .agent.md extension and have the following structure.

Note
VS Code detects any .md files in the .github/agents folder of your workspace as custom agents.

Header (optional)
The header is formatted as YAML frontmatter with the following fields:

Expand table
Field	Description
description	A brief description of the custom agent, shown as placeholder text in the chat input field.
name	The name of the custom agent. If not specified, the file name is used.
argument-hint	Optional hint text shown in the chat input field to guide users on how to interact with the custom agent.
tools	A list of tool or tool set names that are available for this custom agent. Can include built-in tools, tool sets, MCP tools, or tools contributed by extensions. To include all tools of an MCP server, use the <server name>/* format.
Learn more about tools in chat.
agents	A list of agent names that are available as subagents in this agent. Use * to allow all agents, or an empty array [] to prevent any subagent use. If you specify agents, ensure the agent tool is included in the tools property.
model	The AI model to use when running the prompt. Specify a single model name (string) or a prioritized list of models (array). When you specify an array, the system tries each model in order until an available one is found. If not specified, the currently selected model in model picker is used.
user-invokable	Optional boolean flag to control whether the agent appears in the agents dropdown in chat (default is true). Set to false to create agents that are only accessible as subagents or programmatically.
disable-model-invocation	Optional boolean flag to prevent the agent from being invoked as a subagent by other agents (default is false).
infer	Deprecated. Use user-invokable and disable-model-invocation instead. Previously, infer: true (the default) made the agent both visible in the picker and available as a subagent. infer: false hid it from both. The new fields give you independent control: use user-invokable: false to hide from the picker while still allowing subagent invocation, or disable-model-invocation: true to prevent subagent invocation while keeping it in the picker.
target	The target environment or context for the custom agent (vscode or github-copilot).
mcp-servers	Optional list of Model Context Protocol (MCP) server config json to use with custom agents in GitHub Copilot (target: github-copilot).
handoffs	Optional list of suggested next actions or prompts to transition between custom agents. Handoff buttons appear as interactive suggestions after a chat response completes.
handoffs.label	The display text shown on the handoff button.
handoffs.agent	The target agent identifier to switch to.
handoffs.prompt	The prompt text to send to the target agent.
handoffs.send	Optional boolean flag to auto-submit the prompt (default is false)
handoffs.model	Optional language model to use when the handoff executes. Use the qualified model name in the format Model Name (vendor), for example GPT-5 (copilot) or Claude Sonnet 4.5 (copilot).
Note
If a given tool is not available when using the custom agent, it is ignored.

Body
The custom agent file body contains the custom agent implementation, formatted as Markdown. This is where you provide specific prompts, guidelines, or any other relevant information that you want the AI to follow when in this custom agent.

You can reference other files by using Markdown links, for example to reuse instructions files.

To reference agent tools in the body text, use the #tool:<tool-name> syntax. For example, to reference the githubRepo tool, use #tool:githubRepo.

When you select the custom agent in the Chat view, the guidelines in the custom agent file body are prepended to the user chat prompt.

Examples
Planning agent example
Agent orchestration example
Claude agent format
Agent files in the .claude/agents folder use plain .md files and support Claude-specific frontmatter properties:

Expand table
Field	Description
name	Agent name (required)
description	What the agent does
tools	Comma-separated string of allowed tools (for example, "Read, Grep, Glob, Bash")
disallowedTools	Comma-separated string of tools to block
VS Code maps Claude-specific tool names to the corresponding VS Code tools. Both the VS Code .agent.md format (with YAML arrays for tools) and the Claude format (with comma-separated strings) are supported.

Note
VS Code also detects .md files in the .claude/agents folder, following the Claude sub-agents format. This enables you to use the same agent definitions across VS Code and Claude Code.

Create a custom agent
You can create a custom agent file in your workspace or user profile.

Tip
Type /agents in the chat input to quickly open the Configure Custom Agents menu.

Select Configure Custom Agents from the agents dropdown and then select Create new custom agent or run the Chat: New Custom Agent command in the Command Palette (⇧⌘P (Windows, Linux Ctrl+Shift+P)).

Choose the location where the custom agent file should be created.

Workspace: Create the custom agent definition file in the .github/agents folder of your workspace to only use it within that workspace.

User profile: Create the custom agent definition file in the current profile folder to use it across all your workspaces.

Workspace (Claude format): Create agent files in the .claude/agents folder for compatibility with Claude Code and other Claude-based tools.

Tip
You can configure additional locations where VS Code searches for custom agent files by using the 
chat.agentFilesLocations
 setting. This is useful for sharing agents across projects or keeping them in a central location outside your workspace.
Enter a file name for the custom agent. This is the default name that appears in the agents dropdown.

Provide the details for the custom agent in the newly created .agent.md file.

Fill in the YAML frontmatter at the top of the file to configure the custom agent's name, description, tools, and other settings.
Add instructions for the custom agent in the body of the file.
To update a custom agent definition file, select Configure Custom Agents from the agents dropdown, and then select a custom agent from the list to modify it.

Customize the agents dropdown list
If you have multiple custom agents, you can customize which ones appear in the agents dropdown. To show or hide specific custom agents:

Select Configure Custom Agents from the agents dropdown.

Hover over a custom agent in the list, and then select the eye icon to show or hide it from the agents dropdown.

Tool list priority
You can specify the list of available tools for both a custom agent and prompt file by using the tools metadata field. Prompt files can also reference a custom agent by using the agent metadata field.

The list of available tools in chat is determined by the following priority order:

Tools specified in the prompt file (if any)
Tools from the referenced custom agent in the prompt file (if any)
Default tools for the selected agent (if any)
Share custom agents across teams
To share custom agents across your team, you can create a workspace-level custom agent (.github/agents folder). If you want to share custom agents across multiple workspaces within your organization, you can define them at the GitHub organization level.

VS Code automatically detects custom agents defined at the organization level to which your account has access. These agents appear in the Agents dropdown in chat alongside the built-in agents, and your personal and workspace custom agents.

To enable discovery of organization-level custom agents, set 
github.copilot.chat.organizationCustomAgents.enabled
 to true.
Learn how you can create custom agents for your organization in the GitHub documentation.

Frequently asked questions
Are custom agents different from chat modes?
Custom agents were previously known as custom chat modes. The functionality remains the same, but the terminology has been updated to better reflect their purpose in customizing AI behavior for specific tasks.

If you have existing .chatmode.md files, rename them to .agent.md to convert them to the new custom agent format and place them in the appropriate location (
chat.agentFilesLocations
) to continue using them.
How do I remove a custom agent?
To completely remove a custom agent from VS Code:

Delete the corresponding .agent.md file from your workspace or user profile.
Select Configure Custom Agents from the agents dropdown, hover over the custom agent in the list, and select the trash icon.
To remove a custom agent that was contributed by an extension, you need to uninstall the extension that provides it. If you don't want to uninstall the extension, you can hide the custom agent from the agents dropdown instead. Follow the steps in Customize the agents dropdown list.

How do I know where a custom agent comes from?
Custom agents can come from different sources: built-in agents, user-defined agents in your profile, workspace-defined agents in your current workspace, organization-defined agents, or extension-contributed agents.

To identify the source of a custom agent:

Select Configure Custom Agents from the agents dropdown.
Hover over the custom agent in the list. The source location is displayed in a tooltip.
Tip
Use the chat customization diagnostics view to see all loaded custom agents, prompt files, instruction files, and skills along with any errors. Right-click in the Chat view and select Diagnostics. Learn more about troubleshooting AI in VS Code.

Related resources
Customize AI with custom instructions
Create reusable prompt files
Use tools in chat
Help and support
Was this documentation helpful?
Yes, this page was helpfulNo, this page was not helpful
Still need help?

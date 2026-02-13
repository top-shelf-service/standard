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
Overview
Agents Tutorial
Planning
Tools
Subagents
Local Agents
Background Agents
Cloud Agents
Third-Party Agents
Customization
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
What are agents?
Types of agents
Agent sessions list
Create an agent session
Hand off a session to another agent
Review and apply file changes
Archive agent sessions
Delete agent sessions
Related resources
Try this
Create a basic game
Use agents in VS Code to generate a tic-tac-toe game in your language of choice.

Open in VS Code

Using agents in Visual Studio Code
Agents automate complete coding tasks that go beyond simple code suggestions and chat interactions. In Visual Studio Code, you can create agent sessions that run locally or in the cloud, interactively or in the background. Hand off tasks between different agent types to use their unique strengths. The unified Chat view gives you a central place to manage and monitor all your agent sessions, regardless of where they run.

This article provides an overview of the various agent types, how to create and manage agent sessions, delegate tasks between agents, and track their progress.

Screenshot of an agent session in VS Code showing code changes and chat interaction.

Important
Make sure agents are enabled in your VS Code settings (
chat.agent.enabled
ORG). Your organization might also disable agents - contact your admin to enable this functionality.
What are agents?
Agents perform complete coding tasks end-to-end. They understand your project, make changes across multiple files, run commands, and adapt based on the results.

For example, imagine you have a failing test. Instead of suggesting a fix, an agent can:

Read the error message and identify the root cause across multiple files
Update the relevant code
Run the tests again to verify the fix works
Commit the changes
You give an agent a high-level task, and it breaks the task down into steps, executes those steps with tools, and self-corrects when it hits errors.

You can run multiple agent sessions in parallel, each focused on a different task. When you create a new agent session, the previous session remains active, and you can switch between tasks via the agent sessions list.

Key concepts
The following concepts describe different aspects of working with agents in VS Code:

Expand table
Concept	Description	Example
Agent type	Where and how an agent runs: local, background, cloud, or third-party.	Start a cloud agent for tasks that require team collaboration.
Built-in agent	A preconfigured agent in VS Code: Agent, Plan, and Ask. These agents are ready to use without any setup.	Select the Plan agent to create a structured plan for building a new feature.
Custom agent	A reusable configuration (defined in an .agent.md file) that gives an agent a specific role, tools, and instructions. Custom agents work with any agent type.	Create a "Security Reviewer" custom agent with read-only tools that focuses on identifying vulnerabilities.
Subagent	A child agent spawned within a session to handle a subtask in its own isolated context window.	An agent researching a topic spawns a subagent to gather information, then receives only the summary back.
Hand off	Transferring a session from one agent type to another, carrying over the conversation history.	Start planning with a local agent, then hand off to a cloud agent to implement the plan as a pull request.
Types of agents
VS Code supports four main categories of agents, each designed for different use cases and levels of interaction:

Diagram showing agent types by environment and interaction.

Which agent should I use?
Use the following table to find the right agent type for your task:

Expand table
I want to...	Use
Brainstorm, explore, or iterate on an idea interactively	Local agent
Get answers about my codebase	Local agent (Ask)
Create a structured implementation plan	Local agent (Plan)
Fix an issue that needs editor context (test failures, linting errors, debug output)	Local agent
Use specific VS Code extension tools or MCP servers	Local agent
Implement a well-defined task while I keep working	Background agent or Cloud agent
Explore multiple variants or proof of concepts	Background agent or Cloud agent
Create a PR for team review and collaboration	Cloud agent
Assign a GitHub issue to an agent	Cloud agent
Use a specific AI provider (Anthropic, OpenAI)	Third-party agent
Local agents
Local agents run directly within VS Code on your machine. You interact with local agents through chat to get immediate results to your prompts. Local agents have full access to your workspace, tools, and models. Use local agents for interactive tasks that require immediate feedback, such as brainstorming, planning, or exploratory work.

Local agent sessions use one of three built-in agents: Agent for complex coding tasks, Plan for creating structured implementation plans, and Ask for answering questions about your codebase. You can also create custom agents for specialized workflows.

Learn more about local agents in VS Code.

Background agents
Note
The term "background agent" might also appear as "Copilot CLI" or "worktree" in the VS Code interface while an experiment is being run.

Background agents, like Copilot CLI, are CLI-based agents that run non-interactively in the background on your local machine. They use Git worktrees to work isolated from your main workspace, preventing conflicts with your active work. Use background agents for well-defined tasks that have all necessary context, such as implementing a plan.

Learn more about background agents in VS Code.

Cloud agents
Cloud agents, like Copilot coding agent, run on remote infrastructure and integrate with GitHub repositories and pull requests for team collaboration and code reviews. Use cloud agents for well-defined tasks where you want to collaborate with team members through pull requests, or for tasks that can run without immediate feedback.

Learn more about cloud agents in VS Code.

Third-party agents
VS Code supports agents from third-party AI providers, like Anthropic and OpenAI. By using third-party agents, you can use the unique capabilities of these providers with your existing GitHub Copilot subscription, while benefiting from VS Code's unified session management and rich editor experience. Depending on the provider, third-party agents can run locally or in the cloud.

Learn more about third-party agents in VS Code.

Agent sessions list
The Chat view provides a unified view to manage all your agent sessions, regardless of where they run. By default, it shows your recent sessions, and gives information about their status, type, and file changes. Expand the list to see and filter all your agent sessions.

The list of sessions is scoped to your workspace. If you don't have a workspace open, the list shows all sessions across your workspaces. The sessions are grouped by time periods, such as Today or Last Week.

The Chat view operates in two modes: compact and side-by-side. You can manually switch between compact and side-by-side mode by using the toggle control in the top-right corner of the Chat view.

Compact:

In compact view, the list of sessions is embedded in the Chat view. When you select a session from the list, the Chat view switches to that session. Use the back button to return to the sessions list.

Screenshot of the Chat view in compact mode showing recent agent sessions.

Side-by-side

In side-by-side view, the list of sessions is shown side-by-side with the Chat view. Select a session from the list to view its details in the Chat view.

Screenshot of the Chat view in expanded mode showing full agent session history.

Tip
When you make the Chat view wider, it automatically switches to side-by-side mode. Right-click on the sessions list and select Sessions Orientation to change this behavior (
chat.viewSessions.orientation
). You can also use the toggle button.
Right-click a session in the list to see additional actions, such as different options to open the session details, archive the session, or agent-type specific actions like checking out a pull request (for cloud agent sessions).

To hide the session list from the Chat view, right-click in an empty chat and unselect Show Sessions (
chat.viewSessions.enabled
).
Note
Extension developers can learn how to integrate with the Agents view by using the proposed API chatSessionsProvider. The API is currently in a proposed state and subject to change.

Agent status indicator (Experimental)
The agent status indicator provides quick access to your agent sessions directly from the command center in the title bar. The indicator displays visual badges for unread messages and in-progress sessions, so you can stay informed about your AI agent activity without switching views.

Screenshot showing the Agent Status Indicator in the command center with unread and in-progress badges.

The indicator shows:

Unread sessions badge: Shows the count of chat sessions with new messages. Select the badge to filter the sessions list to show only unread sessions.
In-progress sessions badge: Shows the count of sessions with running agents. Select the badge to filter the sessions list to show only in-progress sessions.
Sparkle icon: Provides quick access to chat and session management options.
You can configure the indicator's behavior by using the 
chat.agentsControl.clickBehavior
 setting to toggle chat visibility, cycle through chat states (show, maximize, hide), or focus the chat input.
When a filter is active, the sessions list automatically expands to show all matching sessions. Select the badge again to clear the filter and return to the default view.

Note
The agent status indicator is an experimental feature. Enable it by using 
chat.agentsControl.enabled
. The unread and in-progress indicators require 
chat.viewSessions.enabled
 to be enabled.
Create an agent session
You can create multiple agent sessions in parallel, each focused on a different task. When you create a new agent session, the previous session stays active, and you can switch between tasks through the agent sessions list.

When you create a new agent session, it starts with an empty context window. Each agent session is independent, so context from one session doesn't carry over to another.

You can create a new agent session from the Chat view or by using the corresponding commands in the Command Palette.

Open the Chat view and select the New Session dropdown (+).

Screenshot of creating a new agent session from the Chat view.

Choose the agent type from the dropdown. Optionally, select a language model from the model picker.

Screenshot showing agent type dropdown in new chat session.

Enter a prompt to assign a task to the agent. The agent starts working on the task.

Prompt

Generate a diagram that gives a high-level overview of the architecture of this project.
Tip
You can send follow-up prompts while the agent is still working. Choose to queue the message, steer the current request, or stop and send immediately.

Hand off a session to another agent
You can hand off an existing task from one agent to another agent to take advantage of their unique strengths. For example, create a plan with a local agent, hand off to a background agent for proof of concepts, and then continue with a cloud agent to submit a pull request for team review.

To hand off a local agent session, select a different agent type from the session type dropdown in the chat input box. VS Code creates a new session, carrying over the full conversation history and context. The original session is archived after handoff.

Screenshot showing the session type dropdown for handing off to another agent.

In a background agent session, delegate to a cloud agent by entering the /delegate command in the chat input box. You can provide additional instructions after the /delegate command.

Assign a coding task to an agent
If you install the GitHub Pull Requests extension, you can assign an agent to implement TODO comments in your code.

Screenshot of assigning a TODO comment to Copilot coding agent.

On GitHub.com, or by using the GitHub Pull Requests extension, you can assign GitHub issues to Copilot coding agent by assigning the issue to copilot or by mentioning it in an issue comment or pull request to ask for a code review.

Review and apply file changes
When an agent session completes and makes code changes to your project, the session list shows the file change statistics for that session. To review the changes made by the agent, select the session from the list to open the session details.

Screenshot of the file changes diff editor in an agent session.

Depending on the agent type, you have options to apply the changes made by the agent onto your local workspace, or to check out the branch from the agent session (for cloud agents).

Archive agent sessions
To keep the list of sessions organized, archive completed or inactive sessions. Archiving a session doesn't delete it but moves it out of the active sessions list. At any time, you can unarchive a session to restore it to the active sessions list.

To archive a session, hover over the session in the session list and select Archive. After you archive a session, it disappears from the list. Inversely, you can also unarchive a session in the same way.

Screenshot of archiving an agent session in the sessions view.

To view your archived sessions, use the filter options in the sessions list and select the Archived filter.

Delete agent sessions
To permanently delete an agent session, right-click the session in the sessions list and select Delete. Deleting a session removes it permanently and can't be undone. For background agent sessions, deleting the session also removes any associated worktrees created for that session.

Important
Deleting a session is irreversible. If you just want to hide a session, consider archiving it instead.

Related resources
Agents tutorial: Hands-on tutorial for working with different agent types.

Tools: Extend agents with built-in, MCP, and extension tools.

Hooks: Execute custom commands at lifecycle events for automation and policy enforcement

Custom agents: Create your own AI agents and extensions.

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
Support Privacy Terms of Use LicenseVisual Studio Code
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
Display Language
Layout
Keyboard Shortcuts
Settings
Settings Sync
Extensions
Themes
Profiles
Accessibility
Command Line Interface
Telemetry
Edit Code
Basic Editing
IntelliSense
Code Navigation
Refactoring
Snippets
Workspaces
Build, Debug, Test
Tasks
Debugging
Debug Configuration
Testing
Port Forwarding
Integrated Browser
GitHub Copilot
Overview
Setup
Quickstart
Best Practices
Agents
Overview
Agents Tutorial
Planning
Tools
Subagents
Local Agents
Background Agents
Cloud Agents
Third-Party Agents
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
Overview
Inline Chat
Chat Sessions
Add Context
Prompt Examples
Review Edits
Checkpoints
Chat Debug View
Inline Suggestions
Smart Actions
Guides
Prompt Engineering
Context Engineering
Test-Driven Development
Edit Notebooks with AI
Test with AI
Debug with AI
MCP Dev Guide
Security
Troubleshooting
FAQ
Reference
Source Control
Terminal
Enterprise
Languages
Node.js / JavaScript
Working with JavaScript
Node.js Tutorial
Node.js Debugging
Deploy Node.js Apps
Browser Debugging
Angular Tutorial
React Tutorial
Vue Tutorial
Debugging Recipes
Performance Profiling
Extensions
TypeScript
Python
Java
C++
C#
Container Tools
Overview
Node.js
Python
ASP.NET Core
Debug
Docker Compose
Registries
Deploy to Azure
Choose a Dev Environment
Customize
Develop with Kubernetes
Tips and Tricks
Data Science
Intelligent Apps
Azure
Remote
Dev Containers
Overview
Tutorial
Attach to Container
Create Dev Container
Advanced Containers
devcontainer.json
Dev Container CLI
Tips and Tricks
FAQ
Reference
On this page there are 9 sectionsOn this page
Set up your project for AI
Pick the right tool for the task
Write effective prompts
Provide the right context
Choose the right model
Plan first, then implement
Manage context and sessions
Customize with reusable primitives
Related resources
Best practices for using AI in VS Code
This article covers proven practices for getting the most out of using AI in Visual Studio Code. Each section provides actionable guidance with links to deeper documentation.

Set up your project for AI
Custom instructions tell the AI about your team's coding standards, preferred patterns, and project-specific context. This approach reduces repetitive prompting and improves the consistency of generated code.

To get started:

Enter /init in the chat input to generate a copilot-instructions.md or AGENTS.md file tailored to your project structure.

Edit the generated file to add or refine instructions.

For language-specific or framework-specific rules, create additional .instructions.md files with applyTo glob patterns by using the Chat: New Instructions File command.

Write effective instructions:

Keep instructions concise. If the instructions file is too long, the AI ignores rules. Include reasoning behind non-obvious rules so the AI can apply them in new contexts.
Show preferred and avoided patterns with short code examples.
Skip rules that your linter or formatter already enforces.
Prune regularly. If the AI already follows a rule without the instruction, remove it.
For more information, see custom instructions and the full customization overview.

Pick the right tool for the task
AI in VS Code offers several interaction modes. Choosing the right one for the task at hand saves time and produces better results.

Expand table
Tool	Best for	Example
Inline suggestions	Staying in the flow while writing code	Code completions, variable names, boilerplate
Ask (chat)	Questions, brainstorming, exploring ideas	"How does authentication work in this project?"
Inline chat	Targeted, in-place edits without switching context	Refactoring a function, adding error handling
Agents	Multi-file changes that require autonomous planning and tool use	Implementing a feature end-to-end
Plan	Structured planning before implementation	Designing an architecture or migration strategy
Smart actions	Built-in, specialized one-step tasks	Generating commit messages, fixing errors, renaming symbols
Write effective prompts
The quality of AI responses depends on the clarity and specificity of your prompt. These techniques help you get better results.

Be specific about inputs, outputs, and constraints. State the programming language, frameworks, and libraries you want to use. Describe expected behavior or include example input and output.

Prompt

Write a TypeScript function that validates email addresses.
Return true for valid addresses, false otherwise. Don't use regex.
Example: validateEmail("user@example.com") returns true
Example: validateEmail("invalid") returns false
Break down complex tasks. Instead of asking for an entire feature at once, decompose it into smaller, well-scoped steps. This approach produces more reliable results and makes it easier to catch problems early.

Include expected output for verification. Provide test cases, expected results, or acceptance criteria so the AI can verify its own work. This step is one of the highest-leverage things you can do.

Prompt

Implement a rate limiter using the token bucket algorithm.
Write unit tests that verify: 10 requests/second allowed,
11th request rejected, bucket refills after 1 second.
Run the tests after implementing.
Iterate with follow-up prompts. Refine responses by adding constraints or corrections in follow-up messages rather than rewriting the entire prompt.

Avoid vague prompts. A prompt like "make this better" gives the AI no direction. Instead, specify what "better" means: "reduce the time complexity" or "add input validation for null values."

For more information, see prompt engineering and find practical prompt examples in the GitHub Copilot documentation.

Provide the right context
The AI responds more accurately when it has relevant context. Use these techniques to point the AI at the right information:

Use #codebase to explicitly instruct the AI to search your workspace for relevant code.
Reference specific files, folders, or symbols in your prompt with #<file>, #<folder>, or #<symbol>. Or, use drag and drop.
Use #fetch to pull content from a web page, or #githubRepo to search a GitHub repository.
Add problems, test failures, or terminal output for scenario-specific context.
Add images or screenshots to let the AI analyze visual content.
Use the integrated browser to preview your app and select page elements to use as context.
Add relevant tools by using Configure Tools in chat.
For more information, see adding context to chat prompts and configuring tools.

Choose the right model
VS Code supports multiple AI models. Choose the model that fits your task by using the model picker in the chat input field.
Use BYOK for more control over model selection and hosting options.
For more information, see selecting AI models and available models for Copilot Chat.

Plan first, then implement
For complex changes that span multiple files, separate planning from implementation. This approach prevents the AI from solving the wrong problem.

Explore. Use ask mode or a subagent to read the relevant code and understand how it works before making changes.
Plan. Use the Plan agent to create a structured implementation plan. Review and refine the plan before executing.
Implement. Switch to agent mode and implement from the plan. Include tests or expected outputs so the agent can verify its own work.
Review. Use checkpoints to review progress and rewind if the agent goes off track.
For more information, see the context engineering workflow.

Manage context and sessions
AI responses might degrade as the conversation fills with irrelevant context. Manage your sessions proactively.

Start new sessions for unrelated tasks. Don't keep piling unrelated questions into one conversation. Context pollution reduces response quality.
Remove irrelevant history. Delete past questions and responses that are no longer relevant, or start a fresh session.
Use subagents for investigation. Delegate research and exploration to subagents so the findings don't clutter your main context.
Use workspace indexing. For GitHub repositories, enable the remote index for fast, accurate code search across your entire codebase. For non-GitHub repos, a local index is created automatically.
Course-correct early. If the AI is heading in the wrong direction, steer it with a follow-up message to redirect the current request, queue a corrective prompt for after the current response completes, or stop and send a new prompt immediately.
For more information, see session management and workspace indexing.

Customize with reusable primitives
Commit reusable customization files to your repository so your entire team benefits from consistent AI behavior.

Save task-specific prompts with context and instructions in prompt files (.prompt.md). Trigger them like slash commands by typing / followed by the prompt name (for example, /security-review).
Define specialized AI personas with scoped tool access by creating custom agents (.agent.md). Use them for constrained workflows like code review, security audit, or planning.
Chain agents into manual workflows with handoffs or automate them with Agent Skills for end-to-end automation of complex processes.
Use subagents for isolated research that doesn't pollute main context.
Teach the AI domain-specific procedures (testing, deployment, debugging) with Agent Skills (SKILL.md). Include scripts, examples, and reference docs alongside your instructions.
Write specific description in the Agent Skill YAML frontmatter that states both what the skill does and when to use it. The AI uses this field to decide whether to load the skill.
Browse community skills in the awesome-copilot repository.

Related resources
Prompt engineering guide
Context engineering guide
Customization overview
Cheat sheet
Best Practices for using GitHub Copilot in the GitHub Copilot documentation
Help and support
Was this documentation helpful?
Yes, this page was helpfulNo, this page was not helpful
Still need help?
Ask the community
Request features
Report issues
Help us improve
All VS Code docs are open source. See something that's wrong or unclear? Submit a pull request.

02/06/2025
VS Code on Github Follow us on X VS Code on LinkedIn VS Code on Bluesky Join the VS Code community on Reddit The VS Code Insiders Podcast VS Code on TikTok VS Code on YouTube
Microsoft homepage
Support Privacy Terms of Use License
Set up a test-driven development flow in VS Code
Test-driven development (TDD) is a software development approach where you write tests before implementing functionality. This creates a tight feedback loop that improves code quality, catches bugs early, and ensures that the code meets your requirements. Visual Studio Code's AI capabilities can enhance your TDD workflow by guiding you through the different phases of writing tests, implementing code, running tests, and optimizing the code.

This guide shows you how to set up an AI-assisted test-driven development workflow in VS Code by using custom agents, handoffs, and custom instructions.

TDD overview
Implementation overview
You can implement an AI-assisted TDD workflow in VS Code by using custom agents. Each phase of the TDD process (red, green, refactor) has a specific goal and requires different AI behavior. You create a custom agent for each phase that defines the specific role and guidelines for that phase.

With custom agent handoffs, you can transition from one phase to the next once the AI completes its task. The custom agents are connected in a cycle that mirrors the TDD workflow:

Red phase → hands off to Green phase after writing failing tests
Green phase → runs tests to verify implementation, then hands off to Refactor phase
Refactor phase → runs tests to ensure they still pass, then hands off back to Red phase to start the next cycle
If you have established test conventions, you can use custom instructions to set up a testing context that guides the AI in generating tests that align with your project's standards.

The following diagram shows how custom agents work together to implement the TDD workflow, with handoffs enabling smooth transitions between phases.

Diagram that shows the TDD implementation diagram for VS Code with testing instructions, and custom agents for the red, green, and refactor phases.

Tip
You can further enhance the TDD workflow by adding a planning phase before starting the cycle. You can use the built-in plan agent or create a custom planning agent that helps clarify requirements and identify edge cases to cover with tests.

Step 1: Set up testing guidelines
If you have established test conventions and practices, create a custom instructions file (testing.instructions.md) to help the AI generate tests that align with your project's standards.

Why this helps: Without explicit test conventions, AI might generate tests that don't match your project's style, use inconsistent patterns, or miss important test scenarios.

To set up testing guidelines:

Run the Chat: Create Instructions File command in the Command Palette to create a new instructions file in your workspace.

Select .github/instructions to create the instructions file in your workspace.
Enter "testing" as the name for the instructions file.
Note
By using a *.instructions.md file instead of the copilot.instructions.md file, you can selectively apply these testing guidelines only to test files in your project instead of including them in all AI interactions.

Update the instructions applyTo metadata to automatically apply them to test files. Also set the description metadata to indicate that these instructions provide testing context.

The following example updates the applyTo field to target all files in the tests/ directory:

Markdown

---
description: 'Use these guidelines when generating or updating tests.'
applyTo: tests/**
---
Add your project's testing guidelines to the body of the instructions file.

The following example provides a starting point for test conventions:

Markdown

---
description: 'Use these guidelines when generating or updating tests.'
applyTo: tests/**
---
# [Project Name] Testing Guidelines

## Test conventions
* Write clear, focused tests that verify one behavior at a time
* Use descriptive test names that explain what is being tested and the expected outcome
* Follow Arrange-Act-Assert (AAA) pattern: set up test data, execute the code under test, verify results
* Keep tests independent - each test should run in isolation without depending on other tests
* Start with the simplest test case, then add edge cases and error conditions
* Tests should fail for the right reason - verify they catch the bugs they're meant to catch
* Mock external dependencies to keep tests fast and reliable
Tip
You can create an optional test structure template that defines sections and patterns for different test types (for example, test-template.md). Reference this template in your instructions file so the AI uses it when generating tests.

Step 2: Create red phase custom agent
Create a "TDD-red" custom agent that focuses on the red phase of TDD. This custom agent is only responsible for writing failing tests based on the provided requirements and should not implement any application code. When completed, this agent hands off to the green phase custom agent.

Why this helps: Without a focused mode, the AI might mix implementation suggestions with test creation, and miss the core TDD principle of writing tests first.

To create the .github/agents/TDD-red.agent.md red phase custom agent:

Run the Chat: New Custom Agent command in the Command Palette.

Select .github/agents to create the custom agent definition in your workspace.
Enter "TDD-red" as the name for the custom agent.
Update the custom agent definition to describe the guidelines and rules for the red phase, and to specify a handoff to the green phase custom agent.

The following TDD-red.agent.md file provides a starting point for the red phase.

Markdown

---
name: TDD Red
description: TDD phase for writing FAILING tests
infer: true
tools: ['read', 'edit', 'search']
handoffs:
  - label: TDD Green
    agent: TDD Green
    prompt: Implement minimal implementation
---
You are a test-writer: when given a function name, spec, or requirements, output a complete test file (or test function) that asserts the expected behavior, which must fail when run against the current codebase. Use the project’s style/conventions. Do not write implementation, only tests.
Step 3: Create green phase custom agent
Create a "TDD-green" custom agent that focuses on the green phase of TDD. This custom agent is only responsible for writing the minimal implementation code to make the tests pass, without modifying the test code. After implementing, this agent runs the tests to verify they pass, then hands off to the refactor phase custom agent.

To create the .github/agents/TDD-green.agent.md green phase custom agent:

Run the Chat: New Custom Agent command in the Command Palette.

Select .github/agents to create the custom agent definition in your workspace.
Enter "TDD-green" as the name for the custom agent.
Update the custom agent definition to describe the guidelines and rules for the green phase, and to specify a handoff to the refactor phase custom agent.

The following TDD-green.agent.md file provides a starting point:

Markdown

---
name: TDD Green
description: TDD phase for writing MINIMAL implementation to pass tests
infer: true
tools: ['search', 'edit', 'execute']
handoffs:
  - label: TDD Refactor
    agent: TDD Refactor
    prompt: Refactor the implementation
---

You are a code-implementer. Given a failing test case and context (existing codebase or module), write the minimal code change needed so that the test passes - no extra features. Do not write tests, only implementation.

After implementing changes, run the tests to verify they pass.
Step 4: Create refactor phase custom agent
Create a "TDD-refactor" custom agent that focuses on the refactor phase of TDD to improve code quality while keeping all tests passing. This agent is responsible for cleaning up code, removing duplication, improving naming, and enhancing structure without changing functionality. After refactoring, this agent runs the tests to ensure they still pass, then hands off back to the red phase to start the next TDD cycle.

To create the .github/agents/TDD-refactor.agent.md refactor phase custom chat agent:

Run the Chat: New Custom Agent command in the Command Palette.

Select .github/agents to create the custom agent definition in your workspace.
Enter "TDD-refactor" as the name for the custom agent.
Update the custom agent definition to describe the guidelines and rules for the refactor phase.

The following TDD-refactor.agent.md file provides a starting point:

Markdown

---
name: TDD Refactor
description: Refactor code while maintaining passing tests
tools: ['search', 'edit', 'read', 'execute']
infer: true
handoffs:
  - label: TDD Red
    agent: TDD Red
    prompt: Start next TDD cycle with new test
---
You are refactor-assistant. Given code that passes all tests, examine it and suggest or apply refactoring to improve readability/structure/DRYness, without changing behavior. No new functionality, no breaking changes.

After refactoring, run the tests to ensure all tests still pass and behavior is preserved.
Use the TDD workflow to implement features
Now that the TDD custom agents are set up, you can use them to implement features in your project using the TDD workflow.

Open the Chat view and select the TDD Red agent from the agent dropdown menu.

Provide a prompt that describes the feature or behavior you want to test.

For example:

Text

Write tests for user registration with email validation and password requirements.
Review the generated tests and use the handoff actions to transition through the TDD cycle:

After tests are written, select TDD Green to implement the minimal code to make tests pass
The green agent runs tests automatically after implementing
After tests pass, select TDD Refactor to improve code quality
The refactor agent runs tests automatically after refactoring to ensure they still pass
Select TDD Red to start the next cycle with additional functionality
Troubleshooting and best practices
Common TDD pitfalls with AI
Running TDD without handoffs: Using a single agent to complete the entire TDD cycle removes the human from the loop. Handoffs provide control points where you can assess each step, verify the AI's work, and steer the agent in the right direction before moving to the next phase.

Missing test coverage for features: TDD agents focus on making existing tests pass and won't implement features that don't have corresponding tests. Ensure every requirement in your specification has test coverage before expecting the implementation to include it.

Skipping the red phase: AI might suggest implementing code before writing tests.

Over-implementation: AI might generate more code than needed to pass the current test. Review implementations critically and remove unnecessary complexity.

Testing implementation details: Tests should verify behavior, not implementation. If refactoring requires changing tests, they might be too tightly coupled to implementation details.

Incomplete test coverage: AI might miss edge cases or error conditions. Review generated tests critically and ask for additional tests covering boundary conditions, error scenarios, and edge cases.

Best practices for TDD with AI
Choose the right model for the task: Different language models have different strengths. Consider using reasoning models for complex test generation and edge case identification. Use the model picker in the Chat view to switch models during your TDD workflow or define the model in your custom agent properties.

Validate test quality: After AI generates a test, review it to ensure it fails for the right reason. Run the test before implementing to verify it catches the missing functionality.

Maintain incremental progress: Take small steps through the TDD cycle. Write one test, implement minimal code, refactor, then repeat. Small iterations prevent large mistakes and keep the codebase working.

Run tests frequently: Execute tests immediately after changes. Don't accumulate multiple changes before testing. Frequent test runs provide rapid feedback and catch issues early.

Use test coverage as a guide: High coverage doesn't guarantee quality, but low coverage indicates untested behavior. Ask AI to suggest tests for uncovered code paths.

Maintain test independence: Tests should run in any order without affecting each other. If tests depend on execution order or shared state, refactor to make them independent.

Update test context as needed: As your project evolves, update the testing guidelines in your instructions file to reflect new conventions, frameworks, or practices.

Related resources

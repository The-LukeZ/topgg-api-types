# Contributing

Thank you for your interest in contributing! Here are some guidelines to help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Make your changes (in a new branch)
4. Test your changes by building the project
5. Format via `pnpm format`
6. Commit your changes with a clear message
7. Push your branch to your fork
8. Create a pull request to the main repository

## Making Changes

### General Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages (use present tense)
- Keep changes focused and atomic (one feature or fix per commit)

### Specific Areas

- **package.json**: You may not update the `exports` field as it is set by `tsdown` automatically. If you need to add new exports, add them in the source code and let `tsdown` handle the rest.
- **Type Definitions**: Ensure that any new types are well-documented with JSDoc comments for clarity.

  Make sure that types are reusable if needed in multiple places.

- **Validators**: If adding new API endpoints, consider adding corresponding `zod/mini` validators for runtime validation.
- **Utils**: If something is needed in both v0 and v1, add it to the `utils` directory and import it where needed.
- **Imports**: Use path aliases defined in `tsconfig.json` / `tsdown.config.ts` for cleaner imports (e.g., `import { Bot } from '@types'` instead of relative paths).

## Submitting Changes

1. Push your branch to your fork
2. Create a pull request with a clear description
3. Link any related issues
4. Ensure all tests pass

## Code Style

- Use consistent indentation (use prettier to format code)
- Add comments for complex logic
- Keep functions small and focused

## Reporting Issues

- Search existing issues first
- Provide a clear description and reproduction steps
- Include relevant version information

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

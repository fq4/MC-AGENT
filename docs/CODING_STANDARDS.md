# Coding Standards

## TypeScript

- Strict mode enabled (`"strict": true`)
- No `any` unless absolutely unavoidable
- Prefer interfaces over type aliases for object shapes
- Use `readonly` for immutable properties
- Use explicit return types on public functions
- Use descriptive names: `calculateDistance` not `calc`

## Code Style

- 2 spaces for indentation
- Double quotes for strings
- Semicolons required
- Trailing commas in multi-line structures
- 100 character line width
- Always use curly braces for control flow

## Module Organization

- One class/interface per file
- File name matches exported class/interface name
- Index files re-export from implementation files
- Avoid deep nesting (max 3 levels)

## Error Handling

- Never swallow exceptions silently
- Provide meaningful log messages
- Fail fast for unrecoverable configuration errors
- Recover from transient failures (e.g., network drops)

## Logging

- Use Winston, never `console.log` outside startup
- Log levels: error, warn, info, debug
- Include context in log messages

## Imports

- Group imports: external, internal, parent, sibling
- Use `.js` extensions for ESM imports
- Avoid circular dependencies

## Testing

- Test files colocated with source or in `tests/`
- Descriptive test names
- One assertion concept per test
- Use `beforeEach` for setup
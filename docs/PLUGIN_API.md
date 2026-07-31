# Plugin API

## Interface

```typescript
interface Plugin {
  name: string;
  version: string;
  description: string;
  register: (bot: Bot) => Promise<void> | void;
  unregister: (bot: Bot) => Promise<void> | void;
}
```

## Plugin Manifest

Each plugin directory must contain a `package.json`:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My plugin",
  "main": "index.js"
}
```

## Lifecycle

### Registration
`register(bot)` is called when the plugin is loaded. Use this to:
- Subscribe to events
- Add commands
- Register behaviors
- Initialize state

### Unregistration
`unregister(bot)` is called when the plugin is unloaded. Use this to:
- Remove event listeners
- Clean up intervals/timeouts
- Release resources

## Example Plugin

```typescript
import { Plugin, Bot } from 'mc-agent';

const plugin: Plugin = {
  name: 'greeter',
  version: '1.0.0',
  description: 'Greets players when they join',
  register: (bot: Bot) => {
    bot.events.on('bot:chat', ({ sender, message }) => {
      if (message === 'hello') {
        bot.chat(`Hello, ${sender}!`);
      }
    });
  },
  unregister: (bot: Bot) => {
    bot.events.removeAllListeners('bot:chat');
  },
};

export default plugin;
```

## Error Isolation

Plugin errors are caught and logged. A failing plugin does not crash the bot.
# Commands

Commands are auto-registered at startup. Each command file exports a `Command` object.

## Built-in Commands

### follow &lt;username&gt;
Follow a player.
- Aliases: `followplayer`, `fp`
- Arguments: `username`

### stop
Stop the current task.
- Aliases: `halt`, `cancel`

### goto &lt;x&gt; &lt;y&gt; &lt;z&gt;
Move to coordinates.
- Aliases: `move`, `walk`
- Arguments: `x`, `y`, `z`

### mine &lt;block_name&gt;
Mine a specific block type.
- Aliases: `dig`, `mineblock`
- Arguments: `block_name`

### collect &lt;item&gt;
Collect items.
- Aliases: `gather`, `pickup`
- Arguments: `item`

### attack &lt;entity&gt;
Attack an entity.
- Aliases: `fight`, `pvp`
- Arguments: `entity`

### inventory
Show inventory contents.
- Aliases: `inv`, `items`

### say &lt;message&gt;
Send a chat message.
- Aliases: `msg`, `chat`
- Arguments: `message`

## Creating Custom Commands

Add a new file in `src/commands/`:

```typescript
import { Command, CommandContext } from '../types/index.js';

export const myCommand: Command = {
  metadata: {
    name: 'mycommand',
    aliases: ['mc'],
    description: 'Does something',
    usage: 'mycommand <arg>',
    arguments: ['arg'],
    permissions: [],
  },
  execute: async (ctx: CommandContext) => {
    ctx.bot.chat('Hello!');
  },
};
```

Then import it in `src/commands/index.ts` and add it to the `registerCommands()` array.
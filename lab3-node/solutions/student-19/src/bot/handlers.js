import { STATES } from '../state/index.js';

export function createHandlers(fsm, providers) {
  async function start(ctx) {
    await ctx.reply('Welcome to LlamaBot! Use /chat or /providers');
  }

  async function chat(ctx) {
    const userId = String(ctx.from.id);
    const { data } = fsm.getState(userId);

    if (!data.activeProvider) {
      fsm.setState(userId, STATES.WAITING_FOR_PROVIDER);
      await ctx.reply('No active provider. Use /providers to select one.');
      return;
    }

    fsm.setState(userId, STATES.WAITING_FOR_MESSAGE, data);
    await ctx.reply(`Send your message for ${data.activeProvider}/${data.activeModel}:`);
  }

  async function listProviders(ctx) {
    const userId = String(ctx.from.id);
    const list = providers.list();
    
    const lines = list.map((p, i) => {
      const modelsStr = p.getModels().join(', ');
      return `${i + 1}. ${p.name} [${p.getStatus()}] (models: ${modelsStr})`;
    });
    
    const text = lines.length ? lines.join('\n') : 'No providers configured.';
    
    fsm.setState(userId, STATES.WAITING_FOR_PROVIDER, {});
    await ctx.reply(`Available providers:\n${text}\n\nSend the number to select:`);
  }

  async function handleText(ctx) {
    const userId = String(ctx.from.id);
    const { state, data } = fsm.getState(userId);
    const text = (ctx.message.text || '').trim();

    try {
      if (state === STATES.WAITING_FOR_PROVIDER) {
        await handleProviderSelection(ctx, userId, data, text);
      } else if (state === STATES.WAITING_FOR_MODEL) {
        await handleModelSelection(ctx, userId, data, text);
      } else if (state === STATES.WAITING_FOR_MESSAGE) {
        await handleChatMessage(ctx, userId, data, text);
      } else {
        await ctx.reply('Unknown action. Use /chat or /providers.');
      }
    } catch (err) {
      console.error('Handler error:', err);
      await ctx.reply(`Error: ${err.message}`);
    }
  }

  async function handleProviderSelection(ctx, userId, data, text) {
    const list = providers.list();
    const idx = parseInt(text, 10) - 1;
    
    if (Number.isNaN(idx) || idx < 0 || idx >= list.length) {
      fsm.setState(userId, STATES.IDLE);
      await ctx.reply('Invalid selection. Try /providers again.');
      return;
    }
    
    const provider = list[idx];
    const models = providers.getModels(provider.name);
    const nextData = { ...data, activeProvider: provider.name };

    if (models.length === 1) {
      fsm.setState(userId, STATES.IDLE, { ...nextData, activeModel: models[0] });
      await ctx.reply(`Selected: ${provider.name} / ${models[0]}`);
    } else {
      fsm.setState(userId, STATES.WAITING_FOR_MODEL, { ...nextData, modelNames: models });
      const modelLines = models.map((m, i) => `${i + 1}. ${m}`).join('\n');
      await ctx.reply(`Select model for ${provider.name}:\n${modelLines}`);
    }
  }

  async function handleModelSelection(ctx, userId, data, text) {
    const idx = parseInt(text, 10) - 1;
    
    if (Number.isNaN(idx) || idx < 0 || idx >= data.modelNames.length) {
      fsm.setState(userId, STATES.IDLE);
      await ctx.reply('Invalid selection. Try /providers again.');
      return;
    }
    
    const model = data.modelNames[idx];
    fsm.setState(userId, STATES.IDLE, { ...data, activeModel: model });
    await ctx.reply(`Selected model: ${model}`);
  }

  async function handleChatMessage(ctx, userId, data, text) {
    if (!text) {
      await ctx.reply('Message cannot be empty. Try again.');
      return;
    }
    const { activeProvider, activeModel } = data;
    const reply = await providers.chat(activeProvider, activeModel, text);
    await ctx.reply(`[${activeProvider}/${activeModel}]\n${reply}`);
    fsm.setState(userId, STATES.IDLE, data);
  }

  return { start, chat, listProviders, handleText };
}
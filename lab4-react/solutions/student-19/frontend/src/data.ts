import type { LLMModel, LLMProvider, LLMRequest } from '@my-app/ui-library'

export const providers: LLMProvider[] = [
  { id: 'openrouter', name: 'OpenRouter', available: true },
  { id: 'groq', name: 'Groq', available: true },
  { id: 'ollama', name: 'Ollama', available: true },
  { id: 'mistral', name: 'Mistral AI', available: false },
]

export const models: LLMModel[] = [
  {
    id: 'openrouter/llama-3.3-70b',
    providerId: 'openrouter',
    name: 'Llama 3.3 70B Instruct',
  },
  {
    id: 'openrouter/deepseek-r1',
    providerId: 'openrouter',
    name: 'DeepSeek R1',
  },
  {
    id: 'openrouter/gemini-2.0-flash',
    providerId: 'openrouter',
    name: 'Gemini 2.0 Flash',
  },
  {
    id: 'groq/llama-3.3-70b-versatile',
    providerId: 'groq',
    name: 'Llama 3.3 70B Versatile',
  },
  {
    id: 'groq/mixtral-8x7b',
    providerId: 'groq',
    name: 'Mixtral 8x7B',
  },
  {
    id: 'ollama/qwen2.5-7b',
    providerId: 'ollama',
    name: 'Qwen 2.5 7B',
  },
  {
    id: 'ollama/llama3.2-3b',
    providerId: 'ollama',
    name: 'Llama 3.2 3B',
  },
  {
    id: 'mistral/mistral-small-latest',
    providerId: 'mistral',
    name: 'Mistral Small',
  },
  {
    id: 'mistral/open-mistral-7b',
    providerId: 'mistral',
    name: 'Open Mistral 7B',
  },
]

export const rotationRules: string[] = [
  'При ошибке запроса переключаться на следующую доступную модель.',
  'Пропускать провайдера, если он помечен как недоступный.',
  'При исчерпании лимита токенов выбирать модель с меньшим расходом.',
  'Запрос в статусе «В ожидании» дольше 30 секунд считать зависшим и повторять на другой модели.',
  'Отдавать приоритет бесплатным моделям.',
]

export const initialRequests: LLMRequest[] = [
  {
    id: 'request-1',
    provider: 'OpenRouter',
    model: 'Llama 3.3 70B Instruct',
    status: 'success',
    createdAt: '2026-10-27T08:12:05.000Z',
    tokens: 842,
  },
  {
    id: 'request-2',
    provider: 'Groq',
    model: 'Mixtral 8x7B',
    status: 'error',
    createdAt: '2026-10-27T08:15:40.000Z',
    tokens: 0,
  },
  {
    id: 'request-3',
    provider: 'Ollama',
    model: 'Qwen 2.5 7B',
    status: 'pending',
    createdAt: '2026-10-27T08:16:02.000Z',
    tokens: 128,
  },
  {
    id: 'request-4',
    provider: 'OpenRouter',
    model: 'DeepSeek R1',
    status: 'success',
    createdAt: '2026-10-27T08:20:11.000Z',
    tokens: 1560,
  },
]

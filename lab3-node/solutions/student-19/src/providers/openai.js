import OpenAI from 'openai';

export class OpenAIProvider {
  constructor(apiKey) {
    this.name = 'openai';
    this._client = new OpenAI({ apiKey });
    this._models = ['gpt-4o-mini', 'gpt-4o'];
    this._status = 'available';
  }

  getModels() {
    return [...this._models];
  }

  getStatus() {
    return this._status;
  }

  setStatus(status) {
    this._status = status;
  }

  async chat(model, message) {
    try {
      if (typeof message !== 'string' || message.length === 0) {
        throw new Error('Message must be a non-empty string');
      }
      const response = await this._client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: message }]
      });
      this.setStatus('available');
      return response.choices[0].message.content;
    } catch (err) {
      this.setStatus('unavailable');
      throw err;
    }
  }
}
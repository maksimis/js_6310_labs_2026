export class ProviderRegistry {
  constructor() {
    this.providers = new Map();
  }

  // register() — добавляет нового провайдера в реестр
  // provider — объект провайдера, у него должно быть поле .name
  register(provider) {
    if (!provider || typeof provider.name !== 'string') {
      throw new Error('Provider must have a string name');
    }
    this.providers.set(provider.name, provider);
  }

  // list() — возвращает массив всех зарегистрированных провайдеров
  list() {
    return Array.from(this.providers.values());
  }

  // get() — возвращает провайдера по имени
  get(name) {
    const provider = this.providers.get(name);
    if (!provider) {
      const err = new Error(`Provider "${name}" not found`);
      err.statusCode = 404;
      throw err;
    }
    return provider;
  }

  // getModels() — возвращает список моделей конкретного провайдера
  getModels(name) {
    return this.get(name).getModels();
  }

  // chat() — главная функция: отправляет сообщение в нужный провайдер/модель
  // providerName — имя провайдера ("mock", "openai")
  // model — имя модели ("mock-small", "gpt-4o-mini")
  // message — текст от пользователя
  async chat(providerName, model, message) {
    const provider = this.get(providerName); // получаем провайдера
    const models = provider.getModels();     // получаем его модели
    
    // Проверяем, что такая модель вообще существует у этого провайдера
    if (!models.includes(model)) {
      const err = new Error(`Model "${model}" not found for provider "${providerName}"`);
      err.statusCode = 400;
      throw err;
    }
    
    return await provider.chat(model, message);
  }
}
/**
 * 翻译管理器 - 管理翻译文件的加载、缓存和文本获取
 * 
 * 功能特性:
 * - 动态加载翻译文件
 * - 翻译缓存和性能优化
 * - 支持嵌套翻译键和参数插值
 * - 多语言回退机制
 * - 跨环境兼容 (浏览器/Node.js)
 */
class TranslationManager {
  constructor() {
    this.translations = {};
    this.currentLanguage = 'en';
    this.defaultLanguage = 'en';
    this.loadingPromises = {};
    this.supportedLanguages = ['en', 'zh-cn', 'zh-tw'];
    
    // 翻译文件路径配置
    this.translationPaths = {
      'en': './assets/js/i18n/en.js',
      'zh-cn': './assets/js/i18n/zh-cn.js', 
      'zh-tw': './assets/js/i18n/zh-tw.js'
    };
  }

  /**
   * 设置当前语言
   * @param {string} language - 语言代码
   */
  setCurrentLanguage(language) {
    if (this.supportedLanguages.includes(language)) {
      this.currentLanguage = language;
    } else {
      console.warn(`Unsupported language: ${language}, falling back to ${this.defaultLanguage}`);
      this.currentLanguage = this.defaultLanguage;
    }
  }

  /**
   * 获取当前语言
   * @returns {string} 当前语言代码
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * 加载指定语言的翻译文件
   * @param {string} language - 语言代码
   * @returns {Promise<Object>} 翻译数据
   */
  async loadTranslations(language) {
    // 验证语言是否支持
    if (!this.supportedLanguages.includes(language)) {
      throw new Error(`Unsupported language: ${language}`);
    }

    // 如果已经加载过，直接返回
    if (this.translations[language]) {
      return this.translations[language];
    }

    // 如果正在加载，返回现有的Promise
    if (this.loadingPromises[language]) {
      return this.loadingPromises[language];
    }

    // 开始加载
    this.loadingPromises[language] = this._loadTranslationFile(language);
    
    try {
      const translations = await this.loadingPromises[language];
      this.translations[language] = translations;
      delete this.loadingPromises[language];
      return translations;
    } catch (error) {
      delete this.loadingPromises[language];
      throw error;
    }
  }

  /**
   * 内部方法：加载翻译文件
   * @param {string} language - 语言代码
   * @returns {Promise<Object>} 翻译数据
   */
  async _loadTranslationFile(language) {
    const filePath = this.translationPaths[language];
    
    if (!filePath) {
      throw new Error(`No translation file path configured for language: ${language}`);
    }

    try {
      // 在浏览器环境中动态加载脚本
      if (typeof window !== 'undefined') {
        return await this._loadScriptInBrowser(filePath, language);
      } 
      // 在Node.js环境中加载模块
      else if (typeof require !== 'undefined') {
        return await this._loadModuleInNode(filePath);
      } 
      else {
        throw new Error('Unsupported environment for loading translations');
      }
    } catch (error) {
      console.error(`Failed to load translations for ${language}:`, error);
      
      // 如果不是默认语言，尝试加载默认语言
      if (language !== this.defaultLanguage) {
        console.warn(`Falling back to default language: ${this.defaultLanguage}`);
        return await this.loadTranslations(this.defaultLanguage);
      }
      
      throw error;
    }
  }

  /**
   * 在浏览器环境中加载脚本
   * @param {string} filePath - 文件路径
   * @param {string} language - 语言代码
   * @returns {Promise<Object>} 翻译数据
   */
  _loadScriptInBrowser(filePath, language) {
    return new Promise((resolve, reject) => {
      // 检查是否已经有全局变量
      const globalVarName = `translations_${language.replace('-', '_')}`;
      if (window[globalVarName]) {
        resolve(window[globalVarName]);
        return;
      }

      const script = document.createElement('script');
      script.src = filePath;
      script.async = true;
      
      script.onload = () => {
        // 脚本加载完成后，检查全局变量
        if (window[globalVarName]) {
          resolve(window[globalVarName]);
        } else {
          reject(new Error(`Translation variable ${globalVarName} not found after loading script`));
        }
        document.head.removeChild(script);
      };
      
      script.onerror = () => {
        reject(new Error(`Failed to load translation script: ${filePath}`));
        document.head.removeChild(script);
      };
      
      document.head.appendChild(script);
    });
  }

  /**
   * 在Node.js环境中加载模块
   * @param {string} filePath - 文件路径
   * @returns {Promise<Object>} 翻译数据
   */
  async _loadModuleInNode(filePath) {
    try {
      const module = require(filePath);
      return module.default || module;
    } catch (error) {
      throw new Error(`Failed to require translation module: ${filePath}`);
    }
  }

  /**
   * 获取翻译文本
   * @param {string} key - 翻译键，支持点号分隔的嵌套键
   * @param {Object} params - 可选的参数对象，用于字符串插值
   * @param {string} fallbackLanguage - 可选的回退语言
   * @returns {string} 翻译文本
   */
  getText(key, params = {}, fallbackLanguage = null) {
    if (!key || typeof key !== 'string') {
      return key || '';
    }

    // 尝试从当前语言获取翻译
    let text = this._getTextFromLanguage(key, this.currentLanguage);
    
    // 如果没找到且指定了回退语言，尝试回退语言
    if (!text && fallbackLanguage && fallbackLanguage !== this.currentLanguage) {
      text = this._getTextFromLanguage(key, fallbackLanguage);
    }
    
    // 如果还没找到且当前语言不是默认语言，尝试默认语言
    if (!text && this.currentLanguage !== this.defaultLanguage) {
      text = this._getTextFromLanguage(key, this.defaultLanguage);
    }
    
    // 如果都没找到，返回键名
    if (!text) {
      return key;
    }

    // 处理参数插值
    return this._interpolateParams(text, params);
  }

  /**
   * 从指定语言获取翻译文本
   * @param {string} key - 翻译键
   * @param {string} language - 语言代码
   * @returns {string|null} 翻译文本或null
   */
  _getTextFromLanguage(key, language) {
    const translations = this.translations[language];
    if (!translations) {
      return null;
    }

    // 支持嵌套键，如 'nav.about'
    const keys = key.split('.');
    let current = translations;
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return null;
      }
    }
    
    return typeof current === 'string' ? current : null;
  }

  /**
   * 处理参数插值
   * @param {string} text - 原始文本
   * @param {Object} params - 参数对象
   * @returns {string} 插值后的文本
   */
  _interpolateParams(text, params) {
    if (!params || typeof params !== 'object') {
      return text;
    }

    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * 检查翻译是否已加载
   * @param {string} language - 语言代码
   * @returns {boolean} 是否已加载
   */
  isLanguageLoaded(language) {
    return !!this.translations[language];
  }

  /**
   * 获取所有已加载的语言
   * @returns {string[]} 已加载的语言代码数组
   */
  getLoadedLanguages() {
    return Object.keys(this.translations);
  }

  /**
   * 清除指定语言的翻译缓存
   * @param {string} language - 语言代码
   */
  clearLanguageCache(language) {
    if (this.translations[language]) {
      delete this.translations[language];
    }
    if (this.loadingPromises[language]) {
      delete this.loadingPromises[language];
    }
  }

  /**
   * 清除所有翻译缓存
   */
  clearAllCache() {
    this.translations = {};
    this.loadingPromises = {};
  }

  /**
   * 获取支持的语言列表
   * @returns {string[]} 支持的语言代码数组
   */
  getSupportedLanguages() {
    return [...this.supportedLanguages];
  }

  /**
   * 预加载所有支持的语言
   * @returns {Promise<void>} 加载完成的Promise
   */
  async preloadAllLanguages() {
    const loadPromises = this.supportedLanguages.map(lang => 
      this.loadTranslations(lang).catch(error => {
        console.warn(`Failed to preload language ${lang}:`, error);
        return null;
      })
    );
    
    await Promise.all(loadPromises);
  }

  /**
   * 获取翻译统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    const stats = {
      currentLanguage: this.currentLanguage,
      loadedLanguages: this.getLoadedLanguages(),
      supportedLanguages: this.getSupportedLanguages(),
      loadingLanguages: Object.keys(this.loadingPromises)
    };

    // 计算每种语言的翻译键数量
    stats.translationCounts = {};
    for (const [lang, translations] of Object.entries(this.translations)) {
      stats.translationCounts[lang] = this._countTranslationKeys(translations);
    }

    return stats;
  }

  /**
   * 递归计算翻译键的数量
   * @param {Object} obj - 翻译对象
   * @returns {number} 键的数量
   */
  _countTranslationKeys(obj) {
    let count = 0;
    for (const value of Object.values(obj)) {
      if (typeof value === 'string') {
        count++;
      } else if (typeof value === 'object' && value !== null) {
        count += this._countTranslationKeys(value);
      }
    }
    return count;
  }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TranslationManager;
} else {
  window.TranslationManager = TranslationManager;
}
/**
 * 主国际化系统 - 整合所有国际化组件
 * 
 * 功能特性:
 * - 统一的国际化系统入口
 * - 自动语言检测和切换
 * - 组件生命周期管理
 * - 错误处理和回退机制
 * - 系统状态监控和事件通知
 */
class I18nSystem {
  constructor() {
    this.detector = null;
    this.translationManager = null;
    this.renderer = null;
    this.isInitialized = false;
    this.currentLanguage = 'en';
    
    // 配置选项
    this.config = {
      defaultLanguage: 'en',
      supportedLanguages: ['en', 'zh-cn', 'zh-tw'],
      autoDetect: true,
      enableDOMObserver: true,
      fallbackLanguage: 'en'
    };
  }

  /**
   * 初始化国际化系统
   * @param {Object} options - 配置选项
   * @returns {Promise<void>}
   */
  async initialize(options = {}) {
    try {
      // 合并配置
      this.config = { ...this.config, ...options };
      
      // 初始化组件
      await this.initializeComponents();
      
      // 检测语言
      if (this.config.autoDetect) {
        this.currentLanguage = this.detector.detectLanguage();
      } else {
        this.currentLanguage = this.config.defaultLanguage;
      }
      
      // 加载翻译
      await this.loadLanguage(this.currentLanguage);
      
      // 渲染页面
      this.renderer.updatePageText(this.currentLanguage);
      
      // 启动DOM观察器
      if (this.config.enableDOMObserver) {
        this.renderer.startDOMObserver();
      }
      
      this.isInitialized = true;
      
      // 触发初始化完成事件
      this.dispatchEvent('initialized', {
        language: this.currentLanguage,
        supportedLanguages: this.config.supportedLanguages
      });
      
    } catch (error) {
      console.error('Failed to initialize I18n System:', error);
      
      // 回退到默认语言
      await this.fallbackToDefault();
      
      throw error;
    }
  }

  /**
   * 初始化所有组件
   * @private
   */
  async initializeComponents() {
    // 检查组件是否已加载
    if (typeof LanguageDetector === 'undefined') {
      throw new Error('LanguageDetector not loaded');
    }
    if (typeof TranslationManager === 'undefined') {
      throw new Error('TranslationManager not loaded');
    }
    if (typeof TextRenderer === 'undefined') {
      throw new Error('TextRenderer not loaded');
    }

    // 初始化组件
    this.detector = new LanguageDetector();
    this.translationManager = new TranslationManager();
    this.renderer = new TextRenderer();
    
    // 设置组件关联
    this.renderer.setTranslationManager(this.translationManager);
  }

  /**
   * 加载指定语言
   * @param {string} language - 语言代码
   * @returns {Promise<void>}
   */
  async loadLanguage(language) {
    try {
      // 验证语言是否支持
      if (!this.config.supportedLanguages.includes(language)) {
        console.warn(`Unsupported language: ${language}, falling back to ${this.config.defaultLanguage}`);
        language = this.config.defaultLanguage;
      }
      
      // 加载翻译文件
      await this.translationManager.loadTranslations(language);
      
      // 设置当前语言
      this.translationManager.setCurrentLanguage(language);
      this.currentLanguage = language;
      
    } catch (error) {
      console.error(`Failed to load language ${language}:`, error);
      
      // 尝试回退语言
      if (language !== this.config.fallbackLanguage) {
        await this.loadLanguage(this.config.fallbackLanguage);
      } else {
        throw error;
      }
    }
  }

  /**
   * 切换语言
   * @param {string} language - 目标语言代码
   * @returns {Promise<void>}
   */
  async switchLanguage(language) {
    if (!this.isInitialized) {
      throw new Error('I18n System not initialized');
    }

    if (language === this.currentLanguage) {
      return;
    }

    try {
      // 加载新语言
      await this.loadLanguage(language);
      
      // 重新渲染页面
      this.renderer.updatePageText(language);
      
      // 触发语言切换事件
      this.dispatchEvent('languageChanged', {
        from: this.currentLanguage,
        to: language
      });
      
    } catch (error) {
      console.error(`Failed to switch to language ${language}:`, error);
      throw error;
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
   * 获取支持的语言列表
   * @returns {string[]} 支持的语言代码数组
   */
  getSupportedLanguages() {
    return [...this.config.supportedLanguages];
  }

  /**
   * 获取翻译文本
   * @param {string} key - 翻译键
   * @param {Object} params - 参数对象
   * @returns {string} 翻译文本
   */
  getText(key, params = {}) {
    if (!this.isInitialized || !this.translationManager) {
      console.warn('I18n System not initialized, returning key');
      return key;
    }
    
    return this.translationManager.getText(key, params);
  }

  /**
   * 重新渲染所有翻译
   */
  rerender() {
    if (!this.isInitialized || !this.renderer) {
      console.warn('I18n System not initialized');
      return;
    }
    
    this.renderer.rerender();
  }

  /**
   * 获取系统状态
   * @returns {Object} 系统状态信息
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      currentLanguage: this.currentLanguage,
      supportedLanguages: this.config.supportedLanguages,
      config: { ...this.config },
      translationStats: this.translationManager ? this.translationManager.getStats() : null,
      renderStats: this.renderer ? this.renderer.getTranslationStats() : null
    };
  }

  /**
   * 验证系统完整性
   * @returns {Object} 验证结果
   */
  validate() {
    const issues = [];
    const warnings = [];

    // 检查初始化状态
    if (!this.isInitialized) {
      issues.push('System not initialized');
    }

    // 检查组件
    if (!this.detector) issues.push('LanguageDetector not initialized');
    if (!this.translationManager) issues.push('TranslationManager not initialized');
    if (!this.renderer) issues.push('TextRenderer not initialized');

    // 检查翻译完整性
    if (this.renderer) {
      const renderValidation = this.renderer.validateTranslations();
      if (renderValidation.issues.length > 0) {
        issues.push(...renderValidation.issues.map(issue => `Render: ${issue.message}`));
      }
      if (renderValidation.warnings.length > 0) {
        warnings.push(...renderValidation.warnings.map(warning => `Render: ${warning.message}`));
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      warnings,
      timestamp: Date.now()
    };
  }

  /**
   * 回退到默认语言
   * @private
   */
  async fallbackToDefault() {
    try {
      if (!this.translationManager) {
        await this.initializeComponents();
      }
      
      await this.loadLanguage(this.config.defaultLanguage);
      
      if (this.renderer) {
        this.renderer.updatePageText(this.config.defaultLanguage);
      }
      
      this.isInitialized = true;
      
    } catch (error) {
      console.error('Fallback failed:', error);
    }
  }

  /**
   * 清理系统资源
   */
  cleanup() {
    if (this.renderer) {
      this.renderer.cleanup();
    }
    
    if (this.translationManager) {
      this.translationManager.clearAllCache();
    }
    
    this.detector = null;
    this.translationManager = null;
    this.renderer = null;
    this.isInitialized = false;
  }

  /**
   * 触发自定义事件
   * @param {string} eventType - 事件类型
   * @param {Object} detail - 事件详情
   * @private
   */
  dispatchEvent(eventType, detail = {}) {
    try {
      const event = new CustomEvent(`i18n:${eventType}`, {
        detail: {
          timestamp: Date.now(),
          system: this,
          ...detail
        }
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.warn('Error dispatching event:', error);
    }
  }

  /**
   * 添加事件监听器
   * @param {string} eventType - 事件类型
   * @param {Function} callback - 回调函数
   */
  addEventListener(eventType, callback) {
    document.addEventListener(`i18n:${eventType}`, callback);
  }

  /**
   * 移除事件监听器
   * @param {string} eventType - 事件类型
   * @param {Function} callback - 回调函数
   */
  removeEventListener(eventType, callback) {
    document.removeEventListener(`i18n:${eventType}`, callback);
  }

  /**
   * 预加载所有支持的语言
   * @returns {Promise<void>}
   */
  async preloadAllLanguages() {
    if (!this.translationManager) {
      throw new Error('TranslationManager not initialized');
    }
    
    try {
      await this.translationManager.preloadAllLanguages();
    } catch (error) {
      console.warn('Some languages failed to preload:', error);
    }
  }

  /**
   * 设置配置选项
   * @param {Object} newConfig - 新的配置选项
   */
  setConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}

// 创建全局实例
let globalI18nSystem = null;

/**
 * 获取全局国际化系统实例
 * @returns {I18nSystem} 全局实例
 */
function getI18nSystem() {
  if (!globalI18nSystem) {
    globalI18nSystem = new I18nSystem();
  }
  return globalI18nSystem;
}

/**
 * 快速初始化函数
 * @param {Object} options - 配置选项
 * @returns {Promise<I18nSystem>} 初始化后的系统实例
 */
async function initI18n(options = {}) {
  const system = getI18nSystem();
  await system.initialize(options);
  return system;
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { I18nSystem, getI18nSystem, initI18n };
} else {
  window.I18nSystem = I18nSystem;
  window.getI18nSystem = getI18nSystem;
  window.initI18n = initI18n;
}
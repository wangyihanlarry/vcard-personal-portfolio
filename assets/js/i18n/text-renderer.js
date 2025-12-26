/**
 * 文本渲染器 - 负责将翻译文本应用到DOM元素
 * 
 * 功能特性:
 * - 自动更新页面所有可翻译元素
 * - 支持多种DOM属性类型 (text, html, title等)
 * - DOM变化监听和动态翻译
 * - 翻译完整性验证
 * - 自定义事件系统
 */
class TextRenderer {
  constructor() {
    this.translationManager = null;
    this.renderedElements = new Set();
    this.observers = [];
    
    // 支持的属性类型
    this.supportedAttributes = {
      'text': 'textContent',
      'html': 'innerHTML', 
      'title': 'title',
      'alt': 'alt',
      'placeholder': 'placeholder',
      'value': 'value'
    };
  }

  /**
   * 设置翻译管理器
   * @param {TranslationManager} translationManager - 翻译管理器实例
   */
  setTranslationManager(translationManager) {
    this.translationManager = translationManager;
  }

  /**
   * 更新页面所有可翻译文本
   * @param {string} language - 目标语言代码
   */
  updatePageText(language = null) {
    if (!this.translationManager) {
      console.error('TranslationManager not set');
      return;
    }

    // 如果指定了语言，先设置当前语言
    if (language) {
      this.translationManager.setCurrentLanguage(language);
    }

    // 更新HTML lang属性
    this.updateHtmlLang(this.translationManager.getCurrentLanguage());

    // 查找所有带有data-i18n属性的元素
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
      this.updateElement(element);
    });

    // 触发自定义事件
    this.dispatchTranslationEvent('textUpdated', {
      language: this.translationManager.getCurrentLanguage(),
      elementsCount: elements.length
    });
  }

  /**
   * 更新单个元素的文本
   * @param {HTMLElement} element - 要更新的DOM元素
   */
  updateElement(element) {
    if (!element || !this.translationManager) {
      return;
    }

    const i18nKey = element.getAttribute('data-i18n');
    const i18nAttr = element.getAttribute('data-i18n-attr') || 'text';
    const i18nParams = element.getAttribute('data-i18n-params');
    
    if (!i18nKey) {
      console.warn('Element has data-i18n attribute but no key specified', element);
      return;
    }

    // 解析参数
    let params = {};
    if (i18nParams) {
      try {
        params = JSON.parse(i18nParams);
      } catch (error) {
        console.warn('Invalid JSON in data-i18n-params:', i18nParams, error);
      }
    }

    // 获取翻译文本
    const translatedText = this.translationManager.getText(i18nKey, params);
    
    // 应用翻译到元素
    this.applyTranslationToElement(element, translatedText, i18nAttr);
    
    // 记录已渲染的元素
    this.renderedElements.add(element);
  }

  /**
   * 将翻译文本应用到元素的指定属性
   * @param {HTMLElement} element - 目标元素
   * @param {string} text - 翻译文本
   * @param {string} attribute - 目标属性类型
   */
  applyTranslationToElement(element, text, attribute = 'text') {
    try {
      switch (attribute) {
        case 'text':
          element.textContent = text;
          break;
        case 'html':
          element.innerHTML = text;
          break;
        case 'title':
          element.title = text;
          break;
        case 'alt':
          element.alt = text;
          break;
        case 'placeholder':
          element.placeholder = text;
          break;
        case 'value':
          element.value = text;
          break;
        default:
          // 尝试作为自定义属性设置
          if (element.hasAttribute(attribute)) {
            element.setAttribute(attribute, text);
          } else {
            console.warn(`Unsupported attribute type: ${attribute}`);
            element.textContent = text; // 回退到文本内容
          }
      }
    } catch (error) {
      console.error('Error applying translation to element:', error, element);
    }
  }

  /**
   * 更新HTML文档的lang属性
   * @param {string} language - 语言代码
   */
  updateHtmlLang(language) {
    if (!language) return;
    
    try {
      // 更新html元素的lang属性
      document.documentElement.lang = language;
      
      // 更新meta标签中的语言信息（如果存在）
      const metaLang = document.querySelector('meta[http-equiv="Content-Language"]');
      if (metaLang) {
        metaLang.setAttribute('content', language);
      }
      
    } catch (error) {
      console.error('Error updating HTML lang attribute:', error);
    }
  }

  /**
   * 监听DOM变化，自动翻译新添加的元素
   */
  startDOMObserver() {
    if (!window.MutationObserver) {
      console.warn('MutationObserver not supported, dynamic translation disabled');
      return;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // 检查新添加的元素本身
              if (node.hasAttribute && node.hasAttribute('data-i18n')) {
                this.updateElement(node);
              }
              
              // 检查新添加元素的子元素
              const childElements = node.querySelectorAll ? node.querySelectorAll('[data-i18n]') : [];
              childElements.forEach(child => this.updateElement(child));
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.observers.push(observer);
  }

  /**
   * 停止DOM监听
   */
  stopDOMObserver() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  /**
   * 获取页面中所有可翻译元素的统计信息
   * @returns {Object} 统计信息
   */
  getTranslationStats() {
    const elements = document.querySelectorAll('[data-i18n]');
    const stats = {
      totalElements: elements.length,
      renderedElements: this.renderedElements.size,
      elementsByType: {},
      elementsByKey: {}
    };

    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const attr = element.getAttribute('data-i18n-attr') || 'text';
      
      // 按属性类型统计
      stats.elementsByType[attr] = (stats.elementsByType[attr] || 0) + 1;
      
      // 按翻译键统计
      stats.elementsByKey[key] = (stats.elementsByKey[key] || 0) + 1;
    });

    return stats;
  }

  /**
   * 验证页面翻译完整性
   * @returns {Object} 验证结果
   */
  validateTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    const issues = [];
    const warnings = [];

    elements.forEach((element, index) => {
      const key = element.getAttribute('data-i18n');
      const attr = element.getAttribute('data-i18n-attr') || 'text';
      
      if (!key) {
        issues.push({
          element: index,
          type: 'missing-key',
          message: 'Element has data-i18n attribute but no key specified'
        });
        return;
      }

      if (this.translationManager) {
        const text = this.translationManager.getText(key);
        if (text === key) {
          warnings.push({
            element: index,
            key: key,
            type: 'missing-translation',
            message: `No translation found for key: ${key}`
          });
        }
      }

      if (!this.supportedAttributes[attr] && !element.hasAttribute(attr)) {
        warnings.push({
          element: index,
          key: key,
          type: 'unsupported-attribute',
          message: `Unsupported or missing attribute: ${attr}`
        });
      }
    });

    return {
      totalElements: elements.length,
      issues: issues,
      warnings: warnings,
      isValid: issues.length === 0
    };
  }

  /**
   * 重新渲染所有翻译
   */
  rerender() {
    this.renderedElements.clear();
    this.updatePageText();
  }

  /**
   * 清理渲染器资源
   */
  cleanup() {
    this.stopDOMObserver();
    this.renderedElements.clear();
    this.translationManager = null;
  }

  /**
   * 触发自定义翻译事件
   * @param {string} eventType - 事件类型
   * @param {Object} detail - 事件详情
   */
  dispatchTranslationEvent(eventType, detail = {}) {
    try {
      const event = new CustomEvent(`i18n:${eventType}`, {
        detail: {
          timestamp: Date.now(),
          renderer: this,
          ...detail
        }
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.warn('Error dispatching translation event:', error);
    }
  }

  /**
   * 添加翻译事件监听器
   * @param {string} eventType - 事件类型
   * @param {Function} callback - 回调函数
   */
  addEventListener(eventType, callback) {
    document.addEventListener(`i18n:${eventType}`, callback);
  }

  /**
   * 移除翻译事件监听器
   * @param {string} eventType - 事件类型
   * @param {Function} callback - 回调函数
   */
  removeEventListener(eventType, callback) {
    document.removeEventListener(`i18n:${eventType}`, callback);
  }

  /**
   * 批量更新指定选择器的元素
   * @param {string} selector - CSS选择器
   * @param {string} language - 目标语言（可选）
   */
  updateElementsBySelector(selector, language = null) {
    if (language && this.translationManager) {
      this.translationManager.setCurrentLanguage(language);
    }

    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element.hasAttribute('data-i18n')) {
        this.updateElement(element);
      }
    });
  }

  /**
   * 获取支持的属性类型列表
   * @returns {string[]} 支持的属性类型
   */
  getSupportedAttributes() {
    return Object.keys(this.supportedAttributes);
  }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TextRenderer;
} else {
  window.TextRenderer = TextRenderer;
}
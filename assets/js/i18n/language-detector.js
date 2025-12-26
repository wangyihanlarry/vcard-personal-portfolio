/**
 * 语言检测器 - 检测浏览器语言偏好并映射到支持的语言
 * 
 * 功能特性:
 * - 自动检测浏览器Accept-Language头
 * - 支持多种中文变体识别 (简体/繁体)
 * - 提供语言映射和回退机制
 * - 兼容多种浏览器环境
 */
class LanguageDetector {
  constructor() {
    this.supportedLanguages = ['en', 'zh-cn', 'zh-tw'];
    this.defaultLanguage = 'en';
    
    // 语言映射表
    this.languageMapping = {
      'en': 'en',
      'en-US': 'en',
      'en-GB': 'en',
      'en-AU': 'en',
      'en-CA': 'en',
      'zh': 'zh-cn',
      'zh-CN': 'zh-cn',
      'zh-Hans': 'zh-cn',
      'zh-Hans-CN': 'zh-cn',
      'zh-TW': 'zh-tw',
      'zh-HK': 'zh-tw',
      'zh-MO': 'zh-tw',
      'zh-Hant': 'zh-tw',
      'zh-Hant-TW': 'zh-tw',
      'zh-Hant-HK': 'zh-tw'
    };
  }

  /**
   * 检测浏览器首选语言
   * @returns {string} 标准化的语言代码
   */
  detectLanguage() {
    try {
      // 获取浏览器语言列表
      const languages = this.getBrowserLanguages();
      
      // 遍历语言列表，找到第一个支持的语言
      for (const lang of languages) {
        const normalizedLang = this.parseLanguageCode(lang);
        if (this.supportedLanguages.includes(normalizedLang)) {
          return normalizedLang;
        }
      }
      
      // 如果没有找到支持的语言，返回默认语言
      return this.defaultLanguage;
    } catch (error) {
      console.warn('Language detection failed:', error);
      return this.defaultLanguage;
    }
  }

  /**
   * 获取浏览器语言列表
   * @returns {string[]} 语言代码数组
   */
  getBrowserLanguages() {
    const languages = [];
    
    // 尝试获取navigator.languages (现代浏览器)
    if (navigator.languages && navigator.languages.length > 0) {
      languages.push(...navigator.languages);
    }
    
    // 回退到navigator.language
    if (navigator.language) {
      languages.push(navigator.language);
    }
    
    // 回退到navigator.userLanguage (IE)
    if (navigator.userLanguage) {
      languages.push(navigator.userLanguage);
    }
    
    return languages.length > 0 ? languages : [this.defaultLanguage];
  }

  /**
   * 解析并标准化语言代码
   * @param {string} langCode - 原始语言代码
   * @returns {string} 标准化的语言代码
   */
  parseLanguageCode(langCode) {
    if (!langCode || typeof langCode !== 'string') {
      return this.defaultLanguage;
    }

    // 清理语言代码
    const cleanLangCode = langCode.trim();
    
    // 直接映射
    if (this.languageMapping[cleanLangCode]) {
      return this.languageMapping[cleanLangCode];
    }
    
    // 尝试匹配主语言代码 (例如: zh-CN-x-variant -> zh-CN)
    const mainLangCode = cleanLangCode.split('-').slice(0, 2).join('-');
    if (this.languageMapping[mainLangCode]) {
      return this.languageMapping[mainLangCode];
    }
    
    // 尝试匹配基础语言代码 (例如: zh-CN -> zh)
    const baseLangCode = cleanLangCode.split('-')[0];
    if (this.languageMapping[baseLangCode]) {
      return this.languageMapping[baseLangCode];
    }
    
    // 特殊处理中文变体
    if (this.isChineseVariant(cleanLangCode)) {
      return this.detectChineseVariant(cleanLangCode);
    }
    
    // 如果都没有匹配，返回默认语言
    return this.defaultLanguage;
  }

  /**
   * 检查是否为中文变体
   * @param {string} langCode - 语言代码
   * @returns {boolean} 是否为中文变体
   */
  isChineseVariant(langCode) {
    const lowerCode = langCode.toLowerCase();
    return lowerCode.startsWith('zh') || 
           lowerCode.includes('chinese') ||
           lowerCode.includes('hans') ||
           lowerCode.includes('hant');
  }

  /**
   * 检测中文变体类型
   * @param {string} langCode - 语言代码
   * @returns {string} 中文变体类型
   */
  detectChineseVariant(langCode) {
    const lowerCode = langCode.toLowerCase();
    
    // 繁体中文标识
    const traditionalIndicators = ['tw', 'hk', 'mo', 'hant', 'traditional'];
    
    for (const indicator of traditionalIndicators) {
      if (lowerCode.includes(indicator)) {
        return 'zh-tw';
      }
    }
    
    // 默认为简体中文
    return 'zh-cn';
  }

  /**
   * 验证语言代码是否受支持
   * @param {string} langCode - 语言代码
   * @returns {boolean} 是否受支持
   */
  isLanguageSupported(langCode) {
    return this.supportedLanguages.includes(langCode);
  }

  /**
   * 获取支持的语言列表
   * @returns {string[]} 支持的语言代码数组
   */
  getSupportedLanguages() {
    return [...this.supportedLanguages];
  }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LanguageDetector;
} else {
  window.LanguageDetector = LanguageDetector;
}
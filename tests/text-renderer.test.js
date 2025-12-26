/**
 * 文本渲染器属性测试
 * Feature: vcard-i18n, Property 2: 文本渲染完整性
 * **Validates: Requirements 1.6, 2.1, 2.2, 2.3, 2.4**
 */

// 模拟DOM环境（用于Node.js测试）
function createMockDOM() {
  const mockDocument = {
    documentElement: { lang: 'en' },
    querySelectorAll: function(selector) {
      return this._elements.filter(el => {
        if (selector === '[data-i18n]') {
          return el.hasAttribute('data-i18n');
        }
        return false;
      });
    },
    createElement: function(tagName) {
      return new MockElement(tagName);
    },
    dispatchEvent: function(event) {
      // Mock event dispatch
    },
    addEventListener: function(type, callback) {
      // Mock event listener
    },
    removeEventListener: function(type, callback) {
      // Mock event listener removal
    },
    _elements: []
  };

  class MockElement {
    constructor(tagName = 'div') {
      this.tagName = tagName;
      this.attributes = {};
      this.textContent = '';
      this.innerHTML = '';
      this.title = '';
      this.alt = '';
      this.placeholder = '';
      this.value = '';
    }

    getAttribute(name) {
      return this.attributes[name] || null;
    }

    setAttribute(name, value) {
      this.attributes[name] = value;
    }

    hasAttribute(name) {
      return name in this.attributes;
    }

    querySelectorAll(selector) {
      return []; // 简化实现
    }
  }

  // 创建一些测试元素
  const elements = [
    (() => {
      const el = new MockElement('h1');
      el.setAttribute('data-i18n', 'nav.about');
      return el;
    })(),
    (() => {
      const el = new MockElement('button');
      el.setAttribute('data-i18n', 'nav.resume');
      return el;
    })(),
    (() => {
      const el = new MockElement('p');
      el.setAttribute('data-i18n', 'about.title');
      return el;
    })(),
    (() => {
      const el = new MockElement('input');
      el.setAttribute('data-i18n', 'contact.form.fullName');
      el.setAttribute('data-i18n-attr', 'placeholder');
      return el;
    })(),
    (() => {
      const el = new MockElement('img');
      el.setAttribute('data-i18n', 'personal.name');
      el.setAttribute('data-i18n-attr', 'alt');
      return el;
    })()
  ];

  mockDocument._elements = elements;

  return { mockDocument, MockElement, elements };
}

// 简化的属性测试框架
class PropertyTestRunner {
  constructor() {
    this.testCount = 50; // 减少测试次数以适应模拟环境
  }

  property(name, generator, testFn) {
    console.log(`Running property test: ${name}`);
    let passed = 0;
    let failed = 0;
    let failures = [];

    for (let i = 0; i < this.testCount; i++) {
      try {
        const testData = generator();
        const result = testFn(testData);
        if (result) {
          passed++;
        } else {
          failed++;
          failures.push({ iteration: i, data: testData });
        }
      } catch (error) {
        failed++;
        failures.push({ iteration: i, error: error.message });
      }
    }

    console.log(`Property test "${name}": ${passed} passed, ${failed} failed`);
    if (failures.length > 0) {
      console.log('Failures:', failures.slice(0, 3));
    }
    
    return failed === 0;
  }
}

// 测试数据生成器
const generators = {
  // 生成语言代码
  languageCode: () => {
    const codes = ['en', 'zh-cn', 'zh-tw'];
    return codes[Math.floor(Math.random() * codes.length)];
  },

  // 生成翻译键
  translationKey: () => {
    const keys = [
      'nav.about', 'nav.resume', 'nav.portfolio', 'nav.blog', 'nav.contact',
      'personal.name', 'personal.title', 'about.title', 'contact.form.fullName'
    ];
    return keys[Math.floor(Math.random() * keys.length)];
  },

  // 生成属性类型
  attributeType: () => {
    const types = ['text', 'html', 'title', 'alt', 'placeholder', 'value'];
    return types[Math.floor(Math.random() * types.length)];
  }
};

// 创建模拟翻译管理器
function createMockTranslationManager() {
  const mockTranslations = {
    'en': {
      nav: { about: 'About', resume: 'Resume', portfolio: 'Portfolio', blog: 'Blog', contact: 'Contact' },
      personal: { name: 'Richard hanrick', title: 'Web developer' },
      about: { title: 'About me' },
      contact: { form: { fullName: 'Full name' } }
    },
    'zh-cn': {
      nav: { about: '关于', resume: '简历', portfolio: '作品集', blog: '博客', contact: '联系' },
      personal: { name: '理查德·汉瑞克', title: '网页开发者' },
      about: { title: '关于我' },
      contact: { form: { fullName: '姓名' } }
    },
    'zh-tw': {
      nav: { about: '關於', resume: '履歷', portfolio: '作品集', blog: '部落格', contact: '聯絡' },
      personal: { name: '理查德·漢瑞克', title: '網頁開發者' },
      about: { title: '關於我' },
      contact: { form: { fullName: '姓名' } }
    }
  };

  return {
    currentLanguage: 'en',
    translations: mockTranslations,
    
    setCurrentLanguage(lang) {
      if (['en', 'zh-cn', 'zh-tw'].includes(lang)) {
        this.currentLanguage = lang;
      }
    },
    
    getCurrentLanguage() {
      return this.currentLanguage;
    },
    
    getText(key, params = {}) {
      const keys = key.split('.');
      let current = this.translations[this.currentLanguage];
      
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          return key; // 返回键名作为回退
        }
      }
      
      return typeof current === 'string' ? current : key;
    }
  };
}

// 属性测试
function runTextRendererPropertyTests() {
  // 在Node.js环境中设置模拟DOM
  const { mockDocument, MockElement, elements } = createMockDOM();
  
  // 模拟全局document对象
  if (typeof global !== 'undefined') {
    global.document = mockDocument;
    global.Node = { ELEMENT_NODE: 1 };
    global.CustomEvent = function(type, options) {
      this.type = type;
      this.detail = options ? options.detail : {};
    };
  }

  const TextRenderer = require('../assets/js/i18n/text-renderer.js');
  const runner = new PropertyTestRunner();
  
  console.log('=== 文本渲染器属性测试 ===');

  // 创建测试实例
  const renderer = new TextRenderer();
  const mockTranslationManager = createMockTranslationManager();
  renderer.setTranslationManager(mockTranslationManager);

  // Property 2: 文本渲染完整性
  const property2Result = runner.property(
    'Property 2: 文本渲染完整性',
    generators.languageCode,
    (language) => {
      try {
        // 设置语言
        mockTranslationManager.setCurrentLanguage(language);
        
        // 更新页面文本
        renderer.updatePageText(language);
        
        // 验证所有元素都被正确渲染
        const elementsWithI18n = mockDocument.querySelectorAll('[data-i18n]');
        
        for (const element of elementsWithI18n) {
          const key = element.getAttribute('data-i18n');
          const attr = element.getAttribute('data-i18n-attr') || 'text';
          const expectedText = mockTranslationManager.getText(key);
          
          let actualText;
          switch (attr) {
            case 'text':
              actualText = element.textContent;
              break;
            case 'placeholder':
              actualText = element.placeholder;
              break;
            case 'alt':
              actualText = element.alt;
              break;
            case 'title':
              actualText = element.title;
              break;
            case 'value':
              actualText = element.value;
              break;
            default:
              actualText = element.textContent;
          }
          
          // 验证文本是否正确设置
          if (actualText !== expectedText) {
            return false;
          }
        }
        
        // 验证HTML lang属性是否正确设置
        if (mockDocument.documentElement.lang !== language) {
          return false;
        }
        
        return true;
      } catch (error) {
        console.error('Property test error:', error);
        return false;
      }
    }
  );

  // 额外的单元测试
  console.log('\n=== 单元测试用例 ===');
  
  const testCases = [
    {
      test: () => {
        renderer.setTranslationManager(mockTranslationManager);
        return renderer.translationManager === mockTranslationManager;
      },
      description: '设置翻译管理器'
    },
    {
      test: () => {
        mockTranslationManager.setCurrentLanguage('zh-cn');
        renderer.updatePageText();
        return mockDocument.documentElement.lang === 'zh-cn';
      },
      description: 'HTML lang属性更新'
    },
    {
      test: () => {
        const element = new MockElement('span');
        element.setAttribute('data-i18n', 'nav.about');
        mockTranslationManager.setCurrentLanguage('en');
        renderer.updateElement(element);
        return element.textContent === 'About';
      },
      description: '单个元素文本更新'
    },
    {
      test: () => {
        const element = new MockElement('input');
        element.setAttribute('data-i18n', 'contact.form.fullName');
        element.setAttribute('data-i18n-attr', 'placeholder');
        mockTranslationManager.setCurrentLanguage('zh-cn');
        renderer.updateElement(element);
        return element.placeholder === '姓名';
      },
      description: '元素属性更新'
    },
    {
      test: () => {
        const stats = renderer.getTranslationStats();
        return stats && typeof stats.totalElements === 'number';
      },
      description: '翻译统计信息获取'
    },
    {
      test: () => {
        const validation = renderer.validateTranslations();
        return validation && typeof validation.isValid === 'boolean';
      },
      description: '翻译验证功能'
    },
    {
      test: () => {
        const supportedAttrs = renderer.getSupportedAttributes();
        return Array.isArray(supportedAttrs) && supportedAttrs.includes('text');
      },
      description: '支持的属性类型获取'
    },
    {
      test: () => {
        const element = new MockElement('div');
        element.setAttribute('data-i18n', 'nonexistent.key');
        renderer.updateElement(element);
        return element.textContent === 'nonexistent.key'; // 应该回退到键名
      },
      description: '不存在翻译键的处理'
    },
    {
      test: () => {
        renderer.applyTranslationToElement(new MockElement('p'), 'Test Text', 'text');
        return true; // 如果没有抛出异常就算通过
      },
      description: '翻译文本应用到元素'
    },
    {
      test: () => {
        try {
          renderer.rerender();
          return true;
        } catch (error) {
          return false;
        }
      },
      description: '重新渲染功能'
    }
  ];

  let unitTestsPassed = 0;
  let unitTestsFailed = 0;

  testCases.forEach((testCase, index) => {
    try {
      const passed = testCase.test();
      if (passed) {
        unitTestsPassed++;
        console.log(`✓ Test ${index + 1}: ${testCase.description}`);
      } else {
        unitTestsFailed++;
        console.log(`✗ Test ${index + 1}: ${testCase.description}`);
      }
    } catch (error) {
      unitTestsFailed++;
      console.log(`✗ Test ${index + 1}: ${testCase.description} - Error: ${error.message}`);
    }
  });

  console.log(`\n单元测试结果: ${unitTestsPassed} passed, ${unitTestsFailed} failed`);

  // 测试不同语言的渲染一致性
  console.log('\n=== 多语言渲染一致性测试 ===');
  
  const languages = ['en', 'zh-cn', 'zh-tw'];
  let consistencyTestsPassed = 0;
  let consistencyTestsFailed = 0;

  languages.forEach(lang => {
    try {
      mockTranslationManager.setCurrentLanguage(lang);
      renderer.updatePageText();
      
      const elementsWithI18n = mockDocument.querySelectorAll('[data-i18n]');
      let allElementsRendered = true;
      
      for (const element of elementsWithI18n) {
        const key = element.getAttribute('data-i18n');
        const expectedText = mockTranslationManager.getText(key);
        
        if (element.textContent !== expectedText && 
            element.placeholder !== expectedText &&
            element.alt !== expectedText) {
          allElementsRendered = false;
          break;
        }
      }
      
      if (allElementsRendered && mockDocument.documentElement.lang === lang) {
        consistencyTestsPassed++;
        console.log(`✓ ${lang}: 所有元素正确渲染`);
      } else {
        consistencyTestsFailed++;
        console.log(`✗ ${lang}: 渲染不完整`);
      }
    } catch (error) {
      consistencyTestsFailed++;
      console.log(`✗ ${lang}: 渲染错误 - ${error.message}`);
    }
  });

  console.log(`\n多语言一致性测试结果: ${consistencyTestsPassed} passed, ${consistencyTestsFailed} failed`);

  // 总结
  const allTestsPassed = property2Result && unitTestsFailed === 0 && consistencyTestsFailed === 0;
  
  console.log(`\n=== 测试总结 ===`);
  console.log(`Property 2 (文本渲染完整性): ${property2Result ? 'PASSED' : 'FAILED'}`);
  console.log(`单元测试: ${unitTestsFailed === 0 ? 'PASSED' : 'FAILED'}`);
  console.log(`多语言一致性测试: ${consistencyTestsFailed === 0 ? 'PASSED' : 'FAILED'}`);
  console.log(`总体结果: ${allTestsPassed ? 'PASSED' : 'FAILED'}`);

  return allTestsPassed;
}

// 导出和运行
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTextRendererPropertyTests };
  
  if (require.main === module) {
    runTextRendererPropertyTests();
  }
} else {
  window.runTextRendererPropertyTests = runTextRendererPropertyTests;
}
/**
 * 语言检测器属性测试
 * Feature: vcard-i18n, Property 1: 语言检测准确性
 * **Validates: Requirements 1.1, 1.3, 1.4, 1.5**
 */

// 导入fast-check用于属性测试
// 注意：在实际环境中需要安装fast-check: npm install --save-dev fast-check
// 这里使用简化的属性测试实现

class PropertyTestRunner {
  constructor() {
    this.testCount = 100;
  }

  // 简化的属性测试框架
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
      console.log('Failures:', failures.slice(0, 5)); // 显示前5个失败案例
    }
    
    return failed === 0;
  }
}

// 测试数据生成器
const generators = {
  // 生成各种语言代码
  languageCode: () => {
    const codes = [
      'en', 'en-US', 'en-GB', 'en-AU',
      'zh', 'zh-CN', 'zh-Hans', 'zh-Hans-CN',
      'zh-TW', 'zh-HK', 'zh-Hant', 'zh-Hant-TW',
      'fr', 'de', 'ja', 'ko', 'es', 'pt',
      'zh-CN-x-variant', 'zh-TW-x-variant',
      '', null, undefined, 'invalid-lang',
      'ZH-CN', 'EN-US', // 大写测试
      'zh_CN', 'zh_TW', // 下划线格式
    ];
    return codes[Math.floor(Math.random() * codes.length)];
  },

  // 生成浏览器语言数组
  browserLanguages: () => {
    const count = Math.floor(Math.random() * 5) + 1;
    const languages = [];
    for (let i = 0; i < count; i++) {
      languages.push(generators.languageCode());
    }
    return languages;
  }
};

// 属性测试
function runLanguageDetectorPropertyTests() {
  // 导入LanguageDetector类
  const LanguageDetector = require('../assets/js/i18n/language-detector.js');
  
  const runner = new PropertyTestRunner();
  const detector = new LanguageDetector();
  
  console.log('=== 语言检测器属性测试 ===');

  // Property 1: 语言检测准确性
  const property1Result = runner.property(
    'Property 1: 语言检测准确性',
    generators.languageCode,
    (langCode) => {
      const result = detector.parseLanguageCode(langCode);
      
      // 验证返回值总是支持的语言之一
      const supportedLanguages = detector.getSupportedLanguages();
      if (!supportedLanguages.includes(result)) {
        return false;
      }

      // 验证简体中文识别
      if (typeof langCode === 'string') {
        const lower = langCode.toLowerCase();
        if (lower.includes('zh-cn') || lower.includes('zh-hans')) {
          return result === 'zh-cn';
        }
        
        // 验证繁体中文识别
        if (lower.includes('zh-tw') || lower.includes('zh-hk') || 
            lower.includes('zh-hant') || lower.includes('zh-mo')) {
          return result === 'zh-tw';
        }
        
        // 验证英文识别
        if (lower.startsWith('en')) {
          return result === 'en';
        }
      }

      // 对于无效输入，应该返回默认语言
      if (!langCode || typeof langCode !== 'string') {
        return result === 'en';
      }

      return true;
    }
  );

  // 额外的单元测试用例
  console.log('\n=== 单元测试用例 ===');
  
  const testCases = [
    { input: 'zh-CN', expected: 'zh-cn', description: '简体中文标准格式' },
    { input: 'zh-Hans', expected: 'zh-cn', description: '简体中文Unicode格式' },
    { input: 'zh-TW', expected: 'zh-tw', description: '繁体中文台湾' },
    { input: 'zh-HK', expected: 'zh-tw', description: '繁体中文香港' },
    { input: 'zh-Hant', expected: 'zh-tw', description: '繁体中文Unicode格式' },
    { input: 'en-US', expected: 'en', description: '美式英文' },
    { input: 'en-GB', expected: 'en', description: '英式英文' },
    { input: 'fr-FR', expected: 'en', description: '不支持的语言回退到英文' },
    { input: '', expected: 'en', description: '空字符串回退到英文' },
    { input: null, expected: 'en', description: 'null值回退到英文' },
    { input: undefined, expected: 'en', description: 'undefined回退到英文' }
  ];

  let unitTestsPassed = 0;
  let unitTestsFailed = 0;

  testCases.forEach((testCase, index) => {
    const result = detector.parseLanguageCode(testCase.input);
    const passed = result === testCase.expected;
    
    if (passed) {
      unitTestsPassed++;
      console.log(`✓ Test ${index + 1}: ${testCase.description}`);
    } else {
      unitTestsFailed++;
      console.log(`✗ Test ${index + 1}: ${testCase.description}`);
      console.log(`  Expected: ${testCase.expected}, Got: ${result}`);
    }
  });

  console.log(`\n单元测试结果: ${unitTestsPassed} passed, ${unitTestsFailed} failed`);

  // 测试浏览器语言检测
  console.log('\n=== 浏览器语言检测测试 ===');
  
  // 模拟不同的浏览器环境
  const originalNavigator = typeof navigator !== 'undefined' ? navigator : {};
  
  const browserTests = [
    {
      navigator: { languages: ['zh-CN', 'en-US'], language: 'zh-CN' },
      expected: 'zh-cn',
      description: '简体中文浏览器'
    },
    {
      navigator: { languages: ['zh-TW', 'en-US'], language: 'zh-TW' },
      expected: 'zh-tw', 
      description: '繁体中文浏览器'
    },
    {
      navigator: { languages: ['en-US', 'en'], language: 'en-US' },
      expected: 'en',
      description: '英文浏览器'
    },
    {
      navigator: { languages: ['fr-FR', 'de-DE'], language: 'fr-FR' },
      expected: 'en',
      description: '不支持语言的浏览器'
    }
  ];

  let browserTestsPassed = 0;
  let browserTestsFailed = 0;

  browserTests.forEach((test, index) => {
    // 临时替换navigator对象
    if (typeof global !== 'undefined') {
      global.navigator = test.navigator;
    } else if (typeof window !== 'undefined') {
      window.navigator = test.navigator;
    }

    const result = detector.detectLanguage();
    const passed = result === test.expected;

    if (passed) {
      browserTestsPassed++;
      console.log(`✓ Browser Test ${index + 1}: ${test.description}`);
    } else {
      browserTestsFailed++;
      console.log(`✗ Browser Test ${index + 1}: ${test.description}`);
      console.log(`  Expected: ${test.expected}, Got: ${result}`);
    }
  });

  // 恢复原始navigator
  if (typeof global !== 'undefined') {
    global.navigator = originalNavigator;
  } else if (typeof window !== 'undefined') {
    window.navigator = originalNavigator;
  }

  console.log(`\n浏览器测试结果: ${browserTestsPassed} passed, ${browserTestsFailed} failed`);

  // 总结
  const allTestsPassed = property1Result && unitTestsFailed === 0 && browserTestsFailed === 0;
  console.log(`\n=== 测试总结 ===`);
  console.log(`属性测试: ${property1Result ? 'PASSED' : 'FAILED'}`);
  console.log(`单元测试: ${unitTestsFailed === 0 ? 'PASSED' : 'FAILED'}`);
  console.log(`浏览器测试: ${browserTestsFailed === 0 ? 'PASSED' : 'FAILED'}`);
  console.log(`总体结果: ${allTestsPassed ? 'PASSED' : 'FAILED'}`);

  return allTestsPassed;
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
  const LanguageDetector = require('../assets/js/i18n/language-detector.js');
  
  // 在函数外部定义，确保可以访问
  function runTests() {
    return runLanguageDetectorPropertyTests();
  }
  
  module.exports = { runLanguageDetectorPropertyTests, runTests };
  
  // 如果直接运行此文件
  if (require.main === module) {
    runTests();
  }
} else {
  // 浏览器环境
  window.runLanguageDetectorPropertyTests = runLanguageDetectorPropertyTests;
}
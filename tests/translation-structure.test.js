/**
 * 翻译文件结构验证测试
 * **Validates: Requirements 2.1, 4.1**
 */

// 导入翻译文件
const translations_en = require('../assets/js/i18n/en.js');
const translations_zh_cn = require('../assets/js/i18n/zh-cn.js');
const translations_zh_tw = require('../assets/js/i18n/zh-tw.js');

/**
 * 递归获取对象的所有键路径
 * @param {Object} obj - 要分析的对象
 * @param {string} prefix - 键路径前缀
 * @returns {string[]} 所有键路径的数组
 */
function getAllKeyPaths(obj, prefix = '') {
  const paths = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // 递归处理嵌套对象
      paths.push(...getAllKeyPaths(value, currentPath));
    } else if (typeof value === 'string') {
      // 只收集字符串值的路径
      paths.push(currentPath);
    }
  }
  
  return paths;
}

/**
 * 比较两个键路径数组，找出差异
 * @param {string[]} paths1 - 第一个路径数组
 * @param {string[]} paths2 - 第二个路径数组
 * @param {string} lang1 - 第一种语言名称
 * @param {string} lang2 - 第二种语言名称
 * @returns {Object} 比较结果
 */
function compareKeyPaths(paths1, paths2, lang1, lang2) {
  const set1 = new Set(paths1);
  const set2 = new Set(paths2);
  
  const onlyIn1 = [...set1].filter(path => !set2.has(path));
  const onlyIn2 = [...set2].filter(path => !set1.has(path));
  const common = [...set1].filter(path => set2.has(path));
  
  return {
    onlyIn1,
    onlyIn2,
    common,
    lang1,
    lang2,
    isIdentical: onlyIn1.length === 0 && onlyIn2.length === 0
  };
}

/**
 * 验证翻译值不为空
 * @param {Object} translations - 翻译对象
 * @param {string} language - 语言名称
 * @returns {Object} 验证结果
 */
function validateTranslationValues(translations, language) {
  const emptyValues = [];
  const paths = getAllKeyPaths(translations);
  
  paths.forEach(path => {
    const keys = path.split('.');
    let current = translations;
    
    for (const key of keys) {
      current = current[key];
    }
    
    if (typeof current === 'string' && current.trim() === '') {
      emptyValues.push(path);
    }
  });
  
  return {
    language,
    emptyValues,
    totalKeys: paths.length,
    hasEmptyValues: emptyValues.length > 0
  };
}

/**
 * 运行翻译文件结构验证测试
 */
function runTranslationStructureTests() {
  console.log('=== 翻译文件结构验证测试 ===\n');
  
  const translations = {
    'en': translations_en,
    'zh-cn': translations_zh_cn,
    'zh-tw': translations_zh_tw
  };
  
  // 获取所有语言的键路径
  const keyPaths = {};
  for (const [lang, trans] of Object.entries(translations)) {
    keyPaths[lang] = getAllKeyPaths(trans);
    console.log(`${lang} 语言包含 ${keyPaths[lang].length} 个翻译键`);
  }
  
  console.log('\n=== 键结构一致性检查 ===');
  
  // 比较所有语言对的键结构
  const languages = Object.keys(translations);
  let allStructuresMatch = true;
  
  for (let i = 0; i < languages.length; i++) {
    for (let j = i + 1; j < languages.length; j++) {
      const lang1 = languages[i];
      const lang2 = languages[j];
      
      const comparison = compareKeyPaths(
        keyPaths[lang1], 
        keyPaths[lang2], 
        lang1, 
        lang2
      );
      
      console.log(`\n${lang1} vs ${lang2}:`);
      
      if (comparison.isIdentical) {
        console.log(`✓ 键结构完全一致 (${comparison.common.length} 个共同键)`);
      } else {
        console.log(`✗ 键结构不一致`);
        allStructuresMatch = false;
        
        if (comparison.onlyIn1.length > 0) {
          console.log(`  仅在 ${lang1} 中存在的键 (${comparison.onlyIn1.length}):`);
          comparison.onlyIn1.slice(0, 5).forEach(key => console.log(`    - ${key}`));
          if (comparison.onlyIn1.length > 5) {
            console.log(`    ... 还有 ${comparison.onlyIn1.length - 5} 个`);
          }
        }
        
        if (comparison.onlyIn2.length > 0) {
          console.log(`  仅在 ${lang2} 中存在的键 (${comparison.onlyIn2.length}):`);
          comparison.onlyIn2.slice(0, 5).forEach(key => console.log(`    - ${key}`));
          if (comparison.onlyIn2.length > 5) {
            console.log(`    ... 还有 ${comparison.onlyIn2.length - 5} 个`);
          }
        }
        
        console.log(`  共同键: ${comparison.common.length}`);
      }
    }
  }
  
  console.log('\n=== 翻译值验证 ===');
  
  // 验证每种语言的翻译值
  let allValuesValid = true;
  
  for (const [lang, trans] of Object.entries(translations)) {
    const validation = validateTranslationValues(trans, lang);
    
    console.log(`\n${lang} 翻译值验证:`);
    
    if (validation.hasEmptyValues) {
      console.log(`✗ 发现 ${validation.emptyValues.length} 个空值`);
      validation.emptyValues.forEach(path => console.log(`  - ${path}`));
      allValuesValid = false;
    } else {
      console.log(`✓ 所有 ${validation.totalKeys} 个翻译值都有效`);
    }
  }
  
  console.log('\n=== 特定键验证 ===');
  
  // 验证关键的翻译键是否存在
  const criticalKeys = [
    'nav.about',
    'nav.resume', 
    'nav.portfolio',
    'nav.blog',
    'nav.contact',
    'personal.name',
    'personal.title',
    'about.title',
    'resume.title',
    'portfolio.title',
    'blog.title',
    'contact.title'
  ];
  
  let allCriticalKeysExist = true;
  
  for (const key of criticalKeys) {
    console.log(`\n检查关键键: ${key}`);
    
    for (const [lang, trans] of Object.entries(translations)) {
      const keys = key.split('.');
      let current = trans;
      let exists = true;
      
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          exists = false;
          break;
        }
      }
      
      if (exists && typeof current === 'string' && current.trim() !== '') {
        console.log(`  ✓ ${lang}: "${current}"`);
      } else {
        console.log(`  ✗ ${lang}: 缺失或无效`);
        allCriticalKeysExist = false;
      }
    }
  }
  
  console.log('\n=== 数据类型一致性检查 ===');
  
  // 检查相同键在不同语言中的数据类型是否一致
  let dataTypesConsistent = true;
  const enPaths = keyPaths['en'];
  
  for (const path of enPaths) {
    const keys = path.split('.');
    const types = {};
    
    for (const [lang, trans] of Object.entries(translations)) {
      let current = trans;
      let exists = true;
      
      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          exists = false;
          break;
        }
      }
      
      if (exists) {
        types[lang] = typeof current;
      }
    }
    
    // 检查所有语言的类型是否一致
    const typeValues = Object.values(types);
    const firstType = typeValues[0];
    const allSameType = typeValues.every(type => type === firstType);
    
    if (!allSameType) {
      console.log(`✗ 键 "${path}" 的数据类型不一致:`);
      for (const [lang, type] of Object.entries(types)) {
        console.log(`  ${lang}: ${type}`);
      }
      dataTypesConsistent = false;
    }
  }
  
  if (dataTypesConsistent) {
    console.log('✓ 所有键的数据类型在各语言中保持一致');
  }
  
  console.log('\n=== 测试总结 ===');
  
  const allTestsPassed = allStructuresMatch && allValuesValid && 
                        allCriticalKeysExist && dataTypesConsistent;
  
  console.log(`键结构一致性: ${allStructuresMatch ? 'PASSED' : 'FAILED'}`);
  console.log(`翻译值有效性: ${allValuesValid ? 'PASSED' : 'FAILED'}`);
  console.log(`关键键存在性: ${allCriticalKeysExist ? 'PASSED' : 'FAILED'}`);
  console.log(`数据类型一致性: ${dataTypesConsistent ? 'PASSED' : 'FAILED'}`);
  console.log(`总体结果: ${allTestsPassed ? 'PASSED' : 'FAILED'}`);
  
  return allTestsPassed;
}

// 导出和运行
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTranslationStructureTests };
  
  if (require.main === module) {
    runTranslationStructureTests();
  }
} else {
  window.runTranslationStructureTests = runTranslationStructureTests;
}
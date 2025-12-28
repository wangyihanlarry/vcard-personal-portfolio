# 变更：基于Accept-Language添加中英文国际化支持

## 变更原因
当前作品集网站仅支持英文，限制了非英语用户的访问。添加国际化功能将扩大受众范围，为中文访问者提供更好的用户体验。

## 变更内容
- 添加国际化（i18n）系统，支持中英文两种语言
- 实现基于浏览器Accept-Language头的自动语言检测
- 创建语言配置文件用于翻译
- 更新UI元素以支持动态语言切换
- 确保中文文本使用合适的字体正确显示

## 影响范围
- 受影响的规格：用户界面、内容展示
- 受影响的代码：index.html、assets/js/script.js、assets/css/style.css
- 新增文件：assets/js/i18n.js、assets/css/i18n.css
// 国际化配置
const i18nConfig = {
  en: {
    // 页面标题
    pageTitle: "vCard - Personal Portfolio",

    // 导航栏
    navAbout: "About",
    navResume: "Resume",
    navPortfolio: "Portfolio",
    navBlog: "Blog",
    navContact: "Contact",

    // 侧边栏
    name: "Richard hanrick",
    title: "Web developer",
    showContacts: "Show Contacts",
    hideContacts: "Hide Contacts",

    // 联系信息
    email: "Email",
    phone: "Phone",
    birthday: "Birthday",
    location: "Location",

    // About部分
    aboutText: "Web developer from Sacramento, California, USA. I enjoy building beautiful, responsive websites and applications.",

    // 其他文本
    testimonials: "Testimonials",
    clients: "Happy Clients",
    projects: "Projects",
    yearsOfExperience: "Years of Experience",
    awards: "Awards"
  },

  "zh-CN": {
    // 页面标题
    pageTitle: "vCard - 个人作品集",

    // 导航栏
    navAbout: "关于我",
    navResume: "简历",
    navPortfolio: "作品集",
    navBlog: "博客",
    navContact: "联系我",

    // 侧边栏
    name: "Richard hanrick",
    title: "网页开发者",
    showContacts: "显示联系方式",
    hideContacts: "隐藏联系方式",

    // 联系信息
    email: "邮箱",
    phone: "电话",
    birthday: "生日",
    location: "地址",

    // About部分
    aboutText: "来自美国加利福尼亚州萨克拉门托的网页开发者。我热爱构建美观、响应式的网站和应用程序。",

    // 其他文本
    testimonials: "客户评价",
    clients: "满意客户",
    projects: "项目",
    yearsOfExperience: "工作经验",
    awards: "奖项"
  },

  "zh-TW": {
    // 页面标题
    pageTitle: "vCard - 個人作品集",

    // 导航栏
    navAbout: "關於我",
    navResume: "履歷",
    navPortfolio: "作品集",
    navBlog: "部落格",
    navContact: "聯繫我",

    // 侧边栏
    name: "Richard hanrick",
    title: "網頁開發者",
    showContacts: "顯示聯繫方式",
    hideContacts: "隱藏聯繫方式",

    // 联系信息
    email: "郵箱",
    phone: "電話",
    birthday: "生日",
    location: "地址",

    // About部分
    aboutText: "來自美國加利福尼亞州薩克拉門托的網頁開發者。我熱愛構建美觀、響應式的網站和應用程式。",

    // 其他文本
    testimonials: "客戶評價",
    clients: "滿意客戶",
    projects: "專案",
    yearsOfExperience: "工作經驗",
    awards: "獎項"
  }
};

// 获取浏览器语言设置
function getBrowserLanguage() {
  const lang = navigator.language || navigator.userLanguage;

  // 检查具体的中文地区
  if (lang === 'zh-CN' || lang === 'zh-cn') {
    return 'zh-CN';
  }
  if (lang === 'zh-TW' || lang === 'zh-tw' || lang === 'zh-HK' || lang === 'zh-hk') {
    return 'zh-TW';
  }

  // 默认返回英文
  return 'en';
}

// 当前语言
let currentLang = getBrowserLanguage();

// 获取翻译文本
function t(key) {
  return i18nConfig[currentLang][key] || i18nConfig['en'][key] || key;
}

// 切换语言
function switchLanguage(lang) {
  if (i18nConfig[lang]) {
    currentLang = lang;
    updatePageLanguage();
    // 更新HTML lang属性
    if (lang === 'zh-CN') {
      document.documentElement.lang = 'zh-CN';
    } else if (lang === 'zh-TW') {
      document.documentElement.lang = 'zh-TW';
    } else {
      document.documentElement.lang = 'en';
    }
  }
}

// 更新页面语言
function updatePageLanguage() {
  // 更新页面标题
  document.title = t('pageTitle');

  // 更新导航栏
  updateNavigation();

  // 更新侧边栏
  updateSidebar();

  // 更新联系信息标签
  updateContactLabels();

  // 更新其他文本元素
  updateOtherTexts();
}

// 更新导航栏
function updateNavigation() {
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const navKeys = ['navAbout', 'navResume', 'navPortfolio', 'navBlog', 'navContact'];

  navLinks.forEach((link, index) => {
    if (navKeys[index]) {
      link.textContent = t(navKeys[index]);
    }
  });
}

// 更新侧边栏
function updateSidebar() {
  const nameElement = document.querySelector('.name');
  const titleElement = document.querySelector('.title');
  const showContactsBtn = document.querySelector('.info_more-btn span');

  if (nameElement) nameElement.textContent = t('name');
  if (titleElement) titleElement.textContent = t('title');
  if (showContactsBtn) {
    const isActive = document.querySelector('[data-sidebar]').classList.contains('active');
    showContactsBtn.textContent = isActive ? t('hideContacts') : t('showContacts');
  }
}

// 更新联系信息标签
function updateContactLabels() {
  const contactTitles = document.querySelectorAll('.contact-title');
  const contactKeys = ['email', 'phone', 'birthday', 'location'];

  contactTitles.forEach((title, index) => {
    if (contactKeys[index]) {
      title.textContent = t(contactKeys[index]);
    }
  });
}

// 更新其他文本元素
function updateOtherTexts() {
  // 更新统计数字标签
  const statsLabels = document.querySelectorAll('.stats-item .label');
  const statsKeys = ['clients', 'projects', 'yearsOfExperience', 'awards'];

  statsLabels.forEach((label, index) => {
    if (statsKeys[index]) {
      label.textContent = t(statsKeys[index]);
    }
  });

  // 更新testimonials标题
  const testimonialsTitle = document.querySelector('.testimonials-title');
  if (testimonialsTitle) {
    testimonialsTitle.textContent = t('testimonials');
  }
}

// 监听侧边栏切换，更新按钮文本
function setupSidebarListener() {
  const sidebarBtn = document.querySelector('[data-sidebar-btn]');
  if (sidebarBtn) {
    sidebarBtn.addEventListener('click', function() {
      setTimeout(() => {
        const showContactsBtn = document.querySelector('.info_more-btn span');
        if (showContactsBtn) {
          const isActive = document.querySelector('[data-sidebar]').classList.contains('active');
          showContactsBtn.textContent = isActive ? t('hideContacts') : t('showContacts');
        }
      }, 10);
    });
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 设置初始语言
  if (currentLang === 'zh-CN') {
    document.documentElement.lang = 'zh-CN';
  } else if (currentLang === 'zh-TW') {
    document.documentElement.lang = 'zh-TW';
  } else {
    document.documentElement.lang = 'en';
  }

  // 更新页面内容
  updatePageLanguage();

  // 设置事件监听器
  setupSidebarListener();
});
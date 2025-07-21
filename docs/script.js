// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initScrollAnimations();
    initSmoothScrolling();
    initMobileMenu();
    initScreenshotZoom();
});

// 导航栏功能
function initNavigation() {
    const navbar = document.querySelector('.navbar');

    // 监听滚动事件，实现导航栏滚动效果
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // 添加滚动背景效果
        if (currentScrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 高亮当前导航项
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// 平滑滚动
function initSmoothScrolling() {
    // 为所有锚点链接添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 考虑导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 滚动动画
function initScrollAnimations() {
    // 创建 Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // 为卡片添加延迟动画
                if (entry.target.classList.contains('feature-card') || 
                    entry.target.classList.contains('screenshot-item') ||
                    entry.target.classList.contains('tech-item')) {
                    
                    const cards = entry.target.parentElement.children;
                    Array.from(cards).forEach((card, index) => {
                        if (card === entry.target) {
                            card.style.animationDelay = `${index * 0.1}s`;
                        }
                    });
                }
                
                // 观察完成后取消观察
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    const animatedElements = document.querySelectorAll(
        '.feature-card, .screenshot-item, .tech-item, .step'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// 移动端菜单
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // 点击菜单项后关闭菜单
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // 点击外部区域关闭菜单
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// 添加移动端菜单样式
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 70px;
            right: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding: 2rem 0;
            transition: right 0.3s ease;
            border-left: 1px solid var(--border-color);
        }
        
        .nav-menu.active {
            right: 0;
        }
        
        .nav-menu .nav-link {
            font-size: 1.2rem;
            margin: 1rem 0;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .nav-link.active {
            color: var(--primary-color) !important;
        }
        
        .nav-link.active::after {
            width: 100% !important;
        }
    }
`;
document.head.appendChild(style);

// 产品截图放大预览
function initScreenshotZoom() {
  // 创建灯箱元素
  const lightbox = document.createElement('div');
  lightbox.className = 'screenshot-lightbox';
  lightbox.innerHTML = '<div class="screenshot-lightbox-content"></div>';
  document.body.appendChild(lightbox);
  const content = lightbox.querySelector('.screenshot-lightbox-content');

  function showLightbox(src, type, alt) {
    content.innerHTML = '';
    if (type === 'img') {
      const img = document.createElement('img');
      img.src = src;
      img.alt = alt || '';
      content.appendChild(img);
    } else if (type === 'video') {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      video.style.maxWidth = '90vw';
      video.style.maxHeight = '80vh';
      content.appendChild(video);
    }
    lightbox.classList.add('active');
  }

  // 关闭灯箱
  function hideLightbox() {
    lightbox.classList.remove('active');
    content.innerHTML = '';
  }
  lightbox.addEventListener('click', hideLightbox);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') hideLightbox();
  });

  // 绑定点击事件
  document.querySelectorAll('.screenshot-placeholder img, .screenshot-placeholder video').forEach(el => {
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      const src = el.getAttribute('src');
      const alt = el.getAttribute('alt') || '';
      showLightbox(src, el.tagName.toLowerCase(), alt);
    });
  });
}

// 页面性能优化
function optimizePerformance() {
    // 预加载重要资源
    const preloadLinks = [
        '../src/assets/qiantu-logo.svg'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = 'image';
        document.head.appendChild(link);
    });
    
    // 懒加载图片（如果有的话）
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// 初始化性能优化
optimizePerformance();

// 错误处理
window.addEventListener('error', (e) => {
    console.error('页面发生错误:', e.error);
});

// 页面可见性 API - 当用户切换标签页时暂停动画
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面不可见时暂停动画
        document.body.style.animationPlayState = 'paused';
    } else {
        // 页面可见时恢复动画
        document.body.style.animationPlayState = 'running';
    }
}); 
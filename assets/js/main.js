// ========================================
// 모바일 디바이스 감지 및 리다이렉트
// ========================================

function checkMobileDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isSmallScreen = window.innerWidth <= 768;
    
    return mobileRegex.test(userAgent) || isSmallScreen;
}

function redirectToMobile() {
    const isMainPage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
    const isMobileDevice = checkMobileDevice();
    const isNotAlreadyMobile = !window.location.pathname.includes('/mobile/');
    
    if (isMainPage && isMobileDevice && isNotAlreadyMobile) {
        window.location.href = '/mobile/index.html';
    }
}

// 페이지 로드 시 모바일 리다이렉트 체크
redirectToMobile();

// ========================================
// 메인 애니메이션 기능
// ========================================

function initHeroAnimation() {
    const heroImages = document.querySelectorAll('.hero-animation img');
    if (heroImages.length === 0) return;
    
    let currentIndex = 0;
    heroImages[0].classList.add('active');
    
    function toggleImages() {
        heroImages.forEach(img => img.classList.remove('active'));
        heroImages[currentIndex].classList.add('active');
        currentIndex = (currentIndex + 1) % heroImages.length;
    }
    
    setInterval(toggleImages, 3000);
}

// ========================================
// Case Detail 페이지 애니메이션
// ========================================

function initCaseDetailAnimation() {
    const typoElements = document.querySelectorAll('.case-detail-content .info');
    if (typoElements.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    typoElements.forEach(typo => observer.observe(typo));
}

// ========================================
// Lab 페이지 애니메이션
// ========================================

function initLabAnimation() {
    const labImages = document.querySelectorAll('.section.lab .content div span img');
    if (labImages.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                const handleScroll = () => {
                    const rect = entry.target.getBoundingClientRect();
                    const scrollProgress = 1 - (rect.top / window.innerHeight);
                    
                    if (scrollProgress > 0 && scrollProgress < 1) {
                        entry.target.style.transform = `translateY(${scrollProgress * -50}px) scale(${1 + scrollProgress * 0.05})`;
                    }
                };

                window.addEventListener('scroll', handleScroll);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    labImages.forEach(img => observer.observe(img));
}

// ========================================
// 클립보드 복사 기능
// ========================================

function initClipboardCopy() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    const toastMessage = document.querySelector('.toast-message');
    
    if (copyButtons.length === 0) return;
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const textToCopy = button.previousElementSibling.textContent;
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.classList.remove('copied');
                }, 1000);
            } catch (err) {
                console.error('클립보드 복사 실패:', err);
            }

            if (toastMessage) {
                toastMessage.classList.add('show');
                setTimeout(() => {
                    toastMessage.classList.remove('show');
                }, 2500);
            }
        });
    });
}

// ========================================
// 모바일 네비게이션
// ========================================

function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.main-nav');
    
    if (!hamburger || !nav) return;
    
    hamburger.addEventListener('click', function() {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// ========================================
// 메인 초기화
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initHeroAnimation();
    initCaseDetailAnimation();    
    initLabAnimation();
    initClipboardCopy();
    initMobileNavigation();
}); 
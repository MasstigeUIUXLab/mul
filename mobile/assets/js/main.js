// ========================================
// 모바일 메인 JavaScript
// ========================================

// ========================================
// 히어로 이미지 자동 전환 애니메이션
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
// Case Detail 페이지 스크롤 애니메이션
// ========================================

function initCaseDetailAnimation() {
    const caseDetailItems = document.querySelectorAll('.case-detail-content-item');
    if (caseDetailItems.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 200);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    caseDetailItems.forEach(item => observer.observe(item));
}

// ========================================
// 클립보드 복사 및 토스트 메시지
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
// 모바일 네비게이션 메뉴
// ========================================

function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger-menu');
    const closeBtn = document.querySelector('.close-menu');
    const nav = document.querySelector('.main-nav');
    
    if (!hamburger || !closeBtn || !nav) return;
    
    hamburger.addEventListener('click', function() {
        nav.classList.add('active');
    });

    closeBtn.addEventListener('click', function() {
        nav.classList.remove('active');
    });
}

// ========================================
// 메인 초기화
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initHeroAnimation();
    initCaseDetailAnimation();
    initClipboardCopy();
    initMobileNavigation();
}); 
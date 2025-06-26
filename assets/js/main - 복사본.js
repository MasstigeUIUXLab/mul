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
// Lab 페이지 부드러운 스냅 스크롤 효과
// ========================================

function initLabSnapScroll() {
    const labSections = document.querySelectorAll('.section.lab section');
    if (labSections.length === 0) return;
    
    let currentSection = 0;
    let isScrolling = false;
    let scrollTimeout;
    
    // 헤더 높이 고정값
    const HEADER_HEIGHT = 100;
    
    // Workshop article들
    const workshopArticles = document.querySelectorAll('.section.lab .workshop article');
    let currentArticleIndex = 0;
    let isWorkshopActive = false;
    
    // Video 섹션 요소들
    const videoSection = document.querySelector('.section.lab .video');
    const videoTxtArea = videoSection ? videoSection.querySelector('.txt-area') : null;
    const videoTxtImg = videoTxtArea ? videoTxtArea.querySelector('img') : null;
    const videoTxtP = videoTxtArea ? videoTxtArea.querySelector('p') : null;
    const videoTxtA = videoTxtArea ? videoTxtArea.querySelector('a') : null;
    let isVideoActive = false;
    
    // 현재 섹션 찾기
    function getCurrentSection() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        for (let i = 0; i < labSections.length; i++) {
            const section = labSections[i];
            const rect = section.getBoundingClientRect();
            
            if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
                return i;
            }
        }
        return 0;
    }
    
    // Video 섹션 순차적 패럴랙스 효과
    function handleVideoSectionEnter() {
        if (!isVideoActive && videoSection) {
            isVideoActive = true;
            
            // 이미지 먼저 나타남
            if (videoTxtImg) {
                setTimeout(() => {
                    videoTxtImg.classList.add('active');
                }, 300);
            }
            
            // 텍스트 0.2초 지연 후 나타남
            if (videoTxtP) {
                setTimeout(() => {
                    videoTxtP.classList.add('active');
                }, 500);
            }
            
            // 링크 0.4초 지연 후 나타남
            if (videoTxtA) {
                setTimeout(() => {
                    videoTxtA.classList.add('active');
                }, 700);
            }
        }
    }
    
    // Video 섹션 초기화
    function initVideoSection() {
        if (videoTxtImg) {
            videoTxtImg.classList.remove('active');
        }
        if (videoTxtP) {
            videoTxtP.classList.remove('active');
        }
        if (videoTxtA) {
            videoTxtA.classList.remove('active');
        }
        isVideoActive = false;
    }
    
    // 푸터로 스크롤하는 함수
    function scrollToFooter() {
        if (isScrolling) return;
        
        isScrolling = true;
        document.body.classList.add('scrolling');
        
        // 페이지 최하단으로 스크롤
        const startPosition = window.pageYOffset;
        const targetPosition = document.documentElement.scrollHeight - window.innerHeight;
        const distance = targetPosition - startPosition;
        const duration = 1200;
        let startTime = null;
        
        function animateScroll(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                setTimeout(() => {
                    isScrolling = false;
                    document.body.classList.remove('scrolling');
                }, 100);
            }
        }
        
        requestAnimationFrame(animateScroll);
    }
    
    // Workshop article 초기화
    function initWorkshopArticles() {
        workshopArticles.forEach((article, index) => {
            article.style.opacity = 0;
            article.style.transform = 'translateY(100px)';
            article.classList.remove('active');
        });
        currentArticleIndex = 0;
        isWorkshopActive = false;
    }
    
    // Workshop article 스냅 스크롤
    function scrollToNextArticle() {
        if (currentArticleIndex < workshopArticles.length - 1) {
            currentArticleIndex++;
            showCurrentArticle();
        } else {
            // 마지막 article에서 다음 스크롤 시 다음 섹션으로 이동
            scrollToSection(5); // methodology 섹션
        }
    }
    
    function scrollToPrevArticle() {
        if (currentArticleIndex > 0) {
            currentArticleIndex--;
            showCurrentArticle();
        } else {
            // 첫 번째 article에서 이전 스크롤 시 이전 섹션으로 이동
            scrollToSection(3); // track 섹션
        }
    }
    
    // 현재 article 표시
    function showCurrentArticle() {
        workshopArticles.forEach((article, index) => {
            if (index === currentArticleIndex) {
                article.style.opacity = 1;
                article.style.transform = 'translateY(0)';
                article.classList.add('active');
            } else {
                article.style.opacity = 0;
                article.style.transform = 'translateY(100px)';
                article.classList.remove('active');
            }
        });
    }
    
    // Workshop 섹션 진입 시 첫 번째 article 표시
    function handleWorkshopSectionEnter() {
        if (!isWorkshopActive) {
            isWorkshopActive = true;
            currentArticleIndex = 0;
            showCurrentArticle();
        }
    }
    
    // 헤더로 스크롤하는 함수
    function scrollToHeader() {
        if (isScrolling) return;
        
        isScrolling = true;
        document.body.classList.add('scrolling');
        
        // Workshop article 초기화
        initWorkshopArticles();
        // Video 섹션 초기화
        initVideoSection();
        
        // 페이지 최상단으로 스크롤
        const startPosition = window.pageYOffset;
        const targetPosition = 0;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let startTime = null;
        
        function animateScroll(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                setTimeout(() => {
                    isScrolling = false;
                    document.body.classList.remove('scrolling');
                }, 100);
            }
        }
        
        requestAnimationFrame(animateScroll);
    }
    
    // 첫 번째 섹션과 헤더가 한 화면에 보이도록 스크롤
    function scrollToFirstSectionWithHeader() {
        if (isScrolling) return;
        
        isScrolling = true;
        document.body.classList.add('scrolling');
        
        const firstSection = labSections[0];
        
        // 첫 번째 섹션의 위치에서 헤더 높이만큼 위로 이동하되, 
        // 헤더가 완전히 보이도록 약간의 여백을 추가
        const targetPosition = Math.max(0, firstSection.offsetTop - HEADER_HEIGHT - 20);
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1200;
        let startTime = null;
        
        function animateScroll(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                setTimeout(() => {
                    isScrolling = false;
                    document.body.classList.remove('scrolling');
                }, 100);
            }
        }
        
        requestAnimationFrame(animateScroll);
    }
    
    // 특정 섹션으로 부드럽게 스크롤
    function scrollToSection(index) {
        if (index < 0 || index >= labSections.length || isScrolling) return;
        
        isScrolling = true;
        currentSection = index;
        
        // Workshop 섹션으로 이동할 때 article 초기화
        if (index === 4) { // workshop 섹션 인덱스
            initWorkshopArticles();
        }
        
        // Video 섹션으로 이동할 때 초기화
        if (index === 1) { // video 섹션 인덱스
            initVideoSection();
        }
        
        // 스크롤 중 표시
        document.body.classList.add('scrolling');
        
        // 일반 섹션 스크롤
        const targetSection = labSections[index];
        const targetPosition = targetSection.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1200;
        let startTime = null;
        
        function animateScroll(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                setTimeout(() => {
                    isScrolling = false;
                    document.body.classList.remove('scrolling');
                    
                    // Workshop 섹션에 도달했을 때 첫 번째 article 표시
                    if (index === 4) {
                        handleWorkshopSectionEnter();
                    }
                    
                    // Video 섹션에 도달했을 때 순차적 패럴랙스 효과 시작
                    if (index === 1) {
                        handleVideoSectionEnter();
                    }
                }, 100);
            }
        }
        
        requestAnimationFrame(animateScroll);
    }
    
    // 마우스 휠 이벤트 (더 부드럽게)
    function handleWheel(e) {
        e.preventDefault();
        
        if (isScrolling) return;
        
        const wheelDelta = e.deltaY;
        const threshold = 50;
        
        if (Math.abs(wheelDelta) > threshold) {
            const direction = wheelDelta > 0 ? 1 : -1;
            
            // Workshop 섹션에서 article 스냅 스크롤
            if (currentSection === 4 && isWorkshopActive) {
                if (direction > 0) {
                    scrollToNextArticle();
                } else {
                    scrollToPrevArticle();
                }
                return;
            }
            
            // 첫 번째 섹션에서 위로 스크롤할 때 헤더로 이동
            if (currentSection === 0 && direction === -1) {
                scrollToHeader();
            }
            // 두 번째 섹션에서 위로 스크롤할 때 첫 번째 섹션과 헤더가 한 화면에 보이도록
            else if (currentSection === 1 && direction === -1) {
                scrollToFirstSectionWithHeader();
            }
            // methodology 섹션에서 아래로 스크롤할 때 푸터로 이동
            else if (currentSection === 5 && direction === 1) {
                scrollToFooter();
            }
            else {
                const nextSection = Math.max(0, Math.min(labSections.length - 1, currentSection + direction));
                if (nextSection !== currentSection) {
                    scrollToSection(nextSection);
                }
            }
        }
    }
    
    // 키보드 이벤트
    function handleKeydown(e) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            
            // Workshop 섹션에서 article 스냅 스크롤
            if (currentSection === 4 && isWorkshopActive) {
                scrollToNextArticle();
                return;
            }
            
            // methodology 섹션에서 아래로 키를 누르면 푸터로 이동
            if (currentSection === 5) {
                scrollToFooter();
                return;
            }
            
            scrollToSection(Math.min(labSections.length - 1, currentSection + 1));
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            
            // Workshop 섹션에서 article 스냅 스크롤
            if (currentSection === 4 && isWorkshopActive) {
                scrollToPrevArticle();
                return;
            }
            
            // 첫 번째 섹션에서 위로 키를 누르면 헤더로 이동
            if (currentSection === 0) {
                scrollToHeader();
            }
            // 두 번째 섹션에서 위로 키를 누르면 첫 번째 섹션과 헤더가 한 화면에 보이도록
            else if (currentSection === 1) {
                scrollToFirstSectionWithHeader();
            }
            else {
                scrollToSection(Math.max(0, currentSection - 1));
            }
        }
    }
    
    // 터치 이벤트 (더 부드럽게)
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }
    
    function handleTouchEnd(e) {
        touchEndY = e.changedTouches[0].clientY;
        const touchEndTime = Date.now();
        const diff = touchStartY - touchEndY;
        const touchDuration = touchEndTime - touchStartTime;
        
        const minSwipeDistance = 30;
        const maxSwipeTime = 300;
        
        if (Math.abs(diff) > minSwipeDistance && touchDuration < maxSwipeTime) {
            // Workshop 섹션에서 article 스냅 스크롤
            if (currentSection === 4 && isWorkshopActive) {
                if (diff > 0) { // 위로 스와이프
                    scrollToNextArticle();
                } else { // 아래로 스와이프
                    scrollToPrevArticle();
                }
                return;
            }
            
            if (diff > 0) { // 위로 스와이프
                // methodology 섹션에서 위로 스와이프하면 푸터로 이동
                if (currentSection === 5) {
                    scrollToFooter();
                } else {
                    scrollToSection(Math.min(labSections.length - 1, currentSection + 1));
                }
            } else { // 아래로 스와이프
                // 첫 번째 섹션에서 아래로 스와이프하면 헤더로 이동
                if (currentSection === 0) {
                    scrollToHeader();
                }
                // 두 번째 섹션에서 아래로 스와이프하면 첫 번째 섹션과 헤더가 한 화면에 보이도록
                else if (currentSection === 1) {
                    scrollToFirstSectionWithHeader();
                }
                else {
                    scrollToSection(Math.max(0, currentSection - 1));
                }
            }
        }
    }
    
    // 스크롤 이벤트로 현재 섹션 업데이트
    function handleScroll() {
        if (!isScrolling) {
            currentSection = getCurrentSection();
        }
    }
    
    // 스크롤 완료 감지
    function handleScrollEnd() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            document.body.classList.remove('scrolling');
        }, 150);
    }
    
    // 이벤트 리스너 등록
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScrollEnd, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // 초기 현재 섹션 설정
    currentSection = getCurrentSection();
    
    // 초기 workshop article 상태 설정
    initWorkshopArticles();
    
    // 초기 video 섹션 상태 설정
    initVideoSection();
}

// ========================================
// Lab 페이지 애니메이션 (제거)
// ========================================

function initLabAnimation() {
    // 애니메이션 기능 제거
    return;
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
// UX for AI 페이지 스냅 스크롤 효과
// ========================================

function initUxaiSnapScroll() {
    const uxaiSections = document.querySelectorAll('.section.uxui section');
    if (uxaiSections.length === 0) return;
    
    let currentSection = 0;
    let isScrolling = false;
    let scrollTimeout;
    
    // 헤더 높이 고정값
    const HEADER_HEIGHT = 100;
    
    // 현재 섹션 찾기
    function getCurrentSection() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        for (let i = 0; i < uxaiSections.length; i++) {
            const section = uxaiSections[i];
            const rect = section.getBoundingClientRect();
            
            if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
                return i;
            }
        }
        return 0;
    }
    
    // 푸터로 스크롤하는 함수
    function scrollToFooter() {
        if (isScrolling) return;
        
        isScrolling = true;
        document.body.classList.add('scrolling');
        
        // 페이지 최하단으로 스크롤
        const startPosition = window.pageYOffset;
        const targetPosition = document.documentElement.scrollHeight - window.innerHeight;
        const distance = targetPosition - startPosition;
        const duration = 1200;
        let startTime = null;
        
        function animateScroll(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                setTimeout(() => {
                    isScrolling = false;
                    document.body.classList.remove('scrolling');
                }, 100);
            }
        }
        
        requestAnimationFrame(animateScroll);
    }
    
    // 헤더로 스크롤하는 함수
    function scrollToHeader() {
        if (isScrolling) return;
        
        isScrolling = true;
        document.body.classList.add('scrolling');
        
        // 페이지 최상단으로 스크롤
        const startPosition = window.pageYOffset;
        const targetPosition = 0;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let startTime = null;
        
        function animateScroll(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                setTimeout(() => {
                    isScrolling = false;
                    document.body.classList.remove('scrolling');
                }, 100);
            }
        }
        
        requestAnimationFrame(animateScroll);
    }
    
    // 첫 번째 섹션과 헤더가 한 화면에 보이도록 스크롤
    function scrollToFirstSectionWithHeader() {
        if (isScrolling) return;
        
        isScrolling = true;
        document.body.classList.add('scrolling');
        
        const firstSection = uxaiSections[0];
        
        // 첫 번째 섹션의 위치에서 헤더 높이만큼 위로 이동하되, 
        // 헤더가 완전히 보이도록 약간의 여백을 추가
        const targetPosition = Math.max(0, firstSection.offsetTop - HEADER_HEIGHT - 60);
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1200;
        let startTime = null;
        
        function animateScroll(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                setTimeout(() => {
                    isScrolling = false;
                    document.body.classList.remove('scrolling');
                }, 100);
            }
        }
        
        requestAnimationFrame(animateScroll);
    }
    
    // 특정 섹션으로 부드럽게 스크롤
    function scrollToSection(index) {
        if (index < 0 || index >= uxaiSections.length || isScrolling) return;
        
        isScrolling = true;
        currentSection = index;
        
        // 스크롤 중 표시
        document.body.classList.add('scrolling');
        
        // 일반 섹션 스크롤
        const targetSection = uxaiSections[index];
        const targetPosition = targetSection.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1200;
        let startTime = null;
        
        function animateScroll(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                setTimeout(() => {
                    isScrolling = false;
                    document.body.classList.remove('scrolling');
                }, 100);
            }
        }
        
        requestAnimationFrame(animateScroll);
    }
    
    // 마우스 휠 이벤트 (더 부드럽게)
    function handleWheel(e) {
        e.preventDefault();
        
        if (isScrolling) return;
        
        const wheelDelta = e.deltaY;
        const threshold = 50;
        
        if (Math.abs(wheelDelta) > threshold) {
            const direction = wheelDelta > 0 ? 1 : -1;
            
            // 첫 번째 섹션에서 위로 스크롤할 때 헤더로 이동
            if (currentSection === 0 && direction === -1) {
                scrollToHeader();
            }
            // 두 번째 섹션에서 위로 스크롤할 때 첫 번째 섹션과 헤더가 한 화면에 보이도록
            else if (currentSection === 1 && direction === -1) {
                scrollToFirstSectionWithHeader();
            }
            // 마지막 섹션에서 아래로 스크롤할 때 푸터로 이동
            else if (currentSection === uxaiSections.length - 1 && direction === 1) {
                scrollToFooter();
            }
            else {
                const nextSection = Math.max(0, Math.min(uxaiSections.length - 1, currentSection + direction));
                if (nextSection !== currentSection) {
                    scrollToSection(nextSection);
                }
            }
        }
    }
    
    // 키보드 이벤트
    function handleKeydown(e) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            
            // 마지막 섹션에서 아래로 키를 누르면 푸터로 이동
            if (currentSection === uxaiSections.length - 1) {
                scrollToFooter();
                return;
            }
            
            scrollToSection(Math.min(uxaiSections.length - 1, currentSection + 1));
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            // 첫 번째 섹션에서 위로 키를 누르면 헤더로 이동
            if (currentSection === 0) {
                scrollToHeader();
            }
            // 두 번째 섹션에서 위로 키를 누르면 첫 번째 섹션과 헤더가 한 화면에 보이도록
            else if (currentSection === 1) {
                scrollToFirstSectionWithHeader();
            }
            else {
                scrollToSection(Math.max(0, currentSection - 1));
            }
        }
    }
    
    // 터치 이벤트 (더 부드럽게)
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }
    
    function handleTouchEnd(e) {
        touchEndY = e.changedTouches[0].clientY;
        const touchEndTime = Date.now();
        const diff = touchStartY - touchEndY;
        const touchDuration = touchEndTime - touchStartTime;
        
        const minSwipeDistance = 30;
        const maxSwipeTime = 300;
        
        if (Math.abs(diff) > minSwipeDistance && touchDuration < maxSwipeTime) {
            if (diff > 0) { // 위로 스와이프
                // 마지막 섹션에서 위로 스와이프하면 푸터로 이동
                if (currentSection === uxaiSections.length - 1) {
                    scrollToFooter();
                } else {
                    scrollToSection(Math.min(uxaiSections.length - 1, currentSection + 1));
                }
            } else { // 아래로 스와이프
                // 첫 번째 섹션에서 아래로 스와이프하면 헤더로 이동
                if (currentSection === 0) {
                    scrollToHeader();
                }
                // 두 번째 섹션에서 아래로 스와이프하면 첫 번째 섹션과 헤더가 한 화면에 보이도록
                else if (currentSection === 1) {
                    scrollToFirstSectionWithHeader();
                }
                else {
                    scrollToSection(Math.max(0, currentSection - 1));
                }
            }
        }
    }
    
    // 스크롤 이벤트로 현재 섹션 업데이트
    function handleScroll() {
        if (!isScrolling) {
            currentSection = getCurrentSection();
        }
    }
    
    // 스크롤 완료 감지
    function handleScrollEnd() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            document.body.classList.remove('scrolling');
        }, 150);
    }
    
    // 이벤트 리스너 등록
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScrollEnd, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // 초기 현재 섹션 설정
    currentSection = getCurrentSection();
}

// ========================================
// 메인 초기화
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initHeroAnimation();
    initCaseDetailAnimation();    
    initLabAnimation();
    initLabSnapScroll();
    initUxaiSnapScroll();
    initClipboardCopy();
    initMobileNavigation();
}); 
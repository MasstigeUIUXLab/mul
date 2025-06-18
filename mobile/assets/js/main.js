// Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 메인 페이지 이미지 교차 애니메이션
    const heroImages = document.querySelectorAll('.hero-animation img');
    if (heroImages.length > 0) {
        let currentIndex = 0;
        heroImages[0].classList.add('active');
        
        function toggleImages() {
            heroImages.forEach(img => img.classList.remove('active'));
            heroImages[currentIndex].classList.add('active');
            currentIndex = (currentIndex + 1) % heroImages.length;
        }
        
        setInterval(toggleImages, 3000);
    }

    // Case Detail 페이지 스크롤 애니메이션
    const typoElements = document.querySelectorAll('.case-detail-content .typo');
    if (typoElements.length > 0) {
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

        typoElements.forEach(typo => {
            observer.observe(typo);
        });
    }

    // Lab 페이지 이미지 애니메이션
    const labImages = document.querySelectorAll('.section.lab .content div span img');
    if (labImages.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-10% 0px', // 요소가 10% 보이기 시작할 때 애니메이션 시작
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] // 더 부드러운 애니메이션을 위한 임계값
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 요소가 화면에 들어올 때
                    entry.target.classList.add('active');
                    
                    // 스크롤 위치에 따른 추가 애니메이션
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

        labImages.forEach(img => {
            observer.observe(img);
        });
    }

    

    // 클립보드 복사 기능

    // 토스트 메시지 기능
    const copyButtons = document.querySelectorAll('.copy-btn');
    const toastMessage = document.querySelector('.toast-message');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 버튼의 형제 요소인 a 태그의 텍스트 가져오기
            const textToCopy = button.previousElementSibling.textContent;
            
            // 클립보드에 복사
            navigator.clipboard.writeText(textToCopy).then(() => {
                // 복사 성공 시 버튼 스타일 변경 (선택사항)
                button.classList.add('copied');
                
                // 1초 후 버튼 스타일 원래대로 복구
                setTimeout(() => {
                    button.classList.remove('copied');
                }, 1000);
            }).catch(err => {
                console.error('클립보드 복사 실패:', err);
            });

            toastMessage.classList.add('show');
            
            // 2.5초 후 show 클래스 제거
            setTimeout(() => {
                toastMessage.classList.remove('show');
            }, 2500);
        });
    });

    const hamburger = document.querySelector('.hamburger-menu');
    const closeBtn = document.querySelector('.close-menu');
    const nav = document.querySelector('.main-nav');

    hamburger.addEventListener('click', function() {
        nav.classList.add('active');
    });

    closeBtn.addEventListener('click', function() {
        nav.classList.remove('active');
    });
}); 
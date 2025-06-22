// 문서가 로드되면 실행되는 메인 JavaScript 코드
document.addEventListener('DOMContentLoaded', function() {
    // 메인 페이지의 히어로 이미지 자동 전환 애니메이션
    // .hero-animation 내부의 모든 이미지를 3초마다 순차적으로 페이드인/아웃
    const heroImages = document.querySelectorAll('.hero-animation img');
    if (heroImages.length > 0) {
        let currentIndex = 0;
        heroImages[0].classList.add('active');
        
        function toggleImages() {
            heroImages.forEach(img => img.classList.remove('active'));
            heroImages[currentIndex].classList.add('active');
            currentIndex = (currentIndex + 1) % heroImages.length;
        }
        
        setInterval(toggleImages, 3000); // 3초마다 이미지 전환
    }

    // Case Detail 페이지의 콘텐츠 아이템 스크롤 애니메이션
    // 각 아이템이 화면에 나타날 때 순차적으로 페이드인 되는 효과
    const caseDetailItems = document.querySelectorAll('.case-detail-content-item');
    if (caseDetailItems.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-10% 0px', // 상단에서 10% 지점에서 트리거
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, index * 200); // 각 아이템마다 200ms 딜레이로 순차 등장
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        caseDetailItems.forEach(item => {
            observer.observe(item);
        });
    }

    // 클립보드 복사 및 토스트 메시지 기능
    // 버튼 클릭 시 텍스트를 클립보드에 복사하고 알림 메시지를 표시
    const copyButtons = document.querySelectorAll('.copy-btn');
    const toastMessage = document.querySelector('.toast-message');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const textToCopy = button.previousElementSibling.textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.classList.remove('copied');
                }, 1000); // 1초 후 복사 상태 표시 제거
            }).catch(err => {
                console.error('클립보드 복사 실패:', err);
            });

            // 토스트 메시지 표시 및 자동 숨김
            toastMessage.classList.add('show');
            setTimeout(() => {
                toastMessage.classList.remove('show');
            }, 2500); // 2.5초 후 토스트 메시지 숨김
        });
    });

    // 모바일 메뉴 토글 기능
    // 햄버거 메뉴 클릭 시 내비게이션 메뉴를 표시하고 닫기 버튼으로 숨김
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
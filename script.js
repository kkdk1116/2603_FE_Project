const emailForms = document.querySelectorAll(".add-email");

emailForms.forEach(form => {
    form.addEventListener("submit", function(event){
        event.preventDefault();
        const emailInput = this.querySelectorAll("input");
        const email = emailInput.value;
        
        if(email) {
            alert(email + " 로 구독 안내문을 보내드리겠습니다.");
            emailInput.value = ""; // 입력창 초기화 (내용 비우기)
        }
    });
});

// 모달을 여는 함수
const openModal = (id) => {
    const modal = document.getElementById(id);
    if(modal) modal.classList.add('active');
};

// 모달을 닫는 함수
const closeModal = () => {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active')
    })

// 입력했던 내용이나 에러 메시지 초기화 
    document.querySelectorAll('.modal-content input').forEach(input => input.value = '');
    document.querySelectorAll('.error-msg').forEach(error => error.textContent = '');
};

// '모든 닫기 버튼(X)'에 클릭 이벤트 연결하기
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.onclick = closeModal;
});

// 버튼 클릭 이벤트

// 배너 버튼
const bannerBtn = document.getElementById('banner-btn');
if(bannerBtn){
    bannerBtn.onclick = () => openModal('banner-modal');
}

// 로그인 버튼 클릭 시 모달 열기
const loginNavBtn = document.getElementById('login-nav-btn');
if(loginNavBtn){
    loginNavBtn.onclick = () => openModal('login-modal');
}

// 회원가입 버튼 클릭 시 모달 열기
const signupNavBtn = document.getElementById('signup-nav-btn');
if(signupNavBtn){
    signupNavBtn.onclick = () => openModal('signup-modal');
}

// 푸터의 이벤트 버튼 클릭 시 모달 열기
const eventBtn = document.getElementById('event-btn');
if(eventBtn){
    eventBtn.onclick = () => openModal('event-modal');
}

// 회원가입 로컬 스토리지에 저장
const signupSubmit = document.getElementById('signup-submit');
if(signupSubmit) {
    signupSubmit.onclick = () => {
        // 사용자 입력한 값 가져오기
        const id = document.getElementById('signup-id').value.trim();
        const pw = document.getElementById('signup-pw').value;
        const pwConfirm = document.getElementById('signup-pw-confirm').value;
        const errorEl = document.getElementById('signup-error');

        // 빈 칸 검사
        if(!id || !pw) {
            errorEl.textContent = '아이디와 비밀번호를 입력해 주세요.';
            return;
        }

        // 비밀번호 유효성 검사 (8자리 이상, 영문, 숫자, 특수문자 포함)
        const pwRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?/~`|-]).{8,}$/;
        if (!pwRegex.test(pw)) {
            errorEl.textContent = '비밀번호는 최소 8자리 이상이며, 영문, 숫자, 특수문자를 모두 포함해야 합니다.';
            return;
        }

        // 비밀번호 확인 검사
        if(pw !== pwConfirm) {
            errorEl.textContent = '비밀번호가 일치하지 않습니다.';
            return;
        }
    
        // 로컬 스토리지에 기존 회원 명단 가져오기
        const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

        if (accounts.find(user => user.id === id)) {
            errorEl.textContent = "이미 사용중인 아이디입니다.";
            return;
        }

        // 새로운 회원 추가 (저장)
        accounts.push({id, pw});
        localStorage.setItem('accounts', JSON.stringify(accounts));

        alert('회원가입이 완료되었습니다! 이제 로그인해 보세요');
        closeModal();
    };
}

// 로그인: 저장된 정보와 비교하기
const loginSubmit = document.getElementById('login-submit');
if (loginSubmit) {
  loginSubmit.onclick = () => {
    const id = document.getElementById('login-id').value.trim();
    const pw = document.getElementById('login-pw').value;
    const errorEl = document.getElementById('login-error');

    // 저장된 회원 명단 가져오기
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    // 입력한 정보와 일치하는 회원 찾기
    const user = accounts.find(acc => acc.id === id && acc.pw === pw);

    if (user) {
      // 로그인 성공 시: 현재 로그인한 유저 정보를 저장
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      alert(`${user.id}님, 환영합니다!`);
      closeModal();
      updateUI(); // 화면 모습 바꾸기 (로그인 버튼 숨기기 등)
    } else {
      errorEl.textContent = '아이디 또는 비밀번호가 틀렸습니다.';
    }
  };
}

// 로그인 상태에 따라 버튼 보여주기/숨기기
const updateUI = () => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const userStatus = document.getElementById('user-status');
  const loginNavBtn = document.getElementById('login-nav-btn');
  const signupNavBtn = document.getElementById('signup-nav-btn');
  const logoutBtn = document.getElementById('logout-btn');

  if (loggedInUser) {
    // 로그인 된 상태
    userStatus.textContent = `${loggedInUser.id}님 접속 중`;
    userStatus.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    loginNavBtn.classList.add('hidden');
    signupNavBtn.classList.add('hidden');
  } else {
    // 로그아웃 된 상태
    userStatus.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    loginNavBtn.classList.remove('hidden');
    signupNavBtn.classList.remove('hidden');
  }
};

// 로그아웃 버튼 콜
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.onclick = () => {
    localStorage.removeItem('loggedInUser');
    alert('로그아웃 되었습니다.');
    updateUI();
  };
}

// 화면 맨 위로 스크롤
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 화면 맨 아래로 스크롤
const scrollBottomBtn = document.getElementById('scroll-bottom');
if (scrollBottomBtn) {
    scrollBottomBtn.addEventListener('click', () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });
}

// 이메일 입력창 초기화(X 버튼) 기능
const inputWrappers = document.querySelectorAll('.input-wrapper');

inputWrappers.forEach(wrapper => {
    const input = wrapper.querySelector('input');
    const clearBtn = wrapper.querySelector('.clear-btn');

    if (input && clearBtn) {
        // 타이핑 시 값 존재 여부에 따라 클래스 토글
        input.addEventListener('input', () => {
            if (input.value.length > 0) {
                wrapper.classList.add('has-value');
            } else {
                wrapper.classList.remove('has-value');
            }
        });

        // X 버튼 클릭 시 동작
        clearBtn.addEventListener('click', () => {
            input.value = ''; // 입력값 초기화
            wrapper.classList.remove('has-value'); // X 버튼 숨김
            input.focus(); // 텍스트 삭제 후 입력창에 다시 포커스
        });
    }
});

// 페이지 로드 시 출석 체크 팝업 및 룰렛 팝업 실행 (다중 탭 중복 호출 방지)
window.addEventListener('DOMContentLoaded', () => {
    // 현재 시간(밀리초) 및 로컬 스토리지에 저장된 마지막 팝업 호출 시간 확인
    const now = Date.now();
    const lastPopupTime = localStorage.getItem('lastPopupTime') || 0;

    // 마지막 팝업 호출 시점으로부터 2초(2000ms)가 지났을 때만 실행
    if (now - lastPopupTime > 2000) {
        // 출석 체크 창
        window.open('attendancePopup.html', 'attendancePopup', 'width=450,height=550,left=100,top=100');
        // 행운의 룰렛 창
        window.open('roulette.html', 'roulettePopup', 'width=450,height=600,left=570,top=100');
        
        // 현재 팝업을 호출한 시간을 로컬 스토리지에 갱신
        localStorage.setItem('lastPopupTime', now);
    }
});

let visitCount = Number(localStorage.getItem("visit")) || 0;

visitCount++;

localStorage.setItem("visit", visitCount);
document.querySelector("#visit").innerText = visitCount;

let likeCount = 0;

const likeBtn = document.querySelector("#like");
const result = document.querySelector("#likeCount");

likeBtn. addEventListener("click", function(){
likeCount++;
result.innerText = likeCount;
});


// 로스팅 항목 선택 시 말풍선 제어 로직
const roastSelect = document.getElementById('roast-select');
const roastBubble = document.getElementById('roast-bubble');
const roastDesc = document.getElementById('roast-desc');
const bubbleClose = document.getElementById('bubble-close');

// 선택 항목별 출력될 텍스트 데이터 객체
const roastDescriptions = {
    light: "생두의 맛이 잘 나타나며 가벼운 느낌을 줍니다.",
    medium: "산미와 고소함이 균형을 이루어 누구나 편하게 즐기기 좋은 커피입니다.",
    dark: "산미가 적고 묵직한 바디감과 쌉싸름한 다크 초콜릿 향이 특징입니다."
};

if (roastSelect && roastBubble) {
    // 항목 변경 이벤트 감지
    roastSelect.addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        
        // 데이터 객체에 해당 값이 존재할 경우 텍스트 업데이트 및 표시
        if (roastDescriptions[selectedValue]) {
            roastDesc.textContent = roastDescriptions[selectedValue];
            roastBubble.classList.remove('hidden');
        }
    });

    // 닫기 버튼 클릭 이벤트 감지
    bubbleClose.addEventListener('click', () => {
        roastBubble.classList.add('hidden');
    });
}


// ---- 테마(라이트/다크) 전환 로직 ----
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// 1. 로컬 스토리지에서 저장된 테마 불러오기
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
    if (themeToggleBtn) {
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i> 다크 모드';
    }
}

// 2. 테마 전환 버튼 클릭 이벤트
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        // body 요소에 light-mode 클래스 토글
        document.body.classList.toggle('light-mode');
        
        // 상태에 따라 버튼 텍스트 및 로컬 스토리지 데이터 업데이트
        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i> 다크 모드';
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i> 라이트 모드';
        }
    });
}

// 매장안내 버튼 클릭 시 지도 모달 열기
const storeInfoBtn = document.getElementById('store-info-btn');
if (storeInfoBtn) {
    storeInfoBtn.onclick = (e) => {
        e.preventDefault(); // <a> 태그의 기본 동작(페이지 최상단 이동) 방지
        openModal('map-modal');
    };
}

// FAQ 아코디언 동일 항목 클릭 시 접기 기능
const accordionLabels = document.querySelectorAll('.accordion li label');

accordionLabels.forEach(label => {
    label.addEventListener('click', function(e) {
        // 클릭한 라벨과 연결된 라디오 버튼 요소 찾기
        const radioId = this.getAttribute('for');
        const radio = document.getElementById(radioId);
        
        // 이미 열려있는(체크된) 상태에서 라벨을 다시 클릭했다면
        if (radio && radio.checked) {
            e.preventDefault(); // 브라우저의 기본 라디오 체크 동작을 강제로 막음
            radio.checked = false; // 체크를 해제하여 내용을 접음
        }
    });
});

// 미션 5_카드 선택 시 추천 메시지 출력
const coffeCard = document.querySelectorAll(".card")
coffeCard.forEach(function(card){
  card.addEventListener("click", function() {
    const name = card.querySelector("h3").innerHTML;
    alert(`${name}를 추천합니다`);
  });
});


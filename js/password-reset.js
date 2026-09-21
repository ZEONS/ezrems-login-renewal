(() => {
    const content = document.querySelector('.accessmain .content');
    const title = content.querySelector('h2');
    const trigger = document.querySelector('#passwordResetButton');
    const findIdTrigger = document.querySelector('#findIdButton');
    const view = document.querySelector('#passwordResetView');
    const form = document.querySelector('#passwordResetForm');
    const username = document.querySelector('#resetUsername');
    const error = document.querySelector('#resetUsernameError');
    const status = document.querySelector('#resetStatus');
    const nameGroup = document.querySelector('#recoveryNameGroup');
    const nameInput = document.querySelector('#recoveryName');
    const nameError = document.querySelector('#recoveryNameError');
    const submitButton = form.querySelector('button[type="submit"]');
    let findingId = false;
    const clearMessages = () => {
        nameInput.removeAttribute('aria-invalid');
        nameError.textContent = '';
        nameError.classList.remove('show');
        username.removeAttribute('aria-invalid');
        error.textContent = '';
        error.classList.remove('show');
        status.hidden = true;
        status.textContent = '';
    };
    const openRecovery = findId => {
        findingId = findId;
        form.reset();
        clearMessages();
        content.classList.add('is-password-reset');
        title.id = 'passwordResetTitle';
        title.textContent = findingId ? '아이디 찾기' : '비밀번호 재설정';
        nameGroup.hidden = !findingId;
        nameInput.disabled = !findingId;
        submitButton.textContent = findingId ? '아이디 이메일 발송' : '인증코드 발송';
        view.hidden = false;
        const loginId = document.querySelector('#uid').value.trim();
        username.value = loginId.includes('@') ? loginId : '';
        (findingId ? nameInput : username).focus();
        window.dispatchEvent(new Event('resize'));
    };
    trigger.addEventListener('click', () => openRecovery(false));
    findIdTrigger.addEventListener('click', () => openRecovery(true));
    document.querySelector('#backToLogin').addEventListener('click', () => {
        view.hidden = true;
        content.classList.remove('is-password-reset');
        title.removeAttribute('id');
        title.textContent = '로그인';
        form.reset();
        clearMessages();
        (findingId ? findIdTrigger : trigger).focus();
        window.dispatchEvent(new Event('resize'));
    });
    username.addEventListener('input', clearMessages);
    nameInput.addEventListener('input', clearMessages);
    form.addEventListener('submit', event => {
        event.preventDefault();
        clearMessages();
        if (findingId && !nameInput.value.trim()) {
            nameError.textContent = '이름을 입력해 주세요.';
            nameError.classList.add('show');
            nameInput.setAttribute('aria-invalid', 'true');
            nameInput.focus();
            return;
        }
        if (!username.value.trim()) {
            error.textContent = '이메일 주소를 입력해 주세요.';
            error.classList.add('show');
            username.setAttribute('aria-invalid', 'true');
            username.focus();
            return;
        }
        if (!username.validity.valid) {
            error.textContent = '올바른 이메일 주소를 입력해 주세요.';
            error.classList.add('show');
            username.setAttribute('aria-invalid', 'true');
            username.focus();
            return;
        }
        // Wire the authentication service here when its reset API is available.
        // Never claim that a code was delivered without a successful server response.
        status.textContent = findingId
            ? '현재 아이디 이메일 발송 기능은 준비 중입니다. 고객센터 070-8811-8881로 문의해 주세요.'
            : '현재 인증코드 발송 기능은 준비 중입니다. 고객센터 070-8811-8881로 문의해 주세요.';
        status.hidden = false;
    });
})();

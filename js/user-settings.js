(() => {
    const storageKey = 'ezrems-user-backgrounds';
    const fontKey = 'ezrems-ui-font';
    const root = document.documentElement;
    const entry = document.querySelector('#userSettingsButton');
    // The customer section is hidden on small screens; keep settings reachable.
    const settingsMenu = document.querySelector('.references-settings');
    const menuHome = document.createComment('Screen settings desktop position');
    settingsMenu.before(menuHome);
    const compactScreen = matchMedia('(max-width:850px)');
    const placeMenu = () => {
        if (compactScreen.matches) document.querySelector('.utility').prepend(settingsMenu);
        else menuHome.after(settingsMenu);
    };
    compactScreen.addEventListener('change', placeMenu);
    placeMenu();
    let saved = { panel: '', page: '', mode: 'registered' };
    const sourceOptions = [...document.querySelectorAll('input[name="backgroundSource"]')];
    const sourceStatus = document.querySelector('#backgroundSourceStatus');
    const validImage = value => typeof value === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value) && value.length <= 1500000;
    try {
        const value = JSON.parse(localStorage.getItem(storageKey));
        for (const key of ['panel', 'page']) if (validImage(value?.[key])) saved[key] = value[key];
        saved.mode = ['registered', 'user'].includes(value?.mode) ? value.mode : (saved.panel || saved.page ? 'user' : 'registered');
    } catch (_) { /* Defaults also work when browser storage is unavailable. */ }
    const applyImages = () => {
        for (const key of ['panel', 'page']) {
            root.toggleAttribute(`data-user-${key}`, saved.mode === 'user' && Boolean(saved[key]));
            root.toggleAttribute(`data-user-${key}-default`, saved.mode === 'user' && !saved[key]);
            if (saved[key]) root.style.setProperty(`--user-${key}-image`, `url("${saved[key]}")`);
            else root.style.removeProperty(`--user-${key}-image`);
        }
        sourceOptions.forEach(option => { option.checked = option.value === saved.mode; });
        document.querySelector('#registeredThemeSettings').hidden = saved.mode !== 'registered';
        document.querySelector('#customThemeSettings').hidden = saved.mode !== 'user';
    };
    applyImages();
    sourceOptions.forEach(option => option.addEventListener('change', () => {
        if (!option.checked) return;
        const next = { ...saved, mode: option.value };
        try { localStorage.setItem(storageKey, JSON.stringify(next)); }
        catch (_) {
            applyImages();
            sourceStatus.textContent = '선택을 저장하지 못했습니다. 브라우저 저장 공간이나 저장 허용 설정을 확인해 주세요.';
            return;
        }
        saved = next;
        applyImages();
        sourceStatus.textContent = `${saved.mode === 'user' ? '사용자 설정 테마' : '등록된 테마'}를 적용했습니다. 이 브라우저에만 저장됩니다.`;
        window.dispatchEvent(new Event('resize'));
    }));
    const dialog = document.createElement('dialog');
    dialog.id = 'userSettingsDialog';
    dialog.className = 'user-settings-dialog';
    dialog.setAttribute('aria-labelledby', 'userSettingsTitle');
    dialog.setAttribute('aria-describedby', 'userSettingsNotice');
    dialog.innerHTML = `<div class="user-settings-content">
        <div class="settings-handle" aria-hidden="true"></div>
        <div class="settings-heading"><h2 id="userSettingsTitle">사용자 설정</h2><button type="button" id="closeUserSettings" autofocus>닫기</button></div>
        <p class="settings-notice" id="userSettingsNotice">설정과 선택한 이미지는 <strong>현재 기기의 이 브라우저에만 저장</strong>됩니다. 서버로 전송되지 않으며, 다른 기기·브라우저와 공유되지 않습니다. 브라우저 데이터를 삭제하면 설정도 삭제됩니다.</p>
        <div class="settings-grid">${[['panel', '패널 배경 이미지'], ['page', '전체 페이지 배경 이미지']].map(([key, label]) => `<fieldset class="settings-image"><legend>${label}</legend><div class="settings-preview" id="${key}Preview"></div><label class="settings-help" for="${key}Image">이미지 파일 선택</label><input id="${key}Image" type="file" accept="image/png,image/jpeg,image/webp"><button type="button" data-clear="${key}">기본 배경 사용</button></fieldset>`).join('')}</div>
        <p class="settings-help">JPG, PNG, WebP · 파일당 최대 10MB. 저장 공간에 맞춰 이미지 크기가 조정됩니다.<br>패널 배경은 왼쪽 홍보 영역에 적용됩니다. 전체 페이지 배경은 카드형 화면의 바깥 여백에서 확인할 수 있습니다.</p>
        <label class="settings-font" for="userFont">폰트 설정</label><select id="userFont"></select>
        <div class="settings-font-preview" id="userFontPreview">나에게 맞는 화면, 편안한 업무의 시작<br>ezREMS · ABC abc 0123456789</div>
        <p class="settings-help">설치되거나 로드된 글꼴을 사용하며, 사용할 수 없으면 기본 글꼴로 표시됩니다.</p>
        <p class="settings-status" id="userSettingsStatus" role="status" aria-live="polite"></p>
        <div class="settings-actions"><button type="button" id="resetUserSettings">기본값으로 복원</button><button type="button" class="settings-save" id="saveUserSettings">저장하고 적용</button></div>
    </div>`;
    document.body.append(dialog);
    const fontSelect = dialog.querySelector('#userFont');
    for (const [key, option] of Object.entries(fontOptions)) fontSelect.add(new Option(option.label, key));
    const status = dialog.querySelector('#userSettingsStatus');
    const saveButton = dialog.querySelector('#saveUserSettings');
    let draft, generation = 0, pending = 0, previousOverflow;
    const message = (text, error = false) => { status.textContent = text; status.toggleAttribute('data-error', error); };
    const previewFont = () => { dialog.querySelector('#userFontPreview').style.fontFamily = fontOptions[fontSelect.value].stack; };
    const previewImage = key => {
        const preview = dialog.querySelector(`#${key}Preview`);
        preview.replaceChildren();
        preview.classList.toggle('is-default', !draft[key]);
        if (draft[key]) { const image = new Image(); image.src = draft[key]; image.alt = `${key === 'panel' ? '패널' : '전체 페이지'} 배경 미리보기`; preview.append(image); }
        else preview.textContent = key === 'panel' ? '기본 파란색 배경' : '기본 회색 배경';
    };
    entry.addEventListener('click', () => {
        draft = { ...saved };
        generation++;
        pending = 0;
        saveButton.disabled = false;
        for (const key of ['panel', 'page']) { previewImage(key); dialog.querySelector(`#${key}Image`).value = ''; }
        fontSelect.value = activeFont;
        previewFont();
        message('변경 후 ‘저장하고 적용’을 눌러 주세요.');
        document.querySelector('#layoutPanel').hidden = true;
        document.querySelector('#themeButton').setAttribute('aria-expanded', 'false');
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialog.showModal();
    });
    dialog.querySelector('#closeUserSettings').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); } });
    dialog.addEventListener('close', () => { generation++; document.body.style.overflow = previousOverflow; document.querySelector('#themeButton').focus(); });
    fontSelect.addEventListener('change', previewFont);
    const versions = { panel: 0, page: 0 };
    for (const key of ['panel', 'page']) {
        dialog.querySelector(`[data-clear="${key}"]`).addEventListener('click', () => { versions[key]++; draft[key] = ''; dialog.querySelector(`#${key}Image`).value = ''; previewImage(key); message('기본 배경을 선택했습니다. 저장하면 적용됩니다.'); });
        dialog.querySelector(`#${key}Image`).addEventListener('change', async event => {
            const file = event.target.files[0];
            if (!file) return;
            const version = ++versions[key], session = generation;
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) { event.target.value = ''; message('10MB 이하의 JPG, PNG, WebP 이미지를 선택해 주세요.', true); return; }
            pending++; saveButton.disabled = true;
            message('이미지를 준비하고 있습니다.');
            const url = URL.createObjectURL(file);
            try {
                const image = new Image(); image.src = url; await image.decode();
                const ratio = Math.min(1, 1600 / Math.max(image.width, image.height));
                const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(image.width * ratio)); canvas.height = Math.max(1, Math.round(image.height * ratio));
                const context = canvas.getContext('2d'); context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(image, 0, 0, canvas.width, canvas.height);
                const data = canvas.toDataURL('image/jpeg', .78);
                if (!validImage(data)) throw new Error('image too large');
                if (generation === session && versions[key] === version) { draft[key] = data; previewImage(key); message('이미지를 준비했습니다. 저장하면 적용됩니다.'); }
            } catch (_) { if (generation === session && versions[key] === version) message('이미지를 읽을 수 없습니다. 더 작은 이미지나 다른 파일을 선택해 주세요.', true); }
            finally { URL.revokeObjectURL(url); if (generation === session) { pending--; saveButton.disabled = pending > 0; } }
        });
    }
    dialog.querySelector('#resetUserSettings').addEventListener('click', () => {
        for (const key of ['panel', 'page']) { versions[key]++; draft[key] = ''; dialog.querySelector(`#${key}Image`).value = ''; previewImage(key); }
        fontSelect.value = 'paperlogy'; previewFont(); message('기본값을 선택했습니다. 저장하면 개인 배경과 폰트 설정이 초기화됩니다.');
    });
    saveButton.addEventListener('click', () => {
        let oldBackground, wroteBackground = false;
        try {
            oldBackground = localStorage.getItem(storageKey);
            localStorage.setItem(storageKey, JSON.stringify(draft)); wroteBackground = true;
            localStorage.setItem(fontKey, fontSelect.value);
        } catch (_) {
            if (wroteBackground) try { if (oldBackground === null) localStorage.removeItem(storageKey); else localStorage.setItem(storageKey, oldBackground); } catch (_) { }
            message('저장하지 못했습니다. 브라우저 저장 공간이나 저장 허용 설정을 확인해 주세요. 더 작은 이미지로 다시 시도할 수 있습니다.', true); return;
        }
        saved = { ...draft }; applyImages(); applyFont(fontSelect.value);
        window.dispatchEvent(new Event('resize'));
        message('이 브라우저에만 저장하고 적용했습니다.');
        dialog.close();
    });
})();

(() => {
    const button = document.querySelector('#themeButton');
    const panel = document.querySelector('#layoutPanel');
    const options = [...panel.querySelectorAll('input[name="layout"]')];
    const storageKey = 'ezrems-ui-layout';

    const backgroundSelect = document.querySelector('#backgroundThemeSelect');
    const backgroundHelp = document.querySelector('#backgroundThemeHelp');
    const backgroundStorageKey = 'ezrems-background-theme';

    const escapeOption = value => String(value ?? '').replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
    const refreshBackgroundThemes = () => {
        const themes = Array.isArray(window.EZREMS_BACKGROUND_THEMES) ? window.EZREMS_BACKGROUND_THEMES : [];
        let savedId = '';
        try { savedId = localStorage.getItem(backgroundStorageKey) || '' } catch (error) { }
        if (!themes.some(theme => theme.id === savedId)) savedId = '';
        backgroundSelect.innerHTML = '<option value="">관리자 기본 테마</option>' + themes.map(theme => '<option value="' + escapeOption(theme.id) + '">' + escapeOption(theme.name || '이름 없는 테마') + ' · ' + (theme.mode === 'card' ? '카드형' : '패널형') + '</option>').join('');
        backgroundSelect.value = savedId;
        backgroundSelect.disabled = themes.length === 0;
        backgroundHelp.textContent = themes.length ? '선택한 테마는 이 브라우저에 저장됩니다.' : '관리자가 등록한 배경 테마가 없습니다.';
    };


    const applyLayout = value => {
        const layout = value === 'full' ? 'full' : 'card';
        document.documentElement.dataset.layout = layout;
        options.forEach(option => { option.checked = option.value === layout });
        try { localStorage.setItem(storageKey, layout) } catch (error) { }
        // Re-align marketing content after the container changes size.
        requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    };

    const setOpen = open => {
        panel.hidden = !open;
        button.setAttribute('aria-expanded', String(open));
        if (open) options.find(option => option.checked).focus();
    };

    let savedLayout = 'card';
    try { savedLayout = localStorage.getItem(storageKey) || 'card' } catch (error) { }
    applyLayout(savedLayout);

    backgroundSelect.addEventListener('change', () => { const id = backgroundSelect.value; try { if (id) localStorage.setItem(backgroundStorageKey, id); else localStorage.removeItem(backgroundStorageKey) } catch (error) { } if (typeof window.EZREMS_SET_BACKGROUND_THEME === 'function') window.EZREMS_SET_BACKGROUND_THEME(id); backgroundHelp.textContent = id ? '선택한 테마를 적용했습니다.' : '관리자 기본 테마를 적용했습니다.' });
    window.addEventListener('ezrems:themes-loaded', refreshBackgroundThemes);
    refreshBackgroundThemes();

    button.addEventListener('click', () => setOpen(panel.hidden));
    options.forEach(option => option.addEventListener('change', () => {
        if (option.checked) applyLayout(option.value);
    }));
    document.addEventListener('click', event => {
        if (!panel.contains(event.target) && !button.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !panel.hidden) {
            setOpen(false);
            button.focus();
        }
    });
    document.addEventListener('focusin', event => {
        if (!panel.contains(event.target) && !button.contains(event.target)) setOpen(false);
    });
    document.querySelector('#viewport').addEventListener('transitionend', event => {
        if (event.target.id === 'viewport') window.dispatchEvent(new Event('resize'));
    });
})();

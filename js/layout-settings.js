(() => {
    const button = document.querySelector('#themeButton');
    const panel = document.querySelector('#layoutPanel');
    const options = [...panel.querySelectorAll('input[name="layout"]')];
    const storageKey = 'ezrems-ui-layout';

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

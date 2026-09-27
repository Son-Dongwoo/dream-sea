/* Navigation uses real links. This script only enhances the scenery. */
(() => {
  'use strict';
  const root = document.documentElement;
  const button = document.getElementById('motion-toggle');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let userOff = false;
  try { userOff = localStorage.getItem('dream-sea:motion') === 'off'; } catch (_) {}
  let frame = 0;
  let latest = null;

  function resetDrift() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    latest = null;
    root.style.setProperty('--drift-x', '0px');
    root.style.setProperty('--drift-y', '0px');
  }
  function syncMotion() {
    const off = preference.matches || userOff;
    root.dataset.motion = off ? 'off' : 'on';
    if (button) {
      button.hidden = false;
      button.setAttribute('aria-pressed', String(off));
      button.disabled = preference.matches;
      button.title = preference.matches
        ? '운영체제의 움직임 감소 설정을 사용 중입니다.'
        : off ? '배경 움직임 다시 켜기' : '배경 움직임 줄이기';
    }
    if (off) resetDrift();
  }
  if (button) {
    button.addEventListener('click', () => {
      if (preference.matches) return;
      userOff = !userOff;
      try { localStorage.setItem('dream-sea:motion', userOff ? 'off' : 'on'); } catch (_) {}
      syncMotion();
    });
  }
  preference.addEventListener('change', syncMotion);
  finePointer.addEventListener('change', resetDrift);
  window.addEventListener('storage', event => {
    if (event.key === 'dream-sea:motion' || event.key === null) {
      try { userOff = localStorage.getItem('dream-sea:motion') === 'off'; } catch (_) {}
      syncMotion();
    }
  });
  document.addEventListener('pointermove', event => {
    if (root.dataset.motion !== 'on' || !finePointer.matches || event.pointerType === 'touch') return;
    latest = { x: event.clientX, y: event.clientY };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!latest || root.dataset.motion !== 'on') return;
      const x = (latest.x / window.innerWidth - .5) * 14;
      const y = (latest.y / window.innerHeight - .5) * 10;
      root.style.setProperty('--drift-x', `${x.toFixed(2)}px`);
      root.style.setProperty('--drift-y', `${y.toFixed(2)}px`);
    });
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', resetDrift);
  document.addEventListener('visibilitychange', () => { if (document.hidden) resetDrift(); });
  window.addEventListener('pageshow', syncMotion);
  syncMotion();
})();

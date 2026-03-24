// ============================================================
//  script.js — GSAP Animations
//  依存: gsap.min.js, ScrollTrigger.min.js
// ============================================================

gsap.registerPlugin(ScrollTrigger);

// ============================================================
//  ユーティリティ
// ============================================================
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ============================================================
//  1. カスタムカーソル
// ============================================================
(function initCursor() {
  const cursor = qs('#cursor');
  const follower = qs('#cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.set(cursor, { x: mouseX, y: mouseY });
  });

  // フォロワーは少し遅れてついてくる
  gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    gsap.set(follower, { x: followerX, y: followerY });
  });

  // ホバーエフェクト
  const hoverTargets = qsa('a, button, .work-card, .writing-item, .nav__menu');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-hover');
      follower.classList.add('is-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-hover');
      follower.classList.remove('is-hover');
    });
  });
})();

// ============================================================
//  2. ページロードアニメーション
// ============================================================
(function initPageLoad() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // ヒーロータイトルの各行を下から上に
  tl.from('.hero__title-line', {
    y: '110%',
    duration: 1.4,
    stagger: 0.12,
    ease: 'power4.out',
  })
    .from('.hero__label', {
      opacity: 0,
      y: 16,
      duration: 1,
    }, '-=0.8')
    .from('.hero__sub', {
      opacity: 0,
      y: 16,
      duration: 1,
    }, '-=0.8')
    .from('.nav', {
      opacity: 0,
      y: -20,
      duration: 1,
    }, '-=1')
    .from('.hero__scroll', {
      opacity: 0,
      y: 10,
      duration: 0.8,
    }, '-=0.6');

  // ヒーロー画像：クリップパスで上から開く
  tl.from('.hero__image', {
    clipPath: 'inset(0 0 100% 0)',
    duration: 1.6,
    ease: 'power4.inOut',
  }, 0.2);

})();

// ============================================================
//  3. スクロールアニメーション
// ============================================================
(function initScrollAnimations() {

  // --- js-fade: 下からフェードイン ---
  qsa('.js-fade').forEach(el => {
    // ページロード時に既に表示されているものはスキップ
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // --- js-fade-line: セクションラベル (左からスライド) ---
  qsa('.js-fade-line').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // --- js-clip: クリップパス（下から開く）---
  qsa('.js-clip').forEach(el => {
    gsap.fromTo(el,
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.4,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // --- ワークカード: スタガーで出現 ---
  const workGrids = qsa('.works__grid, .writing-grid');
  workGrids.forEach(grid => {
    const cards = qsa('.work-card, .writing-item', grid);
    gsap.fromTo(cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // --- ビデオアイテム: 交互に出現 ---
  qsa('.video-item').forEach((item, i) => {
    const direction = i % 2 === 0 ? -30 : 30;
    gsap.fromTo(item,
      { opacity: 0, x: direction },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 82%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // --- About ヒストリーリスト: 1行ずつ ---
  const historyItems = qsa('.about__history li');
  gsap.fromTo(historyItems,
    { opacity: 0, x: 20 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about__history',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    }
  );

  // --- Divider ライン: 左から伸びる ---
  qsa('.divider').forEach(el => {
    gsap.fromTo(el,
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1,
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // --- フッター ---
  gsap.fromTo('.footer__name',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 90%',
        toggleActions: 'play none none none',
      }
    }
  );

})();

// ============================================================
//  4. パララックス (ヒーロー画像)
// ============================================================
(function initParallax() {
  gsap.to('.hero__image .placeholder', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });
})();

// ============================================================
//  5. スムーズスクロール (ナビリンク)
// ============================================================
(function initSmoothNav() {
  qsa('.nav__links a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = qs(link.getAttribute('href'));
      if (!target) return;
      gsap.to(window, {
        duration: 1.4,
        scrollTo: { y: target, offsetY: 80 },
        ease: 'power3.inOut',
      });
    });
  });
})();

// ============================================================
//  6. ナビの背景（スクロール時に少し暗くする）
// ============================================================
(function initNavScroll() {
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      const nav = qs('.nav');
      if (!nav) return;
      if (self.direction === 1 && self.scroll() > 80) {
        nav.style.mixBlendMode = 'normal';
      } else {
        nav.style.mixBlendMode = 'difference';
      }
    }
  });
})();

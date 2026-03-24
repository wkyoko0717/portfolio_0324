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
//  3. スクロールアニメーション（IntersectionObserver版）
// ============================================================
(function initScrollAnimations() {

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      if (el.classList.contains('js-fade')) {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }
        );
      }
      else if (el.classList.contains('js-fade-line')) {
        gsap.fromTo(el,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
        );
      }
      else if (el.classList.contains('js-clip')) {
        gsap.fromTo(el,
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'power4.inOut' }
        );
      }

      observer.unobserve(el); // 一度発火したら解除
    });
  }, { threshold: 0.15 });

  // js-fade / js-fade-line / js-clip を監視
  qsa('.js-fade, .js-fade-line, .js-clip').forEach(el => observer.observe(el));

  // ワークカード・ライティングカード（スタガー）
  const gridObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const cards = qsa('.work-card, .writing-item', entry.target);
      gsap.fromTo(cards,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }
      );
      gridObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  qsa('.works__grid, .writing-grid').forEach(el => gridObserver.observe(el));

  // ビデオアイテム
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const direction = Array.from(qsa('.video-item')).indexOf(entry.target) % 2 === 0 ? -30 : 30;
      gsap.fromTo(entry.target,
        { opacity: 0, x: direction },
        { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' }
      );
      videoObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  qsa('.video-item').forEach(el => videoObserver.observe(el));

  // Aboutヒストリー
  const historyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      gsap.fromTo(qsa('.about__history li'),
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out' }
      );
      historyObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  const history = qs('.about__history');
  if (history) historyObserver.observe(history);

  // Divider
  const dividerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      gsap.fromTo(entry.target,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }
      );
      dividerObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  qsa('.divider').forEach(el => dividerObserver.observe(el));

  // Footer
  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      gsap.fromTo('.footer__name',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );
      footerObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  const footer = qs('.footer');
  if (footer) footerObserver.observe(footer);

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

// ============================================================
//  背景光源パララックス
// ============================================================
(function initAmbientParallax() {
  const lights = qsa('.ambient-light');
  // コンテンツより30〜50%遅くスクロールさせる
  const speeds = [0.35, 0.42, 0.28, 0.38, 0.45, 0.32];

  lights.forEach((light, i) => {
    const speed = speeds[i] || 0.4;
    gsap.to(light, {
      yPercent: -(100 * speed * 1.5),
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5, // scrubを大きくするほど「ゆっくり追いかけてくる」感じになる
      }
    });
  });
})();

// ============================================================
//  自己PR：スクロール連動カード＋番号カウントアップ
// ============================================================
(function initStrengths() {
  const cards = qsa('.strength-card');
  const numEl = qs('#strengthsNum');
  if (!cards.length || !numEl) return;

  const nums = ['01', '02', '03', '04'];

  cards.forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => {
        // このカードをアクティブに
        cards.forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
        // 番号をフリップ
        gsap.to(numEl, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          onComplete: () => {
            numEl.textContent = nums[i];
            gsap.to(numEl, { opacity: 1, y: 0, duration: 0.3 });
          }
        });
      },
      onEnterBack: () => {
        cards.forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
        gsap.to(numEl, {
          opacity: 0,
          y: 10,
          duration: 0.2,
          onComplete: () => {
            numEl.textContent = nums[i];
            gsap.to(numEl, { opacity: 1, y: 0, duration: 0.3 });
          }
        });
      },
    });
  });

  // 最初のカードを最初からアクティブに
  cards[0]?.classList.add('is-active');
})();

// ============================================================
//  GAMEセクション — ScrollTrigger Pin 水平スクロール
// ============================================================
(function initGameScroll() {
  const wrap = qs('#gameScrollWrap');
  const track = qs('#gameTrack');
  const progress = qs('#gameProgressBar');
  const hint = qs('#gameDragHint');
  if (!wrap || !track) return;

  // トラック全体の横幅 - 画面幅 = スクロールさせる量
  const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 1000);

  // ピン留め＋横スクロール
  gsap.to(track, {
    x: getScrollAmount,
    ease: 'none',
    scrollTrigger: {
      trigger: wrap,
      pin: true,           // このセクションを画面に固定
      scrub: 1.2,          // 縦スクロール量を横移動に変換（大きいほどぬるぬる）
      start: 'top 200px',    // wrapの上端が画面上端に来たら固定開始
      end: () => `+=${track.scrollWidth + 1000}`, // トラック全幅分スクロールしたら解除
      anticipatePin: 1,
      onUpdate: (self) => {
        if (progress) progress.style.width = `${self.progress * 100}%`;
        if (hint && self.progress > 0.02) gsap.to(hint, { opacity: 0, duration: 0.3 });
      },
    }
  });

  // ドラッグは念のため残す（タッチ用）
  let startX = 0;
  wrap.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  // スライドごとの入場アニメーション
  qsa('.game-slide').forEach((slide, i) => {
    gsap.fromTo(slide,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay: i * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wrap,
          start: 'top 85%',
          toggleActions: 'play none none none',
          invalidateOnRefresh: true, // ← これを全部に追加

        }
      }
    );
  });

})();

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});

window.addEventListener('load', () => {
  setTimeout(() => {
    ScrollTrigger.refresh(true);
  }, 300);
});
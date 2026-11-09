/* 사진: images/santiburi/gallery-01.jpg ... 또는 images/waterford/gallery-01.jpg ...
   JPG/JPEG/PNG/WEBP 지원. 첫 번째 사진부터 번호를 연속으로 지정하세요. */
(() => {
  document.querySelectorAll('.golf-carousel').forEach(carousel => {
    const course = carousel.dataset.course;
    const track = carousel.querySelector('.golf-carousel-track');
    const prev = carousel.querySelector('.golf-carousel-prev');
    const next = carousel.querySelector('.golf-carousel-next');
    const count = carousel.querySelector('.golf-carousel-count');
    const empty = carousel.querySelector('.golf-carousel-empty');
    const slides = [];
    let active = 0;
    const update = () => {
      count.textContent = slides.length ? `${active + 1} / ${slides.length}` : '사진 준비 중';
      prev.disabled = !slides.length || active === 0;
      next.disabled = !slides.length || active === slides.length - 1;
      empty.hidden = slides.length > 0;
    };
    const go = index => {
      active = Math.max(0, Math.min(index, slides.length - 1));
      if (slides[active]) track.scrollTo({left: slides[active].offsetLeft - track.offsetLeft, behavior:'smooth'});
      update();
    };
    prev.addEventListener('click', () => go(active - 1));
    next.addEventListener('click', () => go(active + 1));
    track.addEventListener('scroll', () => {
      if (!slides.length) return;
      const left = track.scrollLeft;
      let closest = 0;
      slides.forEach((slide, i) => {
        if (Math.abs(slide.offsetLeft - track.offsetLeft - left) < Math.abs(slides[closest].offsetLeft - track.offsetLeft - left)) closest = i;
      });
      active = closest;
      update();
    }, {passive:true});
    const exts = ['jpg','jpeg','png','webp'];
    const findPhoto = (n, extIndex = 0) => {
      if (n > 20) return;
      if (extIndex >= exts.length) return; // 사진 번호는 01부터 연속
      const filename = `gallery-${String(n).padStart(2,'0')}.${exts[extIndex]}`;
      const img = new Image();
      img.alt = `${course === 'santiburi' ? '싼티부리' : '워터포드'} 사진 ${n}`;
      img.onload = () => {
        const slide = document.createElement('div');
        slide.className = 'golf-carousel-slide';
        slide.appendChild(img);
        track.appendChild(slide);
        slides.push(slide);
        update();
        findPhoto(n + 1);
      };
      img.onerror = () => findPhoto(n, extIndex + 1);
      img.src = `images/${course}/${filename}`;
    };
    update();
    findPhoto(1);
  });
})();

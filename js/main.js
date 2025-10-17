// main.js - common behaviors for MG FinTech
document.addEventListener('DOMContentLoaded', function(){
  // nav toggle for small screens
  document.querySelectorAll('.nav-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const nav = document.querySelector('.nav');
      if(nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
  });

  // set year in footers
  const y = new Date().getFullYear();
  document.querySelectorAll('#year, #year-about, #year-plans, #year-detail, #year-dash, #year-contact').forEach(el=>el && (el.textContent = y));

  // animate features on scroll
  const features = document.querySelectorAll('.feature');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.style.opacity = 1; });
  }, {threshold:0.2});
  features.forEach(f=>io.observe(f));

  // featured amount animate
  const amtEl = document.getElementById('featuredAmount');
  if(amtEl){
    let v = 100000;
    let i=0;
    const steps = [100000,150000,200000];
    setInterval(()=>{ amtEl.textContent = (steps[i%steps.length]).toLocaleString('en-IN'); i++; }, 3000);
  }

});

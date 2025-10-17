// plans.js - enhanced for MG FinTech
const fallbackPlans = [
  {"id":1,"name":"Silver Plan","amount":100000,"members":20,"duration":20,"monthly":5000,"start_date":"2025-01-01","status":"Open","description":"Balanced plan for small groups. Monthly installment fixed.","auction_day":"Every 1st month"},
  {"id":2,"name":"Gold Plan","amount":200000,"members":25,"duration":25,"monthly":8000,"start_date":"2025-02-01","status":"Open","description":"Higher-value plan with more members and longer duration.","auction_day":"Every 1st month"},
  {"id":3,"name":"Starter Plan","amount":50000,"members":10,"duration":10,"monthly":5000,"start_date":"2025-03-01","status":"Open","description":"Short term plan ideal for quick returns.","auction_day":"Every 1st month"},
  {"id":4,"name":"Platinum Plan","amount":500000,"members":50,"duration":50,"monthly":10000,"start_date":"2025-01-15","status":"Open","description":"High-value long term plan for established groups.","auction_day":"Every 15th"},
  {"id":5,"name":"Family Plan","amount":250000,"members":30,"duration":25,"monthly":8333,"start_date":"2025-04-01","status":"Open","description":"Family-focused plan with flexible rules.","auction_day":"Every 1st month"},
  {"id":6,"name":"Micro Plan","amount":20000,"members":5,"duration":5,"monthly":4000,"start_date":"2025-05-01","status":"Closed","description":"Very small group, short tenure.","auction_day":"N/A"},
  {"id":7,"name":"Business Booster","amount":300000,"members":30,"duration":30,"monthly":10000,"start_date":"2025-02-20","status":"Open","description":"Designed for small business capital needs.","auction_day":"Every 20th"},
  {"id":8,"name":"Community Plan","amount":150000,"members":15,"duration":15,"monthly":10000,"start_date":"2025-06-01","status":"Open","description":"Community savings with moderate tenure.","auction_day":"Every 1st month"}
];

function formatINR(x){ return '₹'+Number(x).toLocaleString('en-IN'); }

function renderPlanCard(p){
  const div = document.createElement('div');
  div.className = 'plan-card';
  div.innerHTML = `<h3>${p.name}</h3>
  <div class="plan-meta">${formatINR(p.amount)} • ${p.members} members • ${p.duration} months</div>
  <p style="margin-top:0.5rem;color:#556074">${p.description}</p>
  <div style="display:flex;gap:0.5rem;align-items:center;margin-top:0.5rem;font-size:0.95rem;color:#4b5563">
    <div><strong>Monthly</strong><div>${formatINR(p.monthly)}</div></div>
    <div style="margin-left:8px"><strong>Start</strong><div>${p.start_date}</div></div>
    <div style="margin-left:8px"><strong>Auction</strong><div>${p.auction_day}</div></div>
  </div>
  <div class="plan-actions">
    <a class="btn" href="plan-details.html?id=${p.id}">View Details</a>
    <button class="btn btn-outline" onclick="openJoinModal()">Join Now</button>
  </div>`;
  return div;
}

function populatePlans(plans){
  const grid = document.getElementById('plans-grid');
  const home = document.getElementById('home-plans');
  if(grid) grid.innerHTML='';
  if(home) home.innerHTML='';
  plans.forEach(p=>{
    if(grid) grid.appendChild(renderPlanCard(p));
    if(home){
      const el = document.createElement('div');
      el.className='plan-card';
      el.innerHTML = `<h4 style="margin:0">${p.name}</h4><div style="color:#6b7280">${formatINR(p.amount)} • ${p.duration}m</div>`;
      home.appendChild(el);
    }
  });
  observeCards();
  // fill duration filter
  const sel = document.getElementById('durationFilter');
  if(sel){
    sel.innerHTML = '<option value="">All durations</option>';
    const durations = [...new Set(plans.map(x=>x.duration))].sort((a,b)=>a-b);
    durations.forEach(d=>{
      const o = document.createElement('option'); o.value=d; o.textContent=d+' months';
      sel.appendChild(o);
    });
  }
}

(function loadPlans(){
  fetch('data/plans.json').then(r=>{
    if(!r.ok) throw new Error('no-fetch');
    return r.json();
  }).then(data=>{
    populatePlans(data);
  }).catch(()=>{
    populatePlans(fallbackPlans);
  });
})();

// search & filter using current dataset (fallbackPlans used if fetch not available)
function currentPlans(){
  // prefer fetched data if available in DOM (simple approach)
  return fallbackPlans;
}

document.addEventListener('input', (e)=>{
  if(e.target && e.target.id==='search'){
    const q = e.target.value.toLowerCase();
    const filtered = currentPlans().filter(p=> p.name.toLowerCase().includes(q) || String(p.amount).includes(q));
    populatePlans(filtered);
  }
  if(e.target && e.target.id==='durationFilter'){
    const val = e.target.value;
    const filtered = val ? currentPlans().filter(p=>String(p.duration)===String(val)) : currentPlans();
    populatePlans(filtered);
  }
});

// plan-details page
(function detailPage(){
  const el = document.getElementById('plan-detail');
  if(!el) return;
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id')) || 1;
  const plan = fallbackPlans.find(p=>p.id===id) || fallbackPlans[0];
  el.innerHTML = `<div class="plan-card" style="padding:1.25rem">
    <h2>${plan.name}</h2>
    <p class="plan-meta">${formatINR(plan.amount)} • ${plan.members} members • ${plan.duration} months</p>
    <p style="margin-top:0.5rem;color:#556074">${plan.description}</p>
    <div style="margin-top:0.75rem">
      <strong>Monthly:</strong> ${formatINR(plan.monthly)} &nbsp; | &nbsp; <strong>Start Date:</strong> ${plan.start_date} &nbsp; | &nbsp; <strong>Auction:</strong> ${plan.auction_day}
    </div>
    <div style="margin-top:1rem">
      <button class="btn" onclick="openJoinModal()">Join Plan</button>
      <a class="btn btn-outline" href="plans.html">Back to Plans</a>
    </div>
  </div>

  <h3 style="margin-top:1rem">Members (sample)</h3>
  <table class="table"><thead><tr><th>#</th><th>Name</th><th>Joined</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Ravi</td><td>2025-01-12</td></tr>
    <tr><td>2</td><td>Sita</td><td>2025-02-10</td></tr>
  </tbody></table>`;
})();


// simple intersection observer to animate cards
function observeCards(){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('visible');
      }
    });
  }, {threshold:0.12});
  document.querySelectorAll('.plan-card').forEach(c=>{ obs.observe(c); });
}

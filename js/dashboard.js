// dashboard.js - populate sample history for MG FinTech
(function(){
  const body = document.getElementById('historyBody');
  if(!body) return;
  const samples = [
    {date:'2025-09-01',plan:'Silver Plan',amount:'₹5,000',status:'Paid'},
    {date:'2025-08-01',plan:'Gold Plan',amount:'₹8,000',status:'Paid'},
    {date:'2025-07-01',plan:'Business Booster',amount:'₹10,000',status:'Pending'}
  ];
  body.innerHTML = samples.map(s=>`<tr><td>${s.date}</td><td>${s.plan}</td><td>${s.amount}</td><td>${s.status}</td></tr>`).join('');
})();

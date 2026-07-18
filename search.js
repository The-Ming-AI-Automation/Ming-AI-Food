const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const processingState = document.getElementById('processingState');
const resultsSection = document.getElementById('results');
const resultsGrid = document.getElementById('resultsGrid');
const processingText = document.getElementById('processingText');
const resultsSubtitle = document.getElementById('resultsSubtitle');
const resetSearch = document.getElementById('resetSearch');

const restaurants = [
  {name:'Kumo Ramen House',type:'Japanese · Ramen',score:96,emoji:'🍜',style:'ramen',desc:'Rich broth, handmade noodles and the kind of comfort food worth travelling for.',meta:['RM 20–40','1.8 km','Popular'],creator:'Featured by 8 food creators'},
  {name:'Mori Matcha Studio',type:'Cafe · Matcha',score:94,emoji:'🍵',style:'cafe',desc:'A calm little space for matcha, soft desserts and a slower afternoon.',meta:['RM 15–30','2.4 km','Trending'],creator:'Trending on social'},
  {name:'Ember & Salt',type:'Grill · Contemporary',score:92,emoji:'🥩',style:'grill',desc:'A good option when you want something special without overthinking the evening.',meta:['RM 50–80','3.1 km','Date night'],creator:'Visited by local creators'}
];

function runSearch(query) {
  if (!query.trim()) {
    showToast('Tell Ming what you are craving first ✦');
    searchInput.focus();
    return;
  }

  processingState.classList.add('active');
  resultsSection.classList.remove('active');
  processingState.scrollIntoView({behavior:'smooth', block:'center'});

  const steps = [...document.querySelectorAll('.processing-step')];
  const messages = [
    'Understanding your craving',
    'Checking local places',
    'Looking for food signals',
    'Building your shortlist'
  ];

  steps.forEach(step => {
    step.classList.remove('active','done');
    step.querySelector('span').textContent = '○';
  });

  let index = 0;
  processingText.textContent = messages[0];

  const timer = setInterval(() => {
    if (index > 0) {
      steps[index - 1].classList.remove('active');
      steps[index - 1].classList.add('done');
      steps[index - 1].querySelector('span').textContent = '✓';
    }

    if (index < steps.length) {
      steps[index].classList.add('active');
      processingText.textContent = messages[index];
      index++;
    } else {
      clearInterval(timer);
      setTimeout(() => showResults(query), 450);
    }
  }, 850);
}

function showResults(query) {
  processingState.classList.remove('active');
  resultsSection.classList.add('active');
  resultsSubtitle.textContent = `A few places selected for “${query}”.`;
  resultsGrid.innerHTML = restaurants.map((restaurant, index) => `
    <article class="restaurant-card" style="animation-delay:${index * 120}ms">
      <div class="restaurant-image ${restaurant.style}">
        <span>${restaurant.emoji}</span>
        ${index === 0 ? '<span class="trending-badge">✦ Ming top pick</span>' : ''}
        <button class="save-button" aria-label="Save ${restaurant.name}" data-save="${restaurant.name}">♡</button>
      </div>
      <div class="restaurant-info">
        <div class="restaurant-top">
          <div><h3>${restaurant.name}</h3><span class="restaurant-type">${restaurant.type}</span></div>
          <div class="score">${restaurant.score}<small>MING<br>SCORE</small></div>
        </div>
        <p class="restaurant-description">${restaurant.desc}</p>
        <div class="restaurant-meta">${restaurant.meta.map(item => `<span>${item}</span>`).join('')}</div>
        <div class="restaurant-footer"><span>✦ ${restaurant.creator}</span><button class="view-button" data-view="${restaurant.name}">Explore →</button></div>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('[data-save]').forEach(button => {
    button.addEventListener('click', () => {
      button.textContent = button.textContent === '♡' ? '♥' : '♡';
      showToast(button.textContent === '♥' ? 'Saved to your Try List ♡' : 'Removed from your Try List');
    });
  });

  document.querySelectorAll('[data-view]').forEach(button => {
    button.addEventListener('click', () => showToast(`${button.dataset.view} details are coming in Day 3 →`));
  });

  resultsSection.scrollIntoView({behavior:'smooth', block:'start'});
}

searchButton.addEventListener('click', () => runSearch(searchInput.value));
searchInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') runSearch(searchInput.value);
});

document.querySelectorAll('[data-query]').forEach(button => {
  button.addEventListener('click', () => {
    searchInput.value = button.dataset.query;
    runSearch(button.dataset.query);
  });
});

resetSearch.addEventListener('click', () => {
  resultsSection.classList.remove('active');
  searchInput.value = '';
  searchInput.focus();
  window.scrollTo({top:0, behavior:'smooth'});
});

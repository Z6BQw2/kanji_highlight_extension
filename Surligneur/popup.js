document.addEventListener('DOMContentLoaded', () => {
  const vocabListElem = document.getElementById('vocabList');
  const clearBtn = document.getElementById('clearBtn');

  function loadVocabulary() {
    chrome.storage.local.get({ vocabulaire: [] }, (data) => {
      const vocab = data.vocabulaire;
      vocabListElem.innerHTML = '';
      vocab.forEach((word) => {
        const li = document.createElement('li');
        li.textContent = word;
        vocabListElem.appendChild(li);
      });
    });
  }

  clearBtn.addEventListener('click', () => {
    chrome.storage.local.set({ vocabulaire: [] }, loadVocabulary);
  });

  loadVocabulary();
});

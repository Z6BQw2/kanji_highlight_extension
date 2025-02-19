chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "ajouterVocabulaire",
    title: "Ajouter au vocabulaire",
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: "supprimerVocabulaire",
    title: "Supprimer du vocabulaire",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const selectedText = info.selectionText.trim();
  if (!selectedText) return;

  if (info.menuItemId === "ajouterVocabulaire") {
    chrome.storage.local.get({ vocabulaire: [] }, (data) => {
      let vocab = data.vocabulaire;
      if (!vocab.includes(selectedText)) {
        vocab.push(selectedText);
        chrome.storage.local.set({ vocabulaire: vocab }, () => {
          // Met à jour le surlignage sur l'onglet courant
          chrome.tabs.sendMessage(tab.id, { action: "updateHighlight" });
        });
      }
    });
  } else if (info.menuItemId === "supprimerVocabulaire") {
    chrome.storage.local.get({ vocabulaire: [] }, (data) => {
      let vocab = data.vocabulaire;
      const index = vocab.indexOf(selectedText);
      if (index !== -1) {
        vocab.splice(index, 1);
        chrome.storage.local.set({ vocabulaire: vocab }, () => {
          // Met à jour le surlignage sur l'onglet courant
          chrome.tabs.sendMessage(tab.id, { action: "updateHighlight" });
        });
      }
    });
  }
});


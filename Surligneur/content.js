// Fonction pour échapper les caractères spéciaux dans une chaîne pour l'utiliser dans une expression régulière
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightVocabulary() {
  chrome.storage.local.get({ vocabulaire: [] }, (data) => {
    const vocabularyList = data.vocabulaire;
    if (vocabularyList.length === 0) return;

    // Construire une expression régulière qui capture tous les mots/expressions enregistrés
    const regex = new RegExp('(' + vocabularyList.map(escapeRegExp).join('|') + ')', 'gi');

    // Utiliser un TreeWalker pour parcourir les nœuds de texte
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (node.parentNode && ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentNode.nodeName))
            return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodes = [];
    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach((node) => {
      const parent = node.parentNode;
      // Remplacer les occurrences par un span surligné
      const replacedText = node.nodeValue.replace(regex, '<span class="highlighted">$1</span>');
      if (replacedText !== node.nodeValue) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = replacedText;
        while (tempDiv.firstChild) {
          parent.insertBefore(tempDiv.firstChild, node);
        }
        parent.removeChild(node);
      }
    });
  });
}

// Lancer le surlignage au chargement de la page
highlightVocabulary();

// Écouter le message pour actualiser le surlignage
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateHighlight") {
    highlightVocabulary();
  }
});

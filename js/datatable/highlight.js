// Handles live search text node highlight highlighting

export function removeHighlights(container) {
  if (!container) return;
  const marks = container.querySelectorAll('mark.dt-highlight');
  marks.forEach((mark) => {
    const parent = mark.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    }
  });
}

export function applyHighlights(container, query, colIdx = 'all') {
  if (!container) return;
  removeHighlights(container);

  if (!query || !query.trim()) return;

  const tokens = query
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (tokens.length === 0) return;

  const regex = new RegExp(`(${tokens.join('|')})`, 'gi');

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      if (text && regex.test(text)) {
        regex.lastIndex = 0;
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
          const matchIndex = match.index;
          if (matchIndex > lastIndex) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchIndex)));
          }

          const mark = document.createElement('mark');
          mark.className = 'dt-highlight';
          mark.textContent = match[0];
          fragment.appendChild(mark);

          lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        }

        if (node.parentNode) {
          node.parentNode.replaceChild(fragment, node);
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'BUTTON' || node.classList.contains('row-actions')) {
        return;
      }
      Array.from(node.childNodes).forEach(walk);
    }
  }

  const tbody = container.querySelector('tbody') || container;

  if (colIdx !== 'all' && colIdx !== undefined && colIdx !== null && !isNaN(Number(colIdx))) {
    const targetIdx = Number(colIdx);
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((tr) => {
      const cells = tr.querySelectorAll('th, td');
      if (cells[targetIdx]) {
        walk(cells[targetIdx]);
      }
    });
  } else {
    walk(tbody);
  }
}

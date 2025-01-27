export class ScriptRenderer {
  render(scripts) {
    const container = document.getElementById('scriptsList');
    if (!container) return;

    container.innerHTML = scripts.map(script => {
      try {
        return this.createScriptCard(script);
      } catch (error) {
        console.error('Error rendering script card:', error);
        return '';
      }
    }).join('');
    
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }

  createScriptCard(script) {
    if (!script) return '';

    const date = script.updatedAt ? new Date(script.updatedAt).toLocaleDateString() : 'Неизвестная дата';
    const [mainCategory, subcategory] = (script.category || 'networks:mikrotik').split(':');
    
    return `
      <div class="script-card" data-id="${script.id || ''}">
        <div class="script-header">
          <h3 class="script-title">${this.escapeHtml(script.title || 'Без названия')}</h3>
          <div class="script-actions">
            <button data-action="copy">Копировать</button>
            <button data-action="edit">Изменить</button>
            <button data-action="delete">Удалить</button>
          </div>
        </div>
        
        <div class="script-metadata">
          <span class="script-category">${this.getCategoryLabel(mainCategory)} / ${this.getSubcategoryLabel(subcategory)}</span>
          ${script.target ? `<span class="script-target">Цель: ${this.escapeHtml(script.target)}</span>` : ''}
        </div>
        
        <p class="script-description">${this.escapeHtml(script.description || 'Без описания')}</p>
        
        <pre><code class="${subcategory}">${this.escapeHtml(script.content || '')}</code></pre>
        
        <div class="script-tags">
          ${(script.tags || []).map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
        </div>
        
        <small>Обновлено: ${date}</small>
      </div>
    `;
  }

  getCategoryLabel(category) {
    const labels = {
      'networks': 'Сети',
      'servers': 'Серверы', 
      'devices': 'Устройства'
    };
    return labels[category] || category;
  }

  getSubcategoryLabel(subcategory) {
    const labels = {
      // Networks
      'mikrotik': 'MikroTik',
      'vpn': 'VPN',
      
      // Servers
      'linux': 'Linux',
      'docker': 'Docker',
      
      // Devices
      'routers': 'Роутеры',
      'switches': 'Коммутаторы'
    };
    return labels[subcategory] || subcategory;
  }

  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
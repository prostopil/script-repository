export class Modal {
  constructor() {
    const modal = document.getElementById('scriptModal');
    if (!modal) return;

    this.modal = modal;
    this.form = document.getElementById('scriptForm');
    this.editingId = null;

    // Close button
    const closeBtn = this.modal.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.close();
      });
    }

    // Click outside modal
    window.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Version history button
    const showVersionsBtn = document.getElementById('showVersions');
    if (showVersionsBtn) {
      showVersionsBtn.addEventListener('click', () => {
        this.toggleVersionHistory();
      });
    }
  }

  open(script = null) {
    const elements = {
      title: document.getElementById('scriptTitle'),
      category: document.getElementById('scriptCategory'),
      description: document.getElementById('scriptDescription'),
      content: document.getElementById('scriptContent'),
      tags: document.getElementById('scriptTags'),
      target: document.getElementById('scriptTarget'),
      versionComment: document.getElementById('versionComment'),
      modalTitle: document.getElementById('modalTitle'),
      versionHistoryContainer: document.getElementById('versionHistory'),
      versionsList: document.getElementById('versionsList')
    };

    // Validate all elements exist
    const missingElements = Object.entries(elements)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingElements.length > 0) {
      console.error('Missing modal elements:', missingElements);
      return;
    }

    this.editingId = script?.id || null;
    elements.modalTitle.textContent = script ? 'Редактировать скрипт' : 'Добавить скрипт';
    
    // Fill form if editing
    elements.title.value = script?.title || '';
    elements.category.value = script?.category || 'networks:mikrotik';
    elements.description.value = script?.description || '';
    elements.content.value = script?.content || '';
    elements.tags.value = script?.tags ? script.tags.join(', ') : '';
    elements.target.value = script?.target || '';
    elements.versionComment.value = '';
    
    // Show/hide version history
    if (script && script.versions) {
      this.renderVersionHistory(script.versions);
      elements.versionHistoryContainer.style.display = 'block';
    } else {
      elements.versionHistoryContainer.style.display = 'none';
    }
    
    this.modal.style.display = 'block';
  }

  close() {
    this.modal.style.display = 'none';
    this.form.reset();
    this.editingId = null;
  }

  renderVersionHistory(versions) {
    const container = document.getElementById('versionsList');
    container.innerHTML = versions.map(version => `
      <div class="version-item">
        <div class="version-header">
          <span>Version ${version.version}</span>
          <span>${new Date(version.timestamp).toLocaleString()}</span>
        </div>
        <div class="version-comment">${version.comment}</div>
        <button class="version-restore" data-version="${version.version}">
          Восстановить версию
        </button>
      </div>
    `).join('');
  }

  toggleVersionHistory() {
    const container = document.getElementById('versionHistory');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  }
}
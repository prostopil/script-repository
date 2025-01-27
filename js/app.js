import { ScriptStore } from './store.js';
import { ScriptRenderer } from './renderer.js';
import { Modal } from './modal.js';

class App {
  constructor() {
    try {
      this.store = new ScriptStore();
      this.renderer = new ScriptRenderer();
      this.modal = new Modal();
      
      this.currentCategory = 'all';
      this.currentSubcategory = null;
      this.searchQuery = '';
      
      this.init();
    } catch (error) {
      console.error('App initialization error:', error);
    }
  }

  init() {
    try {
      this.bindEventListeners();
      this.renderScripts();
      this.renderServers();
      this.updateStats();
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  bindEventListeners() {
    try {
      const addNewBtn = document.getElementById('addNewBtn');
      if (addNewBtn) {
        addNewBtn.addEventListener('click', () => {
          if (this.modal) {
            this.modal.open();
          } else {
            console.error('Modal is not initialized');
          }
        });
      }

      const categoriesContainer = document.querySelector('.categories-tabs');
      if (categoriesContainer) {
        categoriesContainer.addEventListener('click', (e) => {
          if (e.target.classList.contains('category-tab')) {
            this.handleCategoryChange(e.target);
          }
        });
      }

      const subcategoriesContainer = document.querySelector('.subcategories');
      if (subcategoriesContainer) {
        subcategoriesContainer.addEventListener('click', (e) => {
          if (e.target.classList.contains('subcategory-btn')) {
            this.handleSubcategoryChange(e.target);
          }
        });
      }

      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.handleSearch(e.target.value);
        });
      }

      const scriptForm = document.getElementById('scriptForm');
      if (scriptForm) {
        scriptForm.addEventListener('submit', (e) => {
          this.handleScriptSubmit(e);
        });
      }

      const scriptsList = document.getElementById('scriptsList');
      if (scriptsList) {
        scriptsList.addEventListener('click', (e) => {
          const action = e.target.dataset.action;
          const scriptId = e.target.closest('.script-card')?.dataset.id;
          
          if (action && scriptId) {
            this.handleScriptAction(action, scriptId);
          }
        });
      }

      const versionsList = document.getElementById('versionsList');
      if (versionsList) {
        versionsList.addEventListener('click', (e) => {
          if (e.target.classList.contains('version-restore')) {
            const version = parseInt(e.target.dataset.version);
            this.handleVersionRestore(version);
          }
        });
      }

      const addServerBtn = document.getElementById('addServer');
      if (addServerBtn) {
        addServerBtn.addEventListener('click', () => {
          const url = document.getElementById('serverUrl').value;
          const username = document.getElementById('serverUsername').value;
          const password = document.getElementById('serverPassword').value;
          
          if (url && username && password) {
            if (this.store) {
              this.store.addServer({ url, username, password });
              this.renderServers();
              ['serverUrl', 'serverUsername', 'serverPassword'].forEach(id => {
                document.getElementById(id).value = '';
              });
            } else {
              console.error('Store is not initialized');
            }
          }
        });
      }

      const serverList = document.getElementById('serverList');
      if (serverList) {
        serverList.addEventListener('click', (e) => {
          if (e.target.classList.contains('delete-server')) {
            const serverId = e.target.dataset.id;
            if (this.store) {
              this.store.removeServer(serverId);
              this.renderServers();
            } else {
              console.error('Store is not initialized');
            }
          }
        });
      }
    } catch (error) {
      console.error('Event listener binding error:', error);
    }
  }

  handleCategoryFilter(button) {
    try {
      const category = button.dataset.category;
      document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn === button);
      });
      this.currentCategory = category;
      this.renderScripts();
    } catch (error) {
      console.error('Category filter error:', error);
    }
  }

  handleCategoryChange(button) {
    try {
      document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.toggle('active', tab === button);
      });

      const category = button.dataset.category;
      this.currentCategory = category;
      this.currentSubcategory = null;

      document.querySelectorAll('.subcategory-group').forEach(group => {
        group.style.display = group.dataset.category === category || category === 'all' ? 'flex' : 'none';
      });

      document.querySelectorAll('.subcategory-btn').forEach(btn => {
        btn.classList.remove('active');
      });

      this.renderScripts();
    } catch (error) {
      console.error('Category change error:', error);
    }
  }

  handleSubcategoryChange(button) {
    try {
      document.querySelectorAll('.subcategory-btn').forEach(btn => {
        btn.classList.toggle('active', btn === button);
      });

      this.currentSubcategory = button.dataset.subcategory;
      this.renderScripts();
    } catch (error) {
      console.error('Subcategory change error:', error);
    }
  }

  handleSearch(query) {
    try {
      this.searchQuery = query.toLowerCase();
      this.renderScripts();
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  handleScriptSubmit(e) {
    try {
      e.preventDefault();
      
      const formData = {
        title: document.getElementById('scriptTitle').value,
        category: document.getElementById('scriptCategory').value,
        description: document.getElementById('scriptDescription').value,
        content: document.getElementById('scriptContent').value,
        tags: document.getElementById('scriptTags').value.split(',').map(tag => tag.trim()),
        target: document.getElementById('scriptTarget').value,
      };

      if (this.modal && this.modal.editingId) {
        if (this.store) {
          this.store.updateScript(this.modal.editingId, formData);
        } else {
          console.error('Store is not initialized');
        }
      } else if (this.store) {
        this.store.addScript(formData);
      } else {
        console.error('Store is not initialized');
      }

      if (this.modal) {
        this.modal.close();
      } else {
        console.error('Modal is not initialized');
      }
      this.renderScripts();
    } catch (error) {
      console.error('Script submit error:', error);
    }
  }

  handleScriptAction(action, scriptId) {
    try {
      switch (action) {
        case 'edit':
          if (this.store) {
            const script = this.store.getScript(scriptId);
            if (this.modal) {
              this.modal.open(script);
            } else {
              console.error('Modal is not initialized');
            }
          } else {
            console.error('Store is not initialized');
          }
          break;
        case 'delete':
          if (confirm('Вы уверены, что хотите удалить этот скрипт?')) {
            if (this.store) {
              this.store.deleteScript(scriptId);
              this.renderScripts();
            } else {
              console.error('Store is not initialized');
            }
          }
          break;
        case 'copy':
          if (this.store) {
            const content = this.store.getScript(scriptId).content;
            navigator.clipboard.writeText(content)
              .then(() => alert('Скрипт скопирован в буфер обмена!'))
              .catch(err => console.error('Ошибка копирования:', err));
          } else {
            console.error('Store is not initialized');
          }
          break;
      }
    } catch (error) {
      console.error('Script action error:', error);
    }
  }

  handleVersionRestore(version) {
    try {
      if (this.modal && this.modal.editingId) {
        if (this.store) {
          const versionData = this.store.getScriptVersion(this.modal.editingId, version);
          if (versionData) {
            document.getElementById('scriptContent').value = versionData.content;
            document.getElementById('versionComment').value = `Restored from version ${version}`;
          }
        } else {
          console.error('Store is not initialized');
        }
      }
    } catch (error) {
      console.error('Version restore error:', error);
    }
  }

  renderEmptyState() {
    try {
      return `
        <div class="empty-state">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
          </svg>
          <h3>Нет скриптов</h3>
          <p>Добавьте свой первый скрипт, нажав кнопку "Добавить скрипт"</p>
        </div>
      `;
    } catch (error) {
      console.error('Empty state rendering error:', error);
      return '';
    }
  }

  renderScripts() {
    try {
      const scripts = this.store ? this.store.getScripts() : [];
      const filtered = scripts.filter(script => {
        const matchesCategory = this.currentCategory === 'all' || 
          script.category.startsWith(this.currentCategory);
        
        const matchesSubcategory = !this.currentSubcategory || 
          script.category === `${this.currentCategory}:${this.currentSubcategory}`;
        
        const matchesSearch = !this.searchQuery || 
          script.title.toLowerCase().includes(this.searchQuery) ||
          script.description.toLowerCase().includes(this.searchQuery) ||
          script.tags.some(tag => tag.toLowerCase().includes(this.searchQuery));
        
        return matchesCategory && matchesSubcategory && matchesSearch;
      });
      
      const container = document.getElementById('scriptsList');
      if (filtered.length === 0) {
        container.innerHTML = this.renderEmptyState();
      } else {
        if (this.renderer) {
          this.renderer.render(filtered);
        } else {
          console.error('Renderer is not initialized');
        }
      }
      
      this.updateStats(filtered);
    } catch (error) {
      console.error('Scripts rendering error:', error);
    }
  }

  updateStats(scripts = []) {
    try {
      const statsContainer = document.getElementById('scriptStats');
      if (statsContainer) {
        const categoryStats = {};
        scripts.forEach(script => {
          const [mainCategory] = script.category.split(':');
          categoryStats[mainCategory] = (categoryStats[mainCategory] || 0) + 1;
        });

        statsContainer.innerHTML = Object.entries(categoryStats).map(([category, count]) => `
          <div class="stat-item">
            <div class="stat-value">${count}</div>
            <div class="stat-label">${this.getCategoryLabel(category)}</div>
          </div>
        `).join('');
      }
    } catch (error) {
      console.error('Stats updating error:', error);
    }
  }

  getCategoryLabel(category) {
    try {
      const labels = {
        'networks': 'Сети',
        'servers': 'Серверы', 
        'devices': 'Устройства'
      };
      return labels[category] || category;
    } catch (error) {
      console.error('Category label error:', error);
      return '';
    }
  }

  renderServers() {
    try {
      const container = document.getElementById('serverList');
      const servers = this.store ? this.store.servers : [];
      
      container.innerHTML = servers.map(server => `
        <div class="server-item">
          <div>
            <div>${server.url}</div>
            <small>User: ${server.username}</small>
          </div>
          <div>
            <button class="delete-server" data-id="${server.id}">Удалить</button>
          </div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Servers rendering error:', error);
    }
  }
}

try {
  new App();
} catch (error) {
  console.error('Global App Error:', error);
}
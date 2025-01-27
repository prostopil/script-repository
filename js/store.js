export class ScriptStore {
  constructor() {
    // Add fallback for empty storage
    try {
      this.scripts = JSON.parse(localStorage.getItem('scripts')) || [];
      this.servers = JSON.parse(localStorage.getItem('servers')) || [];
    } catch (error) {
      console.error('Error parsing localStorage:', error);
      this.scripts = [];
      this.servers = [];
    }
  }

  saveToStorage() {
    localStorage.setItem('scripts', JSON.stringify(this.scripts));
    localStorage.setItem('servers', JSON.stringify(this.servers));
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  addScript(scriptData) {
    const script = {
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      versions: [{
        version: 1,
        content: scriptData.content,
        timestamp: new Date().toISOString(),
        comment: scriptData.versionComment || 'Initial version'
      }],
      ...scriptData
    };
    
    this.scripts.push(script);
    this.saveToStorage();
    return script;
  }

  updateScript(id, scriptData) {
    const index = this.scripts.findIndex(s => s.id === id);
    if (index !== -1) {
      const currentScript = this.scripts[index];
      const newVersion = (currentScript.version || 1) + 1;
      
      const versionEntry = {
        version: newVersion,
        content: scriptData.content,
        timestamp: new Date().toISOString(),
        comment: scriptData.versionComment || `Version ${newVersion}`
      };

      this.scripts[index] = {
        ...currentScript,
        ...scriptData,
        version: newVersion,
        versions: [...(currentScript.versions || []), versionEntry],
        updatedAt: new Date().toISOString()
      };

      this.saveToStorage();
    }
  }

  deleteScript(id) {
    this.scripts = this.scripts.filter(s => s.id !== id);
    this.saveToStorage();
  }

  getScript(id) {
    return this.scripts.find(s => s.id === id);
  }

  getScriptVersion(id, version) {
    const script = this.getScript(id);
    if (script && script.versions) {
      return script.versions.find(v => v.version === version);
    }
    return null;
  }

  getScripts() {
    return [...this.scripts].sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }

  addServer(serverData) {
    const server = {
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      ...serverData
    };
    
    this.servers.push(server);
    this.saveToStorage();
    return server;
  }

  removeServer(id) {
    this.servers = this.servers.filter(s => s.id !== id);
    this.saveToStorage();
  }
}
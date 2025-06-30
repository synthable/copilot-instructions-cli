export class LayerComposer {
  constructor() {
    this.mergeStrategies = {
      replace: (base, layer) => layer,
      append: (base, layer) => [...base, ...layer],
      prepend: (base, layer) => [...layer, ...base],
      merge: (base, layer) => this.deepMerge(base, layer)
    };
  }

  async compose(base, layerNames) {
    let result = { ...base };
    
    for (const layerName of layerNames) {
      const layer = await this.loadLayer(layerName);
      result = this.applyLayer(result, layer);
    }
    
    return result;
  }

  applyLayer(base, layer) {
    const strategy = layer.strategy || 'merge';
    const mergeFn = this.mergeStrategies[strategy];
    
    if (!mergeFn) {
      throw new Error(`Unknown merge strategy: ${strategy}`);
    }
    
    return {
      ...base,
      instructions: mergeFn(base.instructions || [], layer.instructions || []),
      metadata: {
        ...base.metadata,
        layers: [...(base.metadata.layers || []), layer.name]
      }
    };
  }

  deepMerge(base, layer) {
    if (Array.isArray(base) && Array.isArray(layer)) {
      return [...base, ...layer];
    }
    
    if (typeof base === 'object' && typeof layer === 'object') {
      const result = { ...base };
      
      for (const key in layer) {
        if (key in base) {
          result[key] = this.deepMerge(base[key], layer[key]);
        } else {
          result[key] = layer[key];
        }
      }
      
      return result;
    }
    
    return layer;
  }

  async loadLayer(name) {
    // Delegate to template manager or implement specific layer loading
    const templateManager = new (await import('./template-manager.js')).TemplateManager();
    return templateManager.load(name);
  }
}
import { Plugin, PluginManifest } from "../types/index.js";
import fs from "fs";
import path from "path";

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();

  async loadPlugin(plugin: Plugin): Promise<void> {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} is already loaded`);
    }

    try {
      await plugin.register(null as never);
      this.plugins.set(plugin.name, plugin);
    } catch (error) {
      console.error(`Failed to load plugin ${plugin.name}:`, error);
      throw error;
    }
  }

  async loadPluginsFromDirectory(pluginsDir: string): Promise<void> {
    if (!fs.existsSync(pluginsDir)) {
      return;
    }

    const entries = fs.readdirSync(pluginsDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) {continue;}

      const manifestPath = path.join(pluginsDir, entry.name, "package.json");
      if (!fs.existsSync(manifestPath)) {continue;}

      try {
        const manifest: PluginManifest = JSON.parse(
          fs.readFileSync(manifestPath, "utf-8")
        );
        const pluginPath = path.join(pluginsDir, entry.name, manifest.main);
        const plugin = (await import(pluginPath))?.default as Plugin | undefined;

        if (plugin) {
          await this.loadPlugin(plugin);
        }
      } catch (error) {
        console.error(`Failed to load plugin from ${entry.name}:`, error);
      }
    }
  }

  async unloadPlugin(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) {return;}

    try {
      await plugin.unregister(null as never);
      this.plugins.delete(name);
    } catch (error) {
      console.error(`Failed to unload plugin ${name}:`, error);
    }
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  hasPlugin(name: string): boolean {
    return this.plugins.has(name);
  }

  clear(): void {
    for (const name of this.plugins.keys()) {
      this.unloadPlugin(name);
    }
  }
}
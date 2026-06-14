const TWEAK_ID = "io.github.consolexp.official-windows-computer-use";
const LEGACY_TWEAK_IDS = ["com.local.official-windows-computer-use"];
const MARKETPLACE_NAME = "openai-bundled";
const PLUGIN_NAME = "computer-use";
const PLUGIN_SECTION = 'plugins."computer-use@openai-bundled"';
const MARKETPLACE_SECTION = `marketplaces.${MARKETPLACE_NAME}`;
const DESKTOP_MESSAGE_CHANNEL = "codex_desktop:message-from-view";
const STARTUP_REPAIR_DELAYS_MS = [0, 1500, 6000, 15000, 30000, 60000];
const FEATURE_NUDGE_DELAYS_MS = [1000, 4000, 12000, 30000, 60000];
const PREFERRED_APP_PATHS = [];

const TEXT = {
  en: {
    pageTitle: "Official Windows Computer Use",
    pageDescription: "Repairs and enables Codex's official bundled Windows Computer Use plugin.",
    checking: "Checking setup status...",
    refresh: "Refresh",
    refreshing: "Refreshing...",
    repair: "Repair",
    working: "Working...",
    ready: "Ready",
    check: "Check",
    fix: "Fix",
    unableToReadStatus: (message) => `Unable to read setup status: ${message}`,
    repairFailed: (message) => `Repair failed: ${message}`,
    summaryReady: "Official Windows Computer Use looks ready. Restart Codex if it is already open.",
    summaryNeedsRepair: "Official Windows Computer Use still needs repair.",
    checkOfficialBundle: "Official bundle",
    checkRuntimeMarketplace: "Runtime marketplace",
    checkPluginCache: "Plugin cache",
    checkPluginEnabled: "Plugin enabled",
    checkMarketplaceSource: "Marketplace source",
    missingBundle: "Bundled computer-use plugin not found",
    missingRuntimeMarketplace: "Runtime openai-bundled marketplace is missing the official computer-use plugin or listing.",
    missingPluginCache: "Official computer-use plugin cache is missing the versioned copy or latest junction.",
    pluginConfigMissing: `[${PLUGIN_SECTION}] enabled = true is missing`,
    marketplaceShouldPoint: (path) => `${MARKETPLACE_SECTION} should point to ${path}`,
    missingPlugin: "Official bundled Computer Use plugin was not found.",
    missingPluginInstalled: "Official bundled Computer Use plugin was not found in the installed Codex app.",
    reinstallCodex: "Update or reinstall Codex Desktop so the bundled openai-bundled/computer-use plugin exists.",
    repairComplete: "Repair complete. Fully quit and reopen Codex before testing.",
    repairedRuntimeMarketplace: "Repaired runtime openai-bundled marketplace with the official computer-use plugin.",
    enabledConfig: `Enabled [${PLUGIN_SECTION}] in config.toml.`,
    updatedMarketplace: `Updated [${MARKETPLACE_SECTION}] to point at the runtime bundled marketplace.`,
    cacheInstalled: (version) => `Installed official computer-use plugin cache v${version}.`,
    latestJunctionFailed: (message) => `Unable to refresh latest plugin cache junction: ${message}`,
  },
  zh: {
    pageTitle: "官方 Windows Computer Use",
    pageDescription: "修复并启用 Codex 官方内置的 Windows Computer Use 插件。",
    checking: "正在检查设置状态...",
    refresh: "刷新",
    refreshing: "正在刷新...",
    repair: "修复",
    working: "处理中...",
    ready: "就绪",
    check: "检查",
    fix: "修复",
    unableToReadStatus: (message) => `无法读取设置状态：${message}`,
    repairFailed: (message) => `修复失败：${message}`,
    summaryReady: "官方 Windows Computer Use 已准备就绪。如果 Codex 已打开，请重启后使用。",
    summaryNeedsRepair: "官方 Windows Computer Use 仍需要修复。",
    checkOfficialBundle: "官方内置包",
    checkRuntimeMarketplace: "运行时 marketplace",
    checkPluginCache: "插件缓存",
    checkPluginEnabled: "插件已启用",
    checkMarketplaceSource: "Marketplace 来源",
    missingBundle: "未找到内置 computer-use 插件",
    missingRuntimeMarketplace: "运行时 openai-bundled marketplace 缺少官方 computer-use 插件或列表项。",
    missingPluginCache: "官方 computer-use 插件缓存缺少版本副本或 latest junction。",
    pluginConfigMissing: `[${PLUGIN_SECTION}] enabled = true 缺失`,
    marketplaceShouldPoint: (path) => `${MARKETPLACE_SECTION} 应指向 ${path}`,
    missingPlugin: "未找到官方内置 Computer Use 插件。",
    missingPluginInstalled: "已安装的 Codex 应用中未找到官方内置 Computer Use 插件。",
    reinstallCodex: "请更新或重新安装 Codex Desktop，以包含内置的 openai-bundled/computer-use 插件。",
    repairComplete: "修复完成。请完全退出并重新打开 Codex 后再测试。",
    repairedRuntimeMarketplace: "已修复运行时 openai-bundled marketplace，并加入官方 computer-use 插件。",
    enabledConfig: `已在 config.toml 中启用 [${PLUGIN_SECTION}]。`,
    updatedMarketplace: `已更新 [${MARKETPLACE_SECTION}]，指向运行时内置 marketplace。`,
    cacheInstalled: (version) => `已安装官方 computer-use 插件缓存 v${version}。`,
    latestJunctionFailed: (message) => `无法刷新 latest 插件缓存 junction：${message}`,
  },
};

function currentLanguage() {
  const candidates = [
    publicLanguageFromGlobals(),
    globalThis.__codexppLanguage,
    globalThis.__codexppLocale,
    documentLanguageFromHtml(),
    uiLanguageFromDocument(),
    browserLanguageFromNavigator(),
  ];
  for (const candidate of candidates) {
    const language = normalizeLanguageCandidate(candidate);
    if (language) return language;
  }
  return "zh";
}

function normalizeLanguageCandidate(candidate) {
  const value = String(candidate || "").trim().toLowerCase();
  if (!value || value === "auto" || value === "system" || value === "default") return null;
  if (value.startsWith("zh")) return "zh";
  if (value.startsWith("en")) return "en";
  return null;
}

function uiLanguageFromDocument() {
  if (typeof document === "undefined") return null;
  const text = [
    document.documentElement?.lang,
    document.body?.innerText,
    document.body?.textContent,
  ].filter(Boolean).join("\n");
  return /[\u4e00-\u9fff]/.test(text) ? "zh" : null;
}

function documentLanguageFromHtml() {
  if (typeof document === "undefined") return null;
  const value = String(document.documentElement?.lang || "").trim().toLowerCase();
  return value.startsWith("zh") ? "zh" : null;
}

function browserLanguageFromNavigator() {
  if (typeof navigator === "undefined") return null;
  const value = String(navigator.language || "").trim().toLowerCase();
  return value.startsWith("zh") ? "zh" : null;
}

function publicLanguageFromGlobals() {
  const globalCandidates = [
    globalThis.__codexppPublicSettings,
    globalThis.__codexppSettings,
    globalThis.__codex?.settings,
  ];
  for (const candidate of globalCandidates) {
    const value = candidate?.localeOverride ?? candidate?.values?.localeOverride;
    if (typeof value === "string" && value.trim()) return value;
  }
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key || !/codex|setting|locale|language/i.test(key)) continue;
      const raw = window.localStorage.getItem(key);
      if (!raw || !raw.includes("localeOverride")) continue;
      const value = findLocaleOverride(JSON.parse(raw));
      if (value) return value;
    }
  } catch {}
  return null;
}

function findLocaleOverride(value) {
  if (!value || typeof value !== "object") return null;
  if (typeof value.localeOverride === "string") return value.localeOverride;
  if (typeof value.values?.localeOverride === "string") return value.values.localeOverride;
  for (const child of Object.values(value)) {
    const result = findLocaleOverride(child);
    if (result) return result;
  }
  return null;
}

function t(key, ...args) {
  const entry = TEXT[currentLanguage()][key] ?? TEXT.en[key] ?? key;
  return typeof entry === "function" ? entry(...args) : entry;
}

module.exports = {
  start(api) {
    if (api.process === "main") {
      this._mainTeardown = startMain(api);
      return;
    }

    this._rendererTeardown = startRenderer(api);
    if (api.settings?.registerPage) {
      this._settingsHandle = api.settings.registerPage({
        id: "official-windows-computer-use",
        title: t("pageTitle"),
        iconSvg: settingsIconSvg(),
        render(root) {
          renderSettings(root, api);
        },
      });
      return;
    }

    if (api.settings?.register) {
      this._settingsHandle = api.settings.register({
        id: "official-windows-computer-use",
        title: t("pageTitle"),
        description: t("pageDescription"),
        render(root) {
          renderSettings(root, api);
        },
      });
    }
  },

  stop() {
    this._settingsHandle?.unregister?.();
    this._settingsHandle = null;
    this._rendererTeardown?.();
    this._rendererTeardown = null;
    this._mainTeardown?.();
    this._mainTeardown = null;
  },
};

function settingsIconSvg() {
  return [
    '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
    '<path d="M4.167 5.833A1.667 1.667 0 0 1 5.833 4.167h8.334a1.667 1.667 0 0 1 1.666 1.666v6.25a1.667 1.667 0 0 1-1.666 1.667H10.5l-2.917 2.083v-2.083H5.833a1.667 1.667 0 0 1-1.666-1.667v-6.25Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    '<path d="M7.5 7.917h5M7.5 10.417h3.333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    '</svg>',
  ].join("");
}

function startMain(api) {
  const { ipcMain } = require("electron");
  const timers = scheduleStartupRepair(api);
  const channels = [
    ["setup-status", () => getSetupStatus()],
    ["repair-setup", () => repairSetup(api)],
    ["native-feature-nudge", (_payload, event) => nudgeNativeComputerUseFeatureFromMain(api, event)],
  ];

  for (const [name, handler] of channels) {
    for (const tweakId of [TWEAK_ID, ...LEGACY_TWEAK_IDS]) {
      ipcMain.removeHandler(`codexpp:${tweakId}:${name}`);
    }
    const channel = `codexpp:${TWEAK_ID}:${name}`;
    ipcMain.handle(channel, async (event, payload = {}) => handler(payload, event));
  }

  api.log.info("Official Windows Computer Use tweak loaded.");

  return () => {
    for (const timer of timers) clearTimeout(timer);
    for (const [name] of channels) {
      for (const tweakId of [TWEAK_ID, ...LEGACY_TWEAK_IDS]) {
        ipcMain.removeHandler(`codexpp:${tweakId}:${name}`);
      }
    }
  };
}

function startRenderer(api) {
  const timers = FEATURE_NUDGE_DELAYS_MS.map((delay) => setTimeout(() => {
    void nudgeNativeComputerUseFeature(api, delay);
  }, delay));

  return () => {
    for (const timer of timers) clearTimeout(timer);
  };
}

async function nudgeNativeComputerUseFeature(api, delay) {
  try {
    const result = await api.ipc.invoke("native-feature-nudge");
    if (result?.ok) {
      api.log.debug(`Requested native Computer Use availability after ${delay}ms.`);
    } else {
      api.log.debug(`Computer Use availability nudge skipped after ${delay}ms: ${result?.reason || "unknown"}`);
    }
  } catch (error) {
    api.log.debug("Computer Use availability nudge failed:", error);
  }
}

async function nudgeNativeComputerUseFeatureFromMain(api, event) {
  try {
    const { ipcMain } = require("electron");
    const nativeHandler = ipcMain._invokeHandlers?.get?.(DESKTOP_MESSAGE_CHANNEL);
    if (typeof nativeHandler !== "function") {
      return { ok: false, reason: "native desktop message handler unavailable" };
    }

    await nativeHandler(event, {
      type: "electron-desktop-features-changed",
      computerUse: true,
      computerUseNodeRepl: true,
    });
    api.log.debug("Forwarded native Computer Use availability.");
    return { ok: true };
  } catch (error) {
    api.log.debug("Forwarding native Computer Use availability failed:", error);
    return { ok: false, reason: error?.message || String(error) };
  }
}

function scheduleStartupRepair(api) {
  return STARTUP_REPAIR_DELAYS_MS.map((delay) => setTimeout(() => {
    try {
      const result = repairExistingSetup(api);
      if (result.changed) {
        api.log.info(`Official Windows Computer Use repair applied after ${delay}ms: ${result.messages.join(" | ")}`);
      }
    } catch (error) {
      api.log.warn("Official Windows Computer Use repair failed:", error);
    }
  }, delay));
}

function repairExistingSetup(api) {
  const status = getSetupStatus();
  if (!status.selectedApp) {
    return { changed: false, messages: ["Official bundled Computer Use plugin was not found."] };
  }

  const before = JSON.stringify(compactStatus(status));
  const messages = [];
  applySetupRepairs(status, messages, api);
  const afterStatus = getSetupStatus();
  const after = JSON.stringify(compactStatus(afterStatus));
  return { changed: before !== after, messages, status: afterStatus };
}

function repairSetup(api) {
  const status = getSetupStatus();
  const messages = [];
  if (!status.selectedApp) {
    messages.push("Official bundled Computer Use plugin was not found in the installed Codex app.");
    messages.push("Update or reinstall Codex Desktop so the bundled openai-bundled/computer-use plugin exists.");
    return { ok: false, messages, status };
  }

  try {
    applySetupRepairs(status, messages, api);
    const next = getSetupStatus();
    messages.push("Repair complete. Fully quit and reopen Codex before testing.");
    return { ok: next.ready, messages, status: next };
  } catch (error) {
    messages.push(`Repair failed: ${error?.message || error}`);
    return { ok: false, messages, status: getSetupStatus() };
  }
}

function applySetupRepairs(status, messages, api) {
  ensureRuntimeMarketplace(status, messages);
  ensurePluginCache(status, messages);
  ensurePluginEnabled(status.configPath, messages);
  ensureMarketplaceConfig(status.configPath, status.runtimeMarketplaceRoot, messages);
  void nudgeNativeComputerUseFeatureFromMain(api, null).catch(() => {});
}

function getSetupStatus() {
  const fs = require("node:fs");
  const path = require("node:path");
  const configPath = path.join(getCodexHome(), "config.toml");
  const configText = safeReadFile(configPath);
  const selectedApp = findSelectedApp();
  const runtimeMarketplaceRoot = getRuntimeMarketplaceRoot(configText);
  const runtimeMarketplace = inspectRuntimeMarketplace(fs, runtimeMarketplaceRoot, selectedApp);
  const pluginCache = inspectPluginCache(fs, selectedApp, runtimeMarketplaceRoot);
  const pluginConfig = inspectPluginConfig(configText);
  const marketplaceConfig = inspectMarketplaceConfig(configText, runtimeMarketplaceRoot);
  const checks = [
    check(!!selectedApp, "Official bundle", selectedApp ? selectedApp.pluginRoot : "Bundled computer-use plugin not found", selectedApp ? "pass" : "fail"),
    check(runtimeMarketplace.ok, "Runtime marketplace", runtimeMarketplace.detail, runtimeMarketplace.ok ? "pass" : "fail"),
    check(pluginCache.ok, "Plugin cache", pluginCache.detail, pluginCache.ok ? "pass" : "fail"),
    check(pluginConfig.enabled, "Plugin enabled", pluginConfig.detail, pluginConfig.enabled ? "pass" : "fail"),
    check(marketplaceConfig.ok, "Marketplace source", marketplaceConfig.detail, marketplaceConfig.ok ? "pass" : "warn"),
  ];
  const ready = checks.every((item) => item.state === "pass");

  return {
    ready,
    summary: ready
      ? "Official Windows Computer Use looks ready. Restart Codex if it is already open."
      : "Official Windows Computer Use still needs repair.",
    configPath,
    configText,
    selectedApp,
    runtimeMarketplaceRoot,
    runtimeMarketplace,
    pluginCache,
    pluginConfig,
    marketplaceConfig,
    checks,
  };
}

function inspectRuntimeMarketplace(fs, runtimeMarketplaceRoot, selectedApp) {
  const path = require("node:path");
  const pluginRoot = path.join(runtimeMarketplaceRoot, "plugins", PLUGIN_NAME);
  const pluginJsonPath = path.join(pluginRoot, ".codex-plugin", "plugin.json");
  const marketplaceJsonPath = path.join(runtimeMarketplaceRoot, ".agents", "plugins", "marketplace.json");
  const pluginJson = readJsonFile(pluginJsonPath);
  const marketplaceJson = readJsonFile(marketplaceJsonPath);
  const listed = !!marketplaceJson?.plugins?.some((plugin) => plugin?.name === PLUGIN_NAME);
  const sameVersion = selectedApp?.plugin?.version && pluginJson?.version
    ? selectedApp.plugin.version === pluginJson.version
    : !!pluginJson;
  const ok = fs.existsSync(pluginJsonPath) && listed && sameVersion;
  return {
    ok,
    pluginRoot,
    pluginJsonPath,
    marketplaceJsonPath,
    detail: ok
      ? `${pluginRoot}${pluginJson?.version ? ` (${pluginJson.version})` : ""}`
      : "Runtime openai-bundled marketplace is missing the official computer-use plugin or listing.",
  };
}

function inspectPluginCache(fs, selectedApp, runtimeMarketplaceRoot) {
  const path = require("node:path");
  const version = selectedApp?.plugin?.version || "unknown";
  const cacheRoot = path.join(getCodexHome(), "plugins", "cache", MARKETPLACE_NAME, PLUGIN_NAME);
  const versionRoot = path.join(cacheRoot, version);
  const versionJsonPath = path.join(versionRoot, ".codex-plugin", "plugin.json");
  const latestPath = path.join(cacheRoot, "latest");
  const expectedLatestTarget = path.join(runtimeMarketplaceRoot, "plugins", PLUGIN_NAME);
  let latestOk = false;

  if (fs.existsSync(latestPath)) {
    try {
      latestOk = normalizeFsPath(fs.realpathSync(latestPath)) === normalizeFsPath(expectedLatestTarget);
    } catch {
      latestOk = false;
    }
  }

  const ok = fs.existsSync(versionJsonPath) && latestOk;
  return {
    ok,
    cacheRoot,
    versionRoot,
    latestPath,
    detail: ok
      ? `${versionRoot} + latest`
      : "Official computer-use plugin cache is missing the versioned copy or latest junction.",
  };
}

function inspectPluginConfig(configText) {
  const enabled = readTomlKeyValue(configText, PLUGIN_SECTION, "enabled") === "true";
  return {
    enabled,
    detail: enabled
      ? `[${PLUGIN_SECTION}] enabled = true`
      : `[${PLUGIN_SECTION}] enabled = true is missing`,
  };
}

function inspectMarketplaceConfig(configText, runtimeMarketplaceRoot) {
  const source = readTomlStringValue(configText, MARKETPLACE_SECTION, "source");
  const sourceType = readTomlStringValue(configText, MARKETPLACE_SECTION, "source_type");
  const expected = toVerbatimPath(runtimeMarketplaceRoot);
  const ok = normalizeFsPath(source || "") === normalizeFsPath(expected) && sourceType === "local";
  return {
    ok,
    detail: ok
      ? `${MARKETPLACE_SECTION} -> ${expected}`
      : `${MARKETPLACE_SECTION} should point to ${expected}`,
  };
}

function ensureRuntimeMarketplace(status, messages) {
  const fs = require("node:fs");
  const path = require("node:path");
  const selectedApp = status.selectedApp;
  if (!selectedApp) {
    throw new Error("Official bundled computer-use plugin is unavailable.");
  }

  const runtimeRoot = status.runtimeMarketplaceRoot;
  const runtimePluginRoot = path.join(runtimeRoot, "plugins", PLUGIN_NAME);
  const runtimeMarketplaceJsonPath = path.join(runtimeRoot, ".agents", "plugins", "marketplace.json");
  fs.mkdirSync(path.dirname(runtimeMarketplaceJsonPath), { recursive: true });
  fs.mkdirSync(path.join(runtimeRoot, "plugins"), { recursive: true });

  const appMarketplace = readJsonFile(selectedApp.marketplaceJsonPath)
    || {
      name: MARKETPLACE_NAME,
      interface: { displayName: "OpenAI Bundled" },
      plugins: [],
    };
  const officialEntry = getOfficialMarketplaceEntry(selectedApp);
  const appPlugins = Array.isArray(appMarketplace.plugins) ? appMarketplace.plugins.slice() : [];
  const withoutComputerUse = appPlugins.filter((plugin) => plugin?.name !== PLUGIN_NAME);
  const nextMarketplace = {
    ...appMarketplace,
    name: appMarketplace.name || MARKETPLACE_NAME,
    interface: appMarketplace.interface || { displayName: "OpenAI Bundled" },
    plugins: [...withoutComputerUse, officialEntry],
  };

  if (!directoryHasPluginVersion(runtimePluginRoot, selectedApp.plugin?.version)) {
    copyDirectoryContents(selectedApp.pluginRoot, runtimePluginRoot);
  }

  const beforeMarketplace = safeReadFile(runtimeMarketplaceJsonPath);
  const afterMarketplace = `${JSON.stringify(nextMarketplace, null, 2)}\n`;
  if (beforeMarketplace !== afterMarketplace) {
    fs.writeFileSync(runtimeMarketplaceJsonPath, afterMarketplace, "utf8");
  }
  messages.push("Repaired runtime openai-bundled marketplace with the official computer-use plugin.");
}

function ensurePluginCache(status, messages) {
  const fs = require("node:fs");
  const path = require("node:path");
  const selectedApp = status.selectedApp;
  if (!selectedApp) {
    throw new Error("Official bundled computer-use plugin is unavailable.");
  }

  const version = selectedApp.plugin?.version || "unknown";
  const cacheRoot = path.join(getCodexHome(), "plugins", "cache", MARKETPLACE_NAME, PLUGIN_NAME);
  const versionRoot = path.join(cacheRoot, version);
  const latestPath = path.join(cacheRoot, "latest");
  const runtimePluginRoot = path.join(status.runtimeMarketplaceRoot, "plugins", PLUGIN_NAME);

  fs.mkdirSync(cacheRoot, { recursive: true });
  if (!directoryHasPluginVersion(versionRoot, version)) {
    copyDirectoryContents(selectedApp.pluginRoot, versionRoot);
  }

  if (fs.existsSync(latestPath) && !pathPointsTo(latestPath, runtimePluginRoot)) {
    removePathWithoutFollowingLinks(latestPath);
  }
  try {
    if (!fs.existsSync(latestPath)) {
      fs.symlinkSync(runtimePluginRoot, latestPath, "junction");
    }
  } catch (error) {
    messages.push(`Unable to refresh latest plugin cache junction: ${error?.message || error}`);
  }

  messages.push(`Installed official computer-use plugin cache v${version}.`);
}

function ensurePluginEnabled(configPath, messages) {
  const before = safeReadFile(configPath);
  const after = ensureTomlSectionKey(before, PLUGIN_SECTION, "enabled", "true");
  if (after !== before) {
    writeTextFile(configPath, after);
    messages.push(`Enabled [${PLUGIN_SECTION}] in config.toml.`);
  }
}

function ensureMarketplaceConfig(configPath, runtimeMarketplaceRoot, messages) {
  const expectedSource = toVerbatimPath(runtimeMarketplaceRoot);
  let next = safeReadFile(configPath);
  const withType = ensureTomlSectionKey(next, MARKETPLACE_SECTION, "source_type", literalTomlString("local"));
  const withSource = ensureTomlSectionKey(withType, MARKETPLACE_SECTION, "source", literalTomlString(expectedSource));
  if (withSource !== next) {
    writeTextFile(configPath, withSource);
    messages.push(`Updated [${MARKETPLACE_SECTION}] to point at the runtime bundled marketplace.`);
  }
}

function findSelectedApp() {
  const candidates = appCandidates().map(inspectApp).filter((app) => app.usable);
  return candidates[0] || null;
}

function appCandidates() {
  const fs = require("node:fs");
  const path = require("node:path");
  const results = [];
  const seen = new Set();

  for (const preferred of PREFERRED_APP_PATHS) {
    const resolved = normalizeAppPath(preferred);
    if (resolved && !seen.has(normalizeFsPath(resolved))) {
      seen.add(normalizeFsPath(resolved));
      results.push(resolved);
    }
  }

  const storeAppsRoot = path.join(process.env.LOCALAPPDATA || "", "codex-plusplus", "store-apps");
  if (fs.existsSync(storeAppsRoot)) {
    const entries = fs.readdirSync(storeAppsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.startsWith("OpenAI.Codex_"))
      .sort((left, right) => right.name.localeCompare(left.name));
    for (const entry of entries) {
      const candidate = path.join(storeAppsRoot, entry.name, "app");
      const normalized = normalizeFsPath(candidate);
      if (!seen.has(normalized)) {
        seen.add(normalized);
        results.push(candidate);
      }
    }
  }

  return results;
}

function inspectApp(appPath) {
  const path = require("node:path");
  const pluginRoot = path.join(appPath, "resources", "plugins", MARKETPLACE_NAME, "plugins", PLUGIN_NAME);
  const pluginJsonPath = path.join(pluginRoot, ".codex-plugin", "plugin.json");
  const marketplaceJsonPath = path.join(appPath, "resources", "plugins", MARKETPLACE_NAME, ".agents", "plugins", "marketplace.json");
  const plugin = readJsonFile(pluginJsonPath);
  return {
    appPath,
    pluginRoot,
    pluginJsonPath,
    marketplaceJsonPath,
    plugin,
    usable: !!plugin?.name && !!plugin?.version,
  };
}

function getOfficialMarketplaceEntry(selectedApp) {
  const marketplace = readJsonFile(selectedApp.marketplaceJsonPath);
  const match = marketplace?.plugins?.find((plugin) => plugin?.name === PLUGIN_NAME);
  if (match) return match;
  return {
    name: PLUGIN_NAME,
    source: {
      source: "local",
      path: `./plugins/${PLUGIN_NAME}`,
    },
    policy: {
      installation: "AVAILABLE",
      authentication: "ON_INSTALL",
    },
    category: "Productivity",
  };
}

function getRuntimeMarketplaceRoot(configText) {
  const path = require("node:path");
  const source = readTomlStringValue(configText, MARKETPLACE_SECTION, "source");
  if (source) {
    return stripVerbatimPrefix(source);
  }
  return path.join(getCodexHome(), ".tmp", "bundled-marketplaces", MARKETPLACE_NAME);
}

function getCodexHome() {
  const path = require("node:path");
  const configured = process.env.CODEX_HOME;
  if (configured && configured.trim()) {
    return stripTrailingSlash(stripVerbatimPrefix(configured.trim()));
  }
  const home = process.env.USERPROFILE || process.env.HOME;
  return path.join(home, ".codex");
}

function compactStatus(status) {
  return {
    ready: status.ready,
    selectedApp: status.selectedApp?.appPath || null,
    runtimeMarketplace: status.runtimeMarketplace.ok,
    pluginCache: status.pluginCache.ok,
    pluginConfig: status.pluginConfig.enabled,
    marketplaceConfig: status.marketplaceConfig.ok,
  };
}

function replaceDirectoryContents(sourceDir, targetDir) {
  const fs = require("node:fs");
  if (fs.existsSync(targetDir)) {
    removePathWithoutFollowingLinks(targetDir);
  }
  fs.cpSync(sourceDir, targetDir, { recursive: true, force: true });
}

function copyDirectoryContents(sourceDir, targetDir) {
  const fs = require("node:fs");
  fs.cpSync(sourceDir, targetDir, {
    recursive: true,
    force: false,
    errorOnExist: false,
  });
}

function directoryHasPluginVersion(pluginRoot, version) {
  const path = require("node:path");
  const plugin = readJsonFile(path.join(pluginRoot, ".codex-plugin", "plugin.json"));
  if (!plugin?.name || plugin.name !== PLUGIN_NAME) return false;
  return version ? plugin.version === version : !!plugin.version;
}

function pathPointsTo(linkPath, targetPath) {
  const fs = require("node:fs");
  try {
    return normalizeFsPath(fs.realpathSync(linkPath)) === normalizeFsPath(targetPath);
  } catch {
    return false;
  }
}

function removePathWithoutFollowingLinks(targetPath) {
  const fs = require("node:fs");
  try {
    const stat = fs.lstatSync(targetPath);
    if (stat.isSymbolicLink()) {
      fs.unlinkSync(targetPath);
      return;
    }
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }

  fs.rmSync(targetPath, { recursive: true, force: true });
}

function safeReadFile(filePath) {
  const fs = require("node:fs");
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function writeTextFile(filePath, text) {
  const fs = require("node:fs");
  const path = require("node:path");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, normalizeNewlines(text), "utf8");
}

function readJsonFile(filePath) {
  try {
    return JSON.parse(safeReadFile(filePath));
  } catch {
    return null;
  }
}

function ensureTomlSectionKey(source, sectionName, key, valueLiteral) {
  const lines = normalizeNewlines(source || "").split("\n");
  const sectionHeader = `[${sectionName}]`;
  let sectionIndex = lines.findIndex((line) => line.trim() === sectionHeader);

  if (sectionIndex === -1) {
    while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
    if (lines.length > 0) lines.push("");
    lines.push(sectionHeader, `${key} = ${valueLiteral}`, "");
    return `${lines.join("\n")}\n`;
  }

  let sectionEnd = sectionIndex + 1;
  while (sectionEnd < lines.length && !/^\s*\[/.test(lines[sectionEnd])) {
    sectionEnd += 1;
  }

  const keyPattern = new RegExp(`^\\s*${escapeRegExp(key)}\\s*=`);
  let keyIndex = -1;
  for (let index = sectionIndex + 1; index < sectionEnd; index += 1) {
    if (keyPattern.test(lines[index])) {
      keyIndex = index;
      break;
    }
  }

  if (keyIndex === -1) {
    lines.splice(sectionIndex + 1, 0, `${key} = ${valueLiteral}`);
  } else {
    lines[keyIndex] = `${key} = ${valueLiteral}`;
  }

  return `${lines.join("\n").replace(/\n*$/, "\n\n")}`;
}

function readTomlStringValue(source, sectionName, key) {
  const value = readTomlKeyValue(source, sectionName, key);
  if (!value) return null;
  if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
    return value.slice(1, -1);
  }
  return value;
}

function readTomlKeyValue(source, sectionName, key) {
  const section = readTomlSection(source, sectionName);
  if (!section) return null;
  const match = section.match(new RegExp(`^\\s*${escapeRegExp(key)}\\s*=\\s*(.+?)\\s*$`, "m"));
  return match ? match[1].trim() : null;
}

function readTomlSection(source, sectionName) {
  const normalized = normalizeNewlines(source || "");
  const escapedSection = escapeRegExp(`[${sectionName}]`);
  const pattern = new RegExp(`${escapedSection}\\n([\\s\\S]*?)(?=\\n\\[|$)`);
  const match = normalized.match(pattern);
  return match ? match[1] : "";
}

function literalTomlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function normalizeNewlines(value) {
  return String(value || "").replace(/\r\n/g, "\n");
}

function normalizeAppPath(value) {
  if (!value || typeof value !== "string") return null;
  const normalized = stripTrailingSlash(stripVerbatimPrefix(value));
  return /\\app$/i.test(normalized) ? normalized : `${normalized}\\app`;
}

function stripTrailingSlash(value) {
  return String(value || "").replace(/[\\\/]+$/, "");
}

function stripVerbatimPrefix(value) {
  return String(value || "").replace(/^\\\\\?\\/, "");
}

function toVerbatimPath(value) {
  const normalized = stripTrailingSlash(stripVerbatimPrefix(value)).replace(/\//g, "\\");
  return normalized.startsWith("\\\\?\\") ? normalized : `\\\\?\\${normalized}`;
}

function normalizeFsPath(value) {
  return stripTrailingSlash(stripVerbatimPrefix(String(value || ""))).toLowerCase();
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function check(ok, label, detail, state) {
  return {
    label,
    detail,
    state: state || (ok ? "pass" : "fail"),
  };
}

function renderSettings(root, api) {
  const state = {
    loading: false,
    status: null,
    messages: [],
  };

  async function refresh() {
    state.loading = true;
    render();
    try {
      state.status = await api.ipc.invoke("setup-status");
      state.messages = [];
    } catch (error) {
      state.messages = [t("unableToReadStatus", error?.message || error)];
    } finally {
      state.loading = false;
      render();
    }
  }

  async function repair() {
    state.loading = true;
    render();
    try {
      const result = await api.ipc.invoke("repair-setup");
      state.status = result.status;
      state.messages = result.messages || [];
    } catch (error) {
      state.messages = [t("repairFailed", error?.message || error)];
    } finally {
      state.loading = false;
      render();
    }
  }

  function render() {
    root.innerHTML = "";
    const wrapper = el("div", "display:grid;gap:12px;");
    const card = el("div", "border:1px solid var(--token-border, rgba(127,127,127,0.2));border-radius:12px;padding:12px;display:grid;gap:10px;");
    const heading = el("div", "display:flex;justify-content:space-between;gap:12px;align-items:flex-start;");
    const copy = el("div", "display:grid;gap:4px;min-width:0;");
    copy.append(
      textEl("div", t("pageTitle"), "font-weight:600;font-size:14px;"),
      textEl("div", localizeSetupText(state.status?.summary || t("checking")), "font-size:12px;color:var(--token-text-secondary, var(--text-secondary, #666));line-height:1.4;")
    );
    const actions = el("div", "display:flex;gap:8px;flex-wrap:wrap;");
    const refreshButton = button(state.loading ? t("refreshing") : t("refresh"));
    refreshButton.disabled = state.loading;
    refreshButton.addEventListener("click", () => void refresh());
    const repairButton = button(state.loading ? t("working") : t("repair"), true);
    repairButton.disabled = state.loading;
    repairButton.addEventListener("click", () => void repair());
    actions.append(refreshButton, repairButton);
    heading.append(copy, actions);
    card.append(heading);

    if (state.status?.checks?.length) {
      for (const item of state.status.checks) {
        const row = el("div", "display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:start;padding-top:8px;border-top:1px solid var(--token-border, rgba(127,127,127,0.12));");
        const left = el("div", "display:grid;gap:2px;min-width:0;");
        left.append(
          textEl("div", localizeSetupText(item.label), "font-size:13px;font-weight:550;"),
          textEl("div", localizeSetupText(item.detail), "font-size:12px;color:var(--token-text-secondary, var(--text-secondary, #666));line-height:1.4;word-break:break-word;")
        );
        row.append(left, pill(item.state === "pass" ? t("ready") : item.state === "warn" ? t("check") : t("fix"), item.state));
        card.append(row);
      }
    }

    wrapper.append(card);

    if (state.messages.length) {
      const messageBox = el("div", "display:grid;gap:8px;");
      for (const message of state.messages) {
        messageBox.append(textEl("div", localizeSetupText(message), "padding:10px 12px;border-radius:10px;background:rgba(127,127,127,0.12);font-size:12px;line-height:1.4;"));
      }
      wrapper.append(messageBox);
    }

    root.append(wrapper);
  }

  render();
  void refresh();
}

function localizeSetupText(text) {
  const value = String(text || "");
  if (!value || currentLanguage() !== "zh") return value;
  if (value === TEXT.en.summaryReady) return t("summaryReady");
  if (value === TEXT.en.summaryNeedsRepair) return t("summaryNeedsRepair");
  if (value === "Official bundle") return t("checkOfficialBundle");
  if (value === "Runtime marketplace") return t("checkRuntimeMarketplace");
  if (value === "Plugin cache") return t("checkPluginCache");
  if (value === "Plugin enabled") return t("checkPluginEnabled");
  if (value === "Marketplace source") return t("checkMarketplaceSource");
  if (value === "Bundled computer-use plugin not found") return t("missingBundle");
  if (value === TEXT.en.missingRuntimeMarketplace) return t("missingRuntimeMarketplace");
  if (value === TEXT.en.missingPluginCache) return t("missingPluginCache");
  if (value === TEXT.en.pluginConfigMissing) return t("pluginConfigMissing");
  if (value === TEXT.en.missingPlugin) return t("missingPlugin");
  if (value === TEXT.en.missingPluginInstalled) return t("missingPluginInstalled");
  if (value === TEXT.en.reinstallCodex) return t("reinstallCodex");
  if (value === TEXT.en.repairComplete) return t("repairComplete");
  if (value === TEXT.en.repairedRuntimeMarketplace) return t("repairedRuntimeMarketplace");
  if (value === TEXT.en.enabledConfig) return t("enabledConfig");
  if (value === TEXT.en.updatedMarketplace) return t("updatedMarketplace");
  let match = value.match(/^Installed official computer-use plugin cache v(.+)\.$/);
  if (match) return t("cacheInstalled", match[1]);
  match = value.match(/^Unable to refresh latest plugin cache junction: (.+)$/);
  if (match) return t("latestJunctionFailed", match[1]);
  const expectedPrefix = `${MARKETPLACE_SECTION} should point to `;
  if (value.startsWith(expectedPrefix)) return t("marketplaceShouldPoint", value.slice(expectedPrefix.length));
  return value;
}

function el(tag, style) {
  const node = document.createElement(tag);
  if (style) node.setAttribute("style", style);
  return node;
}

function textEl(tag, text, style) {
  const node = el(tag, style);
  node.textContent = text;
  return node;
}

function button(label, primary) {
  const node = document.createElement("button");
  node.type = "button";
  node.textContent = label;
  node.setAttribute(
    "style",
    [
      "appearance:none",
      "border:1px solid",
      `border-color:${primary ? "#111827" : "rgba(127,127,127,0.28)"}`,
      `background:${primary ? "#111827" : "rgba(127,127,127,0.1)"}`,
      `color:${primary ? "#fff" : "inherit"}`,
      "border-radius:8px",
      "padding:6px 10px",
      "font:inherit",
      "font-size:12px",
      "cursor:pointer",
      "white-space:nowrap",
    ].join(";")
  );
  return node;
}

function pill(label, state) {
  const colors = {
    pass: ["#0f7b45", "rgba(15,123,69,0.10)"],
    warn: ["#9a5b00", "rgba(154,91,0,0.12)"],
    fail: ["#b42318", "rgba(180,35,24,0.12)"],
  };
  const [color, background] = colors[state] || colors.warn;
  const node = document.createElement("span");
  node.textContent = label;
  node.setAttribute(
    "style",
    [
      "display:inline-flex",
      "align-items:center",
      "justify-content:center",
      "min-height:24px",
      "padding:0 9px",
      "border-radius:999px",
      `background:${background}`,
      `color:${color}`,
      "font-size:12px",
      "font-weight:600",
      "white-space:nowrap",
    ].join(";")
  );
  return node;
}

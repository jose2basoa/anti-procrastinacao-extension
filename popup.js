document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("siteInput");
  const suggestionsBox = document.getElementById("suggestions");

  document.getElementById("addBtn").addEventListener("click", addSite);
  document.getElementById("saveMsgBtn").addEventListener("click", saveMessage);
  document.getElementById("setPasswordBtn").addEventListener("click", setPassword);
  document.getElementById("toggleHardcoreBtn").addEventListener("click", toggleHardcore);

  input.addEventListener("input", handleSuggestions);

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".input-group")) {
      suggestionsBox.innerHTML = "";
    }
  });

  loadSites();
  loadSettings();
});

const defaultSuggestions = [
  "youtube.com","instagram.com","tiktok.com","twitter.com",
  "facebook.com","netflix.com","twitch.tv","reddit.com"
];

function handleSuggestions() {
  const input = document.getElementById("siteInput");
  const suggestionsBox = document.getElementById("suggestions");

  const value = input.value.toLowerCase();
  suggestionsBox.innerHTML = "";

  if (!value) return;

  defaultSuggestions
    .filter(site => site.includes(value))
    .forEach(site => {
      const div = document.createElement("div");
      div.textContent = site;

      div.onclick = () => {
        input.value = site;
        suggestionsBox.innerHTML = "";
      };

      suggestionsBox.appendChild(div);
    });
}

function loadSettings() {
  chrome.storage.sync.get(["hardcoreMode"], (data) => {
    const btn = document.getElementById("toggleHardcoreBtn");
    btn.textContent = data.hardcoreMode ? "Desativar Hardcore" : "Ativar Hardcore";
  });
}

function setPassword() {
  const pass = document.getElementById("passwordInput").value;
  if (!pass) return;

  chrome.storage.sync.set({ password: pass });
  alert("Senha definida");
}

function toggleHardcore() {
  chrome.storage.sync.get(["hardcoreMode", "password"], (data) => {
    if (data.hardcoreMode) {
      const input = prompt("Digite a senha para desativar:");
      if (input !== data.password) {
        alert("Senha incorreta");
        return;
      }
      chrome.storage.sync.set({ hardcoreMode: false }, loadSettings);
    } else {
      if (!data.password) {
        alert("Defina uma senha primeiro");
        return;
      }
      chrome.storage.sync.set({ hardcoreMode: true }, loadSettings);
    }
  });
}

function loadSites() {
  chrome.storage.sync.get(["blockedSites"], (data) => {
    const list = document.getElementById("siteList");
    list.innerHTML = "";

    (data.blockedSites || []).forEach((site) => {
      const li = document.createElement("li");
      li.textContent = site;

      const btn = document.createElement("button");
      btn.textContent = "Remover";
      btn.onclick = () => removeSite(site);

      li.appendChild(btn);
      list.appendChild(li);
    });
  });
}

function addSite() {
  chrome.storage.sync.get(["hardcoreMode"], (data) => {
    if (data.hardcoreMode) {
      alert("Modo hardcore ativo. Não pode alterar.");
      return;
    }

    const input = document.getElementById("siteInput");
    const site = input.value.trim();
    if (!site) return;

    chrome.storage.sync.get(["blockedSites"], (data) => {
      const sites = data.blockedSites || [];

      if (!sites.includes(site)) {
        sites.push(site);
        chrome.storage.sync.set({ blockedSites: sites }, loadSites);
      }
    });

    input.value = "";
  });
}

function removeSite(site) {
  chrome.storage.sync.get(["hardcoreMode"], (data) => {
    if (data.hardcoreMode) {
      alert("Modo hardcore ativo. Não pode remover.");
      return;
    }

    chrome.storage.sync.get(["blockedSites"], (data) => {
      const updated = (data.blockedSites || []).filter(s => s !== site);
      chrome.storage.sync.set({ blockedSites: updated }, loadSites);
    });
  });
}

function saveMessage() {
  const msg = document.getElementById("customMessage").value;
  chrome.storage.sync.set({ customMessage: msg });
}
const mensagensPadrao = [
  "Volta ao foco.",
  "Disciplina > motivação.",
  "Você tem meta hoje."
];

chrome.storage.sync.get(["customMessage"], (data) => {
  const msg = data.customMessage;

  document.getElementById("message").innerText =
    msg || mensagensPadrao[Math.floor(Math.random() * mensagensPadrao.length)];
});

function voltar() {
  window.location.href = "https://www.google.com";
}
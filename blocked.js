const mensagens = [
  "Você realmente acha que isso vai te levar pra onde quer?",
  "Volta a estudar. Disciplina > motivação.",
  "Seu concorrente não tá vendo isso agora.",
  "Foco. Você tem meta pra bater.",
  "Menos scroll, mais resultado."
];

document.getElementById("message").innerText =
  mensagens[Math.floor(Math.random() * mensagens.length)];

function voltar() {
  window.history.back();
}
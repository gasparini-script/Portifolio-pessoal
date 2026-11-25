"use strict";

const PERFIL = {
  linkedin: "https://www.linkedin.com/in/rafael-gasparini-4884263a9",
  github: "https://github.com/gasparini-script",
  email: "rafaelfgasparini08@gmail.com",
};

const EXTENSOES_IMAGEM = ["jpg", "jpeg", "png", "webp"];

function aplicarLinks() {
  document.querySelectorAll("[data-link]").forEach((elemento) => {
    const tipo = elemento.dataset.link;
    if (tipo === "email") {
      elemento.href = `mailto:${PERFIL.email}`;
    } else if (PERFIL[tipo]) {
      elemento.href = PERFIL[tipo];
      elemento.target = "_blank";
      elemento.rel = "noopener noreferrer";
    }
  });
  document.querySelectorAll("[data-email-texto]").forEach((elemento) => {
    elemento.textContent = PERFIL.email;
  });
}

function iniciarMenu() {
  const botao = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#menu-principal");
  if (!botao || !menu) return;

  const definirAberto = (aberto) => {
    menu.classList.toggle("is-open", aberto);
    botao.setAttribute("aria-expanded", String(aberto));
    botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  };

  botao.addEventListener("click", () => definirAberto(!menu.classList.contains("is-open")));
  menu.addEventListener("click", (evento) => {
    if (evento.target.closest("a")) {
      definirAberto(false);
    }
  });
  document.addEventListener("click", (evento) => {
    if (!evento.target.closest(".site-header")) definirAberto(false);
  });
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      definirAberto(false);
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      definirAberto(false);
    }
  });
}

function iniciarCartoes() {
  document.querySelectorAll(".card").forEach((cartao) => {
    cartao.addEventListener("mousemove", (evento) => {
      const caixa = cartao.getBoundingClientRect();
      cartao.style.setProperty("--mouse-x", `${evento.clientX - caixa.left}px`);
      cartao.style.setProperty("--mouse-y", `${evento.clientY - caixa.top}px`);
    });
  });

  const dispositivoSemHover = window.matchMedia("(hover: none)");
  document.querySelectorAll("[data-revelar]").forEach((cartao) => {
    const definirAberto = (aberto) => cartao.classList.toggle("is-open", aberto);
    const executarComHover = (acao) => () => {
      if (!dispositivoSemHover.matches) {
        acao();
      }
    };

    cartao.addEventListener("mouseenter", executarComHover(() => definirAberto(true)));
    cartao.addEventListener("mouseleave", executarComHover(() => definirAberto(false)));
    cartao.addEventListener("focusin", executarComHover(() => definirAberto(true)));
    cartao.addEventListener("focusout", executarComHover(() => definirAberto(false)));
    cartao.addEventListener("click", () => {
      if (dispositivoSemHover.matches) {
        definirAberto(!cartao.classList.contains("is-open"));
      }
    });
  });
}

function iniciarFiltros() {
  const botoesFiltro = document.querySelectorAll("[data-filtro]");
  const secoesFiltradas = document.querySelectorAll("[data-categoria]");
  if (!botoesFiltro.length) return;

  botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
      const filtro = botao.dataset.filtro;
      botoesFiltro.forEach((outroBotao) => {
        const estaAtivo = outroBotao === botao;
        outroBotao.classList.toggle("is-active", estaAtivo);
        outroBotao.setAttribute("aria-pressed", String(estaAtivo));
      });
      secoesFiltradas.forEach((secao) => {
        secao.hidden = !(filtro === "todos" || secao.dataset.categoria === filtro);
      });
    });
  });
}

function iniciarCopiaEmail() {
  const botao = document.querySelector("#btn-copiar-email");
  if (!botao) return;
  const tituloBotao = botao.querySelector(".contact-card__title");
  const tituloOriginal = tituloBotao.textContent;
  let temporizador;

  async function copiarTexto(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
      return;
    }
    const campoAuxiliar = document.createElement("textarea");
    campoAuxiliar.value = texto;
    campoAuxiliar.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(campoAuxiliar);
    campoAuxiliar.select();
    const copiou = document.execCommand("copy");
    campoAuxiliar.remove();
    if (!copiou) throw new Error("Falha ao copiar");
  }

  botao.addEventListener("click", async () => {
    try {
      await copiarTexto(PERFIL.email);
      tituloBotao.textContent = "Copiado!";
      botao.classList.add("is-copied");
    } catch (erro) {
      tituloBotao.textContent = "Copie manualmente";
    }
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      tituloBotao.textContent = tituloOriginal;
      botao.classList.remove("is-copied");
    }, 2000);
  });
}

function iniciarImagens() {
  document.querySelectorAll(".media img").forEach((imagem) => {
    const caminhoOriginal = imagem.getAttribute("src");
    const base = caminhoOriginal.replace(/(\.[a-z0-9]+)+$/i, "");
    const candidatas = [...EXTENSOES_IMAGEM.map((extensao) => `${base}.${extensao}`), `${base}.jpg.png`];
    let posicao = candidatas.indexOf(caminhoOriginal);

    const tentarProxima = () => {
      posicao += 1;
      if (posicao < candidatas.length) {
        imagem.src = candidatas[posicao];
      } else {
        imagem.closest(".media").classList.add("is-missing");
      }
    };

    imagem.addEventListener("error", tentarProxima);
    if (imagem.complete && imagem.naturalWidth === 0) tentarProxima();
  });
}

function atualizarAno() {
  const campoAno = document.querySelector("#ano");
  if (campoAno) campoAno.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  aplicarLinks();
  iniciarMenu();
  iniciarCartoes();
  iniciarFiltros();
  iniciarCopiaEmail();
  iniciarImagens();
  atualizarAno();
});

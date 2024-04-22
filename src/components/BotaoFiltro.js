import React from "react";

// função para o componente BotaoFiltro
function BotaoFiltro (props) {
  // classe vai variar de acordo com o estado do botão (isPressed)
  const botaoClass = props.isPressed ? "btn toggle-btn pressed" : "btn toggle-btn";
  // renderiza o botão
  return (
    <button
      type="button"
      className={botaoClass}
      aria-pressed={props.isPressed}
      onClick={() => props.setFiltro(props.text)}>
      <span className="visually-hidden">Mostrar</span>
      <span>{props.text}</span>
      <span className="visually-hidden">tarefas</span>
    </button>
  )
}

export default BotaoFiltro; // exporta o componente BotaoFiltro
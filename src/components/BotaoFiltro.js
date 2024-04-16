import React from "react";

function BotaoFiltro (props) {
  const botaoClass = props.isPressed ? "btn toggle-btn pressed" : "btn toggle-btn";
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

export default BotaoFiltro;
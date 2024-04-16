import React, { useState } from "react";

function ItemLista(props) {

  const [boolEditando, setarEdicao] = useState(false);
  const [novoTexto, setarNovoTexto] = useState("");
  const [novaDescricao, setarNovaDescricao] = useState("");

  function handleMud(e) {
    setarNovoTexto(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const updatedTexto = novoTexto.trim() !== "" ? novoTexto : props.text;
    const updatedDescricao = novaDescricao.trim() !== "" ? novaDescricao : props.description;
  
    if (updatedTexto === "" && updatedDescricao === "") {
      alert("Por favor, insira o conteúdo a ser editado.");
    } else {
      props.editTask(props.id, updatedTexto, updatedDescricao);
      setarNovoTexto("");
      setarNovaDescricao("");
      setarEdicao(false);
    }
  }

  const comecarEdicao = () => {
    setarNovoTexto(props.text);
    setarNovaDescricao(props.description || "");
    setarEdicao(true);
  };
  
  const PLACEHOLDER_MAX = 55;
  const TITULO_PREFIXO = "Título: ";
  const DESCRICAO_PREFIXO = "Descrição: ";

  function juntarTexto(texto, tamanhoMax, prefixo) {
    const textoTruncado = texto.length > tamanhoMax ? texto.slice(0, tamanhoMax - 3) + '...' : texto;
    return prefixo + textoTruncado;
  }
  
  const editingTemplate = (
    <form className="edit-input" onSubmit={handleSubmit}>
      <div className="input-grupo">
        <input
          placeholder={juntarTexto(props.text, PLACEHOLDER_MAX, TITULO_PREFIXO)}
          id={props.id}
          className="todo-texto"
          type="text"
          value={novoTexto}
          onChange={handleMud}
        />
        <input
          placeholder={juntarTexto(props.description || "Sem descrição", PLACEHOLDER_MAX, DESCRICAO_PREFIXO)}  
          className="todo-texto"
          type="text"
          value={novaDescricao}
          onChange={(e) => setarNovaDescricao(e.target.value)}
        />
      </div>
      <div className="lista-botao">
        <button className ='btn btn__primary todo-edit' style={{ marginRight: '1px', marginBottom: '22px'}} type="button" onClick={() => {setarNovoTexto("");setarNovaDescricao("");setarEdicao(false);}}>
          Sair
        </button>
        <button type="submit" style={{ marginRight: '10px', marginBottom: '22px'}} className="btn btn__primary todo-edit">
          Confirmar
        </button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className='list-item'>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompletada(props.id)}
        />
        <label
          className='todo-label'
          htmlFor={props.id}
          style={{textDecoration: props.completed ? "line-through" : "none"}}
        >
          {props.text}
        </label>
        <div className='lista-botao'>
          <button
            type="button"
            onClick={() => setarEdicao(true)}
            style={{ display: props.filter === 'Concluídas' ? 'none' : 'inline' }}
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => props.deleteTask(props.id)}
          >
            Deletar
          </button>
        </div>
      </div>
      <div className="descricao-task">
        <p>{props.description}</p>
      </div>
    </div>
  );

  return <li>{boolEditando ? editingTemplate : viewTemplate}</li>
}

export default ItemLista;
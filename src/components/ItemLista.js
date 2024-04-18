import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

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
      <div className="lista-botao-edit">
        <button 
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          type="button" 
          onClick={() => {setarNovoTexto(""); setarNovaDescricao(""); setarEdicao(false);}}>
          <CloseIcon style={{ color: '#D74C2E', fontSize: '24px' }} />
        </button>
        <button 
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          type="submit">
          <CheckIcon style={{ color: '#D74C2E', fontSize: '24px' }} />
        </button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className='list-item'>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <input
          id={props.id}
          className="todo-checkbox"
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
          {/*<EditIcon 
            style={{ color: '#D74C2E', fontSize: '24px', cursor: 'pointer' }}
            onClick={() => setarEdicao(true)}
          />
          <DeleteIcon
            style={{ color: '#D74C2E', fontSize: '24px', cursor: 'pointer' }}
            onClick={() => props.deleteTask(props.id)}
          />*/}
          <img src="editIcon.png" alt="editar" style={{ width: '24px', heigh: '24px', cursor: "pointer"}} 
          onClick={() => setarEdicao(true)}/>
          <img src="delIcon.png" alt="deletar" style={{ width: '24px', heigh: '24px', cursor: "pointer"}} 
          onClick={() => props.deleteTask(props.id)}/>
        </div>
      </div>
      <div className="descricao-task">
        <p>{props.description}</p>
      </div>
    </div>
  );

  return <li>{boolEditando ? editingTemplate : viewTemplate}</li>;
}

export default ItemLista;
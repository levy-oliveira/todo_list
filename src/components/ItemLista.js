import { useState } from "react";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

function ItemLista(props) {
  const [boolEditando, setarEdicao] = useState(false);
  const [novoName, setarNovoName] = useState("");
  const [novaDescricao, setarNovaDescricao] = useState("");

  function handleMud(e) {
    setarNovoName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const updatedName = novoName.trim() !== "" ? novoName : props.name;
    const updatedDescricao = novaDescricao.trim() !== "" ? novaDescricao : props.description;
  
    if (updatedName === "" && updatedDescricao === "") {
      alert("Por favor, insira o conteúdo a ser editado.");
    } else {
      props.editTask(props.id, updatedName, updatedDescricao);
      setarNovoName("");
      setarNovaDescricao("");
      setarEdicao(false);
    }
  }

  const comecarEdicao = () => {
    setarNovoName(props.name);
    setarNovaDescricao(props.description || "");
    setarEdicao(true);
  };

  const PLACEHOLDER_MAX = 55;
  const TITULO_PREFIXO = "Título: ";
  const DESCRICAO_PREFIXO = "Descrição: ";

  function juntarName(name, tamanhoMax, prefixo) {
    const nameTruncado = name.length > tamanhoMax ? name.slice(0, tamanhoMax - 3) + '...' : name;
    return prefixo + nameTruncado;
  }
  
  const editingTemplate = (
    <form className="edit-input" onSubmit={handleSubmit}>
      <div className="input-grupo">
        <input
          placeholder={juntarName(props.name, PLACEHOLDER_MAX, TITULO_PREFIXO)}
          id={props.id}
          className="todo-texto"
          type="text"
          value={novoName}
          onChange={handleMud}
        />
        <input
          placeholder={juntarName(props.description || "Sem descrição", PLACEHOLDER_MAX, DESCRICAO_PREFIXO)}  
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
          onClick={() => {setarNovoName(""); setarNovaDescricao(""); setarEdicao(false);}}>
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
          defaultChecked={props.status}
          onChange={() => props.toggleTaskCompletada(props.id)}
        />
        <label
          className='todo-label'
          htmlFor={props.id}
          style={{textDecoration: props.status ? "line-through" : "none"}}
        >
          {props.name}
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
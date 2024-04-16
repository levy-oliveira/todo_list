import React, { useState } from "react";
import { nanoid } from "nanoid";

function TodoInput(props) {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if(text.trim() === ""){
      alert("Por favor, insira o conteúdo a ser adicionado.");
    } else if (text) {
      props.onSubmit({
        id: `todo-${nanoid()}`,
        text: text,
        description: description 
      });
      setText("");
      setDescription(""); 
    }
  }
  
  return (
    <form className='todo-form' onSubmit={handleSubmit}>
      <input
        type="text"
        className='todo-input' 
        placeholder='Digite uma tarefa para adicionar à lista'
        value={text}
        onChange={handleChange}
        />
      <input
        type="text"
        className='todo-input' 
        placeholder='Digite uma descrição para a tarefa'
        value={description}
        onChange={handleDescriptionChange}
      />
      <button type="submit" style={{
        backgroundColor: '#c93939',
        border: 'none',
        color: 'white',
        padding: '15px 32px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '14px',
       margin: '4px 2px',
        cursor: 'pointer'
      }}>
      Adicionar
      </button>
    </form>
  )
  
}

export default TodoInput;
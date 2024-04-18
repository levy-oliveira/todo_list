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
        backgroundColor: '#D74C2E',
        border: 'none',
        color: 'white',
        padding: '0px 0px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '30px',
        margin: '2px 2px',
        cursor: 'pointer',
        fontFamily: 'Quicksand',
      }}>
      +
      </button>
    </form>
  )
  
}

export default TodoInput;
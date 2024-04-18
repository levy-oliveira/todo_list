import { useState } from 'react';
import { nanoid } from "nanoid";
import ItemLista from '../components/ItemLista';
import TodoInput from '../components/TodoInput';
import BotaoFiltro from '../components/BotaoFiltro';

/*ToDo:
    Tá criando uma barra lateral quando uma task é adicionada, não sei de onde ela tá vindo
*/

const FILTER_MAP = {
  "Ver tudo": () => true,
  "Tarefas Restante": (task) => !task.completed,
  "Tarefas Feitas": (task) => task.completed,
}

const FILTER_NAMES = Object.keys(FILTER_MAP);

function Home(props) {
  const [tasks, setTasks] = useState(props.tasks || []);
  const [filter, setFiltro] = useState("Ver tudo");
  const [pesquisarTermo, setTermoBusca] = useState('');

  function toggleTaskCompletada(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  const handleSearchChange = (event) => {
    setTermoBusca(event.target.value);

  };

  const filteredTasks = tasks.filter((task) =>
    typeof task.text === 'string' && task.text.toLowerCase().startsWith(pesquisarTermo.toLowerCase())
  );

  function editTask(id, newText, newDescription) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, text: newText, description: newDescription };
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  function editTaskDescricao(id, newDescription) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, description: newDescription };
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  const taskList = filteredTasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <ItemLista
        id={task.id}
        text={task.text}
        completed={task.completed}
        key={task.id}
        toggleTaskCompletada={toggleTaskCompletada}
        deleteTask={deleteTask}
        editTask={editTask}
        description={task.description}
        editTaskDescricao={editTaskDescricao}
        filter={filter}
      />
    ));

  function addTask(task) {
    if (!task.text.trim()) {
      alert('Por favor, insira a tarefa.');
      return;
    }
    const newTask = { id: `todo-${nanoid()}`, text: task.text, completed: false, description: task.description };
    setTasks([...tasks, newTask]);
  }

  const tasksCount = tasks.filter(FILTER_MAP[filter]).length;
  let filterLabel = "";
  switch (filter) {
    case "Ver tudo":
      filterLabel = 'Tarefas no total: ';
      break;
    case "Tarefas Restante":
      filterLabel = 'Tarefas restantes:';
      break;
    case "Tarefas Feitas":
      filterLabel = 'Tarefas feitas: ';
      break;
    default:
      break;
  }

  const message = tasksCount !== 0 ? `${filterLabel} ${tasksCount}` : "";

  const filterList = FILTER_NAMES.map((text) => (
    <BotaoFiltro
      key={text}
      text={text}
      isPressed={text === filter}
      setFiltro={setFiltro}
      tasksCount={tasksCount}
    />
  ))

  return (
    <>
      <div className="principal-header">
        <img
          src="/logo.png"
          alt="Logotipo"
          className="header-logo"
        />
        <h1 className="titulo-header" style={{ fontFamily: 'Quicksand, sans-serif', textAlign: 'center', marginTop: '20px', marginBottom: '20px', marginLeft: '50px', fontSize: '34px', fontWeight: 'bold' }}>
          Lista de Tarefas</h1>
      </div>
      <div className="filtro-list">
        {filterList}
      </div>
      <div className="wrapper">
        <h2 className="titulo-wrapper">O que será adicionado?</h2>

        <input
          type="text"
          className="todo-input"
          placeholder="Pesquise por tarefas"
          value={pesquisarTermo}
          onChange={handleSearchChange}
          style={{
            border: 'none',
            borderRadius: '5px',
            padding: '10px',
            width: '100%',
            outline: 'none',
            fontSize: '14px',
            marginBottom: '5px',
            fontFamily: 'Quicksand, sans-serif',
          }}
        />

        <TodoInput onSubmit={addTask} />

        <ul className='list-wrap' >
          {taskList}
        </ul>

        <div className='todo-count'>
          {message}
        </div>

      </div>
    </>
  );
}

export default Home;
import { useState,useEffect } from 'react';
import ItemLista from '../components/ItemLista';
import TodoInput from '../components/TodoInput';
import BotaoFiltro from '../components/BotaoFiltro';
import axios from 'axios';

/*ToDo:
    Tá criando uma barra lateral quando uma task é adicionada, não sei de onde ela tá vindo
*/

const FILTER_MAP = {
  "Ver tudo": () => true,
  "Tarefas Restante": (task) => !task.completed,
  "Tarefas Feitas": (task) => task.completed,
}

const FILTER_NAMES = Object.keys(FILTER_MAP);

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFiltro] = useState("Ver tudo");
  const [pesquisarTermo, setTermoBusca] = useState('');

  useEffect(() => {
    // Função para carregar as tasks quando o componente for montado
    loadTasks();
  }, []);
  const token = localStorage.getItem('token');
  const loadTasks = async () => {
    try {
       // Obtém o token do localStorage
      const response = await axios.get('http://localhost:3000/api/todo', {
        headers: {
          Authorization: `Bearer ${token}`, // Usa o token para autenticação
        },
      });
      setTasks(response.data.data.todos);
      console.log(response.data.data.todos);
      console.log(tasks);
    } catch (error) {
      console.error('Erro ao carregar as tasks:', error);
    }
  };

  const addTask = async () => {
    try {
      await axios.post(
        'http://localhost:3000/api/create',
        { text: newTaskText },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token salvo globalmente
          },
        }
      );
      setNewTaskText('');
      loadTasks(); // Recarrega as tasks após adicionar uma nova
    } catch (error) {
      console.error('Erro ao adicionar a task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/api/delete/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Token salvo globalmente
        },
      });
      loadTasks(); // Recarrega as tasks após excluir uma
    } catch (error) {
      console.error('Erro ao excluir a task:', error);
    }
  };

  const editTask = async (taskId, newText) => {
    try {
      await axios.put(
        `http://localhost:3000/api/update/${taskId}`,
        { text: newText },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token salvo globalmente
          },
        }
      );
      loadTasks(); // Recarrega as tasks após editar uma
    } catch (error) {
      console.error('Erro ao editar a task:', error);
    }
  };






  /*function toggleTaskCompletada(id) {
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
  function addTask(task) {
    if (!task.text.trim()) {
      alert('Por favor, insira a tarefa.');
      return;
    }
    const newTask = { id: `todo-${nanoid()}`, text: task.text, completed: false, description: task.description };
    setTasks([...tasks, newTask]);
  }*/
  const filteredTasks = tasks.filter((task) =>
    typeof task.text === 'string' && task.text.toLowerCase().startsWith(pesquisarTermo.toLowerCase())
  );
  const taskList = tasks && tasks
  .map((task) => (
    <ItemLista
      id={task.id}
      name={task.name}
      description={task.description}
      status={task.status}
      key={task.id}
      deleteTask={deleteTask}
      editTask={editTask}
      filter={filter}
    />
  ));


  const tasksCount = tasks.length


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
        </div>

      </div>
    </>
  );
}

export default Home;
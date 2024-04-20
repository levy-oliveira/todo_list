import { useState, useEffect } from 'react';
import { nanoid } from "nanoid";
import ItemLista from '../components/ItemLista';
import TodoInput from '../components/TodoInput';
import BotaoFiltro from '../components/BotaoFiltro';
import axios from 'axios';

/*ToDo:
    Tá criando uma barra lateral quando uma task é adicionada, não sei de onde ela tá vindo
*/

const FILTER_MAP = {
  "Ver tudo": () => true, 
  "Tarefas Restante": (task) => !task.status, 
  "Tarefas Feitas": (task) => task.status, 
}

const FILTER_NAMES = Object.keys(FILTER_MAP);

function Home(props) {
  const [tasks, setTasks] = useState(props.tasks || []);
  const [filter, setFiltro] = useState("Ver tudo");
  const [pesquisarTermo, setTermoBusca] = useState('');

  useEffect(() => {
    // Função para carregar as tasks quando o componente for montado
    loadTasks();
  }, []);
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const loadTasks = async () => {
    try {
       // Obtém o token do localStorage
      const response = await axios.get('http://localhost:3000/api/todo', {
        headers: {
          Authorization: `Bearer ${token}`, // Usa o token para autenticação
        },
      });
      setTasks(response.data.data.todos);
      //console.log(response.data.data.todos);
      //console.log(tasks);
    } catch (error) {
      console.error('Erro ao carregar as tasks:', error);
    }
  };

  function toggleTaskCompletada(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        // Atualize localmente a propriedade status
        const updatedTask = { ...task, status: !task.status };
        // Envie a requisição para atualizar no backend
        axios.put(`http://localhost:3000/api/update/${id}`, 
        { 
          "status": updatedTask.status 
        }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then(response => {
          // Se necessário, lide com a resposta do backend aqui
          console.log('Resposta do servidor:', response.data);
        }).catch(error => {
          // Lide com os erros aqui, por exemplo, exibindo uma mensagem de erro
          console.error('Erro ao atualizar tarefa:', error);
        });
        return updatedTask;
      }
      return task;
    });
    // Atualize o estado local com as tarefas atualizadas
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    // Envie a solicitação DELETE para o backend
    axios.delete(`http://localhost:3000/api/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(response => {
      // Se necessário, lide com a resposta do backend aqui
      console.log('Tarefa excluída com sucesso:', response.data);
      // Atualize o estado local após a exclusão bem-sucedida
      const remainingTasks = tasks.filter((task) => id !== task.id);
      setTasks(remainingTasks);
    }).catch(error => {
      // Lide com os erros aqui, por exemplo, exibindo uma mensagem de erro
      console.error('Erro ao excluir tarefa:', error);
    });
  }

  const handleSearchChange = (event) => {
    setTermoBusca(event.target.value);
    
  };

  const filteredTasks = tasks.filter((task) =>
  typeof task.name === 'string' && task.name.toLowerCase().startsWith(pesquisarTermo.toLowerCase())
);

  function editTask(id, newName, newDescription) {
    // Envie a solicitação PATCH para o backend
    axios.put(`http://localhost:3000/api/update/${id}`, { name: newName, description: newDescription }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(response => {
      // Se necessário, lide com a resposta do backend aqui
      console.log('Tarefa editada com sucesso:', response.data);
      // Atualize o estado local após a edição bem-sucedida
      const editedTaskList = tasks.map((task) => {
        if (id === task.id) {
          return { ...task, name: newName, description: newDescription };
        }
        return task;
      });
      setTasks(editedTaskList);
    }).catch(error => {
      // Lide com os erros aqui, por exemplo, exibindo uma mensagem de erro
      console.error('Erro ao editar tarefa:', error);
    });
  }

  function editTaskDescricao(id, newDescription) {
    // Envie a solicitação PATCH para o backend
    axios.put(`http://localhost:3000/api/update/${id}`, { "description": newDescription }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(response => {
      // Se necessário, lide com a resposta do backend aqui
      console.log('Descrição da tarefa editada com sucesso:', response.data);
      // Atualize o estado local após a edição bem-sucedida
      const editedTaskList = tasks.map((task) => {
        if (id === task.id) {
          return { ...task, description: newDescription };
        }
        return task;
      });
      setTasks(editedTaskList);
    }).catch(error => {
      // Lide com os erros aqui, por exemplo, exibindo uma mensagem de erro
      console.error('Erro ao editar descrição da tarefa:', error);
    });
  }

  function addTask(task) {
    if (!task.name.trim()) {
      alert('Por favor, insira a tarefa.');
      return;
    }
  
    // Envie a solicitação POST para o backend
    axios.post(`http://localhost:3000/api/create`, {
      "name": task.name,
      "description": task.description,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then(response => {
      // Se necessário, lide com a resposta do backend aqui
      console.log('Tarefa adicionada com sucesso:', response.data);
      // Atualize o estado local após a adição bem-sucedida
      const newTask = { ...task, id: response.data.id }; // Supondo que o servidor retorne o ID da nova tarefa
      setTasks([...tasks, newTask]);
    }).catch(error => {
      // Lide com os erros aqui, por exemplo, exibindo uma mensagem de erro
      console.error('Erro ao adicionar tarefa:', error);
    });
  }

  const taskList = filteredTasks
  .filter(FILTER_MAP[filter])
  .map((task) => (
    <ItemLista
      id={task.id}
      name={task.name}
      status={task.status}
      toggleTaskCompletada={toggleTaskCompletada}
      deleteTask={deleteTask}
      editTask={editTask}
      description={task.description}
      editTaskDescricao={editTaskDescricao}
      filter={filter}
    />
  ));

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

  const filterList = FILTER_NAMES.map((name) => (
    <BotaoFiltro
      key={name}
      text={name}
      isPressed={name === filter}
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
        <h1 className = "titulo-header" style={{ fontFamily: 'Quicksand, sans-serif', textAlign: 'center', marginTop: '20px',marginBottom: '20px',marginLeft: '50px', fontSize: '34px', fontWeight: 'bold' }}>
          Lista de Tarefas</h1>
      </div>
    <div className = "filtro-list">
    {filterList}
    </div>
    <div className="wrapper">
      <h2 className="titulo-wrapper">Olá {name}</h2>
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
  
      <TodoInput onSubmit={addTask}/>

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
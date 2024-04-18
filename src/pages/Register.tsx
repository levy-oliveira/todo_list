import {useState, SyntheticEvent} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

//Página de registro que é passada como uma função para o app.tsx
const Register = () => {
    //Dados a serem passados para o registro
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //Função que trata do submit do formulário
    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:3000/api/register',{
            name: name,
            email: email,
            password: password,
        });
        console.log(response);
    }
    return (
        <div className='register-background'>
        <div className='register-form'>   
            <form className='form-floating' onSubmit={submit}>
                <img src="logo.png" alt="logo to-do" />
                <h1>Crie uma conta</h1>
                <div className="form-signin">
                    <label htmlFor="name">Nome</label>
                    <input id='name' className="form-control" required 
                    onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="form-signin">
                    <label htmlFor="email">Email</label>
                    <input id='email' type="email" className="form-control" required 
                    onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-signin">
                    <label htmlFor="password">Senha</label>
                    <input id='password' type="password" className="form-control" required 
                    onChange={e => setPassword(e.target.value)}
                    />
                </div>
                {/*<Link className="nav-link" to="/login">Entre na sua conta</Link>*/}
                <button className="submit-bttn" type="submit">Criar</button>
            </form>
        </div>
        </div>
    );
}

export default Register;
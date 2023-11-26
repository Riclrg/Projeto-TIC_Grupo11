import { useState } from "react"
import { useNavigate } from "react-router-dom"

//Tela de login
export default function Login(){
    // vamos criar duas variáveis de estado para username e password   
    // setUsername é uma função que altera o valor de username
    // useState é um hook do ReactJS, cria e inicia a variável de estado
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    // hook do React Router DOM para navegar entre páginas
    const navigate = useNavigate()

    // função que será executada quando o formulário for submetido
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        // previne o comportamento padrão do formulário
        e.preventDefault()
        // vamos verificar se usuário e senha estão corretos
        // vamos conectar assincronamente no backend no endpoint /users?username=xxx
        const resp = await fetch(`http://localhost:3333/tb_usuario/${username}`, {
            method: 'GET'
            })
            .then (resposta => {
                return resposta.json()
            })
        console.log(resp)
        if (resp.length === 0) {
            alert('Usuário / senha incorretos')
        }
        else {
            // usuário encontrado
            // vamos verificar se a senha está correta
            if (resp[0].senha !== password) {
                alert('Usuário / senha incorretos')
            }
            else {
                // senha correta
                // vamos navegar para a página de produtos
                navigate('/Item', {state: {username: username}})
            }
        }
    }

    return (
        <div className="min-h-screen bg-white flex">
                <div className="flex h-full justify-center items-center box-content">
                    <img src="imagem.jpg" alt="" className="w=full h-full objetct-cover "/>
                </div> 
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-80">
                    <div className="mt-6">
                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label className="mt-6 text-black font-semibold" htmlFor="username">
                                    Usuário
                                </label>
                                <input type="text" id="username" value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="appearance-none block w-full py-3 px-4 leading-tight text-gray-700 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gray-500 rounded focus: outline-none" />
                            </div>
                            <div className="mb-4">
                                <label className="mt-6 text-black font-semibold" htmlFor="password">
                                    Senha
                                </label>
                                <input type="password" id="password" value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="appearance-none block w-full py-3 px-4 leading-tight text-gray-700 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gray-500 rounded focus: outline-none" />
                            </div>
                            <div className="mb-4">
                                <button type="submit" 
                                    className="inline-block w-full py-4 px-8 leading-none text-white bg-black hover:bg-gray-800 font-semibold rounded shadow">
                                        Entrar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
       </div>
    )
}
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import COVER_IMAGE from '/imagem.jpg'

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
    const colors = {
        primary:"#060606",
        background: "#f5f5f5",
        disabled: "#D9D9D9"
    }
    
    return (

        <div className="flex items-center justify-center h-screen w-screen ">
            <div className="w-full h-screen flex items-start">
                <div className='absolute top-[0%] left[10%] flex flex-col'></div>
                <img src={COVER_IMAGE} className="w=full h-full objetct-cover"/>
            </div>

            <div className="w-1/2 h-full bg-[#f5f5f5] flex flex-col p-10 justify-around">

                
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-black mb-2 font-semibold" htmlFor="username">
                            Username
                        </label>
                        <input type="text" id="username" value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full bg-transparent text-black py-2 my-1 border-b border-black outline-none focus:outline-none" />
                    </div>

                    <div className="mb-5">
                        <label className="block text-black mb-2 font-semibold" htmlFor="password">
                            Password
                        </label>
                        <input type="password" id="password" value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-transparent text-black py-2 my-1 border-b border-black outline-none focus:outline-none" />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full text-white bg-[#060606] rounded-md p-4 text-center flex-items-center justify-center">
                            Login
                    </button>
                </form>
            </div>
       </div>
    )
}
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdMode, MdOutlineDeleteOutline } from "react-icons/md";
import Menu from "./Menu";

interface FornecedorProps {
  //Tipo de dado
  id_fornecedor: number;
  nm_fornecedor: string;
  telefone: string;
  email: string;
}

export function Fornecedor() {
  // esta variável vai conter o username passado na navegação
  const location = useLocation();
  //Recupera o username
  const username = location.state?.username || "";

  //Vetor de itens
  const [tb_fornecedor, setFornecedor] = useState<FornecedorProps[]>([]);

  //Variáveis de estado para os campos do formulário
  const [nm_fornecedor, setName] = useState("");
  const [telefone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  //Diferencia se vai inserir (id = 0) ou editar (id não for 0) um produto
  const [id_fornecedor, setId] = useState(0);

  //Fazer o hook useEffect para carregar os itens da API
  //Quando a página for carregada ou o username for alterado
  useEffect(() => {
    const buscaFornecedor = async () => {
      try {
        const resp = await fetch(`http://localhost:3333/tb_fornecedor`);
        const tb_fornecedor = await resp.json();
        if (resp.ok) {
          setFornecedor(tb_fornecedor); //Atualiza vetor de itens com dados da API
        } else {
          console.log("Falha na busca por dados");
        }
      } catch (error) {
        console.log(error);
      }
    };
    buscaFornecedor();
  }, [username]);

  //Quando o vetor de itens for alterado, executa a função useEffect
  useEffect(() => {
    setFornecedor(tb_fornecedor); //Atualiza a lista de produtos
  }, [tb_fornecedor]);

  //Função para cadastrar um produto
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //Evita que a página seja recarregada
    //Monta o objeto item
    console.log(`${id_fornecedor} handle`);
    let fornecedor;
    if (id_fornecedor === 0) {
      //Insere
      fornecedor = {
        nm_fornecedor,
        telefone,
        email,
      };
    } else {
      //Atualiza
      fornecedor = {
        nm_fornecedor,
        telefone,
        email,
      };
    }
    let url;
    let verb;
    if (id_fornecedor == 0) {
      //Insere
      url = `http://localhost:3333/tb_fornecedor/add`;
      verb = "POST";
    } else {
      //Atualiza
      url = `http://localhost:3333/tb_fornecedor/update/${id_fornecedor}`;
      verb = "PUT";
    }

    try {
      //Chamar a API para cadastrar o item
      console.log(url);
      console.log(verb);
      const fornecedorCadastrado = await fetch(url, {
        method: verb,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fornecedor),
      }).then((resp) => {
        //Quando o servidor respondeu
        return resp.json(); //Transforma em json
      });
      //Atualiza a lista de itens
      //Monta uma nova lista com a lista anterior + item cadastrado
      if (id_fornecedor === 0) {
        //Insere
        const newFornecedor = [...tb_fornecedor, fornecedorCadastrado];
        console.log(newFornecedor); //Verifique os itens antes de chamar setFornecedor
        setFornecedor(newFornecedor);
      } else {
        //Atualiza
        const updatedItens = tb_fornecedor.map((tb_fornecedor) => {
          return tb_fornecedor.id_fornecedor === id_fornecedor
            ? fornecedorCadastrado
            : tb_fornecedor;
        });
        console.log(updatedItens); //Verifique os itens antes de chamar setFornecedor
        setFornecedor(updatedItens);
      }
    } catch (error) {
      console.log(error);
    }
    setId(0);
    setName("");
    setPhone("");
    setEmail("");
  };

  const handleEdit = (tb_fornecedor: FornecedorProps) => {
    setName(tb_fornecedor.nm_fornecedor);
    setPhone(tb_fornecedor.telefone);
    setEmail(tb_fornecedor.email);
    setId(tb_fornecedor.id_fornecedor); //Vai nos ajudar na criação/edição do item
  };

  //Função para remover um item
  const handleRemove = async (id: number) => {
    let confirma = confirm("Confirma a remoção do item?");
    if (confirma) {
      // requisição DELETE para remover um produto através da API
      await fetch(`http://localhost:3333/tb_fornecedor/delete/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          return response.json();
        })
        .catch((error) => {
          alert(error);
        });
      //Atualiza a lista de itens - removendo o item deletado
      //setFornecedor vai receber como parâmetro a lista de produtos atual
      //Retirando o item que foi removido
      setFornecedor(
        tb_fornecedor.filter((tb_fornecedor) => tb_fornecedor.id_fornecedor !== id)
      );
    }
  };

  return (
    <>
      <div className="w-[25%]">
        <Menu username={username} />
      </div>
      <div>
        <div className="">
          {/* formulário para cadastro de um produto */}
          <form
            onSubmit={handleSubmit}
            className="w-[95%] flex flex-wrap mx-auto mb-4 gap-4 justify-between py-4"
          >
            <div className="w-[50%] h-16 bg-[#c9c9c9] p-2 rounded-xl flex flex-col justify-between">
              <label htmlFor="code" className="text-sm block font-bold ">
                Nome
              </label>
              <input
                type="text"
                id="code"
                value={nm_fornecedor}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-black border-b border-black outline-none focus:outline-none"
              />
            </div>
            <div className="w-[40%] h-16 bg-[#c9c9c9] p-2 rounded-xl flex  flex-col justify-between">
              <label htmlFor="name" className="text-sm block font-bold">
                Telefone
              </label>
              <input
                type="text"
                id="name"
                value={telefone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent text-black border-b border-black outline-none focus:outline-none"
              />
            </div>
            <div className="w-[100%] h-16 bg-[#c9c9c9] p-2 rounded-xl flex flex-col justify-between">
              <label htmlFor="description" className="text-sm block font-bold">
                Email
              </label>
              <textarea
                id="description"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-black border-b border-black outline-none focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-[#060606] rounded-lg p-2 text-center flex-items-center justify-center"
            >
              Criar/Editar Item
            </button>
          </form>
          {/* lista de produtos dentro de uma tabela */}
          <h2 className="w-full font-bold mb-4 text-center">
            {" "}
            Lista de Fornecedores{" "}
          </h2>
          <table className="w-[95%] mx-auto">
            <thead className="bg-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  ID
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  Nome
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  Telefone
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  Email
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  Editar
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tb_fornecedor.map((tb_fornecedor) => (
                <tr className="" key={tb_fornecedor.id_fornecedor}>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    {tb_fornecedor.id_fornecedor}
                  </td>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    {tb_fornecedor.nm_fornecedor}
                  </td>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    {tb_fornecedor.telefone}
                  </td>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    {tb_fornecedor.email}
                  </td>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    <button onClick={() => handleEdit(tb_fornecedor)}>
                      <MdMode size={20} />
                    </button>
                  </td>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    <button onClick={() => handleRemove(tb_fornecedor.id_fornecedor)}>
                      <MdOutlineDeleteOutline size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

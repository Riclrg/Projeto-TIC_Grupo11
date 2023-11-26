import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdMode, MdOutlineDeleteOutline } from "react-icons/md";
import Menu from "./Menu";

interface LocalProps {
  // tipo de dado
  id_sala: number;
  nm_sala: string;
}

export function Local() {
  // esta variável vai conter o username passado na navegação
  const location = useLocation();
  // recupera o username
  const username = location.state?.username || "";

  // vetor de Locais
  const [tb_sala, setLocals] = useState<LocalProps[]>([]);

  // variáveis de estado para os campos do formulário
  const [nm_sala, setLocal] = useState("");
  // diferencia se vai inserir (id = 0) ou editar (id não for 0) um produto
  const [id_sala, setId] = useState(0);

  // fazer o hook useEffect para carregar os Locais da API
  // quando a página for carregada ou o username for alterado
  useEffect(() => {
    const buscaLocais = async () => {
      try {
        const resp = await fetch(`http://localhost:3333/tb_sala`);
        const tb_sala = await resp.json();
        if (resp.ok) {
          setLocals(tb_sala); // atualiza vetor de Locais com dados da API
        } else {
          console.log("Falha na busca por dados");
        }
      } catch (error) {
        console.log(error);
      }
    };
    buscaLocais();
  }, [username]);

  // quando o vetor de Locais for alterado, executa a função useEffect
  useEffect(() => {
    setLocals(tb_sala); // atualiza a lista de Locais
  }, [tb_sala]);

  // função para cadastrar um produto
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // evita que a página seja recarregada
    // monta o objeto produto
    console.log(`${id_sala} handle`);
    let local;
    if (id_sala == 0) {
      // insere
      local = {
        nm_sala,
      };
    } else {
      local = {
        // atualiza
        nm_sala,
      };
    }
    let url;
    let verb;
    if (id_sala == 0) {
      // insere
      url = `http://localhost:3333/tb_sala/add`;
      verb = "POST";
    } else {
      url = `http://localhost:3333/tb_sala/update/${id_sala}`;
      verb = "PUT";
    }

    try {
      // chamar a API para cadastrar o produto
      console.log(url);
      console.log(verb);
      const localCadastrado = await fetch(url, {
        method: verb,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(local),
      }).then((resp) => {
        // quando o servidor respondeu
        return resp.json(); // transforma em json
      });
      //Atualiza a lista de itens
      //Monta uma nova lista com a lista anterior + item cadastrado
      if (id_sala === 0) {
        //Insere
        const newLocal = [...tb_sala, localCadastrado];
        console.log(newLocal); //Verifique os itens antes de chamar setItens
        setLocals(newLocal);
      } else {
        //Atualiza
        const updatedLocal = tb_sala.map((tb_sala) => {
          return tb_sala.id_sala === id_sala ? localCadastrado : tb_sala;
        });
        console.log(updatedLocal); //Verifique os itens antes de chamar setItens
        setLocals(updatedLocal);
      }
    } catch (error) {
      console.log(error);
    }
    setId(0);
    setLocal("");
  };

  // função para remover um produto
  const handleRemove = async (id: number) => {
    let confirma = confirm("Confirma a remoção do produto?");
    if (confirma) {
      // requisição DELETE para remover um produto através da API
      await fetch(`http://localhost:3333/tb_sala/delete/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          return response.json();
        })
        .catch((error) => {
          alert(error);
        });
      // atualiza a lista de Locais - removendo o produto deletado
      // setlocals vai receber como parâmetro a lista de Locais atual
      // retirando o produto que foi removido
      setLocals(tb_sala.filter((tb_sala) => tb_sala.id_sala !== id));
    }
  };

  const handleEdit = (tb_sala: LocalProps) => {
    setLocal(tb_sala.nm_sala);
    setId(tb_sala.id_sala); // vai nos ajudar na criação/edição do produto
  };

  return (
    <>
      <div className=" w-[50%]">
        <Menu username={username} />
      </div>
      <div>
        <div className="">
          {/* formulário para cadastro de um produto */}
          <form
            onSubmit={handleSubmit}
            className="w-[95%] flex flex-wrap mx-auto mb-4 gap-4 justify-between py-4"
          >
            <div className="w-[120%] h-16 bg-[#c9c9c9] p-2 rounded-xl justify-between">
              <label htmlFor="code" className="text-sm block font-bold">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                value={nm_sala}
                onChange={(e) => setLocal(e.target.value)}
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
            Lista de Salas{" "}
          </h2>
          <table className="w-[95%] mx-auto">
            <thead className="bg-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  ID
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  Nome da Sala
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
              {tb_sala.map((tb_sala) => (
                <tr key={tb_sala.id_sala}>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    {tb_sala.id_sala}
                  </td>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    {tb_sala.nm_sala}
                  </td>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    <button onClick={() => handleEdit(tb_sala)}>
                      <MdMode size={20} />
                    </button>
                  </td>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    <button onClick={() => handleRemove(tb_sala.id_sala)}>
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

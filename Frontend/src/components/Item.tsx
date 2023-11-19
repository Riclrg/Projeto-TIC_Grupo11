import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdMode, MdOutlineDeleteOutline } from "react-icons/md";
import Menu from "./Menu";

interface ItemProps {
  //Tipo de dado
  id_item: number;
  cod_item: string;
  nm_item: string;
  des_item: string;
  dt_entrada: string;
  id_fornecedor: string;
  estado_item: string;
  id_sala: string;
}

export function Item() {
  // esta variável vai conter o username passado na navegação
  const location = useLocation();
  //Recupera o username
  const username = location.state?.username || "";

  //Vetor de itens
  const [tb_item, setItens] = useState<ItemProps[]>([]);

  //Cariáveis de estado para os campos do formulário
  const [cod_item, setCod] = useState("");
  const [nm_item, setName] = useState("");
  const [des_item, setDescription] = useState("");
  const [dt_entrada, setDate] = useState("");
  const [id_fornecedor, setSupplier] = useState("");
  const [estado_item, setStatus] = useState("");
  const [id_sala, setLocal] = useState("");
  //Diferencia se vai inserir (id = 0) ou editar (id não for 0) um produto
  const [id_item, setId] = useState(0);

  //Fazer o hook useEffect para carregar os itens da API
  //Quando a página for carregada ou o username for alterado
  useEffect(() => {
    const buscaItens = async () => {
      try {
        const resp = await fetch(`http://localhost:3333/tb_item`);
        const tb_item = await resp.json();
        if (resp.ok) {
          setItens(tb_item); //Atualiza vetor de itens com dados da API
        } else {
          console.log("Falha na busca por dados");
        }
      } catch (error) {
        console.log(error);
      }
    };
    buscaItens();
  }, [username]);

  //Quando o vetor de itens for alterado, executa a função useEffect
  useEffect(() => {
    setItens(tb_item); //Atualiza a lista de produtos
  }, [tb_item]);

  //Função para cadastrar um produto
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //Evita que a página seja recarregada
    //Monta o objeto item
    console.log(`${id_item} handle`);
    let item;
    if (id_item === 0) {
      //Insere
      item = {
        cod_item: parseInt(cod_item, 10), // Converte para número
        nm_item,
        des_item,
        dt_entrada,
        id_fornecedor: parseInt(id_fornecedor, 10), // Converte para número
        estado_item,
        id_sala: parseInt(id_sala, 10), // Converte para número
      };
    }
    else {
      //Atualiza
      item = {
        cod_item: parseInt(cod_item, 10), // Converte para número
        nm_item,
        des_item,
        dt_entrada,
        id_fornecedor: parseInt(id_fornecedor, 10), // Converte para número
        estado_item,
        id_sala: parseInt(id_sala, 10), // Converte para número
      };
    }
    let url;
    let verb;
    if (id_item == 0) {
      //Insere
      url = `http://localhost:3333/tb_item/add`;
      verb = "POST";
    } else {
      //Atualiza
      url = `http://localhost:3333/tb_item/update/${id_item}`;
      verb = "PUT";
    }

    try {
      //Chamar a API para cadastrar o item
      console.log(url);
      console.log(verb);
      const itemCadastrado = await fetch(url, {
        method: verb,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      }).then((resp) => {
        //Quando o servidor respondeu
        return resp.json(); //Transforma em json
      });
      //Atualiza a lista de itens
      //Monta uma nova lista com a lista anterior + item cadastrado
      if (id_item === 0) {
        //Insere
        const newItens = [...tb_item, itemCadastrado];
        console.log(newItens); //Verifique os itens antes de chamar setItens
        setItens(newItens);
      }
      else {
        //Atualiza
        const updatedItens = tb_item.map((tb_item) => {
          return tb_item.id_item === id_item ? itemCadastrado : tb_item;
        });
        console.log(updatedItens); //Verifique os itens antes de chamar setItens
        setItens(updatedItens);
      }
    } 
    catch (error) {
      console.log(error);
    }
    setId(0);
    setCod("");
    setName("");
    setDescription("");
    setStatus("");
    setSupplier("");
    setDate("");
    setLocal("");
  };

  const handleEdit = (tb_item: ItemProps) => {
    setCod(tb_item.cod_item);
    setName(tb_item.nm_item);
    setDescription(tb_item.des_item);
    setDate(tb_item.dt_entrada);
    setSupplier(tb_item.id_fornecedor);
    setStatus(tb_item.estado_item);
    setLocal(tb_item.id_sala);
    console.log(tb_item.id_item);
    setId(tb_item.id_item); //Vai nos ajudar na criação/edição do item
  };

  //Função para remover um item
  const handleRemove = async (id: number) => {
    let confirma = confirm("Confirma a remoção do item?");
    if (confirma) {
      // requisição DELETE para remover um produto através da API
      await fetch(`http://localhost:3333/tb_item/delete/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          return response.json();
        })
        .catch((error) => {
          alert(error);
        });
      //Atualiza a lista de itens - removendo o item deletado
      //setItens vai receber como parâmetro a lista de produtos atual
      //Retirando o item que foi removido
      setItens(tb_item.filter((tb_item) => tb_item.id_item !== id));
    }
  };

  return (
    <>
      <div className="flex-col">
        <Menu username={username} />
      </div>
      <div>
        <div className="">
          {/* formulário para cadastro de um produto */}
          <form
            onSubmit={handleSubmit}
            className="w-[95%] flex flex-wrap mx-auto mb-4 gap-4 justify-between py-4"
          >
            <div className="w-[25%] h-16 bg-[#c9c9c9] p-2 rounded-xl flex flex-col justify-between">
              <label htmlFor="code" className="text-sm block font-bold ">
                Codigo
              </label>
              <input
                type="text"
                id="code"
                value={cod_item}
                onChange={(e) => setCod(e.target.value)}
                className="w-full bg-transparent text-black border-b border-black outline-none focus:outline-none"
              />
            </div>
            <div className="w-[33%] h-16 bg-[#c9c9c9] p-2 rounded-xl flex  flex-col justify-between">
              <label htmlFor="name" className="text-sm block font-bold">
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={nm_item}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-black border-b border-black outline-none focus:outline-none"
              />
            </div>
            <div className="w-[33%] h-16 bg-[#c9c9c9] p-2 rounded-xl flex  flex-col justify-between">
              <label htmlFor="status" className="text-sm block font-bold">
                Estado
              </label>
              <select
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                className="bg-[#c9c9c9] focus:outline-none bg border-b border-black"
              >
                <option>Funcional</option>
                <option>Não Funcional</option>
                <option>Em Manutenção</option>
              </select>
            </div>
            <div className="w-[60%] h-16 bg-[#c9c9c9] p-2 rounded-xl flex flex-col justify-between">
              <label htmlFor="description" className="text-sm block font-bold">
                Descrição
              </label>
              <textarea
                id="description"
                value={des_item}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-transparent text-black border-b border-black outline-none focus:outline-none"
              />
            </div>
            <div className="w-[36%] h-16 bg-[#c9c9c9] p-2 rounded-xl flex  flex-col justify-between">
              <label htmlFor="date" className="text-sm block font-bold">
                Data
              </label>
              <input
                type="date"
                id="date"
                value={dt_entrada}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent text-black border-b border-black outline-none focus:outline-none"
              />
            </div>
            <div className="w-[55%] h-16 bg-[#c9c9c9] p-2 rounded-xl flex  flex-col justify-between">
              <label htmlFor="supplier" className="text-sm block font-bold">
                Fornecedor
              </label>
              <textarea
                id="supplier"
                value={id_fornecedor}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full bg-transparent text-black border-b border-black outline-none focus:outline-none"
              />
            </div>

            <div className="w-[42%] h-16 bg-[#c9c9c9] p-2 rounded-xl flex  flex-col justify-between ">
              <label htmlFor="local" className="text-sm block font-bold">
                Local
              </label>
              <input
                type="string"
                id="local"
                value={id_sala}
                onChange={(e) => setLocal(e.target.value)}
                className="w-full bg-transparent text-black border-b border-black outline-none focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-[#060606] rounded-lg p-2 text-center flex-items-center justify-center">
              Criar/Editar Item
            </button>
          </form>
          {/* lista de produtos dentro de uma tabela */}
          <h2 className="w-full font-bold mb-4 text-center">
            {" "}
            Lista de Patrimônios{" "}
          </h2>
          <table className="w-[95%] mx-auto">
            <thead className="bg-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  ID
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  Codigo
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  Nome
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  Descrição
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  Data
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  Fornecedor
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  Estado
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  Local
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
              {tb_item.map((tb_item) => (
                <tr className="" key={tb_item.id_item}>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    {tb_item.id_item}
                  </td>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    {tb_item.cod_item}
                  </td>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    {tb_item.nm_item}
                  </td>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    {tb_item.des_item}
                  </td>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    {tb_item.dt_entrada}
                  </td>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    {tb_item.id_fornecedor}
                  </td>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    {tb_item.estado_item}
                  </td>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    {tb_item.id_sala}
                  </td>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    <button onClick={() => handleEdit(tb_item)}>
                      <MdMode size={20} />
                    </button>
                  </td>
                  <td className="p-3 text-sm text-gray-800 text-center">
                    <button onClick={() => handleRemove(tb_item.id_item)}>
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

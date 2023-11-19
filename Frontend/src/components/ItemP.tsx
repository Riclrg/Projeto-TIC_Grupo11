// vamos definir as props (propriedades) do componente itemuto
interface ItemProps {
  // tipo de dado
  id: number;
  code: string;
  name: string;
  description: string;
  date: string;
  supplier: string;
  status: string;
  local: string;
}
export function Item(item: ItemProps) {
  return (
    <div className="bg-zinc-900 w-full h-10 text-white rounded m-2 flex items-center justify-center">
      Codigo: {item.code}
      Nome: {item.name}
      Descrição: {item.description}
      Fornecedor: {item.supplier}
      Data: {item.date}
      Estado: {item.status}
      Local: {item.local}
    </div>
  );
}

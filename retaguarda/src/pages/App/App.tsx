import { useEffect, useState } from 'react';
import supa from '../../supabase/client';

import './App.css'
import logo from "../../assets/logo.png";
import componentList from "../../utils/dataType";

function App() {
  const [nav, setNav] = useState(1);

  //register
  const [itemName, setItemName] = useState("");
  const [permissionName, setPermissionName] = useState("");

  //list
  const [dataType, setDataType] = useState([]);
  const [dataTypeSelected, setDataTypeSelected] = useState([]);
  const [permissionList, setPermissionList] = useState([]);

  const [itemList, setItemList] = useState([]);

  //Data
  const [dataPreview, setDataPreview] = useState(null);
  const [data, setData] = useState("");
  const [dataName, setDataName] = useState("");

  //bool
  const [dataToggle, setDataToggle] = useState(false);
  const [itemToggle, setItemToggle] = useState(false);


  const dataFetch = async () => {
    if (dataType.length == 0) {
      const { data, error } = await supa.from("TipoDeDado").select("*");

      if (error == null) {
        setDataType(data);
      }
    }
  }

  const itemFetch = async () => {
    if (dataType.length == 0) {
      const { data, error } = await supa.from("TipoDeItem").select("*");

      if (error == null) {
        setItemList(data);
      }
    }
  }

  const permissaoFetch = async () => {
    if (dataType.length == 0) {
      const { data, error } = await supa.from("Permissao").select("*");

      if (error == null) {
        setPermissionList(data);
      }
    }
  }

  const logOff = async () => {
    const logout = await supa.auth.signOut();
    window.location.reload();
  }

  const registerItemType = async () => {
    if (itemName.length == 0) return alert("Informe nome do item");
    if (dataTypeSelected.length == 0) return alert("Informe ao menos um tipo de dado");

    // Validação
    const { data, error } = await supa.from("TipoDeItem").select("id").eq("nome", itemName);

    if (error != null) return alert("Ocorreu algum erro");

    if (data.length > 0) return alert(`Tipo de item "${itemName}" já cadastrado`);

    const register = await supa.functions.invoke('registerItem', {
      body: JSON.stringify({
        itemName,
        dataTypeList: JSON.stringify(dataTypeSelected),
      })
    });

    if (register.error != null) return alert("Ocorreu algum erro");

    alert("Item cadastrado com sucesso");

    setItemName("");
    setDataTypeSelected([]);
  }

  const registerDataType = async () => {
    if (data.length == 0) return alert("Por favor informe campo HTML desejado");
    if (dataName.length == 0) return alert("Por favor informe nome desejado");

    const register = await supa.from("TipoDeDado").insert([{ nomedodado: dataName, campohtml: data }])

    if (register.error != null) return alert("Ocorreu algum erro");

    alert("Tipo de dado cadastrado com sucesso!");

    setDataPreview(null);
    setData("");
    setDataName("");
  }

  const registerPermission = async () => {
    if (permissionName.length == 0) return alert("Por favor informe campo HTML desejado");

    const register = await supa.from("Permissao").insert([{ nome: permissionName }]).select("*");

    if (register.error != null) return alert("Ocorreu algum erro");

    alert("Permissão cadastrado com sucesso!");

    const newList: any = [...permissionList, register.data[0]];

    setPermissionName("");
    setPermissionList(newList);
  }

  const listDataType = async () => {
    if (data.length == 0) dataFetch();
    setDataToggle(!dataToggle);
  }

  const listItemType = async () => {
    if (data.length == 0) itemFetch();
    setItemToggle(!itemToggle);
  }

  const addDataTypeToList = async (id: number) => {
    const selected = dataType.filter((data: any) => data.id === id)[0];

    const list: any = [...dataTypeSelected, selected];

    setDataTypeSelected(list);
  }

  const numberToHTML = (campohtml: number) => {
    return componentList.filter((item: any) => item.id == campohtml)[0].name;
  }

  const processAction = async () => {
    if (nav == 1) return registerItemType();
    if (nav == 2) return registerDataType();
    if (nav == 3) return registerPermission();
  }

  useEffect(() => {
    dataFetch();
    itemFetch();
    permissaoFetch();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const selected: any = componentList.filter(item => item.id == parseInt(data))[0];

      console.log(selected.component);
      setDataPreview(selected.component);

      console.log(data);
    }
  }, [data]);

  return (
    <div className='page'>
      <button className='btnLogout' onClick={() => logOff()}>Sair</button>
      <div className='container'>
        <img src={logo} alt="logo" className='logo' />
        <main>
          <aside>
            <ul>
              <li className={nav == 1 ? 'active' : ''} onClick={() => setNav(1)}><div className='nav'></div>Tipo item</li>
              <li className={nav == 2 ? 'active' : ''} onClick={() => setNav(2)}><div className='nav'></div>Tipo de dado</li>
              <li className={nav == 3 ? 'active' : ''} onClick={() => setNav(3)}><div className='nav'></div>Permissão</li>
            </ul>
          </aside>
          <section>
            {nav == 1 && (
              <div className='screen'>
                <h1>Cadastro tipo de item</h1>
                <div className='horizontal-50'>
                  <input type="text" placeholder='Digite nome do tipo de item' onChange={(e) => setItemName(e.currentTarget.value)} value={itemName} />
                  <select onChange={(e) => addDataTypeToList(parseInt(e.currentTarget.value))}>
                    <option value="">Selecione um tipo de dado</option>
                    {dataType.map((item: any) => (
                      <option value={item.id}>{item.nomedodado}</option>
                    ))
                    }
                  </select>
                </div>
                {dataTypeSelected.length > 0 ? (
                  <div className='addDataType'>
                    <h4>Adicionados</h4>
                    <ul>
                      {dataTypeSelected.map((item: any) => (
                        <li>{item.nomedodado} <button>X</button></li>
                      ))
                      }
                    </ul>
                  </div>
                ) : (
                  <div className='dataNotFound'>Selecione no minimo um tipo de dado</div>
                )
                }
                <br />
                <h1>Listagem tipo de item <button className='btnToggle' onClick={() => listItemType()}>{(itemToggle) ? "Esconder" : "Ver mais"}</button></h1>
                {itemToggle && (
                  <div className='dataTypeList'>
                    {itemList.map((item: any) => (
                      <div className='item'><p>{item.nome}</p></div>
                    ))
                    }
                  </div>
                )
                }
              </div>
            )}
            {nav == 2 && (
              <div className='screen'>
                <h1>Selecione um tipo de dado</h1>
                <div className='horizontal-50'>
                  <input type="text" placeholder='Nome (ex: Texto)' onChange={(e) => setDataName(e.currentTarget.value)} value={dataName} />
                  <select onChange={(e) => setData(e.currentTarget.value)} value={data}>
                    <option value="">Selecione um tipo de dado</option>
                    {componentList.map((item: any) => (
                      <option value={item.id} >{item.name}</option>
                    ))
                    }
                  </select>
                </div>
                <h1>Preview do componente</h1>
                <div className='htmlPreview'>
                  {dataPreview != null ? (
                    dataPreview
                  ) : (
                    <p>Selecione um tipo de dado</p>
                  )
                  }
                </div>
                <br />
                <h1>Listagem tipo de dado <button className='btnToggle' onClick={() => listDataType()}>{(dataToggle) ? "Esconder" : "Ver mais"}</button></h1>
                {dataToggle && (
                  <div className='dataTypeList'>
                    {dataType.map((item: any) => (
                      <div className='item'><p>{item.nomedodado}</p><small>{numberToHTML(item.campohtml)}</small></div>
                    ))
                    }
                  </div>
                )
                }
              </div>
            )}
            {nav == 3 && (
              <div className='screen'>
                <h1>Cadastrar Permissão</h1>
                <input type="text" placeholder='Digite nome da permissão' onChange={(e) => setPermissionName(e.currentTarget.value)} value={permissionName} />
                <table>
                  <tr>
                    <th>Nome</th>
                  </tr>
                  <tbody>
                    {permissionList.map((item: any) => (
                      <tr><td>{item.nome}</td></tr>
                    ))
                    }
                  </tbody>
                </table>
              </div>
            )}
            <div className='buttons'>
              <button className='prev'>Limpar</button>
              <button className='next' onClick={() => processAction()}>Salvar</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App

import React, { useState, useEffect, use } from 'react';
import './styles/App.css';

// Importar páginas
import { Login } from './pages/Login';
import { Equipamentos } from './pages/Equipamentos';
import { Usuarios} from './pages/Usuarios';


// Importar constantes
import { ADMIN_ROLE, USER_ROLE, TAB_EQUIPAMENTOS, TAB_USUARIOS } from './utils/constants';

function App() {
  // ============================================
  // ESTADO GLOBAL
  // ============================================
  
  const [currentSession, setCurrentSession] = useState({});
  const [currentTab, setCurrentTab] = useState(TAB_EQUIPAMENTOS);
  const [assetData, setAssetData] = useState([]);
  const [isAuthView, setIsAuthView] = useState(true);
  const [toastMessage, setToastMessage] = useState({ show: false, message: '', type: 'sucesso' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [senhaError, setSenhaError] = useState(false);
  const [userData, setUserData] = useState([]);
  const [isSenhaModalOpen, setIsSenhaModalOpen] = useState(false);

  //implementa a persistência da sessão usando localStorage
  useEffect(() => {
    const storedSession = localStorage.getItem('userData');
    if (storedSession) {
      setCurrentSession(JSON.parse(storedSession));
      setIsAuthView(false);
    }
  }, []);

  //==================================
  //FUNÇÕES DE PREENCHIMENTO DE DADOS:
  //===================================

  const loadEquipments = async () => {

      //se não houver token, sai da função
      if (!currentSession.token || currentTab !== TAB_EQUIPAMENTOS) {
        return;
      } ;
      
      //baseurl da API definida no .env
      const baseurl = import.meta.env.VITE_API_URL;

      try {
        //tenta requisitar os dados para a api usand o token para autenticação
        const response = await fetch(`${baseurl}/listarequipamentos`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.token}` // Envia o token para autenticação
          }
        });

        const equipamentos = await response.json();

        if (response.ok) {
          setAssetData(equipamentos.data); // Atualiza os dados dos equipamentos com a resposta da API
        } else {
          mostrarToast(equipamentos.message || 'Erro ao carregar equipamentos', 'erro');
        }
      } catch (error) {
        mostrarToast('Erro ao conectar com o servidor', 'erro');
      }
    };

  const loadUsers = async () => {
    
    //caso não haja token, ou não esteja na aba de usuários, ou o usuário logado não seja admin, sai da função
    if(!currentSession.token || currentTab !== TAB_USUARIOS || currentSession.role !== ADMIN_ROLE) {
      return;
    }

    const baseurl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${baseurl}/listarusuarios`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession.token}`
        }
      });
      const usuarios = await response.json();

      if (response.ok) {
        setUserData(usuarios.data);
      } else {
        mostrarToast(usuarios.message || 'Erro ao carregar usuários', 'erro');
      }
    } catch (error) {
      mostrarToast('Erro ao conectar com o servidor', 'erro');
    }

  };

    // Recarrega os dados sempre que o token, a aba atual ou a visualização de autenticação mudarem
    useEffect(() => {

      // Dispara a função apenas se não estiver na tela de login
      if (!isAuthView) {
        loadEquipments();
        loadUsers();
      }

    }, [currentSession.token, isAuthView, currentTab]);// usa essas variaveis para disparar a função


  // ============================================
  // FUNÇÕES UTILITÁRIAS
  // ============================================
  const mostrarToast = (mensagem, tipo = 'sucesso') => {
    setToastMessage({ show: true, message: mensagem, type: tipo });
    setTimeout(() => setToastMessage({ show: false, message: '', type: 'sucesso' }), 3000);
  };

  // ============================================
  // FUNÇÕES DE AUTENTICAÇÃO
  // ============================================
  const toggleAuth = (mode) => {
    setIsLoginMode(mode === 'login');
  };

  const validarSenhas = (senha, confirmar) => {
    if (senha !== confirmar) {
      setSenhaError(true);
      return false;
    }
    setSenhaError(false);
    return true;
  };

  const handleConfirmarSenhaInput = (e) => {
    const senha = document.getElementById('reg-senha')?.value;
    const confirmar = e.target.value;
    if (senha && confirmar) {
      validarSenhas(senha, confirmar);
    }
  };

  //Função de Login - Envia os dados para a API e monta a sessão atual com os dados retornados (role, user e token)
  const handleLogin = async (e) => {
  e.preventDefault();
 

  const baseurl = import.meta.env.VITE_API_URL;
  
  // Pegando os dados do formulário
  const email = e.target.email.value;
  const senha = e.target.senha.value;


  try {
    const response = await fetch(`${baseurl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }) // enviando um post para a a rota de login
    });


    const data = await response.json(); // Resposta da API

    if (response.ok) {

      const sessionData = {
        role: data.resultado.user.cargo,
        user: data.resultado.user,
        token: data.resultado.token
      }

      setCurrentSession(sessionData);

      //armazena os dados do usuário no localStorage para persistência
      localStorage.setItem('userData', JSON.stringify(sessionData));
      
      setIsAuthView(false); // Libera o acesso ao sistema
      mostrarToast(`Bem-vindo, ${data.resultado.user.nome}!`);
    } else {
      mostrarToast(data.message || 'Credenciais inválidas', 'erro');
    }
  } catch (error) {
    mostrarToast('Erro ao conectar com o servidor', 'erro');
  }
};

//Função para editar a senha do usuário
  const handleEditSenha = async (e) => {
    e.preventDefault();
    const id = editingItem.id;
    const novaSenha = e.target.novaSenha.value;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/editarsenha/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession.token}`
        },
        body: JSON.stringify({ novaSenha })
      });
      const data = await response.json();
      if (response.ok) {
        mostrarToast('Senha atualizada com sucesso!', 'sucesso');
        closeEditModal();
        loadUsers();
      } else {
        mostrarToast(data.message || 'Erro ao atualizar a senha', 'erro');
      }
    } catch (error) {
      mostrarToast('Erro ao conectar com o servidor', 'erro');
    };
  };


  const handleLogout = () => {
    mostrarToast('Logout realizado');
    setTimeout(() => {
      setCurrentSession({ role: null, user: null, token: null });
      setIsAuthView(true);
      // Limpa os dados do localStorage
      localStorage.removeItem('userData');
    }, 1000);
  };

  // ============================================
  // FUNÇÕES DE NAVEGAÇÃO
  // ============================================
  const changeTab = (tab) => {
    setCurrentTab(tab);
  };

  // ============================================
  // FUNÇÕES DE MODAL
  // ============================================
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditEquipamento = (equipamento) => {
    setEditingItem(equipamento);
    setIsEditModalOpen(true);
  };

  const openEditUsuario = (usuario) => {
    setEditingItem(usuario);
    setIsEditModalOpen(true);
  };

  //Cria um modal específico para edição de senha, para evitar confusão com o modal de edição de usuário
  const openEditSenha = (usuario) => {
    setEditingItem(usuario);
    setIsSenhaModalOpen(true);
  };

  const closeSenhaModal = () => {
    setEditingItem(null);
    setIsSenhaModalOpen(false);
  };
  //=====================================================================================================

  const closeEditModal = () => {
    setEditingItem(null);
    setIsEditModalOpen(false);
  };

  //função para salvar as edições de equipamentos e usuários.
  const handleEditSave = async (e) => {
    e.preventDefault();

    // Logica para editar equipamentos
    if (currentTab === TAB_EQUIPAMENTOS && editingItem) {
      //cria um payload com os dados editados, e caso não haja edição em algum campo, mantém o valor anterior.
      const payload = {
        id: editingItem.id,
        patrimonio: e.target.patrimonio?.value || editingItem.patrimonio,
        tipo: e.target.tipo?.value || editingItem.tipo,
        nome: e.target.nome?.value || editingItem.nome,
        setor: e.target.setor?.value || editingItem.setor,
        status: e.target.status?.value || editingItem.status,
        valor: parseFloat(e.target.valor?.value) || editingItem.valor,
        propriedade: e.target.propriedade?.value || editingItem.propriedade,
      };

      try {

        //faz a chamada da API para editar o equipamento, usando o token para autenticação e passando o payload com os dados editados
        const response = await fetch(`${import.meta.env.VITE_API_URL}/editarequipamento/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.token}`
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          mostrarToast('Equipamento atualizado com sucesso!', 'sucesso');
          closeEditModal();
          loadEquipments(); // Recarrega os equipamentos para refletir as mudanças
        }

        if (!response.ok) {
          toastMessage('Erro ao atualizar o equipamento', 'erro');
          return;
        }
  

      } catch (error) {
        mostrarToast('Erro ao atualizar o equipamento', 'erro');
        alert("disparou no catch " + error.message)
      }
    }
    
    // Logica para editar usuários
    if (currentTab === TAB_USUARIOS && editingItem) {
      const payload = {
        id: editingItem.id,
        nome: e.target.nome?.value || editingItem.nome,
        cpf: e.target.cpf?.value || editingItem.cpf,
        dataNascimento: e.target.dataNascimento?.value || editingItem.dataNascimento,
        email: e.target.email?.value || editingItem.email,
        cargo: e.target.cargo?.value || editingItem.role,
      };

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/editarusuario/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.token}`
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          mostrarToast('Usuário atualizado com sucesso!', 'sucesso');
          closeEditModal();
          loadUsers();
        };

        if (!response.ok) {
          mostrarToast('Erro ao atualizar o usuário', 'erro');
          return;
        };
      } catch (error) {
        mostrarToast('Erro ao atualizar o usuário', 'erro');
      };
      
    }
    
    closeEditModal();
  };

  //Função para deletar equipamentos e usuários.
  const handleDelete = async (id, tipo) => {
    if (window.confirm(`Tem certeza que deseja excluir este ${tipo}?`)) {
      if (tipo === 'equipamento') {

        try {
          //chama a API para deletar o equipamento, usando o token para autenticação
          const response = await fetch(`${import.meta.env.VITE_API_URL}/deletarequipamento/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${currentSession.token}`
            }
          });

          if (response.ok) {
            mostrarToast('Equipamento deletado com sucesso!');
            loadEquipments(); // Recarrega os equipamentos para refletir a exclusão
          }
          if (!response.ok) {
            mostrarToast('Erro ao deletar o equipamento', 'erro');
            return;
          };
        }
        catch (error) {
          mostrarToast('Erro ao deletar o equipamento', 'erro');
        };
      }

      if(tipo === 'usuário') {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/deletarusuario/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${currentSession.token}`
            }          
          });

          if (response.ok) {
            mostrarToast('Usuário deletado com sucesso!');
            loadUsers(); // Recarrega os usuários para refletir a exclusão
          }
          if (!response.ok) {
            mostrarToast('Erro ao deletar o usuário', 'erro');
            return;
          };

        } catch (error) {
          mostrarToast('Erro ao deletar o usuário', 'erro');
        }

      }
      
    }
  };

  const handleNovoEquipamento = async (e) => {
    e.preventDefault();
    
    const payload = {
      patrimonio: e.target.patrimonio.value,
      tipo: e.target.tipo.value,
      nome: e.target.nome.value,
      setor: e.target.setor.value,
      status: e.target.status.value,
      valor: parseFloat(e.target.valor.value),
      propriedade: e.target.propriedade.value,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cadastrarequipamento`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession.token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        mostrarToast('Equipamento cadastrado com sucesso!');
        closeModal();
        loadEquipments();
      };

      if (!response.ok) {
        mostrarToast('Erro ao cadastrar o equipamento', 'erro');
        return;
      };

    } catch (error) {
      mostrarToast('Erro ao cadastrar o equipamento', 'erro');
    }
  };

  const handleNovoUsuario = async (e) => {
    e.preventDefault();

    const payload = {
      nome: e.target.nome.value,
      cpf: e.target.cpf.value,
      dataNascimento: e.target.dataNascimento.value,
      email: e.target.email.value,
      senha: e.target.senha.value,
      cargo: e.target.cargo.value
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cadastrarusuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession.token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        mostrarToast('Usuário cadastrado com sucesso!');
        closeModal();
        loadUsers();
      };

      if (!response.ok) {
        mostrarToast('Erro ao cadastrar o usuário', 'erro');
        return;
      };
    } catch (error) {
      mostrarToast('Erro ao cadastrar o usuário', 'erro');
    };

    };

  // ============================================
  // RENDERIZAÇÃO PRINCIPAL
  // ============================================
  return (
    <>
      {/* BARRA DE NAVEGAÇÃO SUPERIOR (PÁGINAS 1 e 2) */}
      {isAuthView && (
        <header className="login-header" id="login-header">
          <div className="login-header__logo">
            <div className="login-header__icone">GA</div>
            <div>
              <span className="login-header__titulo">Gestão de Ativos</span>
              <span className="login-header__subtitulo">Gerenciamento de Inventário</span>
            </div>
          </div>
        </header>
      )}

      {/* PÁGINAS 1 e 2: LOGIN / CADASTRO */}
      {isAuthView && (
        <Login onLogin={handleLogin} />
      )}

      {/* PÁGINAS 3 e 4: SISTEMA (APÓS LOGIN) */}
      {!isAuthView && (
        <div id="app-view">
          <div className="app-layout">
            {/* MENU LATERAL */}
            <aside className="sidebar" id="sidebar">
              <div className="sidebar__header">
                <div className="sidebar__icone">GA</div>
                <div>
                  <div className="sidebar__logo">Gestão de Ativos</div>
                  <div className="sidebar__subtitulo">Segurança e controle</div>
                </div>
              </div>

              <nav className="sidebar__nav">
                {/* Link para PÁGINA 3 */}
                <div 
                  className={`sidebar__link ${currentTab === TAB_EQUIPAMENTOS ? 'sidebar__link--ativo' : ''}`} 
                  onClick={() => changeTab(TAB_EQUIPAMENTOS)}
                >
                  <span className="sidebar__icone" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M9 3v2m6-2v2M9 19v2m6-2v2M5 9h14M5 15h14M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z\'%3E%3C/path%3E%3C/svg%3E')"}}></span>
                  <span>Equipamentos</span>
                </div>

                {/* Link para PÁGINA 4 (só admin) */}
                {currentSession.role === ADMIN_ROLE && (
                  <div 
                    className={`sidebar__link ${currentTab === TAB_USUARIOS ? 'sidebar__link--ativo' : ''}`} 
                    onClick={() => changeTab(TAB_USUARIOS)}
                  >
                    <span className="sidebar__icone" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z\'%3E%3C/path%3E%3C/svg%3E')"}}></span>
                    <span>Usuários</span>
                  </div>
                )}
              </nav>

              <div className="sidebar__footer">
                <div className="sidebar__usuario">
                  <div className="sidebar__avatar">
                    {currentSession.user?.nome?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="sidebar__info">
                    <div className="sidebar__nome">{currentSession.user?.nome || 'Usuário'}</div>
                    <div className="sidebar__cargo">
                      {currentSession.role === ADMIN_ROLE ? 'Administrador' : 'Usuário'}
                    </div>
                  </div>
                </div>
                <button className="sidebar__logout" onClick={handleLogout}>
                  <span>Sair</span>
                </button>
              </div>
            </aside>

            {/* CONTEÚDO PRINCIPAL */}
            <main className="app-conteudo">
              <header className="app-header">
                <h1 className="app-header__titulo">
                  {currentTab === TAB_EQUIPAMENTOS ? 'Equipamentos' : 'Usuários'}
                </h1>
              </header>

              {/* PÁGINA 3: EQUIPAMENTOS */}
              {currentTab === TAB_EQUIPAMENTOS && (
                <Equipamentos 
                  equipamentos={assetData}
                  userData={userData}
                  currentSession={currentSession}
                  userRole={currentSession.role}
                  onEditar={openEditEquipamento}
                  onEditarSenha={openEditSenha}
                  onExcluir={handleDelete}
                  onNovo={openModal}
                />
              )}

              {/* PÁGINA 4: USUÁRIOS */}
              {currentTab === TAB_USUARIOS && currentSession.role === ADMIN_ROLE && (
                <Usuarios 
                  userData={userData}
                  assetData={assetData}
                  userRole={currentSession.role}
                  onEditar={openEditUsuario}
                  onEditarSenha={openEditSenha}
                  onExcluir={handleDelete}
                  onNovo={openModal}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* MODAL NOVO USUÁRIO */}
      {isModalOpen && currentTab === TAB_USUARIOS && (
        <aside className="modal-overlay">
          <div className="modal-corpo">
            <h3>Novo Usuário</h3>
            <form onSubmit={handleNovoUsuario}>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Nome</label>
                <input type="text" name="nome" className="campo-grupo__input" required />
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">CPF</label>
                <input type="text" name="cpf" className="campo-grupo__input" required />
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Data de Nascimento</label>
                <input type="date" name="dataNascimento" className="campo-grupo__input" required />
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Email</label>
                <input type="email" name="email" className="campo-grupo__input" required />
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Senha</label>
                <input type="password" name="senha" id="reg-senha" className="campo-grupo__input" required onInput={handleConfirmarSenhaInput} />
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Confirmar Senha</label>
                <input type="password" name="confirmarSenha" id="reg-confirmar-senha" className={`campo-grupo__input ${senhaError ? 'campo-grupo__input--erro' : ''}`} required onInput={handleConfirmarSenhaInput} />
                {senhaError && <span className="campo-grupo__erro">As senhas não coincidem</span>}
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Cargo</label>
                <select name="cargo" className="campo-grupo__input" required>
                  <option value="USER">Usuário</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div >
                <button type="button" className="btn btn--primario"  onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn--primario">Salvar</button>
              </div>
            </form>
          </div>
        </aside>
      )}

      {/* MODAL NOVO EQUIPAMENTO */}
      {isModalOpen && currentTab === TAB_EQUIPAMENTOS && (
        <aside className="modal-overlay">
          <div className="modal-corpo">
            <h3>Novo Equipamento</h3>
            <form onSubmit={handleNovoEquipamento}>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Patrimônio</label>
                <input type="text" name="patrimonio" className="campo-grupo__input" required />
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Tipo</label>
                <select name="tipo" className="campo-grupo__input" required>
                  <option value="Computador">Computador</option>
                  <option value="Impressora">Impressora</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Teclado">Teclado</option>
                  <option value="Mouse">Mouse</option>
                </select>
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Nome</label>
                <input type="text" name="nome" className="campo-grupo__input" required />
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Setor</label>
                <select name="setor" className="campo-grupo__input" required>
                  <option value="TI">TI</option>
                  <option value="RH">RH</option>
                  <option value="Vendas">Vendas</option>
                  <option value="Financeiro">Financeiro</option>
                </select>
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Status</label>
                <select name="status" className="campo-grupo__input" required>
                  <option value="operante">Operante</option>
                  <option value="atencao">Atenção</option>
                  <option value="inoperante">Inoperante</option>
                </select>
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Valor (R$)</label>
                <input type="number" name="valor" step="0.01" className="campo-grupo__input" required />
              </div>
              <div className="campo-grupo">
                  <label className="campo-grupo__label">Propriedade</label>
                  <select name="propriedade" className="campo-grupo__input" required>
                    <option value="Proprio">Proprio</option>
                    <option value="Locado">Locado</option>
                  </select>
                </div>
              <div >
                <button type="button" className="btn btn--primario"  onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn--primario">Salvar</button>
              </div>
            </form>
          </div>
        </aside>
      )}

      {/* MODAL EDITAR EQUIPAMENTO */}
      {isEditModalOpen && currentTab === TAB_EQUIPAMENTOS && editingItem && (
        <aside className="modal-overlay">
          <div className="modal-corpo">
            <h3>Editar Equipamento</h3>
            <form onSubmit={handleEditSave}>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Patrimônio</label>
                <input type="text" name="patrimonio" defaultValue={editingItem.patrimonio} className="campo-grupo__input" required />
              </div>
              <label className="campo-grupo__label">Tipo</label>
              <select name="tipo" defaultValue={editingItem.tipo} className="campo-grupo__input" required>
                <option value="Computador">Computador</option>
                <option value="Impressora">Impressora</option>
                <option value="Monitor">Monitor</option>
                <option value="Teclado">Teclado</option>
                <option value="Mouse">Mouse</option>
              </select>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Nome</label>
                <input type="text" name="nome" defaultValue={editingItem.nome} className="campo-grupo__input" required />
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Setor</label>
                <select name="setor" defaultValue={editingItem.setor} className="campo-grupo__input" required>
                  <option value="TI">TI</option>
                  <option value="RH">RH</option>
                  <option value="Vendas">Vendas</option>
                  <option value="Financeiro">Financeiro</option>
                </select>
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Status</label>
                <select name="status" defaultValue={editingItem.status} className="campo-grupo__input" required>
                  <option value="operante">Operante</option>
                  <option value="atencao">Atenção</option>
                  <option value="inoperante">Inoperante</option>
                </select>
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Valor</label>
                <input type="number" name="valor" step="0.01" defaultValue={editingItem.valor} className="campo-grupo__input" required />
              </div>
                <div className="campo-grupo">
                  <label className="campo-grupo__label">Propriedade</label>
                  <select name="propriedade" defaultValue={editingItem.propriedade} className="campo-grupo__input" required>
                    <option value="Proprio">Proprio</option>
                    <option value="Locado">Locado</option>
                  </select>
                </div>
              <div >
                <button type="button" className="btn btn--primario"  onClick={closeEditModal}>Cancelar</button>
                <button type="submit" className="btn btn--primario">Salvar</button>
              </div>
            </form>
          </div>
        </aside>
      )}

      {/* MODAL EDITAR USUÁRIO */}
      {isEditModalOpen && currentTab === TAB_USUARIOS && editingItem && (
        <aside className="modal-overlay">
          <div className="modal-corpo">
            <h3>Editar Usuário</h3>
            <form onSubmit={handleEditSave}>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Nome</label>
                <input type="text" name="nome" defaultValue={editingItem.nome} className="campo-grupo__input" required />
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">CPF</label>
                <input type="text" name="cpf" defaultValue={editingItem.cpf} className="campo-grupo__input" required />
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Data de Nascimento</label>
                <input type="date" name="dataNascimento" defaultValue={editingItem.dataNascimento} className="campo-grupo__input" required />
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Email</label>
                <input type="email" name="email" defaultValue={editingItem.email} className="campo-grupo__input" required />
              </div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Cargo</label>
                <select name="role" defaultValue={editingItem.role} className="campo-grupo__input" required>
                  <option value="admin">Administrador</option>
                  <option value="user">Usuário</option>
                </select>
              </div>
              <div>
                <button type="button" className="btn btn--primario"  onClick={closeEditModal}>Cancelar</button>
                <button type="submit" className="btn btn--primario">Salvar</button>
              </div>
            </form>
          </div>
        </aside>
      )}

      {/* MODAL EDITAR SENHA */}
      {isSenhaModalOpen && editingItem &&(
        <aside className="modal-overlay">
          <div className="modal-corpo">
            <h3>Alterar Senha de {editingItem.nome}</h3>
            <form onSubmit={handleEditSenha}>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Nova Senha</label>
                <input type="password" name="novaSenha" className="campo-grupo__input" required />
              </div>
              <div>
              <div className="campo-grupo">
                <label className="campo-grupo__label">Confirmar Nova Senha</label>
                <input type="password" name="confirmarNovaSenha" className={`campo-grupo__input ${senhaError ? 'campo-grupo__input--erro' : ''}`} required onInput={handleConfirmarSenhaInput} />
                {senhaError && <span className="campo-grupo__erro">As senhas não coincidem</span>}
              </div>
                <button type="button" className="btn btn--primario" onClick={closeSenhaModal}>Cancelar</button>
                <button type="submit" className="btn btn--primario">Salvar</button>
              </div>
            </form>
          </div>
        </aside>
      )}

       {/* TOAST */}
      {toastMessage.show && (
        <div className={`alerta-toast ${toastMessage.type === 'erro' ? 'alerta-toast--erro' : ''}`}>
          {toastMessage.message}
        </div>
      )} 
    </>
  );
}

export default App;
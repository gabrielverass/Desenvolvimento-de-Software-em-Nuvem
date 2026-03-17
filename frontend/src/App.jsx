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
  
  //implementa a persistência da sessão usando localStorage
  useEffect(() => {
    const storedSession = localStorage.getItem('userData');
    if (storedSession) {
      setCurrentSession(JSON.parse(storedSession));
      setIsAuthView(false);
    }
  }, []);

  const [currentSession, setCurrentSession] = useState({ role: null, user: null, token: null });
  const [currentTab, setCurrentTab] = useState(TAB_EQUIPAMENTOS);
  const [assetData, setAssetData] = useState([]);
  const [isAuthView, setIsAuthView] = useState(true);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [toastMessage, setToastMessage] = useState({ show: false, message: '', type: 'sucesso' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [senhaError, setSenhaError] = useState(false);

  // Dados dos usuários
  const [userData, setUserData] = useState([
    { id: 1, nome: 'Admin Sistema', email: 'admin@email.com', role: 'admin' },
    { id: 2, nome: 'João Silva', email: 'joao@email.com', role: 'user' },
    { id: 3, nome: 'Maria Santos', email: 'maria@email.com', role: 'user' }
  ]);


  //FUNÇÕES DE PREENCHIMENTO DE DADOS:

  const loadEquipments = async () => {

      //se não houver token, sai da função
      if (!currentSession.token){
        mostrarToast('Token ausente ou inválido', 'erro');
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

  
    // Recarrega os equipamentos sempre que o token ou a visualização de autenticação mudar (ex: após login/logout)
    useEffect(() => {

      // Dispara a função apenas se não estiver na tela de login
      if (!isAuthView) {
        loadEquipments();
      }

    }, [currentSession.token, isAuthView]);// usa essas variaveis para disparar a função


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

      setCurrentSession({
        role: data.resultado.role,
        user: data.resultado.user,
        token: data.resultado.token
      });

      //armazena os dados do usuário no localStorage para persistência
      localStorage.setItem('userData', 
        JSON.stringify({
          role: data.resultado.role,
          user: data.resultado.user,
          token: data.resultado.token
        })
      );
      
      setIsAuthView(false); // Libera o acesso ao sistema
      mostrarToast(`Bem-vindo, ${data.resultado.user.nome}!`);
    } else {
      mostrarToast(data.message || 'Credenciais inválidas', 'erro');
    }
  } catch (error) {
    mostrarToast('Erro ao conectar com o servidor', 'erro');
  }
};

  const handleCadastro = (e) => {
    e.preventDefault();
    const senha = e.target.senha.value;
    const confirmar = e.target.confirmarSenha.value;
    
    if (!validarSenhas(senha, confirmar)) {
      mostrarToast('As senhas não coincidem!', 'erro');
      return;
    }
    
    mostrarToast('Conta criada com sucesso! Faça login.');
    e.target.reset();
    toggleAuth('login');
  };

  const handleLogout = () => {
    mostrarToast('Logout realizado');
    setTimeout(() => {
      setCurrentSession({ role: null, user: null, token: null });
      setIsAuthView(true);
      // Limpa os dados do localStorage
      localStorage.removeItem('token');
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

  const closeEditModal = () => {
    setEditingItem(null);
    setIsEditModalOpen(false);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    
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
    
    if (currentTab === TAB_USUARIOS && editingItem) {
      const nome = e.target.nome?.value;
      const email = e.target.email?.value;
      const role = e.target.role?.value;
      
      const updatedUserData = userData.map(user => 
        user.id === editingItem.id 
          ? { ...user, nome: nome || user.nome, email: email || user.email, role: role || user.role }
          : user
      );
      
      setUserData(updatedUserData);
      
      if (currentSession.user?.id === editingItem.id) {
        setCurrentSession({
          ...currentSession,
          user: { ...currentSession.user, nome, email, role }
        });
      }
      
      mostrarToast('Usuário atualizado com sucesso!');
    }
    
    closeEditModal();
  };

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
          <nav className="login-header__menu">
            <a 
              className={`login-header__link ${isLoginMode ? 'login-header__link--ativo' : ''}`} 
              onClick={() => toggleAuth('login')}
              style={{ cursor: 'pointer' }}
            >
              Login
            </a>
            <a 
              className={`login-header__link ${!isLoginMode ? 'login-header__link--ativo' : ''}`} 
              onClick={() => toggleAuth('cadastro')}
              style={{ cursor: 'pointer' }}
            >
              Cadastro
            </a>
            <a className="login-header__link login-header__link--destaque" href="#" onClick={(e) => { e.preventDefault(); mostrarToast('Demonstração em breve'); }}>
              Demonstração
            </a>
          </nav>
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

                {/* Outros links */}
                <div className="sidebar__link" onClick={() => mostrarToast('Funcionalidade em desenvolvimento')}>
                  <span className="sidebar__icone" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z\'%3E%3C/path%3E%3C/svg%3E')"}}></span>
                  <span>Relatórios</span>
                </div>

                <div className="sidebar__link" onClick={() => mostrarToast('Configurações em desenvolvimento')}>
                  <span className="sidebar__icone" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z\'%3E%3C/path%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M15 12a3 3 0 11-6 0 3 3 0 016 0z\'%3E%3C/path%3E%3C/svg%3E')"}}></span>
                  <span>Configurações</span>
                </div>
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
                  onExcluir={handleDelete}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* MODAL NOVO EQUIPAMENTO */}
      {isModalOpen && (
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
              <div >
                <button type="button" className="btn btn--primario"  onClick={closeEditModal}>Cancelar</button>
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
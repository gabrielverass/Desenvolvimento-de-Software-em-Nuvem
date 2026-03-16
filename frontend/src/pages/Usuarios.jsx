import React from 'react';

// ============================================
// PÁGINA 4: USUÁRIOS
// ============================================

export function Usuarios({ 
  userData, 
  assetData, 
  onEditar, 
  onExcluir,
  userRole 
}) {
  return (
    <div className="app-main">
      <div className="sessao-topo">
        <h2 id="page-title">Usuários</h2>
      </div>

      <div className="tabela-container">
        <table className="tabela-ativos">
          <thead id="table-head">
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Cargo</th>
              <th>Qtd. Equipamentos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="table-body">
            {userData.map(usuario => {
              const qtdEquipamentos = assetData.filter(item => item.userId === usuario.id).length;
              
              return (
                <tr key={usuario.id}>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <span className={`badge ${usuario.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                      {usuario.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </span>
                  </td>
                  <td >
                    <span className="badge" >
                      {qtdEquipamentos}
                    </span>
                  </td>
                  <td>
                    <div class="div-btnEditar" >
                      <button 
                        className="btn-icone btn-editar"
                        onClick={() => onEditar(usuario)}
                        title="Editar usuário"
                      >
                        ✏️
                      </button>
                      
                      {userRole === 'admin' && usuario.role !== 'admin' && (
                        <button 
                          className="btn-icone btn-excluir"
                          onClick={() => onExcluir(usuario.id, 'usuário')}
                          title="Excluir usuário"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

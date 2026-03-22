import React from 'react';
import { ADMIN_ROLE } from '../utils/constants';

// ============================================
// PÁGINA 4: USUÁRIOS
// ============================================

export function Usuarios({ 
  userData,  
  onEditar,
  onEditarSenha, 
  onExcluir,
  userRole,
  onNovo
}) {
  return (
    <div className="app-main">
      <div className="sessao-topo">
        <h2 id="page-title">Usuários</h2>
        <button 
            className="btn btn--primario" 
            style={{ width: 'auto' }} 
            onClick={onNovo}
          >
            + Novo
        </button>
      </div>
      <div className="tabela-container">
        <table className="tabela-ativos">
          <thead id="table-head">
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Cargo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="table-body">
            {userData.map(usuario => {
              return (
                <tr key={usuario.id}>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <span className={`badge ${usuario.cargo === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                      {usuario.cargo === 'ADMIN' ? 'Administrador' : 'Usuário'}
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
                      <button 
                        className="btn-icone btn-editar"
                        onClick={() => onEditarSenha(usuario)}
                        title="Editar senha"
                      >
                        🔒
                      </button>
                   
                      {userRole === ADMIN_ROLE && usuario.role !== ADMIN_ROLE && usuario.id !== JSON.parse(localStorage.getItem('userData')).user.id && (
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

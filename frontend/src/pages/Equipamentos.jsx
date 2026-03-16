import React from 'react';
import { ADMIN_ROLE } from '../utils/constants';

export function Equipamentos({ 
  equipamentos, 
  userData,
  currentSession,
  onEditar,
  onExcluir,
  onNovo,
  userRole
}) {
  
  // Agora usamos diretamente a prop que vem da API
  const listaParaExibir = equipamentos || [];

  return (
    <div className="app-main">
      <div className="sessao-topo">
        <h2 id="page-title">Equipamentos</h2>
        {userRole === ADMIN_ROLE && (
          <button 
            className="btn btn--primario" 
            style={{ width: 'auto' }} 
            onClick={onNovo}
          >
            + Novo
          </button>
        )}
      </div>
    
      <div className="tabela-container">
        <table className="tabela-ativos">
          <thead id="table-head">
            <tr>
              <th>Patrimônio</th>
              <th>Equipamento</th>
              <th>Setor</th>
              <th>Status</th>
              <th>Valor Unit. (R$)</th>
              <th>Qtd</th>
              <th>Valor Total (R$)</th> 
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="table-body">
            {listaParaExibir.length === 0 ? (
              <tr>
                <td colSpan="8">Nenhum equipamento encontrado.</td>
              </tr>
            ) : (
              listaParaExibir.map(item => {
                // Cálculo usando os nomes exatos da sua API (valorUnitario)
                const vUnitario = item.valorUnitario || 0;
                const qtd = item.quantidade || 0;
                const valorTotal = vUnitario * qtd;

                return (
                  <tr key={item.id}>
                    <td>{item.patrimonio}</td>
                    <td>{item.nome}</td>
                    <td>{item.setor}</td>
                    <td>
                      <span className={`badge badge--${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{vUnitario.toFixed(2).replace('.', ',')}</td>
                    <td>{qtd}</td>
                    <td style={{ fontWeight: 'bold' }}>
                      {valorTotal.toFixed(2).replace('.', ',')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn-icone btn-editar"
                          onClick={() => onEditar(item)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        
                        {userRole === ADMIN_ROLE && (
                          <button 
                            className="btn-icone btn-excluir"
                            onClick={() => onExcluir(item.id, 'equipamento')}
                            title="Excluir"
                          >
                            �️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Rodapé com soma total */}
          {listaParaExibir.length > 0 && (
            <tfoot className="table-foot">
              <tr>
                <td id="total" colSpan="5">TOTAL GERAL:</td>
                <td>
                  {listaParaExibir.reduce((acc, item) => acc + (item.quantidade || 0), 0)}
                </td>
                <td id="somatorio" colSpan="2">
                  R$ {listaParaExibir.reduce((acc, item) => acc + ((item.valorUnitario || 0) * (item.quantidade || 0)), 0).toFixed(2).replace('.', ',')}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
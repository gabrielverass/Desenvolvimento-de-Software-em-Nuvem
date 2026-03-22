import React from 'react';

export function Login({ onLogin }) {
  return (
    <main className="sessao-autenticacao">
      <div className="cartao-auth">
        <form id="form-login" onSubmit={onLogin}>
          {/* Cabeçalho do Cartão */}
          <div className="cartao-auth__header">
            <h1 className="cartao-auth__titulo">Login</h1>
            <p className="cartao-auth__subtitulo">Gestão de Ativos</p>
          </div>
          
          {/* Campo E-mail */}
          <div className="campo-grupo">
            <label htmlFor="login-email" className="campo-grupo__label">E-mail Corporativo</label>
            <input 
              type="email" 
              id="login-email" 
              name="email" 
              className="campo-grupo__input" 
              placeholder="seu@email.com" 
              required 
            />
          </div>
          
          {/* Campo Senha */}
          <div className="campo-grupo">
            <label htmlFor="login-senha" className="campo-grupo__label">Senha</label>
            <input 
              type="password" 
              id="login-senha" 
              name="senha" 
              className="campo-grupo__input" 
              placeholder="••••••••" 
              required 
            />
          </div>
          
          {/* Ações */}
          <button type="submit" className="btn btn--primario btn--bloco">
            Entrar no Sistema
          </button>
          
          <div className="cartao-auth__footer">
            <small>Problemas com acesso? Contate o suporte de TI.</small>
          </div>
        </form>
      </div>
    </main>
  );
}
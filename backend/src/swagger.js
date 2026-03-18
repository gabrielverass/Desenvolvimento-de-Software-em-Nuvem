export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'API de Gestão de Ativos',
    version: '1.0.0',
    description: 'API REST para gerenciamento de usuários e ativos.',
  },
  servers: [
    { url: `http://localhost:${process.env.PORT || 5000}`, description: 'Servidor local' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ApiError: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          error: { type: 'string' },
        },
      },
      AuthRequest: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: { type: 'string', format: 'email' },
          senha: { type: 'string' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          resultado: {
            type: 'object',
            properties: {
              user: { type: 'object' },
              token: { type: 'string' },
            },
          },
        },
      },
      UserCreate: {
        type: 'object',
        required: ['nome', 'cpf', 'dataNascimento', 'email', 'senha'],
        properties: {
          nome: { type: 'string' },
          cpf: { type: 'string' },
          dataNascimento: { type: 'string' },
          email: { type: 'string', format: 'email' },
          senha: { type: 'string' },
          cargo: { type: 'string', description: 'Opcional: ADMIN ou usuario' },
        },
      },
      UserListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'array', items: { type: 'object' } },
        },
      },
      UserEditPassword: {
        type: 'object',
        required: ['novaSenha'],
        properties: {
          novaSenha: { type: 'string' },
        },
      },
      AssetCreate: {
        type: 'object',
        required: ['patrimonio', 'tipo', 'nome', 'setor', 'propriedade', 'status', 'valor'],
        properties: {
          patrimonio: { type: 'string' },
          tipo: { type: 'string' },
          nome: { type: 'string' },
          setor: { type: 'string' },
          propriedade: { type: 'string' },
          status: { type: 'string' },
          valor: { type: 'number' },
        },
      },
      AssetListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'array', items: { type: 'object' } },
        },
      },
      AssetResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/login': {
      post: {
        tags: ['Auth'],
        summary: 'Autentica um usuário e retorna um token JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Autenticação bem-sucedida',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '400': {
            description: 'Credenciais inválidas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
              },
            },
          },
        },
      },
    },
    '/cadastrarusuario': {
      post: {
        tags: ['Usuários'],
        summary: 'Cadastra um novo usuário (ADMIN)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserCreate' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Usuário cadastrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    status: { type: 'number' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
              },
            },
          },
          '401': { description: 'Não autenticado' },
          '403': { description: 'Sem permissão (não admin)' },
        },
      },
    },
    '/listarusuarios': {
      get: {
        tags: ['Usuários'],
        summary: 'Lista todos os usuários (ADMIN)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de usuários',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserListResponse' },
              },
            },
          },
          '401': { description: 'Não autenticado' },
          '403': { description: 'Sem permissão (não admin)' },
        },
      },
    },
    '/editarsenha/{id}': {
      put: {
        tags: ['Usuários'],
        summary: 'Altera a senha de um usuário (ADMIN)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID do usuário',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserEditPassword' },
            },
          },
        },
        responses: {
          '200': { description: 'Senha alterada' },
          '400': { description: 'Dados inválidos' },
          '401': { description: 'Não autenticado' },
          '403': { description: 'Sem permissão (não admin)' },
        },
      },
    },
    '/cadastrarequipamento': {
      post: {
        tags: ['Ativos'],
        summary: 'Cadastra um novo equipamento',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AssetCreate' },
            },
          },
        },
        responses: {
          '201': { description: 'Equipamento cadastrado' },
          '400': { description: 'Dados inválidos' },
          '401': { description: 'Não autenticado' },
        },
      },
    },
    '/listarequipamentos': {
      get: {
        tags: ['Ativos'],
        summary: 'Lista todos os equipamentos',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de equipamentos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AssetListResponse' },
              },
            },
          },
          '401': { description: 'Não autenticado' },
        },
      },
    },
    '/buscarequipamento/{patrimonio}': {
      get: {
        tags: ['Ativos'],
        summary: 'Busca equipamento por patrimônio',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'patrimonio',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Equipamento encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AssetResponse' },
              },
            },
          },
          '400': { description: 'Dados inválidos' },
          '401': { description: 'Não autenticado' },
        },
      },
    },
    '/editarequipamento/{id}': {
      put: {
        tags: ['Ativos'],
        summary: 'Edita um equipamento',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AssetCreate' },
            },
          },
        },
        responses: {
          '200': { description: 'Equipamento editado' },
          '400': { description: 'Dados inválidos' },
          '401': { description: 'Não autenticado' },
        },
      },
    },
    '/deletarequipamento/{id}': {
      delete: {
        tags: ['Ativos'],
        summary: 'Deleta um equipamento',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'Equipamento deletado' },
          '401': { description: 'Não autenticado' },
        },
      },
    },
  },
};
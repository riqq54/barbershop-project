# 💈 API: Barbershop Project

API de Gerenciamento para Barbearias desenvolvida como projeto de TCC.

O projeto segue os princípios da **Clean Architecture** (Arquitetura Limpa) e **Domain-Driven Design (DDD)** para garantir um sistema escalável, robusto e de fácil manutenção.

---

## 🎯 Objetivo e Arquitetura

Esta API é a camada de serviços central do sistema, projetada para gerenciar as operações de uma barbearia.

Adotamos uma rigorosa separação de responsabilidades (Clean Architecture):

1.  **Domínio (`src/core`):** Regras de negócio centrais.
2. **Aplicação (`src/app`):** Entidades, Casos de Uso e Contratos de Implementação (Repositórios, etc)
3.  **Infraestrutura (`src/infra`):** Implementação real dos contratos (Repositórios, etc) e a camada de interface (Rotas Fastify).

---

## 📅 Últimas Atualizações

Este log documenta o progresso das funcionalidades e da infraestrutura do projeto:

### 14/10/2025 - Implementação de RBAC e Gerenciamento de Usuários

* ✅ **Controle de Acesso (RBAC):** Adicionado `role` ao *payload* do Token JWT e implementação do *middleware* `verifyUserRole` para autorização baseada em função. Responsabilidade de autorização delegada para a camada de Infraestrutura.
* ✅ **Rotas Protegidas:** Rota `POST /users` configurada para exigir autorização da `role: MANAGER` via `preHandler`.
* 🔄 **Refatoração do Registro:**
    * `RegisterUserUseCase` renomeado para **`RegisterClientUseCase`**.
    * Novo **`CreateUserUseCase`** criado para permitir que Managers cadastrem outros usuários.

### 11/10/2025 - Autenticação e Login Implementados

* ✅ **Autenticação Funcional:** Implementação do **Middleware** `verifyJWT` como `preHandler` para para proteger todas as rotas privadas com verificação JWT.
* 👤 **Perfil de Usuário:** Rota `GET /me` concluída, permitindo que o Front-End valide o token e obtenha os dados do usuário autenticado.
* 🧱 **Padrões:** Uso do **`UserProfilePresenter`** para mapear entidades internas para o contrato de resposta HTTP.
* 🧪 **Qualidade:** Cobertura de testes E2E para o fluxo completo de obtenção do perfil com token.

### 10/10/2025 - Autenticação e Login Implementados

* ✅ **Login Funcional:** Implementação completa da rota `/sessions` para autenticação de usuários.
* 🔐 **Segurança Reforçada:** Uso do **BCrypt** para comparação de senhas (`HashComparer`) e geração de **Tokens JWT** para acesso (`@fastify/jwt`).
* 🧱 **Arquitetura Limpa:** Lógica de autenticação isolada no `AuthenticateUserUseCase` e geração de token no Controller.
* 🧪 **Qualidade:** Testes unitários e testes E2E para o fluxo de Login.

### 07/10/2025 - Configuração de CI/CD Finalizada!

* ✅ **Deploy Finalizado:** A aplicação está rodando no ambiente de produção dentro da plataforma Fly.io.
* ✅ **Build do projeto utilizando Docker Multi-Stage Build:** Uso de estágios de construção com Dockerfile para otimizar o tamanho da imagem final, garantindo a performance e a presença dos artefatos do Prisma.
* ✅ **DB em Produção:** Sucesso na conexão e configuração do banco de dados na plataforma Neon (PostgreSQL).
* ✅ **Migrações Automáticas:** Configuração do `release_command` no arquivo `fly.toml` para garantir que `npx prisma migrate deploy` seja executado a cada novo deploy, sincronizando o DB antes de a API entrar no ar.
* 🛠️ **Ajustes no Docker:** Correção da ordem dos comandos no `Dockerfile` e adição do `COPY --from=builder /app/node_modules/.prisma` para garantir que os artefatos gerados do Prisma Client estejam presentes no container de produção.

### 06/10/2025 - Função de Registro/Cadastro (MVP)

* ✅ **Casos de Uso:** Finalização do `RegisterClientUseCase` (Cadastro).
* ✅ **Segurança:** Implementação do **BCrypt** para hashing de senhas.
* ✅ **Persistência:** Implementação do `PrismaUsersRepository`.
* ✅ **Testes Unitários e E2E:** Cobertura de testes de ponta a ponta para a rota `/accounts` e unitários para o `RegisterClientUseCase`.

### 06/10/2025 - Setup do Projeto

* ✅ **Estrutura:** Configuração inicial da Clean Architecture (Domínio, Aplicação, Infraestrutura).
* ✅ **Tecnologias:** Setup inicial com Fastify, TypeScript, Prisma e Vitest.
---

## ✅ Status Atual do Projeto (MVP de Autenticação)

O fluxo de **Cadastro de Usuário** está completo e funcional, incluindo:

* **Validação:** Zod no controller (`/accounts`).
* **Segurança:** Hashing de senha com BCrypt.
* **Persistência:** Repositório Prisma (PostgreSQL).
* **Qualidade:** Testes unitários teste E2E.

| Endpoint | Método | Descrição | Status |
| :--- | :--- | :--- | :--- |
| `/accounts` | `POST` | Cadastro de novos usuários (Role: CLIENT padrão). | **CONCLUÍDO** |
| `/sessions` | `POST` | Autenticação de usuário e retorno do token JWT. | **CONCLUÍDO** |
| `/me` | `GET` | Retorna o perfil do usuário autenticado (requer JWT). | **CONCLUÍDO** |

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Framework** | **Fastify** | Servidor web de alta performance. |
| **Linguagem** | **TypeScript** | Garante tipagem estática e segurança. |
| **ORM** | **Prisma** | ORM Type-Safe para interação com o DB. |
| **Banco de Dados** | **PostgreSQL** | DB Relacional. |
| **Validação** | **Zod** | Validação de schemas de requisição/resposta. |
| **Segurança** | **BCrypt / JWT** | Hashing de senhas e Tokens de Acesso. |
| **Testes** | **Vitest** | Framework para execução de testes unitários e E2E. |
| **DevOps** | **GitHub Actions** | Integração Contínua (CI). |

---

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos

* **Node.js** (versão 22+)
* **Docker** (Para rodar o banco de dados PostgreSQL localmente)

### 1. Clonar o Repositório

```bash
git clone https://github.com/riqq54/barbershop-project.git
cd barbershop-project
```

### 2. Instalar Dependências

```bash
npm install
```
### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto seguindo o arquivo `.env.example`:

```
# PORT
PORT=3333

# Prisma (Database)
DATABASE_URL="postgresql://user:password@localhost:5432/barbershop-project?schema=public"
```

### 4. Subir a imagem do PostgreSQL com Docker Compose

```bash
docker compose up -d
```

### 5. Executar migrações do PrismaORM

```bash
npx prisma migrate dev
```

### 6. Iniciar servidor HTTP 

```bash
npm run dev
```
---

## 🔧 Comandos de teste:

Executar testes unitários:
```bash
npm run test
```

Executar testes E2E:
```bash
npm run test:e2e
```



## Teste diagrama Mermaid

```mermaid
sequenceDiagram
    participant CLI as Cliente (HTTP)
    participant C as Controller (Fastify)
    participant UC as Use Case (RegisterClient)
    participant H as Hasher (BCrypt)
    participant R as Repository (Prisma)
    participant DB as Banco de Dados (PostgreSQL)

    CLI->>C: POST /accounts {login, senha, name}
    activate C
    C->>C: 1. Validação (Zod)
    C->>UC: 2. execute(props)
    activate UC
    UC->>R: 3. findByLogin(login)
    activate R
    R->>DB: Consulta SELECT *
    activate DB
    DB-->>R: Retorna Usuário ou NULL
    deactivate DB
    
    alt Usuário já existe
        R-->>UC: Retorna Usuário
        UC->>C: 4. left(UserAlreadyExistsError)
        C->>CLI: 409 Conflict
    else Usuário único
        R-->>UC: Retorna NULL
        UC->>H: 4. hashString(senha)
        activate H
        H-->>UC: 5. Retorna senha HASHeada
        deactivate H
        UC->>UC: 6. Cria Entidade User (DDD)
        UC->>R: 7. create(User Entity)
        R->>DB: 8. Insere Novo Usuário
        activate DB
        DB-->>R: Confirma Inserção
        deactivate DB
        R-->>UC: Confirma Criação
        UC-->>C: 9. right(User)
        deactivate UC
        C->>CLI: 201 Created
    end
```

---

## 💻 Desenvolvido por:

Henrique Freitas de Lima
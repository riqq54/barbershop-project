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

### 28/10/2025 - Implementação da Busca de Disponibilidade (UX de Agendamento)

* 🔎 **Funcionalidade Central:** Implementação da rota `GET /appointments/available-times` para que o frontend possa consultar dinamicamente os horários livres.
* 📦 **Use Case:** Criação do `FetchAvailableAppointmentTimesUseCase` (Camada de Aplicação) contendo a lógica complexa de iteração de tempo, checagem de horário de trabalho e conflito com agendamentos existentes.
* 💾 **Persistência:** Implementação do método `findConfirmedByBarberAndDate` nos repositórios In-Memory e Prisma, garantindo que apenas agendamentos *confirmados* (não cancelados/completos) sejam considerados.
* 🚀 **Infraestrutura (Interface):** Criação do `FetchAvailableAppointmentTimesController` usando o método `GET` e `querystring` (design RESTful) para facilitar a reatividade no frontend React.
* 🛡️ **Segurança/Qualidade:** Cobertura completa com **Testes Unitários** para a lógica de tempo e **Teste E2E** validando o fluxo completo da requisição HTTP ao cálculo de disponibilidade no banco.

### 27/10/2025 - Implementação do Módulo de Agendamentos (Appointments)

* 🏗️ **Domínio/Entidade:** Criação da Entidade `Appointment` (`src/app/entities/appointment.ts`) com validação de duração e metadados de rastreamento (`completedAt`, `canceledAt`).
* 📦 **Aplicação:** Implementação do Contrato (`AppointmentsRepository`), do Use Case (`CreateAppointmentUseCase`) e dos **Testes Unitários** correspondentes.
    * 🛡️ **Regra de Negócio Crítica:** O Use Case implementa a checagem de sobreposição de horários (overlapping) para garantir que um barbeiro não tenha agendamentos conflitantes.
    * 🔎 **Integração:** O Use Case utiliza o `ServicesRepository` para obter a `durationInMinutes` do serviço.
* 🚀 **Infraestrutura (Interface):** Criação da rota `POST /appointments` protegida por autenticação de cliente.
    * **Presenter:** Implementação do `AppointmentPresenter` para converter objetos `Date` da Entidade em **strings ISO 8601** (padrão web).
* 🧪 **Qualidade:** **Teste E2E** completo para os cenários de sucesso (`201 Created`) e falha de sobreposição de horário (`409 Conflict`).

### 18/10/2025 - CRUD Completo: Edição de Serviços com Histórico de Preços (SCD Tipo 2)

* ✅ **Edição de Serviços:** Implementação da rota `PUT /services/:id`.
* 💰 **SCD Tipo 2 (Preços):** A complexa Regra de Negócio para o histórico de preços foi movida e encapsulada na Entidade `Service` através do método `service.updatePrice(newValueInCents)`.
    * Se o preço for alterado, o registro de preço **ativo** anterior é marcado com o `endDate` (data de encerramento).
    * Um **novo** registro de `ServicePrice` é criado com o novo valor, garantindo a rastreabilidade histórica.
* 💾 **Persistência Limpa:** O método `repository.save()` no `PrismaServicesRepository` foi adaptado para persistir o estado final do agregado, executando os `UPDATE` (encerrando o preço antigo) e o `CREATE` (adicionando o novo preço) dentro de uma única `$transaction` atômica.
* 🔄 **Conclusão do CRUD:** Finalização do CRUD completo para a entidade `Service`.

### 17/10/2025 - CRUD Completo para Serviços (Soft Delete, Leitura e Listagem)

* ✅ **Soft Delete (Inativação):** Implementação da rota `DELETE /services/:id`.
    * **Padrão DDD:** O Use Case (`DeleteServiceUseCase`) delega a Regra de Negócio para a Entidade (`service.inactivate()`) e utiliza o método **`repository.save()`** para persistir o novo estado (com `deletedAt` preenchido).
    * **HTTP:** Resposta com status `204 No Content` para sucesso.
* ✅ **Busca por ID:** Implementação da rota `GET /services/:id` com status `200 OK`.
* ✅ **Listagem e Busca:** Implementação da rota `GET /services` com **paginação** (`page`) e filtro de **busca por nome (`q`)**.
* 🛡️ **Regra de Negócio (Filtro em Serviços):** O método de leitura (`findMany`) na infraestrutura (Prisma e Mocks) foi ajustado para **filtrar automaticamente** serviços ativos (`deletedAt: null`), garantindo que serviços deletados logicamente não sejam expostos.
* 🔄 **Refatoração:** O método `save(service)` foi implementado nos repositórios (Mock e Prisma) para ser o único responsável pela atualização de entidades existentes, consolidando a persistência.

### 16/10/2025 - Implementação do Módulo de Catálogo: Criação de Serviços 

* 🏗️ **Domínio/Entidade:** Criação da Entidade `Service` (`src/app/entities/service.ts`) com `durationInMinutes` e metadados de rastreamento (`updatedAt` e `deletedAt`).
* 📦 **Aplicação:** Implementação do Contrato (`ServicesRepository`), do Use Case (`CreateServiceUseCase`) e dos **Testes Unitários** correspondentes.
* 💾 **Infraestrutura (Persistência):** Definição do `Service` Model no Prisma, criação do `PrismaServicesMapper` e do `PrismaServicesRepository` para persistência.
* 🚀 **Infraestrutura (Interface):** Criação da rota `POST /services` e do `ServicePresenter` para padronizar a resposta HTTP além do **Teste E2E** correspondente.
* ✅ **Acesso:** Rota protegida por `preHandler` para exigir a `role: MANAGER`.

### 14/10/2025 - Implementação de RBAC, Gerenciamento e Listagem de Usuários

* ✅ **Controle de Acesso (RBAC):** Adicionado `role` ao *payload* do Token JWT e implementação do *middleware* `verifyUserRole` para autorização baseada em função. Responsabilidade de autorização delegada para a camada de Infraestrutura.
* ✅ **Criação de Usuários (Post Users):** Implementação da rota `POST /users` configurada para exigir autorização da `role: MANAGER` via `preHandler`.
* ✅ **Listagem de Usuários (Fetch Users):** Implementação da rota `GET /users` com filtros por `role`, busca genérica que verifica nome e login (`q`) e paginação, exigir autorização da `role: MANAGER` via `preHandler`.
* 🔄 **Refatoração do Registro:**
    * `RegisterUserUseCase` renomeado para **`RegisterClientUseCase`**.

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

## 🛠️ Próximos Módulos e Visão de Futuro

O foco principal do projeto passa a ser a implementação do sistema de Agendamento, que será construído sobre o novo **Módulo de Catálogo**.

### 1. Módulo de Catálogo (Serviços e Produtos)
O **MANAGER** terá acesso completo (CRUD) para gerenciar o catálogo.

| Item | Entidade | Descrição |
| :--- | :--- | :--- |
| **Serviços** | `Service` | Itens agendáveis com `valueInCents` e, crucialmente, **`durationInMinutes`**. |
| **Produtos** | `Product` | Itens de venda (como bebidas/cosméticos) com `valueInCents` e `stock` opcional. |

### 2. Módulo de Agendamento
O workflow de agendamento é o coração do sistema, focado em evitar conflitos de horário.

| Etapa | Acesso | Descrição |
| :--- | :--- | :--- |
| **Disponibilidade** | `CLIENT` / `BARBER` | O sistema deve calcular os *slots* disponíveis para um `Barber` em uma `Date`, subtraindo os horários já reservados com base na `Service.durationInMinutes`. |
| **Agendamento** | `CLIENT` / `BARBER` | Criação de uma entidade `Appointment` no *slot* escolhido, garantindo a atomicidade e a ausência de conflitos. |
| **Conclusão** | `BARBER` | O Barbeiro move o `Appointment` para o *status* `COMPLETED` (substituindo o antigo "registro de atendimento"), registrando possíveis gorjetas. |

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

## Teste de fluxograma

| Etapa | Camada | Agrupamento | Artefato Principal | Ações Chave |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Domínio** | - | **Entidade** (`Service.ts`) | Definir a estrutura e as regras de negócio intrínsecas ao objeto (ex: `Service.create({ name, value })`). |
| **2** | **Aplicação** | Contrato | **Contrato de Repositório** (`ServicesRepository.ts`) | Criar a **interface** (o "Contrato") para a persistência (ex: `save(service: Service)`). A regra de negócio não sabe *como* salvar, apenas *o que* salvar. |
| **3** | **Aplicação** | Fluxo | **Caso de Uso** (`CreateServiceUseCase.ts`) | Implementar a **lógica do fluxo da aplicação** (ex: 1. Valida nome único; 2. Cria Entidade; 3. Chama Repositório; 4. Retorna sucesso/erro). |
| **4** | **Testes** | Aplicação | **Unitários** (`.spec.ts`) | Validar o **Caso de Uso** (Etapa 3) e o **Repositório** (Etapa 5) isoladamente, usando *mocks* para dependências. |
| **5** | **Infraestrutura** | Persistência | **Implementação do Repositório** (`PrismaServicesRepository.ts`) | Implementar o contrato da Etapa 2. É onde ocorre a tradução entre a Entidade do Domínio e a modelagem do Prisma (`Mapper`). |
| **6** | **Infraestrutura** | Interface | **Controller** (`CreateServiceController.ts`) | Expor a rota Fastify. Recebe HTTP, valida com Zod, chama o Caso de Uso (Etapa 3) e envia a resposta HTTP. |
| **7** | **Testes** | Fluxo Completo | **E2E** (`.e2e-spec.ts`) | Testar o fluxo completo do cliente, do envio da requisição HTTP (Controller) à persistência no Banco de Dados. |

```mermaid 
graph TD
    A[Início: Nova Funcionalidade]

    subgraph ZA["Camada de Aplicação App"]
    direction LR

        B(1. Domínio: Entidades e Agregados);
        B --> C(2. Repositório: Contrato Interface);
        C --> D(3. Use Case: Regra de Negócio/Fluxo);
        D --> E(4. Testes Unitários: Validar Use Case e Mocks);

    end

    subgraph ZB["Camada de Infraestrutura"]
    direction LR

        F(5. Persistência: Implementação do Repositório - Prisma);
        F --> G(6. Interface: Controller e Rotas - Fastify);
        G --> H(7. Testes E2E: Validar Fluxo Completo - Controller);

    end

    A --> ZA

    ZA --> ZB

    I[Fim: Feature Implementada];

    ZB --> I

    style A fill:#E8F5E9,stroke:#4CAF50,color:#333;
    style B fill:#BBDEFB,stroke:#2196F3,color:#333;
    
    style C fill:#FFE0B2,stroke:#FF9800,color:#333;
    style D fill:#FFE0B2,stroke:#FF9800,color:#333;
    
    style E fill:#CFD8DC,stroke:#607D8B,color:#333;
    style F fill:#CFD8DC,stroke:#607D8B,color:#333;
    
    style G fill:#F0F4C3,stroke:#CDDC39,color:#333;
    style H fill:#F0F4C3,stroke:#CDDC39,color:#333;
    
    style I fill:#E8F5E9,stroke:#4CAF50,color:#333;
```
---

## 💻 Desenvolvido por:

Henrique Freitas de Lima

## teste

```mermaid
sequenceDiagram
    actor CLI as Cliente (HTTP)
    participant C as Controller (Fastify)
    participant MW as Middleware (verifyUserRole)
    participant UC as Use Case (FetchUser)
    participant R as Repository (PrismaUsers)
    participant DB as Banco de Dados (PostgreSQL)

    CLI->>C: GET /users
    activate C
    
    C->>MW: 1. preHandler: verifyUserRole('MANAGER')
    activate MW
    
    alt Usuário é MANAGER
        MW-->>C: 2. Autorizado (Segue)
        deactivate MW
        
        C->>UC: 3. execute({ page, queryParams })
        activate UC
        
        UC->>R: 4. findMany({ page }, queryParams)
        activate R
        
        R->>R: 5. Constrói Filtros e Paginação
        
        R->>DB: 6. Busca Usuários Paginados
        activate DB
        DB-->>R: 7. Retorna usuários filtrados e contagem total de registros
                
        R->>R: 10. Mapeia Users (toDomain)
        R-->>UC: 11. Retorna { users: User[], totalCount }
        deactivate R
        
        UC-->>C: 12. right({ users, totalCount })
        deactivate UC
        
        C->>C: 13. Mapeia Users (UserProfilePresenter.toHTTP)
        C-->>CLI: 200 OK (Paginated Users + Total Count)
        deactivate C
    else Usuário não é MANAGER
        MW--xCLI: 2. 403 Forbidden (Não Autorizado)
    end
```
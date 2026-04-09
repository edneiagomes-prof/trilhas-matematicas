# Trilhas Matemáticas 🧮

Plataforma gamificada de matemática para o ensino fundamental brasileiro.

## Pré-requisitos

- Node.js 18+
- npm

## Configuração

```bash
# Instalar dependências
npm install

# Gerar o Prisma Client
npx prisma generate

# Criar o banco de dados e rodar as migrações
npx prisma migrate dev --name init

# Popular o banco com dados de exemplo
npm run seed
```

## Executar

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Credenciais padrão

| Tipo      | Usuário    | Senha      |
|-----------|------------|------------|
| Professor | professor  | senha123   |
| Aluno     | ana        | aluno123   |
| Aluno     | bruno      | aluno123   |
| Aluno     | carla      | aluno123   |
| Aluno     | diego      | aluno123   |
| Aluno     | elena      | aluno123   |

## Funcionalidades

- **Login** com sessão segura (iron-session)
- **Painel do Professor**: visão geral de turmas, alunos e XP, criação de alunos, redefinição de senhas
- **Painel do Aluno**: trilhas de aventura gamificadas com 4 semanas × 4 missões × 4 questões
- **Quiz interativo**: responda questões de múltipla escolha e ganhe XP
- **Progresso visual**: barra de XP, níveis (Aprendiz → Explorador → Estrategista → Mestre)

## Estrutura

```
src/
  app/           # Páginas e rotas Next.js 14 (App Router)
  components/    # Componentes reutilizáveis
  lib/           # Prisma, sessão e autenticação
prisma/
  schema.prisma  # Esquema do banco de dados (SQLite)
  seed.ts        # Dados iniciais
```
Plataforma gamificada para estudantes do 3º ano fundamental

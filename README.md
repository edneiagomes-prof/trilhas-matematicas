# Trilhas Matemáticas 🧮

Plataforma gamificada de matemática para o ensino fundamental brasileiro.

## Pré-requisitos

- Node.js 18+
- npm

## Configuração (primeira vez)

```bash
# Instalar dependências
npm install

# Criar o banco de dados e aplicar as migrações
npx prisma migrate dev

# Popular o banco com dados de exemplo
npm run seed
```

## Executar

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Atualizando o banco de dados (após puxar novas alterações)

Sempre que houver uma nova migração no repositório, execute:

```bash
# Aplicar as migrações pendentes
npx prisma migrate dev

# Re-popular o banco com os dados atualizados
npm run seed
```

> **Importante:** após atualizar o banco, faça **logout** e **login** novamente no navegador para que a sessão reflita os novos campos.

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
- **Painel do Professor**:
  - Visão geral de turmas, alunos e XP
  - Criação de alunos com nível inicial e turma
  - Criação de novos professores
  - Exclusão de alunos
  - Redefinição de senhas e alteração de trilha (nível) do aluno
  - Filtro por turma e por nível
  - Criação e edição de missões com questões e feedbacks personalizados
- **Painel do Aluno**: trilhas de aventura gamificadas com 4 semanas × 4 missões, filtradas pelo nível do aluno
- **Quiz interativo**: responda questões de múltipla escolha, ganhe XP e veja feedbacks personalizados
- **Trilhas coloridas por nível**: ⬜ Branco → 🔵 Azul → 🟡 Amarelo → 🔴 Vermelho

## Estrutura

```
src/
  app/           # Páginas e rotas Next.js 15 (App Router)
  components/    # Componentes reutilizáveis
  lib/           # Prisma, sessão e autenticação
prisma/
  schema.prisma  # Esquema do banco de dados (SQLite)
  seed.js        # Dados iniciais
scripts/
  start.sh       # Script de inicialização (migrações + seed + next start)
```
Plataforma gamificada para estudantes do 3º ano fundamental

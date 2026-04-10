-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "turmaId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Turma" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Trilha" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "semana" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Missao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trilhaId" INTEGER NOT NULL,
    "nivel" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "xp" INTEGER NOT NULL,
    CONSTRAINT "Missao_trilhaId_fkey" FOREIGN KEY ("trilhaId") REFERENCES "Trilha" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Questao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "missaoId" INTEGER NOT NULL,
    "enunciado" TEXT NOT NULL,
    "opcaoA" TEXT NOT NULL,
    "opcaoB" TEXT NOT NULL,
    "opcaoC" TEXT NOT NULL,
    "opcaoD" TEXT NOT NULL,
    "correta" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    CONSTRAINT "Questao_missaoId_fkey" FOREIGN KEY ("missaoId") REFERENCES "Missao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tentativa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "missaoId" INTEGER NOT NULL,
    "pontos" INTEGER NOT NULL,
    "xpGanho" INTEGER NOT NULL,
    "respostas" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Tentativa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tentativa_missaoId_fkey" FOREIGN KEY ("missaoId") REFERENCES "Missao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Turma_nome_key" ON "Turma"("nome");

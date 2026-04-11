-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Missao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trilhaId" INTEGER NOT NULL,
    "nivel" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "xp" INTEGER NOT NULL,
    "bloqueada" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Missao_trilhaId_fkey" FOREIGN KEY ("trilhaId") REFERENCES "Trilha" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Missao" ("descricao", "id", "nivel", "titulo", "trilhaId", "xp") SELECT "descricao", "id", "nivel", "titulo", "trilhaId", "xp" FROM "Missao";
DROP TABLE "Missao";
ALTER TABLE "new_Missao" RENAME TO "Missao";
CREATE TABLE "new_Trilha" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "semana" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL,
    "bloqueada" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Trilha" ("id", "ordem", "semana", "titulo") SELECT "id", "ordem", "semana", "titulo" FROM "Trilha";
DROP TABLE "Trilha";
ALTER TABLE "new_Trilha" RENAME TO "Trilha";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

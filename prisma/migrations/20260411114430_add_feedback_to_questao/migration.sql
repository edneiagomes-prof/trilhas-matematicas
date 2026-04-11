-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Questao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "missaoId" INTEGER NOT NULL,
    "enunciado" TEXT NOT NULL,
    "opcaoA" TEXT NOT NULL,
    "opcaoB" TEXT NOT NULL,
    "opcaoC" TEXT NOT NULL,
    "opcaoD" TEXT NOT NULL,
    "correta" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "feedbackCorreto" TEXT NOT NULL DEFAULT '',
    "feedbackErrado" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Questao_missaoId_fkey" FOREIGN KEY ("missaoId") REFERENCES "Missao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Questao" ("correta", "enunciado", "id", "missaoId", "opcaoA", "opcaoB", "opcaoC", "opcaoD", "ordem") SELECT "correta", "enunciado", "id", "missaoId", "opcaoA", "opcaoB", "opcaoC", "opcaoD", "ordem" FROM "Questao";
DROP TABLE "Questao";
ALTER TABLE "new_Questao" RENAME TO "Questao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

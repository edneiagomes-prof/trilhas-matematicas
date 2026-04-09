import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Limpar dados
  await prisma.tentativa.deleteMany();
  await prisma.questao.deleteMany();
  await prisma.missao.deleteMany();
  await prisma.trilha.deleteMany();
  await prisma.user.deleteMany();
  await prisma.turma.deleteMany();

  // Criar turmas
  const turma3C = await prisma.turma.create({ data: { nome: "3º C" } });
  const turma3D = await prisma.turma.create({ data: { nome: "3º D" } });
  console.log("✅ Turmas criadas");

  // Criar professor
  const senhaProf = await bcrypt.hash("senha123", 10);
  await prisma.user.create({
    data: {
      username: "professor",
      name: "Professor",
      password: senhaProf,
      role: "teacher",
    },
  });
  console.log("✅ Professor criado");

  // Criar alunos de exemplo
  const alunosData = [
    { username: "ana", name: "Ana Clara", turmaId: turma3C.id },
    { username: "bruno", name: "Bruno Silva", turmaId: turma3C.id },
    { username: "carla", name: "Carla Mendes", turmaId: turma3C.id },
    { username: "diego", name: "Diego Souza", turmaId: turma3D.id },
    { username: "elena", name: "Elena Costa", turmaId: turma3D.id },
  ];
  for (const a of alunosData) {
    const senha = await bcrypt.hash("aluno123", 10);
    await prisma.user.create({
      data: { ...a, password: senha, role: "student" },
    });
  }
  console.log("✅ Alunos de exemplo criados");

  // Semana 1: Sequências e Padrões
  const trilha1 = await prisma.trilha.create({
    data: { titulo: "Sequências e Padrões", semana: 1, ordem: 1 },
  });

  await prisma.missao.create({
    data: {
      trilhaId: trilha1.id,
      nivel: 1,
      titulo: "Primeiros Passos",
      descricao: "Descubra os padrões das sequências numéricas!",
      xp: 10,
      questoes: {
        create: [
          {
            enunciado: "Qual é o próximo número da sequência: 2, 4, 6, 8, ___?",
            opcaoA: "9",
            opcaoB: "10",
            opcaoC: "11",
            opcaoD: "12",
            correta: "B",
            ordem: 1,
          },
          {
            enunciado: "Complete a sequência: 5, 10, 15, 20, ___?",
            opcaoA: "22",
            opcaoB: "23",
            opcaoC: "25",
            opcaoD: "30",
            correta: "C",
            ordem: 2,
          },
          {
            enunciado: "Qual é o número que falta: 1, 3, ___, 7, 9?",
            opcaoA: "4",
            opcaoB: "5",
            opcaoC: "6",
            opcaoD: "8",
            correta: "B",
            ordem: 3,
          },
          {
            enunciado: "Quantos são os números pares entre 1 e 10?",
            opcaoA: "4",
            opcaoB: "5",
            opcaoC: "6",
            opcaoD: "3",
            correta: "B",
            ordem: 4,
          },
        ],
      },
    },
  });

  await prisma.missao.create({
    data: {
      trilhaId: trilha1.id,
      nivel: 2,
      titulo: "Detetive dos Números",
      descricao: "Use seu raciocínio para encontrar padrões escondidos!",
      xp: 15,
      questoes: {
        create: [
          {
            enunciado: "Qual é o próximo número: 3, 6, 9, 12, ___?",
            opcaoA: "13",
            opcaoB: "14",
            opcaoC: "15",
            opcaoD: "16",
            correta: "C",
            ordem: 1,
          },
          {
            enunciado: "Na sequência 100, 90, 80, 70, ___, qual vem depois?",
            opcaoA: "65",
            opcaoB: "60",
            opcaoC: "55",
            opcaoD: "50",
            correta: "B",
            ordem: 2,
          },
          {
            enunciado: "Qual é o padrão: 2, 4, 8, 16, ___?",
            opcaoA: "18",
            opcaoB: "24",
            opcaoC: "32",
            opcaoD: "20",
            correta: "C",
            ordem: 3,
          },
          {
            enunciado: "Complete: 50, 45, 40, 35, ___?",
            opcaoA: "34",
            opcaoB: "33",
            opcaoC: "32",
            opcaoD: "30",
            correta: "D",
            ordem: 4,
          },
        ],
      },
    },
  });

  await prisma.missao.create({
    data: {
      trilhaId: trilha1.id,
      nivel: 3,
      titulo: "Explorador de Padrões",
      descricao: "Padrões complexos esperam por você!",
      xp: 20,
      questoes: {
        create: [
          {
            enunciado: "Qual número falta: 1, 4, 9, 16, ___, 36?",
            opcaoA: "20",
            opcaoB: "25",
            opcaoC: "22",
            opcaoD: "28",
            correta: "B",
            ordem: 1,
          },
          {
            enunciado: "Sequência de ímpares: 1, 3, 5, 7, ___?",
            opcaoA: "8",
            opcaoB: "9",
            opcaoC: "10",
            opcaoD: "11",
            correta: "B",
            ordem: 2,
          },
          {
            enunciado: "Na tabuada do 4: 4, 8, 12, ___, 20?",
            opcaoA: "14",
            opcaoB: "15",
            opcaoC: "16",
            opcaoD: "18",
            correta: "C",
            ordem: 3,
          },
          {
            enunciado: "Qual vem depois: 10, 20, 30, 40, ___?",
            opcaoA: "45",
            opcaoB: "50",
            opcaoC: "55",
            opcaoD: "60",
            correta: "B",
            ordem: 4,
          },
        ],
      },
    },
  });

  await prisma.missao.create({
    data: {
      trilhaId: trilha1.id,
      nivel: 4,
      titulo: "Mestre das Sequências",
      descricao: "O desafio máximo das sequências!",
      xp: 25,
      questoes: {
        create: [
          {
            enunciado: "Qual é o 10º número da tabuada do 7?",
            opcaoA: "63",
            opcaoB: "70",
            opcaoC: "77",
            opcaoD: "56",
            correta: "B",
            ordem: 1,
          },
          {
            enunciado: "Quantos números ímpares existem entre 1 e 20?",
            opcaoA: "8",
            opcaoB: "9",
            opcaoC: "10",
            opcaoD: "11",
            correta: "C",
            ordem: 2,
          },
          {
            enunciado:
              "Sequência: 1, 2, 4, 7, 11, ___? (a diferença aumenta de 1 em 1)",
            opcaoA: "15",
            opcaoB: "14",
            opcaoC: "16",
            opcaoD: "13",
            correta: "C",
            ordem: 3,
          },
          {
            enunciado: "Na sequência 5, 10, 20, 40, ___, qual é o próximo?",
            opcaoA: "60",
            opcaoB: "70",
            opcaoC: "80",
            opcaoD: "75",
            correta: "C",
            ordem: 4,
          },
        ],
      },
    },
  });
  console.log("✅ Trilha 1 criada");

  // Semana 2: Fortaleza do Milhar
  const trilha2 = await prisma.trilha.create({
    data: { titulo: "Fortaleza do Milhar", semana: 2, ordem: 2 },
  });

  await prisma.missao.create({
    data: {
      trilhaId: trilha2.id,
      nivel: 1,
      titulo: "Portão dos Centenas",
      descricao: "Aprenda sobre centenas e dezenas!",
      xp: 10,
      questoes: {
        create: [
          {
            enunciado: "Quantas dezenas tem o número 150?",
            opcaoA: "1",
            opcaoB: "5",
            opcaoC: "15",
            opcaoD: "10",
            correta: "C",
            ordem: 1,
          },
          {
            enunciado: "O número 345 tem quantas centenas?",
            opcaoA: "3",
            opcaoB: "4",
            opcaoC: "5",
            opcaoD: "34",
            correta: "A",
            ordem: 2,
          },
          {
            enunciado: "Qual é o valor do algarismo 7 em 370?",
            opcaoA: "7",
            opcaoB: "70",
            opcaoC: "700",
            opcaoD: "7000",
            correta: "B",
            ordem: 3,
          },
          {
            enunciado: "Quantas unidades tem o número 209?",
            opcaoA: "2",
            opcaoB: "0",
            opcaoC: "9",
            opcaoD: "209",
            correta: "C",
            ordem: 4,
          },
        ],
      },
    },
  });

  await prisma.missao.create({
    data: {
      trilhaId: trilha2.id,
      nivel: 2,
      titulo: "Salão das Adições",
      descricao: "Pratique adições com números grandes!",
      xp: 15,
      questoes: {
        create: [
          {
            enunciado: "Quanto é 250 + 130?",
            opcaoA: "370",
            opcaoB: "380",
            opcaoC: "360",
            opcaoD: "390",
            correta: "B",
            ordem: 1,
          },
          {
            enunciado: "Quanto é 400 + 256?",
            opcaoA: "646",
            opcaoB: "656",
            opcaoC: "660",
            opcaoD: "650",
            correta: "B",
            ordem: 2,
          },
          {
            enunciado: "325 + 475 = ?",
            opcaoA: "790",
            opcaoB: "800",
            opcaoC: "810",
            opcaoD: "795",
            correta: "B",
            ordem: 3,
          },
          {
            enunciado: "Quanto é 199 + 1?",
            opcaoA: "190",
            opcaoB: "199",
            opcaoC: "200",
            opcaoD: "210",
            correta: "C",
            ordem: 4,
          },
        ],
      },
    },
  });

  await prisma.missao.create({
    data: {
      trilhaId: trilha2.id,
      nivel: 3,
      titulo: "Torre das Subtrações",
      descricao: "Derrote os desafios de subtração!",
      xp: 20,
      questoes: {
        create: [
          {
            enunciado: "Quanto é 500 - 250?",
            opcaoA: "200",
            opcaoB: "250",
            opcaoC: "300",
            opcaoD: "150",
            correta: "B",
            ordem: 1,
          },
          {
            enunciado: "735 - 215 = ?",
            opcaoA: "510",
            opcaoB: "520",
            opcaoC: "530",
            opcaoD: "500",
            correta: "B",
            ordem: 2,
          },
          {
            enunciado: "1000 - 1 = ?",
            opcaoA: "989",
            opcaoB: "998",
            opcaoC: "999",
            opcaoD: "990",
            correta: "C",
            ordem: 3,
          },
          {
            enunciado: "Quanto é 600 - 358?",
            opcaoA: "232",
            opcaoB: "242",
            opcaoC: "252",
            opcaoD: "262",
            correta: "B",
            ordem: 4,
          },
        ],
      },
    },
  });

  await prisma.missao.create({
    data: {
      trilhaId: trilha2.id,
      nivel: 4,
      titulo: "Guardião do Milhar",
      descricao: "O desafio supremo dos números grandes!",
      xp: 25,
      questoes: {
        create: [
          {
            enunciado: "Qual é o maior número de 3 algarismos?",
            opcaoA: "899",
            opcaoB: "989",
            opcaoC: "998",
            opcaoD: "999",
            correta: "D",
            ordem: 1,
          },
          {
            enunciado: "Quantas centenas tem o número 1.000?",
            opcaoA: "1",
            opcaoB: "10",
            opcaoC: "100",
            opcaoD: "1000",
            correta: "B",
            ordem: 2,
          },
          {
            enunciado: "850 + 150 = ?",
            opcaoA: "900",
            opcaoB: "950",
            opcaoC: "1000",
            opcaoD: "1050",
            correta: "C",
            ordem: 3,
          },
          {
            enunciado:
              "Qual número é composto por 7 centenas, 3 dezenas e 5 unidades?",
            opcaoA: "735",
            opcaoB: "753",
            opcaoC: "573",
            opcaoD: "537",
            correta: "A",
            ordem: 4,
          },
        ],
      },
    },
  });
  console.log("✅ Trilha 2 criada");

  // Semana 3: Mercado dos Números
  const trilha3 = await prisma.trilha.create({
    data: { titulo: "Mercado dos Números", semana: 3, ordem: 3 },
  });

  await prisma.missao.create({
    data: {
      trilhaId: trilha3.id,
      nivel: 1,
      titulo: "Feirinha das Frutas",
      descricao: "Calcule preços e quantidades na feirinha!",
      xp: 10,
      questoes: {
        create: [
          {
            enunciado:
              "Maria comprou 3 maçãs por R$2,00 cada. Quanto gastou?",
            opcaoA: "R$4,00",
            opcaoB: "R$5,00",
            opcaoC: "R$6,00",
            opcaoD: "R$7,00",
            correta: "C",
            ordem: 1,
          },
          {
            enunciado:
              "João tinha R$10,00 e gastou R$4,50. Quanto sobrou?",
            opcaoA: "R$5,00",
            opcaoB: "R$5,50",
            opcaoC: "R$6,00",
            opcaoD: "R$6,50",
            correta: "B",
            ordem: 2,
          },
          {
            enunciado:
              "Uma dúzia de ovos custa R$12,00. Quanto custa meia dúzia?",
            opcaoA: "R$4,00",
            opcaoB: "R$5,00",
            opcaoC: "R$6,00",
            opcaoD: "R$7,00",
            correta: "C",
            ordem: 3,
          },
          {
            enunciado:
              "Se 1 kg de banana custa R$3,00, quanto custam 4 kg?",
            opcaoA: "R$9,00",
            opcaoB: "R$10,00",
            opcaoC: "R$11,00",
            opcaoD: "R$12,00",
            correta: "D",
            ordem: 4,
          },
        ],
      },
    },
  });

  await prisma.missao.create({
    data: {
      trilhaId: trilha3.id,
      nivel: 2,
      titulo: "Padaria dos Problemas",
      descricao: "Resolva problemas com compras e troco!",
      xp: 15,
      questoes: {
        create: [
          {
            enunciado:
              "Paguei R$20,00 por um produto de R$14,00. Qual é o troco?",
            opcaoA: "R$4,00",
            opcaoB: "R$5,00",
            opcaoC: "R$6,00",
            opcaoD: "R$7,00",
            correta: "C",
            ordem: 1,
          },
          {
            enunciado: "Ana comprou 5 pães a R$1,50 cada. Quanto gastou?",
            opcaoA: "R$6,00",
            opcaoB: "R$7,00",
            opcaoC: "R$7,50",
            opcaoD: "R$8,00",
            correta: "C",
            ordem: 2,
          },
          {
            enunciado:
              "Numa promoção, 3 sucos por R$9,00. Qual o preço de cada?",
            opcaoA: "R$2,00",
            opcaoB: "R$3,00",
            opcaoC: "R$4,00",
            opcaoD: "R$5,00",
            correta: "B",
            ordem: 3,
          },
          {
            enunciado:
              "Pedro tem R$15,00 e quer comprar um brinquedo de R$22,00. Quanto falta?",
            opcaoA: "R$5,00",
            opcaoB: "R$6,00",
            opcaoC: "R$7,00",
            opcaoD: "R$8,00",
            correta: "C",
            ordem: 4,
          },
        ],
      },
    },
  });

  await prisma.missao.create({
    data: {
      trilhaId: trilha3.id,
      nivel: 3,
      titulo: "Supermercado dos Desafios",
      descricao: "Problemas mais complexos de compras!",
      xp: 20,
      questoes: {
        create: [
          {
            enunciado:
              "Numa turma de 30 alunos, metade são meninas. Quantas meninas há?",
            opcaoA: "10",
            opcaoB: "12",
            opcaoC: "15",
            opcaoD: "20",
            correta: "C",
            ordem: 1,
          },
          {
            enunciado:
              "Uma caixa tem 24 chocolates. Se dividirmos entre 4 crianças, quantos cada uma recebe?",
            opcaoA: "4",
            opcaoB: "5",
            opcaoC: "6",
            opcaoD: "8",
            correta: "C",
            ordem: 2,
          },
          {
            enunciado:
              "Comprei 2 cadernos por R$8,00 e 3 canetas por R$3,00. Quanto gastei no total?",
            opcaoA: "R$11,00",
            opcaoB: "R$17,00",
            opcaoC: "R$19,00",
            opcaoD: "R$24,00",
            correta: "B",
            ordem: 3,
          },
          {
            enunciado: "Se uma dúzia custa R$24,00, quanto custam 3 dúzias?",
            opcaoA: "R$48,00",
            opcaoB: "R$60,00",
            opcaoC: "R$72,00",
            opcaoD: "R$80,00",
            correta: "C",
            ordem: 4,
          },
        ],
      },
    },
  });

  await prisma.missao.create({
    data: {
      trilhaId: trilha3.id,
      nivel: 4,
      titulo: "Gerente do Mercado",
      descricao: "Você é o gerente! Resolva todos os problemas!",
      xp: 25,
      questoes: {
        create: [
          {
            enunciado:
              "Num estoque há 5 caixas com 48 itens cada. Quantos itens no total?",
            opcaoA: "200",
            opcaoB: "220",
            opcaoC: "240",
            opcaoD: "260",
            correta: "C",
            ordem: 1,
          },
          {
            enunciado:
              "Um produto custava R$50,00 e teve desconto de R$15,00. Quanto custa agora?",
            opcaoA: "R$30,00",
            opcaoB: "R$35,00",
            opcaoC: "R$40,00",
            opcaoD: "R$45,00",
            correta: "B",
            ordem: 2,
          },
          {
            enunciado:
              "Se compro 6 itens iguais e pago R$48,00, quanto custa cada item?",
            opcaoA: "R$6,00",
            opcaoB: "R$7,00",
            opcaoC: "R$8,00",
            opcaoD: "R$9,00",
            correta: "C",
            ordem: 3,
          },
          {
            enunciado: "Vendi 100 balas a R$0,25 cada. Quanto recebi?",
            opcaoA: "R$20,00",
            opcaoB: "R$25,00",
            opcaoC: "R$30,00",
            opcaoD: "R$35,00",
            correta: "B",
            ordem: 4,
          },
        ],
      },
    },
  });
  console.log("✅ Trilha 3 criada");

  // Semana 4: Missões do Estrategista
  const trilha4 = await prisma.trilha.create({
    data: { titulo: "Missões do Estrategista", semana: 4, ordem: 4 },
  });

  await prisma.missao.create({
    data: {
      trilhaId: trilha4.id,
      nivel: 1,
      titulo: "Multiplicação Inicial",
      descricao: "Aprenda as tabuadas fundamentais!",
      xp: 10,
      questoes: {
        create: [
          {
            enunciado: "Quanto é 6 × 3?",
            opcaoA: "15",
            opcaoB: "16",
            opcaoC: "17",
            opcaoD: "18",
            correta: "D",
            ordem: 1,
          },
          {
            enunciado: "Quanto é 7 × 4?",
            opcaoA: "24",
            opcaoB: "28",
            opcaoC: "32",
            opcaoD: "21",
            correta: "B",
            ordem: 2,
          },
          {
            enunciado: "Quanto é 5 × 8?",
            opcaoA: "35",
            opcaoB: "40",
            opcaoC: "45",
            opcaoD: "50",
            correta: "B",
            ordem: 3,
          },
          {
            enunciado: "Quanto é 9 × 2?",
            opcaoA: "16",
            opcaoB: "17",
            opcaoC: "18",
            opcaoD: "19",
            correta: "C",
            ordem: 4,
          },
        ],
      },
    },
  });

  await prisma.missao.create({
    data: {
      trilhaId: trilha4.id,
      nivel: 2,
      titulo: "Divisão dos Heróis",
      descricao: "Aprenda a dividir para vencer!",
      xp: 15,
      questoes: {
        create: [
          {
            enunciado: "Quanto é 24 ÷ 4?",
            opcaoA: "5",
            opcaoB: "6",
            opcaoC: "7",
            opcaoD: "8",
            correta: "B",
            ordem: 1,
          },
          {
            enunciado: "Quanto é 35 ÷ 7?",
            opcaoA: "4",
            opcaoB: "5",
            opcaoC: "6",
            opcaoD: "7",
            correta: "B",
            ordem: 2,
          },
          {
            enunciado: "30 crianças em grupos de 5. Quantos grupos?",
            opcaoA: "4",
            opcaoB: "5",
            opcaoC: "6",
            opcaoD: "7",
            correta: "C",
            ordem: 3,
          },
          {
            enunciado: "Quanto é 56 ÷ 8?",
            opcaoA: "5",
            opcaoB: "6",
            opcaoC: "7",
            opcaoD: "8",
            correta: "C",
            ordem: 4,
          },
        ],
      },
    },
  });

  await prisma.missao.create({
    data: {
      trilhaId: trilha4.id,
      nivel: 3,
      titulo: "Geometria do Castelo",
      descricao: "Formas e figuras geométricas!",
      xp: 20,
      questoes: {
        create: [
          {
            enunciado: "Quantos lados tem um hexágono?",
            opcaoA: "4",
            opcaoB: "5",
            opcaoC: "6",
            opcaoD: "7",
            correta: "C",
            ordem: 1,
          },
          {
            enunciado: "Qual é a área de um quadrado de lado 5 cm?",
            opcaoA: "10 cm²",
            opcaoB: "20 cm²",
            opcaoC: "25 cm²",
            opcaoD: "30 cm²",
            correta: "C",
            ordem: 2,
          },
          {
            enunciado: "Um triângulo tem quantos lados?",
            opcaoA: "2",
            opcaoB: "3",
            opcaoC: "4",
            opcaoD: "5",
            correta: "B",
            ordem: 3,
          },
          {
            enunciado:
              "Qual figura tem todos os lados iguais e 4 lados?",
            opcaoA: "Retângulo",
            opcaoB: "Triângulo",
            opcaoC: "Losango",
            opcaoD: "Quadrado",
            correta: "D",
            ordem: 4,
          },
        ],
      },
    },
  });

  await prisma.missao.create({
    data: {
      trilhaId: trilha4.id,
      nivel: 4,
      titulo: "O Grande Desafio Final",
      descricao: "A missão mais difícil! Prove que você é um mestre!",
      xp: 25,
      questoes: {
        create: [
          {
            enunciado:
              "Numa escola há 8 turmas com 32 alunos cada. Quantos alunos no total?",
            opcaoA: "246",
            opcaoB: "256",
            opcaoC: "266",
            opcaoD: "276",
            correta: "B",
            ordem: 1,
          },
          {
            enunciado:
              "Se 1 semana = 7 dias, quantos dias tem 4 semanas?",
            opcaoA: "21",
            opcaoB: "28",
            opcaoC: "35",
            opcaoD: "42",
            correta: "B",
            ordem: 2,
          },
          {
            enunciado:
              "Um livro tem 120 páginas. Lendo 15 por dia, em quantos dias termina?",
            opcaoA: "6",
            opcaoB: "7",
            opcaoC: "8",
            opcaoD: "9",
            correta: "C",
            ordem: 3,
          },
          {
            enunciado: "Qual é o resultado de 25 × 4?",
            opcaoA: "90",
            opcaoB: "95",
            opcaoC: "100",
            opcaoD: "105",
            correta: "C",
            ordem: 4,
          },
        ],
      },
    },
  });
  console.log("✅ Trilha 4 criada");

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("👩‍🏫 Professor: username=professor, senha=senha123");
  console.log("🎒 Alunos: username=ana/bruno/carla/diego/elena, senha=aluno123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

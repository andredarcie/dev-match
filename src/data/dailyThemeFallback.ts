export interface FallbackCard {
  kind: "pair" | "info";
  conceptA: string | null;
  conceptB: string | null;
  match: boolean | null;
  front: string | null;
  back: string | null;
}

export interface LocalDailyTheme {
  title: string;
  description: string;
  cards: FallbackCard[];
}

function pair(conceptA: string, conceptB: string, match: boolean): FallbackCard {
  return { kind: "pair", conceptA, conceptB, match, front: null, back: null };
}

function info(front: string, back: string): FallbackCard {
  return { kind: "info", conceptA: null, conceptB: null, match: null, front, back };
}

export const todayTheme: LocalDailyTheme = {
  title: "Object Calisthenics",
  description: "9 regras para escrever código orientado a objetos de alta qualidade.",
  cards: [
    info(
      "O que é Object Calisthenics?",
      "Um conjunto de 9 regras práticas para OOP propostas por Jeff Bay. O objetivo é forçar boas práticas como alta coesão, baixo acoplamento e código mais legível."
    ),

    info(
      "Regra 1: Um nível de identação por método",
      "Cada método deve ter apenas um nível de indentação. Se precisar de mais, extraia um método privado. Isso força funções pequenas e com responsabilidade única."
    ),
    pair("Um nível de identação por método", "Extrair método menor", true),
    pair("Um nível de identação por método", "Herança profunda de classes", false),

    info(
      "Regra 2: Sem palavra-chave ELSE",
      "Evite o ELSE usando retorno antecipado (early return) ou guard clauses. O código fica mais linear e fácil de ler, sem aninhamentos desnecessários."
    ),
    pair("Sem palavra-chave ELSE", "Guard clause / retorno antecipado", true),
    pair("Sem ELSE", "Switch com muitos casos", false),

    info(
      "Regra 3: Envolver primitivos em objetos",
      "Strings, números e booleanos soltos no código perdem contexto. Envolver um CPF em uma classe CPF garante validação e significado semântico."
    ),
    pair("Envolver primitivos em objetos", "Value Object", true),
    pair("CPF como string pura", "Alta coesão", false),

    info(
      "Regra 4: First Class Collection",
      "Toda coleção deve ser encapsulada em sua própria classe. Assim a lógica de filtragem, ordenação e iteração fica junto dos dados, não espalhada pelo código."
    ),
    pair("Coleções como classe própria", "First Class Collection", true),
    pair("First Class Collection", "Array primitivo com lógica espalhada", false),

    info(
      "Regra 5: Um ponto por linha",
      "Encadeamentos como obj.getPedido().getCliente().getNome() violam a Lei de Demeter. Cada objeto deve conhecer apenas seus vizinhos diretos."
    ),
    pair("Um ponto por linha", "Lei de Demeter", true),
    pair("Encadeamento de chamadas", "Baixo acoplamento", false),

    info(
      "Regra 6: Sem abreviações",
      "Nomes como 'ord', 'usr' ou 'calc' exigem contexto mental extra. Use nomes completos e descritivos: o código é lido muito mais vezes do que é escrito."
    ),
    pair("Sem abreviações", "Nomes descritivos e completos", true),
    pair("Variáveis com nomes curtos", "Legibilidade alta", false),

    info(
      "Regra 7: Entidades pequenas",
      "Classes com mais de 50 linhas e pacotes com mais de 10 arquivos costumam ter mais de uma responsabilidade. Divida para manter o foco e a coesão."
    ),
    pair("Entidades pequenas (máx 50 linhas)", "Single Responsibility", true),
    pair("Classe com 500 linhas", "Alta coesão", false),

    info(
      "Regra 8: No máximo 2 variáveis de instância",
      "Limitar a 2 variáveis de instância força classes altamente coesas. Se precisar de mais dados, é sinal de que a classe deve ser dividida."
    ),
    pair("No máximo 2 variáveis de instância", "Alta coesão da classe", true),
    pair("10 atributos em uma classe", "Princípio da responsabilidade única", false),

    info(
      "Regra 9: Sem getters e setters públicos",
      "Getters e setters expõem o estado interno e violam o encapsulamento. Em vez de perguntar o estado e agir, diga ao objeto o que fazer: Tell, Don't Ask."
    ),
    pair("Sem getters e setters públicos", "Tell, Don't Ask", true),
    pair("Getter público para lógica externa", "Encapsulamento forte", false),
  ],
};

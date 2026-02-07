import type { Pair } from "./pairs";

export interface RoadmapNode {
  id: string;
  title: string;
  icon: string;
  level: number;
  prerequisites: string[];
  pairs: Pair[];
}

export const roadmapNodes: RoadmapNode[] = [
  // ===== Level 0 — Fundamentos =====
  {
    id: "fundamentos",
    title: "Fundamentos",
    icon: "\u{1F3D7}\uFE0F",
    level: 0,
    prerequisites: [],
    pairs: [
      { a: "CRUD b\u00E1sico", b: "Banco relacional", match: true },
      { a: "Processamento pesado", b: "Execu\u00E7\u00E3o ass\u00EDncrona", match: true },
      { a: "Dados tempor\u00E1rios", b: "Cache em mem\u00F3ria", match: true },
      { a: "API p\u00FAblica", b: "Documenta\u00E7\u00E3o OpenAPI", match: true },
      { a: "L\u00F3gica de apresenta\u00E7\u00E3o", b: "Frontend", match: true },
      { a: "Regras de neg\u00F3cio", b: "Camada de dom\u00EDnio", match: true },
      { a: "App TODO simples", b: "Arquitetura hexagonal", match: false },
      { a: "Hello World", b: "Load Balancer", match: false },
      { a: "Script \u00FAnico", b: "Docker Swarm", match: false },
      { a: "P\u00E1gina est\u00E1tica", b: "WebSocket", match: false },
      { a: "Blog pessoal", b: "Event Sourcing", match: false },
      { a: "C\u00E1lculo simples", b: "Fila de mensagens", match: false },
    ],
  },

  // ===== Level 1 — Design Patterns (left) =====
  {
    id: "design-patterns",
    title: "Design Patterns",
    icon: "\u{1F4D0}",
    level: 1,
    prerequisites: ["fundamentos"],
    pairs: [
      { a: "Cria\u00E7\u00E3o complexa de objetos", b: "Factory Method", match: true },
      { a: "Inst\u00E2ncia \u00FAnica global", b: "Singleton", match: true },
      { a: "Notificar m\u00FAltiplos ouvintes", b: "Observer", match: true },
      { a: "Adicionar comportamento em runtime", b: "Decorator", match: true },
      { a: "Interface incompat\u00EDvel", b: "Adapter", match: true },
      { a: "Algoritmo intercambi\u00E1vel", b: "Strategy", match: true },
      { a: "Classe com um campo", b: "Abstract Factory", match: false },
      { a: "Lista simples", b: "Chain of Responsibility", match: false },
      { a: "Vari\u00E1vel local", b: "Flyweight", match: false },
      { a: "Getter/Setter b\u00E1sico", b: "Mediator", match: false },
      { a: "Soma de dois n\u00FAmeros", b: "Visitor", match: false },
      { a: "Print no console", b: "Command", match: false },
    ],
  },

  // ===== Level 1 — SOLID & Clean Code (right) =====
  {
    id: "solid",
    title: "SOLID & Clean Code",
    icon: "\u{1F4CF}",
    level: 1,
    prerequisites: ["fundamentos"],
    pairs: [
      { a: "Classe faz s\u00F3 uma coisa", b: "Single Responsibility", match: true },
      { a: "Extens\u00EDvel sem modificar", b: "Open/Closed", match: true },
      { a: "Subtipo substitui tipo base", b: "Liskov Substitution", match: true },
      { a: "Interfaces espec\u00EDficas e coesas", b: "Interface Segregation", match: true },
      { a: "Depender de abstra\u00E7\u00F5es", b: "Dependency Inversion", match: true },
      { a: "Nomes descritivos e claros", b: "Clean Code", match: true },
      { a: "Classe com 20 responsabilidades", b: "Single Responsibility", match: false },
      { a: "God Class (faz tudo)", b: "Clean Code", match: false },
      { a: "Heran\u00E7a com 5+ n\u00EDveis", b: "Liskov Substitution", match: false },
      { a: "Interface com 30 m\u00E9todos", b: "Interface Segregation", match: false },
      { a: "Depend\u00EAncia concreta direta", b: "Dependency Inversion", match: false },
      { a: "Vari\u00E1vel chamada 'x'", b: "C\u00F3digo limpo", match: false },
    ],
  },

  // ===== Level 2 — Estilos Arquiteturais =====
  {
    id: "arquiteturas",
    title: "Estilos Arquiteturais",
    icon: "\u{1F3DB}\uFE0F",
    level: 2,
    prerequisites: ["design-patterns", "solid"],
    pairs: [
      { a: "App corporativo tradicional", b: "Arquitetura em camadas", match: true },
      { a: "App web com formul\u00E1rios", b: "MVC", match: true },
      { a: "Dom\u00EDnio com regras complexas", b: "Domain-Driven Design", match: true },
      { a: "Separar leitura e escrita", b: "CQRS", match: true },
      { a: "Sistema orientado a eventos", b: "Event-Driven Architecture", match: true },
      { a: "Aplica\u00E7\u00E3o com plugins", b: "Arquitetura de plugins", match: true },
      { a: "Landing page simples", b: "DDD", match: false },
      { a: "Script de automa\u00E7\u00E3o", b: "MVC", match: false },
      { a: "Arquivo de configura\u00E7\u00E3o", b: "CQRS", match: false },
      { a: "P\u00E1gina est\u00E1tica", b: "Arquitetura hexagonal", match: false },
      { a: "Planilha Excel", b: "Event-Driven Architecture", match: false },
      { a: "Formul\u00E1rio simples", b: "Arquitetura de plugins", match: false },
    ],
  },

  // ===== Level 3 — Microsservi\u00E7os (left) =====
  {
    id: "microsservicos",
    title: "Microsservi\u00E7os",
    icon: "\u{1F537}",
    level: 3,
    prerequisites: ["arquiteturas"],
    pairs: [
      { a: "Times independentes", b: "Microsservi\u00E7os", match: true },
      { a: "Deploy independente", b: "Bounded Context", match: true },
      { a: "Roteamento de servi\u00E7os", b: "API Gateway", match: true },
      { a: "Evitar falha em cascata", b: "Circuit Breaker", match: true },
      { a: "Descoberta de servi\u00E7os", b: "Service Registry", match: true },
      { a: "Configura\u00E7\u00E3o centralizada", b: "Config Server", match: true },
      { a: "App com 2 telas", b: "Microsservi\u00E7os", match: false },
      { a: "Projeto solo de 1 dev", b: "Service Mesh", match: false },
      { a: "MVP de startup", b: "Kubernetes + Istio", match: false },
      { a: "Prot\u00F3tipo r\u00E1pido", b: "API Gateway complexo", match: false },
      { a: "Equipe de 3 pessoas", b: "15 microsservi\u00E7os", match: false },
      { a: "Monolito funcionando bem", b: "Reescrever tudo em micro", match: false },
    ],
  },

  // ===== Level 3 — Sistemas Distribu\u00EDdos (right) =====
  {
    id: "distribuidos",
    title: "Sist. Distribu\u00EDdos",
    icon: "\u{1F310}",
    level: 3,
    prerequisites: ["arquiteturas"],
    pairs: [
      { a: "Toler\u00E2ncia a falhas", b: "Replica\u00E7\u00E3o", match: true },
      { a: "Dados em m\u00FAltiplas regi\u00F5es", b: "Consist\u00EAncia eventual", match: true },
      { a: "Alta disponibilidade", b: "Cluster ativo-ativo", match: true },
      { a: "Streaming de eventos", b: "Apache Kafka", match: true },
      { a: "Coordena\u00E7\u00E3o distribu\u00EDda", b: "Consenso (Raft/Paxos)", match: true },
      { a: "Cache distribu\u00EDdo", b: "Redis Cluster", match: true },
      { a: "App local single-user", b: "Consenso distribu\u00EDdo", match: false },
      { a: "SQLite local", b: "Sharding", match: false },
      { a: "Dados n\u00E3o cr\u00EDticos", b: "Transa\u00E7\u00E3o distribu\u00EDda 2PC", match: false },
      { a: "Monolito pequeno", b: "Service Mesh", match: false },
      { a: "Arquivo local", b: "Replica\u00E7\u00E3o multi-regi\u00E3o", match: false },
      { a: "Planilha Excel", b: "Apache Kafka", match: false },
    ],
  },

  // ===== Level 4 — Cloud & DevOps =====
  {
    id: "cloud-devops",
    title: "Cloud & DevOps",
    icon: "\u2601\uFE0F",
    level: 4,
    prerequisites: ["microsservicos", "distribuidos"],
    pairs: [
      { a: "Infraestrutura reproduz\u00EDvel", b: "Infrastructure as Code", match: true },
      { a: "Deploy sem downtime", b: "Blue-Green Deployment", match: true },
      { a: "Integra\u00E7\u00E3o cont\u00EDnua", b: "Pipeline CI/CD", match: true },
      { a: "Ambiente isolado", b: "Container Docker", match: true },
      { a: "Orquestra\u00E7\u00E3o de containers", b: "Kubernetes", match: true },
      { a: "C\u00F3digo serverless", b: "AWS Lambda / Functions", match: true },
      { a: "Projeto pessoal simples", b: "Kubernetes em produ\u00E7\u00E3o", match: false },
      { a: "Ambiente de dev local", b: "Multi-cloud", match: false },
      { a: "Site est\u00E1tico", b: "Container orquestrado", match: false },
      { a: "Script bash \u00FAnico", b: "Terraform Enterprise", match: false },
      { a: "App desktop nativo", b: "Serverless", match: false },
      { a: "POC interna", b: "Multi-regi\u00E3o ativo-ativo", match: false },
    ],
  },

  // ===== Level 5 — Escalabilidade (left) =====
  {
    id: "escalabilidade",
    title: "Escalabilidade",
    icon: "\u{1F4C8}",
    level: 5,
    prerequisites: ["cloud-devops"],
    pairs: [
      { a: "Picos de tr\u00E1fego", b: "Auto-scaling", match: true },
      { a: "Leitura frequente dos mesmos dados", b: "Cache em mem\u00F3ria", match: true },
      { a: "Banco sobrecarregado", b: "Read replicas", match: true },
      { a: "Dados massivos", b: "Sharding horizontal", match: true },
      { a: "Assets est\u00E1ticos globais", b: "CDN", match: true },
      { a: "Requisi\u00E7\u00F5es lentas", b: "Fila ass\u00EDncrona", match: true },
      { a: "10 usu\u00E1rios internos", b: "Auto-scaling", match: false },
      { a: "App interna corporativa", b: "CDN global", match: false },
      { a: "Dados pequenos (100 rows)", b: "Sharding", match: false },
      { a: "Tr\u00E1fego constante e baixo", b: "Load balancer complexo", match: false },
      { a: "Blog pessoal", b: "Read replicas", match: false },
      { a: "API com 5 req/min", b: "Rate limiting avan\u00E7ado", match: false },
    ],
  },

  // ===== Level 5 — Seguran\u00E7a (right) =====
  {
    id: "seguranca",
    title: "Seguran\u00E7a",
    icon: "\u{1F6E1}\uFE0F",
    level: 5,
    prerequisites: ["cloud-devops"],
    pairs: [
      { a: "Autentica\u00E7\u00E3o de API", b: "OAuth 2.0 / JWT", match: true },
      { a: "Dados sens\u00EDveis em disco", b: "Criptografia em repouso", match: true },
      { a: "Comunica\u00E7\u00E3o entre servi\u00E7os", b: "mTLS", match: true },
      { a: "Risco de SQL Injection", b: "Prepared Statements", match: true },
      { a: "Input do usu\u00E1rio", b: "Valida\u00E7\u00E3o e sanitiza\u00E7\u00E3o", match: true },
      { a: "Segredos da aplica\u00E7\u00E3o", b: "Vault / Secret Manager", match: true },
      { a: "Dados 100% p\u00FAblicos", b: "Criptografia AES-256", match: false },
      { a: "API interna isolada", b: "OAuth 2.0 com PKCE", match: false },
      { a: "Conte\u00FAdo est\u00E1tico p\u00FAblico", b: "Autentica\u00E7\u00E3o MFA", match: false },
      { a: "Log de debug local", b: "Auditoria SOC2", match: false },
      { a: "Vari\u00E1vel de ambiente local", b: "HSM dedicado", match: false },
      { a: "Site institucional", b: "WAF + DDoS Shield", match: false },
    ],
  },

  // ===== Level 6 — Lideran\u00E7a T\u00E9cnica =====
  {
    id: "lideranca",
    title: "Lideran\u00E7a T\u00E9cnica",
    icon: "\u{1F451}",
    level: 6,
    prerequisites: ["escalabilidade", "seguranca"],
    pairs: [
      { a: "Decis\u00E3o arquitetural importante", b: "ADR documentado", match: true },
      { a: "D\u00E9bito t\u00E9cnico crescente", b: "Roadmap de refatora\u00E7\u00E3o", match: true },
      { a: "Onboarding de novos devs", b: "Documenta\u00E7\u00E3o arquitetural", match: true },
      { a: "Escolha de tecnologia", b: "An\u00E1lise de trade-offs", match: true },
      { a: "Comunica\u00E7\u00E3o entre times", b: "Contratos de API", match: true },
      { a: "Evolu\u00E7\u00E3o do sistema", b: "Fitness Functions", match: true },
      { a: "Todo c\u00F3digo legado", b: "Reescrever do zero", match: false },
      { a: "Tecnologia nova hyped", b: "Adotar imediatamente", match: false },
      { a: "Dev junior travado", b: "Resolver por ele", match: false },
      { a: "Requisito ainda incerto", b: "Projetar solu\u00E7\u00E3o completa", match: false },
      { a: "Prazo apertado", b: "Pular todos os testes", match: false },
      { a: "Performance aceit\u00E1vel", b: "Otimizar prematuramente", match: false },
    ],
  },
];

export function getNodeById(id: string): RoadmapNode | undefined {
  return roadmapNodes.find((n) => n.id === id);
}

export function getShuffledNodePairs(nodeId: string, count = 10): Pair[] {
  const node = getNodeById(nodeId);
  if (!node) return [];
  return [...node.pairs].sort(() => Math.random() - 0.5).slice(0, count);
}

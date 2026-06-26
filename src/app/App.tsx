import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart2,
  Bell,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Globe,
  LockKeyhole,
  LogOut,
  Menu,
  Moon,
  Radar,
  RefreshCw,
  Search,
  ShieldCheck,
  Sun,
  Target,
  TrendingDown,
  TrendingUp,
  User,
  Zap,
  X,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";

type NewsArticle = {
  id: string;
  cat: string;
  title: string;
  excerpt: string;
  body: string[];
  time: string;
  author: string;
  image: string;
  source?: string;
  url?: string;
  live?: boolean;
};

type UserAccount = {
  name: string;
  email: string;
  premium: boolean;
  plan?: UserPlan;
  premiumSince?: string;
  premiumUntil?: string;
  newsletterUntil?: string;
  coursePurchased?: boolean;
  coursePurchasedAt?: string;
  lastPayment?: {
    id: string;
    method: "card" | "pix";
    amount: number;
    paidAt: string;
    offerId?: OfferId;
    cardLast4?: string;
  };
};

type UserPlan = "free" | "pro" | "premium";
type OfferId = "pro" | "premium" | "newsletter" | "course";

type CheckoutPayment = {
  offerId: OfferId;
  method: "card" | "pix";
  payerName: string;
  document: string;
  cardLast4?: string;
};

type Offer = {
  id: OfferId;
  title: string;
  eyebrow: string;
  price: number;
  recurrence: string;
  description: string;
  features: string[];
  cta: string;
};

type AppView = "home" | "login" | "checkout" | "premium" | "plans" | "studies" | "newsletter" | "course" | "ai" | "terminal";
type ThemeMode = "dark" | "light";

const FOREX_PAIRS = [
  { pair: "EUR/USD", value: 1.0892, change: 0.0014, pct: 0.13 },
  { pair: "USD/JPY", value: 157.34, change: -0.42, pct: -0.27 },
  { pair: "GBP/USD", value: 1.2741, change: 0.0031, pct: 0.24 },
  { pair: "USD/BRL", value: 5.218, change: 0.031, pct: 0.6 },
  { pair: "USD/CHF", value: 0.8924, change: -0.0009, pct: -0.1 },
  { pair: "AUD/USD", value: 0.6541, change: 0.0022, pct: 0.34 },
  { pair: "XAU/USD", value: 2341.5, change: 12.3, pct: 0.53 },
];

const INDICES = [
  { name: "S&P 500", value: "5,308.14", change: "+0.87%", up: true },
  { name: "NASDAQ", value: "16,742.39", change: "+1.14%", up: true },
  { name: "IBOVESPA", value: "127,430", change: "-0.32%", up: false },
  { name: "DAX", value: "18,492.37", change: "+0.21%", up: true },
  { name: "NIKKEI", value: "38,820.49", change: "-0.19%", up: false },
];

const CATS = ["TODOS", "MUNDO", "ECONOMIA", "GEOPOLITICA", "IA", "FOREX"];

const CAT_LABELS: Record<string, string> = {
  TODOS: "Todos",
  MUNDO: "Mundo",
  ECONOMIA: "Economia",
  GEOPOLITICA: "Geopolítica",
  IA: "Inteligência Artificial",
  FOREX: "Forex",
};

const CAT_ICONS: Record<string, JSX.Element> = {
  TODOS: <Globe size={13} />,
  MUNDO: <Globe size={13} />,
  ECONOMIA: <BarChart2 size={13} />,
  GEOPOLITICA: <Globe size={13} />,
  IA: <Brain size={13} />,
  FOREX: <TrendingUp size={13} />,
};

const NEWS: NewsArticle[] = [
  {
    id: "mundo-manchetes-globais",
    cat: "MUNDO",
    title: "Mercados globais acompanham politica, energia e tecnologia ao redor do mundo",
    excerpt:
      "A cobertura mundial reune manchetes internacionais sobre economia, diplomacia, conflitos, tecnologia e mercados.",
    body: [
      "Esta pagina acompanha noticias internacionais em tempo real, reunindo fontes de varias regioes para dar uma visao ampla do que movimenta o mundo.",
      "Os feeds ao vivo priorizam manchetes recentes sobre Americas, Europa, Asia, Africa, Oriente Medio, economia global e tecnologia.",
      "Quando uma noticia vem de fonte externa, o botao de fonte original leva ao contexto completo publicado pelo veiculo responsavel.",
    ],
    time: "agora",
    author: "NexusFX Global",
    image:
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1100&h=650&fit=crop&auto=format",
    source: "NexusFX",
  },
  {
    id: "fed-cortes",
    cat: "ECONOMIA",
    title: "Fed sinaliza cautela antes de novos cortes de juros",
    excerpt:
      "Investidores recalibram apostas após falas de dirigentes do banco central americano e novos dados de inflação.",
    body: [
      "O mercado financeiro voltou a reduzir a probabilidade de cortes rápidos nos juros americanos após uma rodada de falas mais cautelosas de membros do Federal Reserve.",
      "A leitura predominante entre analistas é que o banco central ainda precisa de evidências consistentes de desinflação antes de iniciar um ciclo mais agressivo de flexibilização.",
      "Para moedas emergentes, o recado mantém o dólar sustentado no curto prazo e aumenta a sensibilidade a dados de emprego, inflação e consumo nos Estados Unidos.",
    ],
    author: "Marcus Oliveira",
    time: "há 23 min",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1100&h=650&fit=crop&auto=format",
    source: "NexusFX",
  },
  {
    id: "china-estimulo",
    cat: "ECONOMIA",
    title: "China prepara novas medidas para apoiar consumo e setor imobiliário",
    excerpt:
      "Pequim tenta estabilizar a confiança doméstica enquanto investidores cobram estímulos mais diretos.",
    body: [
      "Autoridades chinesas estudam ampliar linhas de crédito e incentivos regionais para conter a fraqueza do mercado imobiliário.",
      "O foco é impedir que a queda prolongada nos preços dos imóveis contamine consumo, crédito e arrecadação de governos locais.",
      "Commodities e moedas ligadas ao crescimento global tendem a reagir rapidamente a qualquer pacote fiscal de maior escala.",
    ],
    time: "há 1h",
    author: "Fernanda Costa",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=480&fit=crop&auto=format",
    source: "NexusFX",
  },
  {
    id: "otan-baltico",
    cat: "GEOPOLITICA",
    title: "OTAN reforça vigilância no Báltico em meio a novas tensões",
    excerpt:
      "Movimentos militares na região reacendem alertas sobre rotas comerciais, energia e segurança europeia.",
    body: [
      "Países da aliança elevaram o monitoramento marítimo e aéreo no Báltico depois de novos episódios de tensão diplomática no leste europeu.",
      "Embora autoridades tentem evitar escalada, investidores acompanham impactos potenciais em energia, seguros e logística regional.",
      "O euro costuma reagir a mudanças no prêmio de risco europeu, especialmente quando a tensão coincide com dados econômicos fracos.",
    ],
    time: "há 2h",
    author: "Rafael Nunes",
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=480&fit=crop&auto=format",
    source: "NexusFX",
  },
  {
    id: "ia-regulacao",
    cat: "IA",
    title: "Reguladores europeus cobram mais transparência de modelos de IA",
    excerpt:
      "Empresas de tecnologia terão de explicar melhor dados, riscos e mecanismos de segurança dos sistemas.",
    body: [
      "A nova rodada de cobrança regulatória na Europa pressiona companhias de IA a detalhar práticas de treinamento, avaliação e mitigação de riscos.",
      "Executivos do setor avaliam que a exigência pode elevar custos de conformidade, mas também criar padrões mais claros para adoção corporativa.",
      "A reação em bolsa tende a diferenciar empresas com infraestrutura própria, dados licenciados e processos auditáveis.",
    ],
    time: "há 3h",
    author: "Camila Braga",
    image:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=480&fit=crop&auto=format",
    source: "NexusFX",
  },
  {
    id: "real-dolar",
    cat: "FOREX",
    title: "Real recua com aversão ao risco e dólar testa resistência",
    excerpt:
      "Operadores monitoram diferencial de juros, fluxo estrangeiro e sinais fiscais no Brasil.",
    body: [
      "O dólar voltou a ganhar força contra o real em uma sessão marcada por busca global por proteção e cautela com ativos emergentes.",
      "Além do exterior, o mercado doméstico segue atento a ruídos fiscais e à comunicação do Banco Central.",
      "No curto prazo, traders observam zonas técnicas de resistência e suporte para medir a força do movimento.",
    ],
    time: "há 4h",
    author: "Lucas Mendes",
    image:
      "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&h=480&fit=crop&auto=format",
    source: "NexusFX",
  },
  {
    id: "g7-tarifas",
    cat: "GEOPOLITICA",
    title: "G7 discute tarifas, cadeias produtivas e segurança tecnológica",
    excerpt:
      "Líderes buscam coordenação diante da competição industrial e da disputa por semicondutores.",
    body: [
      "A reunião do G7 colocou comércio, segurança energética e tecnologia no centro das negociações.",
      "Sem um consenso amplo sobre tarifas, os países sinalizaram medidas coordenadas para reduzir dependências consideradas estratégicas.",
      "O tema segue relevante para ações de tecnologia, moedas asiáticas e setores exportadores europeus.",
    ],
    time: "há 5h",
    author: "Sofia Tavares",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=480&fit=crop&auto=format",
    source: "NexusFX",
  },
];

const INDICATORS = [
  { name: "RSI (14)", value: "62.4", signal: "neutro", color: "#f0a500" },
  { name: "MACD", value: "+0.0023", signal: "compra", color: "#22d3a0" },
  { name: "MA 50", value: "1.0841", signal: "compra", color: "#22d3a0" },
  { name: "MA 200", value: "1.0710", signal: "compra", color: "#22d3a0" },
  { name: "Bollinger", value: "1.09 / 1.07", signal: "neutro", color: "#f0a500" },
  { name: "ATR (14)", value: "0.0062", signal: "volatil.", color: "#e0364a" },
];

const FOREX_STUDIES = [
  { title: "Tendencia", value: "Alta moderada", detail: "Preco acima da media de 50 periodos, mas proximo de resistencia.", tone: "text-emerald-400" },
  { title: "Momentum", value: "Neutro a comprador", detail: "RSI em zona saudavel. Sem sobrecompra forte no curto prazo.", tone: "text-amber-400" },
  { title: "Volatilidade", value: "Media", detail: "ATR permite stops mais curtos, mas exige cuidado em horarios de noticia.", tone: "text-sky-400" },
  { title: "Previsao aberta", value: "Compra so acima da resistencia", detail: "Cenario didatico: aguardar rompimento confirmado antes de entrada.", tone: "text-emerald-400" },
];

const PREMIUM_FOREX = [
  "Forex, cripto, indices, commodities, acoes brasileiras e globais",
  "Indicadores de tendencia, momentum, volatilidade, volume, macro e risco",
  "Cenarios educativos de entrada, nao-entrada, stop e invalidacao",
  "IA Premium para estudar tese, calendario, risco e revisao pos-operacao",
];

const AI_LESSONS = [
  { title: "Prompt claro", detail: "Diga papel, contexto, formato de resposta e criterio de qualidade." },
  { title: "Use exemplos", detail: "Um exemplo bom reduz erro e ajuda a IA copiar o padrao desejado." },
  { title: "Revise em etapas", detail: "Peca primeiro um rascunho, depois melhoria, depois versao final." },
];

const PREMIUM_AI = [
  "Prompts completos para macro, Forex, estudos e negocios",
  "Modelos prontos para copiar, adaptar e revisar",
  "Estudos de caso com antes, depois e criterio de qualidade",
  "Trilha para aprender IA do basico ao uso profissional",
];

const PREMIUM_MARKET_DATA = [
  {
    label: "Mercado FX global",
    value: "US$ 9,6 tri/dia",
    detail: "Volume medio diario reportado pelo BIS em abril de 2025. Liquidez grande nao elimina risco, mas muda a leitura de fluxo.",
  },
  {
    label: "Dolar no centro",
    value: "89,2%",
    detail: "Participacao do USD em uma ponta das operacoes globais de cambio. Por isso, juros e dados dos EUA seguem dominando regimes.",
  },
  {
    label: "Regra do assinante",
    value: "Risco primeiro",
    detail: "Todo estudo parte de cenario, invalidacao e tamanho de posicao antes de falar em entrada ou alvo.",
  },
];

const PREMIUM_TOPIC_BRIEFINGS = [
  {
    cat: "MUNDO",
    title: "Radar global",
    signal: "Fluxo de risco e liquidez",
    bullets: [
      "Separar manchete barulhenta de evento que muda juros, energia, comercio ou dolar.",
      "Mapear sessoes: Asia cria direcao, Europa testa liquidez, Nova York confirma ou invalida.",
      "Usar IA para resumir fontes, mas sempre confirmar dado primario antes de operar noticia.",
    ],
  },
  {
    cat: "ECONOMIA",
    title: "Macro que move preco",
    signal: "Juros, inflacao e crescimento",
    bullets: [
      "Priorizar CPI, payroll, decisoes de bancos centrais, PMI e curvas de juros.",
      "Transformar cada dado em tres cenarios: acima, em linha e abaixo do consenso.",
      "Conectar surpresa economica ao par correto: USD, JPY, EUR, GBP, BRL, ouro ou indices.",
    ],
  },
  {
    cat: "GEOPOLITICA",
    title: "Risco geopolitico",
    signal: "Energia, rotas e safe havens",
    bullets: [
      "Medir impacto em petroleo, gas, fretes, seguros, metais e moedas de refugio.",
      "Evitar operar manchete inicial; esperar confirmacao de fonte e reprecificacao real.",
      "Criar plano de protecao quando spread abre, liquidez some ou candle fica erratico.",
    ],
  },
  {
    cat: "IA",
    title: "IA aplicada a mercado",
    signal: "Pesquisa, sintese e disciplina",
    bullets: [
      "IA faz checklist, compara cenarios, resume calendario e encontra incoerencias na tese.",
      "Nunca delegar decisao final: modelo pode errar dado, inventar fonte ou ignorar regime.",
      "Melhor uso: diario de trade, plano pre-mercado, revisao pos-trade e estudo historico.",
    ],
  },
  {
    cat: "FOREX",
    title: "Forex profissional",
    signal: "Setup, risco e execucao",
    bullets: [
      "Operar menos pares e conhecer regime de cada um: tendencia, range, noticia ou choque.",
      "Toda entrada precisa de gatilho, stop tecnico, stop financeiro e motivo de invalidacao.",
      "Lucro vem de processo repetivel; alavancagem sem controle transforma erro pequeno em perda grande.",
    ],
  },
];

const TRADER_PLAYBOOKS = [
  {
    name: "Soros / Druckenmiller",
    edge: "Macro assimetrico",
    data: "Juros, politica monetaria, fluxo de capital, moedas e mudanca de regime.",
    lesson: "Quando a tese macro e forte, o foco nao e acertar sempre; e perder pequeno ate a assimetria ficar clara.",
  },
  {
    name: "Paul Tudor Jones",
    edge: "Defesa antes do ataque",
    data: "Drawdown, volatilidade, suporte, resistencia e sentimento de mercado.",
    lesson: "O primeiro trabalho do trader e sobreviver. A leitura do risco vem antes da vontade de entrar.",
  },
  {
    name: "Ed Seykota",
    edge: "Sistemas e tendencia",
    data: "Preco, medias, rompimentos, volatilidade e regras objetivas.",
    lesson: "Processo simples, repetido com disciplina, vence opiniao brilhante que muda a cada candle.",
  },
  {
    name: "Jim Simons",
    edge: "Dados e estatistica",
    data: "Padroes, series temporais, correlacoes, ruido, custo de transacao e validacao fora da amostra.",
    lesson: "IA e estatistica ajudam a encontrar vantagem, mas sem teste, custo e controle de overfit a estrategia vira ilusao.",
  },
];

const TRADER_CROSS_RULES = [
  "Defina a tese antes do clique: qual dado provaria que voce esta errado?",
  "Use tamanho pequeno quando a leitura e nova; aumente so quando ha evidencia, liquidez e controle emocional.",
  "Nao misture noticia, scalping e swing no mesmo plano. Cada regime pede stop, tempo e alvo diferentes.",
  "Registre tudo: par, horario, motivo, risco, execucao, emocao e aprendizado. O diario revela o trader real.",
  "IA cruza informacao; o trader decide risco. Automatizar pesquisa nao significa terceirizar responsabilidade.",
];

const AI_FOREX_WORKFLOW = [
  {
    step: "1",
    title: "Coleta macro",
    prompt: "Resuma os eventos macro das proximas 24h para EUR/USD, USD/JPY e XAU/USD. Separe consenso, risco de surpresa e possivel impacto.",
  },
  {
    step: "2",
    title: "Cenario triplo",
    prompt: "Crie tres cenarios para este par: alta, queda e lateralizacao. Para cada um, liste gatilho, invalidacao e o que nao operar.",
  },
  {
    step: "3",
    title: "Checklist tecnico",
    prompt: "Analise tendencia, momentum, volatilidade, zonas de liquidez e horario da sessao. Nao recomende trade; apenas monte checklist.",
  },
  {
    step: "4",
    title: "Pos-trade",
    prompt: "Revise este trade como mentor: o plano foi seguido? O risco estava correto? O que foi habilidade, sorte ou erro repetivel?",
  },
];

const PREMIUM_AI_PROMPTS = [
  "Atue como analista macro conservador. Liste o que pode fortalecer e enfraquecer o dolar hoje, com fontes que eu devo verificar manualmente.",
  "Transforme minha tese em checklist objetivo de entrada, nao-entrada, stop tecnico, stop financeiro e condicao de cancelamento.",
  "Pegue estes trades do meu diario e encontre padroes de erro por horario, par, noticia, pressa, revenge trade e excesso de alavancagem.",
  "Crie um plano de estudo de 30 dias para Forex com foco em macro, price action, risco, psicologia e revisao semanal.",
];

const RISK_PROTOCOL = [
  { rule: "Risco por trade", value: "0,25% a 1%", detail: "Faixa didatica para proteger capital enquanto o trader ainda valida processo." },
  { rule: "Limite diario", value: "2 perdas", detail: "Parar quando o mercado ou a mente saem do plano evita transformar erro em desastre." },
  { rule: "Alavancagem", value: "Usar menos", detail: "Forex permite alavancagem alta; profissional usa como ferramenta, nao como atalho." },
  { rule: "Noticia forte", value: "Spread manda", detail: "Se spread, slippage ou volatilidade impedem stop limpo, o melhor trade pode ser nenhum." },
];

const TERMINAL_STATS = [
  { value: "56", label: "ativos no radar", detail: "Forex, cripto, indices, commodities, B3 e acoes globais." },
  { value: "34", label: "indicadores", detail: "Tendencia, momentum, volatilidade, volume, macro e risco." },
  { value: "5", label: "motores de IA", detail: "Resumo, tese, risco, no-trade e revisao pos-estudo." },
  { value: "0", label: "sinais vendidos", detail: "Tudo e educacional, com gatilho e invalidacao, sem promessa." },
];

const ASSET_UNIVERSE = [
  {
    market: "Forex majors",
    assets: ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "NZD/USD"],
    use: "Juros, DXY, inflacao, payroll, decisoes de bancos centrais e fluxo entre sessoes.",
    signal: "Macro + volatilidade + liquidez Londres/Nova York",
  },
  {
    market: "Forex emergentes",
    assets: ["USD/BRL", "USD/MXN", "USD/ZAR", "EUR/BRL", "JPY/BRL"],
    use: "Fiscal, commodities, risco pais, carry trade, fluxo estrangeiro e calendario local.",
    signal: "Dolar global + risco Brasil + curva de juros",
  },
  {
    market: "Criptos",
    assets: ["BTC", "ETH", "SOL", "BNB", "XRP", "LINK", "AVAX", "MATIC"],
    use: "Dominancia, funding, ETF flow, liquidez, rompimentos e eventos on-chain.",
    signal: "Volatilidade + sentimento + zonas de liquidacao",
  },
  {
    market: "Indices",
    assets: ["S&P 500", "NASDAQ", "Dow Jones", "DAX", "Nikkei", "Ibovespa"],
    use: "Apetite por risco, juros longos, tecnologia, China, bancos e fluxo institucional.",
    signal: "Risk-on/risk-off + breadth + VIX",
  },
  {
    market: "Commodities",
    assets: ["Ouro", "Petroleo WTI", "Brent", "Cobre", "Prata", "Milho"],
    use: "Dolar, juros reais, geopolitica, estoque, demanda chinesa e choque de oferta.",
    signal: "Macro + geopolitica + estoque",
  },
  {
    market: "Acoes e B3",
    assets: ["PETR4", "VALE3", "ITUB4", "BBDC4", "AAPL", "MSFT", "NVDA", "TSLA"],
    use: "Resultado, valuation, margem, noticia corporativa, setor, fluxo e cambio.",
    signal: "Fundamento + noticia + tecnico",
  },
];

const INDICATOR_SYSTEMS = [
  {
    group: "Tendencia",
    indicators: ["SMA", "EMA", "ADX", "Ichimoku", "Supertrend", "Canal de Donchian"],
    use: "Define direcao, regime e se o preco esta em tendencia ou range.",
  },
  {
    group: "Momentum",
    indicators: ["RSI", "MACD", "Estocastico", "CCI", "ROC", "Divergencia"],
    use: "Mede forca, exaustao e perda de velocidade antes de rompimentos falsos.",
  },
  {
    group: "Volatilidade",
    indicators: ["ATR", "Bandas de Bollinger", "Keltner", "VIX", "Desvio padrao", "Range diario"],
    use: "Ajuda a calibrar stop, tamanho, horario e expectativa realista de movimento.",
  },
  {
    group: "Volume e liquidez",
    indicators: ["VWAP", "OBV", "Volume Profile", "Delta", "Zonas de liquidez", "Order blocks"],
    use: "Mostra onde pode haver defesa, absorcao, stop hunt ou falta de liquidez.",
  },
  {
    group: "Macro e sentimento",
    indicators: ["DXY", "Juros 2Y/10Y", "COT", "PMI", "CPI", "Payroll", "Fear & Greed"],
    use: "Evita ler grafico isolado quando o regime macro domina o ativo.",
  },
  {
    group: "Risco operacional",
    indicators: ["R/R", "perda maxima", "drawdown", "slippage", "spread", "correlacao"],
    use: "Transforma a ideia em plano controlado e mostra quando nao operar.",
  },
];

const PREMIUM_ENTRY_SCENARIOS = [
  {
    asset: "EUR/USD",
    score: "78/100",
    context: "Dolar perde forca se juros longos cedem e PMI europeu vem acima do consenso.",
    trigger: "Estudo de compra apenas com fechamento acima da resistencia e reteste com volume.",
    invalidation: "Cenario cancelado se romper minima da sessao ou se DXY recuperar forca.",
    noTrade: "Nao operar durante fala de banco central ou se spread abrir acima do normal.",
    risk: "Risco educativo: perda maxima pequena, stop tecnico fora do ruido e sem alavancagem agressiva.",
  },
  {
    asset: "BTC",
    score: "71/100",
    context: "Cripto reage a fluxo de ETF, dominancia do BTC, funding e apetite por risco em tecnologia.",
    trigger: "Estudo de rompimento so depois de consolidar acima da zona de liquidez anterior.",
    invalidation: "Perde validade se o preco voltar para dentro do range com volume vendedor.",
    noTrade: "Nao operar se funding estiver extremo, volatilidade expandir sem direcao ou noticia regulatoria sair.",
    risk: "Reduzir tamanho por volatilidade; alvo e stop devem respeitar ATR e liquidez.",
  },
  {
    asset: "XAU/USD",
    score: "74/100",
    context: "Ouro combina juros reais, dolar, risco geopolitico e busca por protecao.",
    trigger: "Estudo de entrada apenas se romper maxima com confirmacao e juros reais em queda.",
    invalidation: "Cancela se yields subirem junto com DXY ou se candle devolver rompimento.",
    noTrade: "Evitar antes de CPI, payroll ou decisao do Fed sem plano especifico de noticia.",
    risk: "Stop precisa considerar ATR alto; melhor perder oportunidade do que entrar no ruido.",
  },
];

const NEXUS_EDGE = [
  {
    title: "No-Trade Score",
    detail: "A plataforma pontua quando o melhor estudo e nao entrar: noticia proxima, spread alto, volatilidade fora do regime, tese fraca ou risco grande demais.",
  },
  {
    title: "Cenario em 3 camadas",
    detail: "Cada ativo recebe contexto macro, leitura tecnica e protocolo de risco antes de qualquer hipotese de gatilho.",
  },
  {
    title: "IA como copiloto de disciplina",
    detail: "A IA nao promete acerto. Ela encontra incoerencia, pergunta o que invalida a tese e obriga o assinante a pensar antes do clique.",
  },
];

const PREMIUM_SOURCES = [
  { label: "BIS FX Survey 2025", url: "https://www.bis.org/statistics/rpfx25.htm" },
  { label: "CFTC Forex Fraud Advisory", url: "https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/fraudadv_forex.html" },
  { label: "NFA Forex Investor Resource", url: "https://www.nfa.futures.org/investors/investor-resources/files/forex.pdf" },
  { label: "Investor.gov Day Trading Risk", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks/day-trading-your-dollars-risk" },
];

const FREE_FEATURES = [
  "Noticias por categoria",
  "Artigos educativos",
  "Glossario de mercado",
  "Painel Forex basico",
];

const OFFERS: Record<OfferId, Offer> = {
  pro: {
    id: "pro",
    title: "NexusFX Pro",
    eyebrow: "Plano mensal",
    price: 19.9,
    recurrence: "/mes",
    description: "Para estudar mercado todo dia com briefing, filtros, alertas e simuladores educativos.",
    features: [
      "Morning Brief diario e resumo semanal",
      "Alertas de noticias importantes e agenda economica",
      "Filtros para encontrar o que estudar primeiro",
      "Watchlist educativa por tema e ativo",
      "Simulador de carteira ficticia",
      "Quiz, glossario e trilhas Pro",
      "IA que resume todas as noticias",
    ],
    cta: "Assinar Pro",
  },
  premium: {
    id: "premium",
    title: "NexusFX Premium",
    eyebrow: "Plano mensal",
    price: 39.9,
    recurrence: "/mes",
    description: "Para quem quer o terminal completo: Forex, cripto, ativos, indicadores, IA avancada e protocolo de risco.",
    features: [
      "Tudo do Pro",
      "Terminal Premium Forex, cripto, indices, commodities e acoes",
      "Biblioteca de indicadores tecnicos, macro, fluxo e risco",
      "Cenarios educativos de entrada com gatilho, invalidacao e no-trade",
      "IA avancada para estudo operacional e revisao de tese",
      "No-Trade Score para evitar entradas ruins",
      "Comunidade, aulas, relatorios e materiais PDF",
    ],
    cta: "Assinar Premium",
  },
  newsletter: {
    id: "newsletter",
    title: "NexusFX Morning Brief",
    eyebrow: "Newsletter premium",
    price: 9.9,
    recurrence: "/mes",
    description: "Resumo diario para entender o que mexe com mercado sem perder tempo.",
    features: [
      "Principais noticias do dia",
      "Impacto no mercado em linguagem simples",
      "Termos explicados",
      "Agenda economica",
      "Resumo do que estudar hoje",
    ],
    cta: "Assinar newsletter",
  },
  course: {
    id: "course",
    title: "Investimentos do Zero",
    eyebrow: "Curso separado",
    price: 97,
    recurrence: "pagamento unico",
    description: "Metodo NexusFX para aprender organizacao financeira, renda fixa, acoes, FIIs, ETFs, cambio e leitura de noticias.",
    features: [
      "Organizacao financeira",
      "Renda fixa, Selic, CDI e inflacao",
      "Acoes, FIIs e ETFs",
      "Cambio e Forex com riscos",
      "Como ler noticias economicas",
      "Como nao cair em golpe",
      "PDFs, exercicios e quizzes",
    ],
    cta: "Comprar curso",
  },
};

const PLAN_RANK: Record<UserPlan, number> = {
  free: 0,
  pro: 1,
  premium: 2,
};

const PLAN_COMPARISON = [
  { feature: "Noticias, artigos e glossario", free: true, pro: true, premium: true },
  { feature: "Painel Forex basico e estudos abertos", free: true, pro: true, premium: true },
  { feature: "Morning Brief diario e resumo semanal", free: false, pro: true, premium: true },
  { feature: "Alertas, filtros e watchlist educativa", free: false, pro: true, premium: true },
  { feature: "Simulador de carteira, quizzes e trilhas Pro", free: false, pro: true, premium: true },
  { feature: "IA que resume todas as noticias", free: false, pro: true, premium: true },
  { feature: "Terminal Forex, cripto, indices, commodities e acoes", free: false, pro: false, premium: true },
  { feature: "Todos os grupos de indicadores e biblioteca de setups", free: false, pro: false, premium: true },
  { feature: "Cenarios educativos de entrada, invalidacao e no-trade", free: false, pro: false, premium: true },
  { feature: "IA avancada para estudo operacional", free: false, pro: false, premium: true },
  { feature: "Comunidade, aulas, relatorios e materiais PDF", free: false, pro: false, premium: true },
];

const COURSE_MODULES = [
  {
    title: "Organizacao financeira",
    detail: "Mapeie renda, gastos, reserva e objetivos antes de investir.",
    lessons: ["Diagnostico financeiro", "Reserva de emergencia", "Metas de curto, medio e longo prazo"],
    pdf: "Planilha de orcamento e reserva",
    exercise: "Monte um raio-x financeiro com renda, gastos fixos, gastos variaveis e meta de reserva.",
    quiz: "Qual e o primeiro objetivo antes de buscar rentabilidade?",
  },
  {
    title: "Renda fixa",
    detail: "Entenda Selic, CDI, IPCA, liquidez, risco de credito e marcacao a mercado.",
    lessons: ["CDB, Tesouro e liquidez", "Prefixado, pos-fixado e IPCA+", "Risco de credito e FGC"],
    pdf: "Mapa de produtos de renda fixa",
    exercise: "Compare dois produtos ficticios e explique qual combina com reserva e qual combina com longo prazo.",
    quiz: "Por que um titulo prefixado pode oscilar antes do vencimento?",
  },
  {
    title: "Inflacao, Selic e CDI",
    detail: "Aprenda como juros e inflacao afetam dinheiro, bolsa, cambio e renda fixa.",
    lessons: ["Inflacao na vida real", "Selic e custo de oportunidade", "CDI como referencia"],
    pdf: "Glossario macroeconomico essencial",
    exercise: "Leia uma noticia sobre juros e escreva o impacto esperado em renda fixa, bolsa e dolar.",
    quiz: "O que tende a acontecer com ativos de risco quando juros sobem rapido?",
  },
  {
    title: "Acoes",
    detail: "Leia empresas sem cair em promessa: receita, margem, divida, lucro e governanca.",
    lessons: ["Modelo de negocio", "Indicadores simples", "Risco, setor e governanca"],
    pdf: "Checklist de leitura de empresa",
    exercise: "Escolha uma empresa e preencha receita, lucro, divida, margem e principal risco.",
    quiz: "Por que preco baixo nao significa acao barata?",
  },
  {
    title: "FIIs e ETFs",
    detail: "Use fundos para diversificacao, renda e exposicao tematica com custos claros.",
    lessons: ["FIIs de papel e tijolo", "Dividend yield com cuidado", "ETFs e diversificacao"],
    pdf: "Comparativo FII x ETF",
    exercise: "Monte uma carteira ficticia com ETF amplo e explique o motivo da diversificacao.",
    quiz: "Qual risco aparece quando o investidor olha apenas para dividend yield?",
  },
  {
    title: "Cambio e Forex",
    detail: "Veja liquidez, alavancagem, spread, risco de noticia e gestao de tamanho.",
    lessons: ["Como pares de moedas funcionam", "Spread, lote e alavancagem", "Noticias e volatilidade"],
    pdf: "Checklist de risco em Forex",
    exercise: "Crie um plano ficticio com tese, invalidacao e perda maxima antes de qualquer entrada.",
    quiz: "Por que alavancagem alta pode destruir uma conta mesmo com poucos trades?",
  },
  {
    title: "Noticias economicas",
    detail: "Transforme manchetes em contexto: dado, expectativa, surpresa e impacto.",
    lessons: ["Consenso e surpresa", "Agenda economica", "Como resumir impacto sem exagero"],
    pdf: "Modelo de leitura de noticia",
    exercise: "Pegue uma manchete e responda: qual dado mudou, quem e afetado, qual risco invalida?",
    quiz: "Por que manchete forte nem sempre vira movimento de mercado?",
  },
  {
    title: "Anti-golpe",
    detail: "Checklist para identificar promessa de lucro, pressa, opacidade e conflito de interesse.",
    lessons: ["Promessa de ganho garantido", "Afiliados e transparencia", "Como verificar fontes"],
    pdf: "Checklist anti-golpe NexusFX",
    exercise: "Analise uma oferta ficticia e marque os sinais de alerta.",
    quiz: "Qual frase deve acender alerta imediato em investimentos?",
  },
];

const STUDY_TRACKS = [
  {
    level: "Iniciante",
    title: "Fundamentos do mercado",
    lessons: ["Glossario essencial", "Juros e inflacao", "Como ler uma noticia economica"],
  },
  {
    level: "Intermediario",
    title: "Leitura de ativos",
    lessons: ["Acoes e FIIs", "ETFs e diversificacao", "Cambio sem promessa de ganho"],
  },
  {
    level: "Avancado",
    title: "Processo e risco",
    lessons: ["Watchlist educativa", "Diario de estudos", "Simulador de carteira ficticia"],
  },
];

const DAILY_BRIEF = [
  "Antes da abertura: verifique agenda economica, dolar, juros futuros, commodities e noticias politicas.",
  "Mercado local: Ibovespa tende a reagir a fluxo estrangeiro, fiscal, Petrobras, bancos e curva de juros.",
  "Mercado global: tecnologia, Fed, inflacao americana e China seguem como motores de sentimento.",
  "Estudo do dia: escolha uma noticia e responda: qual dado mudou, qual ativo pode reagir e qual risco invalida a leitura?",
];

const WEEKLY_BRIEF = [
  "Revisar os eventos que realmente mudaram expectativa de juros.",
  "Separar alta por fundamento de alta por fluxo curto.",
  "Atualizar watchlist educativa com motivo de estudo, nao com ordem de compra.",
  "Medir se a carteira ficticia esta concentrada demais em um unico tema.",
];

const GLOSSARY = [
  { term: "Selic", text: "Taxa basica de juros do Brasil; referencia para credito, renda fixa e custo de oportunidade." },
  { term: "CDI", text: "Referencia usada em muitos investimentos de renda fixa no Brasil." },
  { term: "ETF", text: "Fundo negociado em bolsa que replica uma cesta, indice ou estrategia." },
  { term: "Spread", text: "Diferenca entre preco de compra e venda. Em Forex, aumenta em momentos de risco." },
  { term: "Drawdown", text: "Queda do capital a partir de um topo. Ajuda a medir risco real do processo." },
  { term: "Alavancagem", text: "Operar valor maior que o capital disponivel. Amplia ganhos e perdas." },
];

const RSS_FEEDS = [
  { cat: "MUNDO", query: "noticias internacionais mundo hoje politica economia" },
  { cat: "MUNDO", query: "world news Europe Asia Africa Americas Middle East" },
  { cat: "ECONOMIA", query: "economia mercado financeiro Brasil" },
  { cat: "GEOPOLITICA", query: "geopolítica economia mundo" },
  { cat: "IA", query: "inteligência artificial tecnologia" },
  { cat: "FOREX", query: "forex dólar real mercado câmbio" },
];

const generateSparkline = (base: number, len = 20) =>
  Array.from({ length: len }, (_, i) => ({
    i,
    v: base + (Math.random() - 0.48) * base * 0.015 * i * 0.3,
  }));

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const articleHash = (article: NewsArticle) => `#/noticia/${article.id}`;
const categoryHash = (cat: string) => `#/categoria/${cat.toLowerCase()}`;
const SUBSCRIPTION_DAYS = 30;
const USER_STORAGE_KEY = "nexusfx-user";
const PENDING_OFFER_KEY = "nexusfx-pending-offer";
const THEME_STORAGE_KEY = "nexusfx-theme";
const DEFAULT_OFFER_ID: OfferId = "pro";

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const formatCardNumber = (value: string) =>
  onlyDigits(value)
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (value: string) => {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const createReceiptId = () => `NX-${Date.now().toString(36).toUpperCase()}`;

const formatDate = (value?: string) => {
  if (!value) return "sem vencimento";
  return new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const isFutureDate = (value?: string) => !!value && new Date(value).getTime() > Date.now();

const isOfferId = (value: string): value is OfferId => value in OFFERS;

const getUserPlan = (user: UserAccount | null): UserPlan => {
  if (!user) return "free";
  if (user.plan === "pro" || user.plan === "premium") {
    return isFutureDate(user.premiumUntil) ? user.plan : "free";
  }
  if (user.premium && isFutureDate(user.premiumUntil)) return "premium";
  return "free";
};

const hasPlanAccess = (user: UserAccount | null, minimum: Exclude<UserPlan, "free">) =>
  PLAN_RANK[getUserPlan(user)] >= PLAN_RANK[minimum];

const hasNewsletterAccess = (user: UserAccount | null) => hasPlanAccess(user, "pro") || isFutureDate(user?.newsletterUntil);

const hasCourseAccess = (user: UserAccount | null) => hasPlanAccess(user, "premium") || !!user?.coursePurchased;

const hasOfferAccess = (user: UserAccount | null, offerId: OfferId) => {
  if (offerId === "pro") return hasPlanAccess(user, "pro");
  if (offerId === "premium") return hasPlanAccess(user, "premium");
  if (offerId === "newsletter") return hasNewsletterAccess(user);
  return hasCourseAccess(user);
};

const relativeTime = (date: Date) => {
  const diff = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  return date.toLocaleDateString("pt-BR");
};

async function fetchLiveNews() {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(async ({ cat, query }) => {
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("RSS indisponível");
      const xml = await response.text();
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      return Array.from(doc.querySelectorAll("item"))
        .slice(0, 4)
        .map((item, index): NewsArticle => {
          const title = stripHtml(item.querySelector("title")?.textContent ?? "Notícia em atualização");
          const link = item.querySelector("link")?.textContent ?? "#";
          const pubDate = new Date(item.querySelector("pubDate")?.textContent ?? Date.now());
          const source = item.querySelector("source")?.textContent ?? "Google News";
          const excerpt = stripHtml(item.querySelector("description")?.textContent ?? title);

          return {
            id: `live-${cat.toLowerCase()}-${slugify(title) || index}`,
            cat,
            title,
            excerpt,
            body: [
              excerpt || "Esta notícia foi capturada do feed em tempo real e pode estar em atualização.",
              "Use o botão de fonte original para acompanhar todos os detalhes, contexto adicional e possíveis correções editoriais.",
            ],
            time: relativeTime(pubDate),
            author: source,
            image:
              cat === "IA"
                ? "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=480&fit=crop&auto=format"
                : cat === "MUNDO"
                  ? "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=800&h=480&fit=crop&auto=format"
                : cat === "FOREX"
                  ? "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=480&fit=crop&auto=format"
                  : cat === "GEOPOLITICA"
                    ? "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=480&fit=crop&auto=format"
                    : "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=480&fit=crop&auto=format",
            source,
            url: link,
            live: true,
          };
        });
    }),
  );

  return results
    .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    .slice(0, 12);
}

function Ticker() {
  const items = [...FOREX_PAIRS, ...FOREX_PAIRS];
  return (
    <div className="ticker-strip bg-[#060910] border-b border-border overflow-hidden">
      <div className="flex items-center">
        <div className="shrink-0 bg-primary text-primary-foreground px-4 py-1.5 text-[10px] font-mono font-medium tracking-widest uppercase z-10">
          LIVE
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex animate-[scroll_35s_linear_infinite] whitespace-nowrap">
            {items.map((p, i) => (
              <span key={`${p.pair}-${i}`} className="inline-flex items-center gap-2 px-6 py-1.5 border-r border-border/50">
                <span className="text-[11px] font-mono text-muted-foreground">{p.pair}</span>
                <span className="text-[11px] font-mono text-foreground font-medium">{p.value.toFixed(p.value > 100 ? 2 : 4)}</span>
                <span className={`text-[10px] font-mono flex items-center gap-0.5 ${p.pct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {p.pct >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {Math.abs(p.pct).toFixed(2)}%
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SparkLine({ base, up }: { base: number; up: boolean }) {
  const data = useRef(generateSparkline(base)).current;
  return (
    <ResponsiveContainer width={80} height={32}>
      <LineChart data={data}>
        <YAxis domain={["auto", "auto"]} hide />
        <Line type="monotone" dataKey="v" dot={false} stroke={up ? "#22d3a0" : "#e0364a"} strokeWidth={1.5} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function CategoryBadge({ cat }: { cat: string }) {
  const colors: Record<string, string> = {
    ECONOMIA: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    GEOPOLITICA: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    IA: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    FOREX: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  };
  return (
    <span className={`text-[9px] font-mono font-medium tracking-widest uppercase px-2 py-0.5 rounded border ${colors[cat] ?? "text-muted-foreground border-border"}`}>
      {CAT_LABELS[cat] ?? cat}
    </span>
  );
}

function ArticleCard({ article, onOpen }: { article: NewsArticle; onOpen: (article: NewsArticle) => void }) {
  return (
    <button
      onClick={() => onOpen(article)}
      className="text-left group bg-card border border-border hover:border-primary/30 transition-colors overflow-hidden flex flex-col"
    >
      <div className="overflow-hidden bg-muted h-44">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <CategoryBadge cat={article.cat} />
          {article.live && <span className="mono text-[9px] tracking-widest uppercase text-emerald-400">ao vivo</span>}
        </div>
        <h3 className="playfair text-base font-bold leading-snug mt-2 group-hover:text-primary transition-colors">{article.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2 line-clamp-3">{article.excerpt}</p>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] mono">
            <Clock size={10} />
            {article.time} · {article.author}
          </div>
          <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </button>
  );
}

function PremiumBox({
  title,
  items,
  premium,
  onSubscribe,
  onAccess,
  price = "R$ 19,90",
  planLabel = "Pro / mes",
  eyebrow = "Planos pagos",
}: {
  title: string;
  items: string[];
  premium: boolean;
  onSubscribe: () => void;
  onAccess: () => void;
  price?: string;
  planLabel?: string;
  eyebrow?: string;
}) {
  return (
    <div className="border border-primary/30 bg-primary/5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mono text-[10px] tracking-widest uppercase text-primary">{eyebrow}</p>
          <h3 className="playfair text-xl font-bold mt-1">{title}</h3>
        </div>
        <div className="text-right shrink-0">
          <p className="mono text-2xl font-bold text-primary">{price}</p>
          <p className="mono text-[10px] text-muted-foreground">{planLabel}</p>
        </div>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
            <LockKeyhole size={13} className="text-primary mt-0.5 shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>
      <button onClick={premium ? onAccess : onSubscribe} className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm mono hover:bg-primary/90">
        {premium ? (
          <span className="inline-flex items-center gap-2">
            Acessar conteudo premium
            <ArrowUpRight size={14} />
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            Ver planos
            <ArrowUpRight size={14} />
          </span>
        )}
      </button>
    </div>
  );
}

function LoginPage({ onLogin, onBack }: { onLogin: (user: UserAccount) => void; onBack: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const user = { name: name.trim() || "Assinante", email: email.trim(), premium: false };
    if (!user.email) return;
    onLogin(user);
  };

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} />
        Voltar
      </button>
      <form onSubmit={submit} className="bg-card border border-border p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 border border-primary/30 bg-primary/10 flex items-center justify-center text-primary">
            <User size={18} />
          </div>
          <div>
            <p className="mono text-[10px] tracking-widest uppercase text-primary">Acesso</p>
            <h1 className="playfair text-2xl font-bold">Entrar ou criar conta</h1>
          </div>
        </div>
        <label className="block text-xs text-muted-foreground mb-2">Nome</label>
        <input value={name} onChange={(event) => setName(event.target.value)} className="w-full bg-background border border-border px-3 py-2 mb-4 outline-none focus:border-primary" placeholder="Seu nome" />
        <label className="block text-xs text-muted-foreground mb-2">Email</label>
        <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full bg-background border border-border px-3 py-2 mb-5 outline-none focus:border-primary" placeholder="voce@email.com" type="email" />
        <button className="w-full bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90">Continuar</button>
        <p className="text-xs text-muted-foreground leading-relaxed mt-4">Neste prototipo, o login fica salvo neste navegador. Para producao, conecte aqui Firebase, Supabase ou outro backend.</p>
      </form>
    </main>
  );
}

function CheckoutPage({
  user,
  offer,
  onLoginRequired,
  onConfirm,
  onAccess,
  onBack,
}: {
  user: UserAccount | null;
  offer: Offer;
  onLoginRequired: () => void;
  onConfirm: (payment: CheckoutPayment) => void;
  onAccess: () => void;
  onBack: () => void;
}) {
  const [method, setMethod] = useState<"card" | "pix">("card");
  const [payerName, setPayerName] = useState(user?.name ?? "");
  const [document, setDocument] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [acceptedRisk, setAcceptedRisk] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (!user) {
      onLoginRequired();
      return;
    }

    const nextErrors: Record<string, string> = {};
    const documentDigits = onlyDigits(document);
    const cardDigits = onlyDigits(cardNumber);
    const [expiryMonth, expiryYear] = expiry.split("/").map(Number);
    const now = new Date();
    const currentYear = Number(String(now.getFullYear()).slice(-2));
    const expiryIsValid =
      Number.isInteger(expiryMonth) &&
      Number.isInteger(expiryYear) &&
      expiryMonth >= 1 &&
      expiryMonth <= 12 &&
      (expiryYear > currentYear || (expiryYear === currentYear && expiryMonth >= now.getMonth() + 1));

    if (!payerName.trim()) nextErrors.payerName = "Informe o nome do pagador.";
    if (documentDigits.length < 11) nextErrors.document = "Informe CPF ou CNPJ valido.";
    if (!acceptedRisk) nextErrors.acceptedRisk = "Confirme os termos educacionais e de risco.";

    if (method === "card") {
      if (cardDigits.length < 13) nextErrors.cardNumber = "Informe um numero de cartao valido.";
      if (!expiryIsValid) nextErrors.expiry = "Informe uma validade futura no formato MM/AA.";
      if (!/^\d{3,4}$/.test(cvc)) nextErrors.cvc = "Informe o CVV.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setProcessing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    onConfirm({
      offerId: offer.id,
      method,
      payerName: payerName.trim(),
      document: documentDigits,
      cardLast4: method === "card" ? cardDigits.slice(-4) : undefined,
    });
  };

  const activeOffer = hasOfferAccess(user, offer.id);

  if (!user) {
    return (
      <main className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
        <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} />
          Voltar
        </button>
        <div className="grid lg:grid-cols-[1fr_360px] gap-4">
          <section className="bg-card border border-border p-6">
            <p className="mono text-[10px] tracking-widest uppercase text-primary">{offer.eyebrow}</p>
            <h1 className="playfair text-3xl font-bold mt-2">{offer.title}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed mt-3">{offer.description}</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              {offer.features.map((item) => (
                <div key={item} className="border border-border bg-background/40 p-4 text-xs leading-relaxed text-muted-foreground">
                  <LockKeyhole size={13} className="text-primary mb-2" />
                  {item}
                </div>
              ))}
            </div>
          </section>
          <aside className="bg-card border border-border p-6 self-start">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <span className="text-sm">{offer.title}</span>
              <span className="mono text-xl text-primary">
                {offer.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
            <div className="border border-amber-400/25 bg-amber-400/5 p-4">
              <p className="mono text-[10px] tracking-widest uppercase text-amber-400">Login necessario</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">Entre ou crie sua conta antes de preencher pagamento. Depois disso voce volta para este produto automaticamente.</p>
            </div>
            <button onClick={onLoginRequired} className="mt-5 w-full bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90">
              Entrar para continuar
            </button>
          </aside>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
      <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} />
        Voltar
      </button>
      <div className="grid lg:grid-cols-[1fr_360px] gap-4">
        <section className="bg-card border border-border p-6">
          <p className="mono text-[10px] tracking-widest uppercase text-primary">{offer.eyebrow}</p>
          <h1 className="playfair text-3xl font-bold mt-2">{offer.title}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mt-3">{offer.description}</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-6">
            {offer.features.map((item) => (
              <div key={item} className="border border-border bg-background/40 p-4 text-xs leading-relaxed text-muted-foreground">
                <LockKeyhole size={13} className="text-primary mb-2" />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 border border-amber-400/20 bg-amber-400/5 p-4">
            <p className="mono text-[10px] tracking-widest uppercase text-amber-400">Ambiente demo</p>
            <p className="text-xs leading-relaxed text-muted-foreground mt-2">
              A logica de liberacao esta ativa no frontend: pagamento aprovado grava recibo, plano e validade. Para producao, conecte este submit ao provedor de pagamento e confirme por webhook no backend.
            </p>
          </div>
        </section>
        <form onSubmit={submit} className="bg-card border border-border p-6 self-start">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <span className="text-sm">{offer.title}</span>
            <span className="mono text-xl text-primary">
              {offer.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </div>

          {activeOffer ? (
            <div className="border border-emerald-400/25 bg-emerald-400/5 p-4 mb-5">
              <p className="mono text-[10px] tracking-widest uppercase text-emerald-400">Acesso ativo</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">Este produto ja esta liberado para sua conta.</p>
              <button type="button" onClick={onAccess} className="mt-4 w-full bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90">
                Acessar agora
              </button>
            </div>
          ) : null}

          <div className="space-y-3 text-xs text-muted-foreground mb-5">
            <p>Conta: {user?.email ?? "voce ainda nao entrou"}</p>
            <p>Escolha o metodo e preencha os dados para liberar este produto neste navegador.</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={() => setMethod("card")}
              className={`border px-3 py-2 text-xs mono ${method === "card" ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              Cartao
            </button>
            <button
              type="button"
              onClick={() => setMethod("pix")}
              className={`border px-3 py-2 text-xs mono ${method === "pix" ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              PIX
            </button>
          </div>

          <label className="block text-xs text-muted-foreground mb-2">Nome do pagador</label>
          <input
            value={payerName}
            onChange={(event) => setPayerName(event.target.value)}
            className="w-full bg-background border border-border px-3 py-2 mb-1 outline-none focus:border-primary"
            placeholder="Nome no pagamento"
            disabled={activeOffer}
          />
          {errors.payerName && <p className="text-[11px] text-red-400 mb-3">{errors.payerName}</p>}

          <label className="block text-xs text-muted-foreground mb-2 mt-3">CPF/CNPJ</label>
          <input
            value={document}
            onChange={(event) => setDocument(onlyDigits(event.target.value).slice(0, 14))}
            className="w-full bg-background border border-border px-3 py-2 mb-1 outline-none focus:border-primary"
            placeholder="Somente numeros"
            disabled={activeOffer}
          />
          {errors.document && <p className="text-[11px] text-red-400 mb-3">{errors.document}</p>}

          {method === "card" ? (
            <div className="mt-3">
              <label className="block text-xs text-muted-foreground mb-2">Numero do cartao</label>
              <input
                value={cardNumber}
                onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                className="w-full bg-background border border-border px-3 py-2 mb-1 outline-none focus:border-primary"
                placeholder="4242 4242 4242 4242"
                disabled={activeOffer}
              />
              {errors.cardNumber && <p className="text-[11px] text-red-400 mb-3">{errors.cardNumber}</p>}

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Validade</label>
                  <input
                    value={expiry}
                    onChange={(event) => setExpiry(formatExpiry(event.target.value))}
                    className="w-full bg-background border border-border px-3 py-2 mb-1 outline-none focus:border-primary"
                    placeholder="MM/AA"
                    disabled={activeOffer}
                  />
                  {errors.expiry && <p className="text-[11px] text-red-400">{errors.expiry}</p>}
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">CVV</label>
                  <input
                    value={cvc}
                    onChange={(event) => setCvc(onlyDigits(event.target.value).slice(0, 4))}
                    className="w-full bg-background border border-border px-3 py-2 mb-1 outline-none focus:border-primary"
                    placeholder="123"
                    disabled={activeOffer}
                  />
                  {errors.cvc && <p className="text-[11px] text-red-400">{errors.cvc}</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-border bg-background/40 p-4 mt-3">
              <p className="mono text-[10px] tracking-widest uppercase text-primary">PIX copia e cola demo</p>
              <p className="text-xs leading-relaxed text-muted-foreground mt-2 break-all">00020126580014br.gov.bcb.pix0136nexusfx-{offer.id}-demo520400005303986540{String(offer.price.toFixed(2)).padStart(5, "0")}5802BR5920NEXUSFX6009SAO PAULO62070503***6304DEMO</p>
            </div>
          )}

          <label className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed mt-5">
            <input
              type="checkbox"
              checked={acceptedRisk}
              onChange={(event) => setAcceptedRisk(event.target.checked)}
              className="mt-1"
              disabled={activeOffer}
            />
            <span>Entendo que o conteudo e educacional, nao promete rentabilidade e nao substitui decisao propria de risco.</span>
          </label>
          {errors.acceptedRisk && <p className="text-[11px] text-red-400 mt-2">{errors.acceptedRisk}</p>}

          {user ? (
            <button disabled={processing || activeOffer} className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
              <CreditCard size={15} />
              {processing ? "Processando..." : offer.cta}
            </button>
          ) : (
            <button type="button" onClick={onLoginRequired} className="mt-5 w-full bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90">Entrar para assinar</button>
          )}
        </form>
      </div>
    </main>
  );
}

function LegacyPremiumArea({ user, onSubscribe, onBack }: { user: UserAccount | null; onSubscribe: () => void; onBack: () => void }) {
  const activePremium = hasPlanAccess(user, "pro");

  if (!user || !activePremium) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} />
          Voltar
        </button>
        <div className="bg-card border border-border p-6 text-center">
          <LockKeyhole size={30} className="mx-auto text-primary mb-4" />
          <h1 className="playfair text-3xl font-bold">Area premium bloqueada</h1>
          <p className="text-muted-foreground text-sm mt-3">Escolha Pro ou Premium para liberar estudos, resumos e ferramentas educativas.</p>
          <button onClick={onSubscribe} className="mt-6 bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90">Assinar agora</button>
        </div>
      </main>
    );
  }

  const receipt = user.lastPayment;

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} />
        Voltar
      </button>

      <div className="border border-primary/30 bg-primary/5 p-6 lg:p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <p className="mono text-[10px] tracking-widest uppercase text-primary">Pagamento aprovado · Bem-vindo, {user.name}</p>
            <h1 className="playfair text-3xl lg:text-5xl font-bold mt-2">Conteudo premium liberado</h1>
            <p className="text-muted-foreground text-sm leading-relaxed mt-4 max-w-3xl">
              Hub completo para IA, Forex, economia, mundo e geopolitica. A leitura cruza dados oficiais de mercado, boas praticas de risco e padroes observados em traders historicamente reconhecidos.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="mono text-[10px] tracking-widest uppercase border border-emerald-400/30 text-emerald-400 px-2 py-1">Ativo ate {formatDate(user.premiumUntil)}</span>
              {receipt && <span className="mono text-[10px] tracking-widest uppercase border border-border text-muted-foreground px-2 py-1">Recibo {receipt.id}</span>}
              {receipt?.cardLast4 && <span className="mono text-[10px] tracking-widest uppercase border border-border text-muted-foreground px-2 py-1">Cartao final {receipt.cardLast4}</span>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 lg:w-[420px]">
            {PREMIUM_MARKET_DATA.map((item) => (
              <div key={item.label} className="border border-border bg-background/60 p-3">
                <p className="mono text-[9px] tracking-widest uppercase text-muted-foreground">{item.label}</p>
                <p className="mono text-lg text-primary mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mb-12">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <p className="mono text-[10px] tracking-widest uppercase text-primary">Todos os topicos</p>
            <h2 className="playfair text-2xl font-bold mt-1">Briefings premium por categoria</h2>
          </div>
          <BookOpen size={22} className="text-primary hidden sm:block" />
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-3">
          {PREMIUM_TOPIC_BRIEFINGS.map((brief) => (
            <article key={brief.cat} className="bg-card border border-border p-5">
              <div className="flex items-center justify-between gap-3">
                <CategoryBadge cat={brief.cat} />
                <span className="text-primary">{CAT_ICONS[brief.cat]}</span>
              </div>
              <h3 className="playfair text-lg font-bold mt-4">{brief.title}</h3>
              <p className="mono text-[10px] tracking-widest uppercase text-primary mt-1">{brief.signal}</p>
              <div className="mt-4 space-y-3">
                {brief.bullets.map((bullet) => (
                  <p key={bullet} className="text-xs leading-relaxed text-muted-foreground flex gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span>{bullet}</span>
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-[1fr_360px] gap-4 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <Radar size={20} className="text-primary" />
            <div>
              <p className="mono text-[10px] tracking-widest uppercase text-primary">Cruzamento de traders</p>
              <h2 className="playfair text-2xl font-bold">Matriz de traders de referencia</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {TRADER_PLAYBOOKS.map((trader) => (
              <article key={trader.name} className="bg-card border border-border p-5">
                <p className="mono text-[10px] tracking-widest uppercase text-muted-foreground">{trader.edge}</p>
                <h3 className="playfair text-xl font-bold mt-1">{trader.name}</h3>
                <p className="text-xs leading-relaxed text-primary mt-3">{trader.data}</p>
                <p className="text-sm leading-relaxed text-muted-foreground mt-3">{trader.lesson}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="bg-card border border-border p-5 self-start">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" />
            <h3 className="playfair text-xl font-bold">Regras que se repetem</h3>
          </div>
          <div className="mt-5 space-y-3">
            {TRADER_CROSS_RULES.map((rule, index) => (
              <div key={rule} className="flex gap-3">
                <span className="mono text-[10px] text-primary border border-primary/30 w-6 h-6 flex items-center justify-center shrink-0">{index + 1}</span>
                <p className="text-xs leading-relaxed text-muted-foreground">{rule}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid lg:grid-cols-2 gap-4 mb-12">
        <div className="bg-card border border-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <Target size={20} className="text-primary" />
            <div>
              <p className="mono text-[10px] tracking-widest uppercase text-primary">Forex com IA</p>
              <h2 className="playfair text-2xl font-bold">Fluxo de analise profissional</h2>
            </div>
          </div>
          <div className="space-y-3">
            {AI_FOREX_WORKFLOW.map((item) => (
              <div key={item.title} className="border border-border bg-background/40 p-4">
                <div className="flex items-center gap-3">
                  <span className="mono text-xs text-primary border border-primary/30 w-7 h-7 flex items-center justify-center">{item.step}</span>
                  <h3 className="text-sm font-medium">{item.title}</h3>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground mt-3">{item.prompt}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <Zap size={20} className="text-primary" />
            <div>
              <p className="mono text-[10px] tracking-widest uppercase text-primary">Prompts premium</p>
              <h2 className="playfair text-2xl font-bold">Copiar, adaptar e revisar</h2>
            </div>
          </div>
          <div className="space-y-3">
            {PREMIUM_AI_PROMPTS.map((prompt) => (
              <div key={prompt} className="border-l-2 border-primary bg-background/40 px-4 py-3">
                <p className="text-xs leading-relaxed text-muted-foreground">{prompt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-[1fr_360px] gap-4 mb-12">
        <div>
          <div className="mb-5">
            <p className="mono text-[10px] tracking-widest uppercase text-primary">Protocolo de risco</p>
            <h2 className="playfair text-2xl font-bold mt-1">Conteudo top sem promessa falsa</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {RISK_PROTOCOL.map((item) => (
              <article key={item.rule} className="bg-card border border-border p-5">
                <p className="mono text-[10px] tracking-widest uppercase text-muted-foreground">{item.rule}</p>
                <p className="mono text-2xl text-primary mt-2">{item.value}</p>
                <p className="text-xs leading-relaxed text-muted-foreground mt-3">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="border border-amber-400/25 bg-amber-400/5 p-5 self-start">
          <p className="mono text-[10px] tracking-widest uppercase text-amber-400">Nota de responsabilidade</p>
          <p className="text-sm leading-relaxed text-muted-foreground mt-3">
            Este conteudo e educacional. Forex, day trade e produtos alavancados podem gerar perdas rapidas. Nenhum bloco acima e recomendacao personalizada, promessa de rentabilidade ou ordem de compra/venda.
          </p>
          <div className="mt-5 space-y-2">
            {PREMIUM_SOURCES.map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 text-xs text-muted-foreground hover:text-primary border border-border px-3 py-2">
                <span>{source.label}</span>
                <ArrowUpRight size={12} />
              </a>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

function LockedPanel({ title, detail, offerId, onCheckout }: { title: string; detail: string; offerId: OfferId; onCheckout: (offerId: OfferId) => void }) {
  const offer = OFFERS[offerId];
  return (
    <div className="border border-primary/30 bg-primary/5 p-5">
      <LockKeyhole size={20} className="text-primary mb-3" />
      <h3 className="playfair text-xl font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mt-2">{detail}</p>
      <button onClick={() => onCheckout(offerId)} className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90">
        {offer.cta}
        <ArrowUpRight size={14} />
      </button>
    </div>
  );
}

function PlansPage({ user, onCheckout, onBack }: { user: UserAccount | null; onCheckout: (offerId: OfferId) => void; onBack: () => void }) {
  const currentPlan = getUserPlan(user);

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} />
        Voltar
      </button>

      <section className="mb-8">
        <p className="mono text-[10px] tracking-widest uppercase text-primary">Monetizacao NexusFX</p>
        <h1 className="playfair text-4xl font-bold mt-2">Planos para estudar mercado sem vender sinal</h1>
        <p className="text-muted-foreground text-sm leading-relaxed mt-3 max-w-3xl">
          A proposta do NexusFX e vender clareza, estudo, filtros e ferramentas educativas. O posicionamento fica mais profissional e reduz risco juridico: nada de call, entrada garantida ou promessa de lucro.
        </p>
      </section>

      <section className="grid lg:grid-cols-3 gap-4 mb-6">
        <article className="bg-card border border-border p-6 flex flex-col">
          <p className="mono text-[10px] tracking-widest uppercase text-muted-foreground">Free - descobrir</p>
          <h2 className="playfair text-2xl font-bold mt-2">R$ 0</h2>
          <p className="text-sm text-muted-foreground mt-3">Para ler noticias, aprender termos e entender o basico sem pagar.</p>
          <div className="mt-5 space-y-2">
            {FREE_FEATURES.map((feature) => (
              <p key={feature} className="text-xs text-muted-foreground flex gap-2">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                {feature}
              </p>
            ))}
          </div>
          <div className="mt-auto pt-5">
            <p className="mono text-[10px] tracking-widest uppercase text-muted-foreground">Nao inclui</p>
            <p className="text-xs text-muted-foreground mt-2">IA completa, alertas, simulador, terminal premium e comunidade.</p>
          </div>
        </article>

        <article className="bg-card border border-sky-400/25 p-6 flex flex-col">
          <p className="mono text-[10px] tracking-widest uppercase text-sky-400">Pro - acompanhar e estudar</p>
          <h2 className="playfair text-2xl font-bold mt-2">{OFFERS.pro.title}</h2>
          <p className="mono text-3xl text-primary mt-4">
            {OFFERS.pro.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            <span className="text-xs text-muted-foreground"> {OFFERS.pro.recurrence}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-3">{OFFERS.pro.description}</p>
          <div className="mt-5 space-y-2">
            {["Morning Brief diario", "Alertas e filtros", "Watchlist educativa", "Simulador e quizzes", "IA resumindo noticias"].map((feature) => (
              <p key={feature} className="text-xs text-muted-foreground flex gap-2">
                <CheckCircle2 size={13} className="text-sky-400 shrink-0" />
                {feature}
              </p>
            ))}
          </div>
          <div className="mt-auto pt-5">
            <p className="mono text-[10px] tracking-widest uppercase text-muted-foreground">Nao inclui</p>
            <p className="text-xs text-muted-foreground mt-2">Terminal de entrada, IA operacional Premium, comunidade, relatorios e PDFs premium.</p>
            <button disabled={currentPlan === "pro" || currentPlan === "premium"} onClick={() => onCheckout("pro")} className="mt-4 w-full bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90 disabled:opacity-50">
              {currentPlan === "pro" || currentPlan === "premium" ? "Plano ativo" : OFFERS.pro.cta}
            </button>
          </div>
        </article>

        <article className="border border-primary/40 bg-primary/5 p-6 flex flex-col relative overflow-hidden">
          <div className="absolute right-4 top-4 mono text-[9px] tracking-widest uppercase text-primary border border-primary/30 px-2 py-1">Top</div>
          <p className="mono text-[10px] tracking-widest uppercase text-primary">Premium - terminal de mercado</p>
          <h2 className="playfair text-2xl font-bold mt-2">{OFFERS.premium.title}</h2>
          <p className="mono text-3xl text-primary mt-4">
            {OFFERS.premium.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            <span className="text-xs text-muted-foreground"> {OFFERS.premium.recurrence}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-3">{OFFERS.premium.description}</p>
          <div className="mt-5 space-y-2">
            {[
              "Tudo do Pro",
              "Terminal Forex, cripto, indices, commodities e acoes",
              "Todos os grupos de indicadores",
              "Cenarios educativos de entrada e no-trade",
              "IA avancada para tese, risco e revisao",
              "Comunidade, relatorios e PDFs",
            ].map((feature) => (
              <p key={feature} className="text-xs text-muted-foreground flex gap-2">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                {feature}
              </p>
            ))}
          </div>
          <button disabled={currentPlan === "premium"} onClick={() => onCheckout("premium")} className="mt-auto w-full bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90 disabled:opacity-50">
            {currentPlan === "premium" ? "Plano ativo" : OFFERS.premium.cta}
          </button>
        </article>
      </section>

      <section className="bg-card border border-border mb-6 overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[1fr_120px_120px_120px] gap-3 px-5 py-4 border-b border-border">
            <span className="mono text-[10px] tracking-widest uppercase text-muted-foreground">Comparacao rapida</span>
            <span className="mono text-[10px] tracking-widest uppercase text-muted-foreground text-center">Free</span>
            <span className="mono text-[10px] tracking-widest uppercase text-primary text-center">Pro</span>
            <span className="mono text-[10px] tracking-widest uppercase text-primary text-center">Premium</span>
          </div>
          {PLAN_COMPARISON.map((row) => (
            <div key={row.feature} className="grid grid-cols-[1fr_120px_120px_120px] gap-3 px-5 py-3 border-b border-border last:border-b-0">
              <span className="text-sm text-muted-foreground">{row.feature}</span>
              {(["free", "pro", "premium"] as const).map((plan) => (
                <span key={plan} className={`text-center mono text-xs ${row[plan] ? "text-emerald-400" : "text-muted-foreground/40"}`}>
                  {row[plan] ? "sim" : "-"}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-4">
        <p className="mono text-[10px] tracking-widest uppercase text-primary mb-3">Produtos de entrada e produto separado</p>
        <div className="grid lg:grid-cols-2 gap-4">
        {(["newsletter", "course"] as OfferId[]).map((offerId) => {
          const offer = OFFERS[offerId];
          const active = hasOfferAccess(user, offerId);
          return (
            <article key={offer.id} className="bg-card border border-border p-6">
              <p className="mono text-[10px] tracking-widest uppercase text-primary">{offer.eyebrow}</p>
              <h2 className="playfair text-2xl font-bold mt-2">{offer.title}</h2>
              <p className="mono text-2xl text-primary mt-3">
                {offer.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                <span className="text-xs text-muted-foreground"> {offer.recurrence}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-3">{offer.description}</p>
              <button disabled={active} onClick={() => onCheckout(offer.id)} className="mt-5 bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90 disabled:opacity-50">
                {active ? "Liberado" : offer.cta}
              </button>
            </article>
          );
        })}
        </div>
      </section>
    </main>
  );
}

function PremiumArea({
  user,
  onSubscribe,
  onBack,
  onOpenPage,
  onCheckout,
}: {
  user: UserAccount | null;
  onSubscribe: () => void;
  onBack: () => void;
  onOpenPage: (view: AppView) => void;
  onCheckout: (offerId: OfferId) => void;
}) {
  const plan = getUserPlan(user);

  if (!user || plan === "free") {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} />
          Voltar
        </button>
        <div className="bg-card border border-border p-6 text-center">
          <LockKeyhole size={30} className="mx-auto text-primary mb-4" />
          <h1 className="playfair text-3xl font-bold">Area de assinante bloqueada</h1>
          <p className="text-muted-foreground text-sm mt-3">Escolha Pro ou Premium para liberar estudos, resumos, filtros e ferramentas educativas.</p>
          <button onClick={onSubscribe} className="mt-6 bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90">Ver planos</button>
        </div>
      </main>
    );
  }

  const pages: Array<{ title: string; detail: string; view: AppView; locked: boolean; offerId?: OfferId }> = [
    { title: "Estudos", detail: "Trilhas, glossario, quizzes e simulador de carteira ficticia.", view: "studies" as AppView, locked: false },
    { title: "Newsletter", detail: "Morning Brief com noticias, impacto, termos e agenda.", view: "newsletter" as AppView, locked: false },
    { title: "Curso", detail: "Investimentos do Zero com todos os modulos abertos para estudo.", view: "course" as AppView, locked: false },
    { title: "IA Nexus", detail: "Resumo de noticias e IA avancada para estudo e operacoes simuladas.", view: "ai" as AppView, locked: false },
    { title: "Terminal Premium", detail: "Forex, cripto, ativos, indicadores, cenarios e IA operacional.", view: "terminal" as AppView, locked: !hasPlanAccess(user, "premium"), offerId: "premium" as OfferId },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} />
        Voltar
      </button>
      <section className="border border-primary/30 bg-primary/5 p-6 lg:p-8 mb-8">
        <p className="mono text-[10px] tracking-widest uppercase text-primary">Hub do assinante</p>
        <h1 className="playfair text-4xl font-bold mt-2">NexusFX {plan === "premium" ? "Premium" : "Pro"}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3 max-w-3xl">
          Aqui voce escolhe a pagina que quer usar. Cada area tem uma entrega diferente: estudos, newsletter, curso e IA.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="mono text-[10px] tracking-widest uppercase border border-emerald-400/30 text-emerald-400 px-2 py-1">Plano ativo ate {formatDate(user.premiumUntil)}</span>
          {user.lastPayment && <span className="mono text-[10px] tracking-widest uppercase border border-border text-muted-foreground px-2 py-1">Recibo {user.lastPayment.id}</span>}
        </div>
      </section>

      <section className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
        {pages.map((page) => (
          <article key={page.title} className="bg-card border border-border p-5">
            <h2 className="playfair text-xl font-bold">{page.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">{page.detail}</p>
            {page.locked ? (
              <button onClick={() => onCheckout(page.offerId ?? "premium")} className="mt-5 w-full border border-primary/40 text-primary px-4 py-2 mono text-sm hover:bg-primary/10">Assinar Premium</button>
            ) : (
              <button onClick={() => onOpenPage(page.view)} className="mt-5 w-full bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90">Abrir pagina</button>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

function StudiesPage({ user, onCheckout, onBack }: { user: UserAccount | null; onCheckout: (offerId: OfferId) => void; onBack: () => void }) {
  const pro = hasPlanAccess(user, "pro");

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} />
        Voltar
      </button>
      <section className="mb-8">
        <p className="mono text-[10px] tracking-widest uppercase text-primary">Area de estudos</p>
        <h1 className="playfair text-4xl font-bold mt-2">Aprenda mercado por trilhas</h1>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3 max-w-3xl">
          A pagina Free ensina base. O Pro libera filtros, simulador, quizzes e watchlist educativa.
        </p>
      </section>

      <section className="grid lg:grid-cols-3 gap-4 mb-10">
        {STUDY_TRACKS.map((track) => (
          <article key={track.level} className="bg-card border border-border p-5">
            <p className="mono text-[10px] tracking-widest uppercase text-primary">{track.level}</p>
            <h2 className="playfair text-xl font-bold mt-2">{track.title}</h2>
            <div className="mt-4 space-y-3">
              {track.lessons.map((lesson) => (
                <p key={lesson} className="text-xs text-muted-foreground flex gap-2">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  {lesson}
                </p>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="grid lg:grid-cols-[1fr_360px] gap-4">
        <div className="bg-card border border-border p-6">
          <h2 className="playfair text-2xl font-bold">Glossario Free</h2>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            {GLOSSARY.map((item) => (
              <div key={item.term} className="border border-border bg-background/40 p-4">
                <p className="mono text-[10px] tracking-widest uppercase text-primary">{item.term}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {pro ? (
          <aside className="bg-card border border-border p-6">
            <h2 className="playfair text-2xl font-bold">Ferramentas Pro</h2>
            <div className="mt-5 space-y-3">
              {["Quiz semanal", "Watchlist educativa", "Simulador de carteira ficticia", "Filtros de noticias importantes"].map((item) => (
                <div key={item} className="border border-border bg-background/40 p-4 text-sm text-muted-foreground">{item}</div>
              ))}
            </div>
          </aside>
        ) : (
          <LockedPanel title="Ferramentas Pro bloqueadas" detail="Assine o Pro para liberar quiz, watchlist, filtros e simulador de carteira ficticia." offerId="pro" onCheckout={onCheckout} />
        )}
      </section>
    </main>
  );
}

function NewsletterPage({ user, onCheckout, onBack }: { user: UserAccount | null; onCheckout: (offerId: OfferId) => void; onBack: () => void }) {
  const access = hasNewsletterAccess(user);

  return (
    <main className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
      <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} />
        Voltar
      </button>
      <section className="grid lg:grid-cols-[1fr_340px] gap-4">
        <div className="bg-card border border-border p-6">
          <p className="mono text-[10px] tracking-widest uppercase text-primary">NexusFX Morning Brief</p>
          <h1 className="playfair text-4xl font-bold mt-2">Newsletter premium</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">Todo dia: noticias, impacto no mercado, termos explicados, agenda economica e o que estudar.</p>
          <div className="mt-6 space-y-3">
            {(access ? DAILY_BRIEF : DAILY_BRIEF.slice(0, 2)).map((item) => (
              <div key={item} className="border border-border bg-background/40 p-4 text-sm text-muted-foreground">{item}</div>
            ))}
          </div>
          {!access && <p className="text-xs text-muted-foreground mt-4">Assine a newsletter ou o Pro para ver o briefing completo todos os dias.</p>}
        </div>

        <aside className="self-start">
          {access ? (
            <div className="bg-card border border-border p-5">
              <h2 className="playfair text-xl font-bold">Resumo semanal</h2>
              <div className="mt-4 space-y-3">
                {WEEKLY_BRIEF.map((item) => (
                  <p key={item} className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <LockedPanel title="Morning Brief completo" detail="Comece pela newsletter barata de R$ 9,90/mes ou assine o Pro." offerId="newsletter" onCheckout={onCheckout} />
          )}
        </aside>
      </section>
    </main>
  );
}

function CoursePage({ user, onCheckout, onBack }: { user: UserAccount | null; onCheckout: (offerId: OfferId) => void; onBack: () => void }) {
  const access = hasCourseAccess(user);

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} />
        Voltar
      </button>
      <section className="mb-8">
        <p className="mono text-[10px] tracking-widest uppercase text-primary">Curso dentro da plataforma</p>
        <h1 className="playfair text-4xl font-bold mt-2">Investimentos do Zero - Metodo NexusFX</h1>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3 max-w-3xl">Curso aberto para o usuario enxergar valor de verdade. A compra libera pacote de apoio, certificado, comunidade e materiais baixaveis.</p>
      </section>
      <section className="grid lg:grid-cols-[1fr_340px] gap-4 mb-4">
        <div className="bg-card border border-border p-6">
          <p className="mono text-[10px] tracking-widest uppercase text-primary">Aula aberta</p>
          <h2 className="playfair text-2xl font-bold mt-2">Como começar sem cair em promessa</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            O primeiro passo nao e escolher ativo. E organizar reserva, entender risco e aprender a ler informacao. Nesta aula, o aluno monta um mapa de objetivos e separa dinheiro de curto prazo, estudo e risco.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 mt-5">
            {["Diagnostico financeiro", "Reserva antes de risco", "Checklist anti-promessa"].map((item) => (
              <div key={item} className="border border-border bg-background/40 p-3 text-xs text-muted-foreground">{item}</div>
            ))}
          </div>
        </div>
        <aside className="bg-card border border-border p-6 self-start">
          <p className="mono text-[10px] tracking-widest uppercase text-primary">Dentro do curso</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              ["8", "modulos"],
              ["24", "aulas"],
              ["8", "PDFs"],
              ["8", "exercicios"],
            ].map(([value, label]) => (
              <div key={label} className="border border-border bg-background/40 p-3">
                <p className="mono text-2xl text-primary">{value}</p>
                <p className="mono text-[10px] text-muted-foreground uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>
      <section className="grid lg:grid-cols-[1fr_340px] gap-4">
        <div className="space-y-3">
          {COURSE_MODULES.map((module, index) => {
            return (
              <article key={module.title} className="border border-border bg-card p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <p className="mono text-[10px] tracking-widest uppercase text-primary">Modulo {index + 1}</p>
                    <h2 className="playfair text-xl font-bold mt-2">{module.title}</h2>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-3">{module.detail}</p>
                  </div>
                  <span className="mono text-[10px] tracking-widest uppercase text-emerald-400 border border-emerald-400/30 px-2 py-1 self-start">Aberto</span>
                </div>
                <div className="grid md:grid-cols-3 gap-3 mt-4">
                  {module.lessons.map((lesson) => (
                    <div key={lesson} className="border border-border bg-background/40 p-3">
                      <p className="mono text-[9px] tracking-widest uppercase text-muted-foreground">Aula</p>
                      <p className="text-xs text-muted-foreground mt-1">{lesson}</p>
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-3 gap-3 mt-3">
                  <div className="border border-border bg-background/40 p-3">
                    <p className="mono text-[9px] tracking-widest uppercase text-primary">PDF</p>
                    <p className="text-xs text-muted-foreground mt-1">{module.pdf}</p>
                  </div>
                  <div className="border border-border bg-background/40 p-3">
                    <p className="mono text-[9px] tracking-widest uppercase text-primary">Exercicio</p>
                    <p className="text-xs text-muted-foreground mt-1">{module.exercise}</p>
                  </div>
                  <div className="border border-border bg-background/40 p-3">
                    <p className="mono text-[9px] tracking-widest uppercase text-primary">Quiz</p>
                    <p className="text-xs text-muted-foreground mt-1">{module.quiz}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <aside className="self-start">
          {access ? (
            <div className="border border-emerald-400/25 bg-emerald-400/5 p-5">
              <p className="mono text-[10px] tracking-widest uppercase text-emerald-400">Curso liberado</p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">Pacote comprado: materiais baixaveis, certificado e comunidade do curso ficam vinculados a esta conta.</p>
            </div>
          ) : (
            <LockedPanel title="Comprar pacote do curso" detail="Os modulos estao abertos. A compra unica de R$ 97 libera materiais baixaveis, certificado, comunidade e futuras aulas extras." offerId="course" onCheckout={onCheckout} />
          )}
        </aside>
      </section>
    </main>
  );
}

function AiLabPage({ user, articles, selectedPair, onCheckout, onBack }: { user: UserAccount | null; articles: NewsArticle[]; selectedPair: typeof FOREX_PAIRS[number]; onCheckout: (offerId: OfferId) => void; onBack: () => void }) {
  const pro = hasPlanAccess(user, "pro");
  const premium = hasPlanAccess(user, "premium");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const important = articles.slice(0, 6);
  const categoryCount = CATS.filter((cat) => cat !== "TODOS")
    .map((cat) => `${CAT_LABELS[cat]}: ${articles.filter((item) => item.cat === cat).length}`)
    .join(" | ");

  const runAdvancedAi = (event: FormEvent) => {
    event.preventDefault();
    if (!premium || !question.trim()) return;
    setAnswer(
      `Analise educacional NexusFX: antes de qualquer decisao, transforme sua pergunta em tese, risco e invalidacao. Para ${selectedPair.pair}, confirme contexto macro, volatilidade, horario da sessao, spread e tamanho de posicao. Pergunta recebida: "${question.trim()}". Resposta: estude o cenario em tres partes - o que fortalece a tese, o que invalida e qual perda maxima voce aceita. Isto nao e recomendacao de compra ou venda.`,
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} />
        Voltar
      </button>
      <section className="mb-8">
        <p className="mono text-[10px] tracking-widest uppercase text-primary">IA NexusFX</p>
        <h1 className="playfair text-4xl font-bold mt-2">Resumo de noticias e IA avancada</h1>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3 max-w-3xl">
          A IA de resumo ajuda assinantes Pro e Premium a estudar noticias. A IA avancada para estudo e operacoes simuladas so abre no plano Premium.
        </p>
      </section>

      <section className="grid lg:grid-cols-[1fr_380px] gap-4">
        <div className="bg-card border border-border p-6">
          <h2 className="playfair text-2xl font-bold">IA que resume todas as noticias</h2>
          {pro ? (
            <>
              <div className="border border-border bg-background/40 p-4 mt-5">
                <p className="mono text-[10px] tracking-widest uppercase text-primary">Mapa do feed</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">{categoryCount || "Feed ainda carregando."}</p>
              </div>
              <div className="mt-4 space-y-3">
                {important.map((article) => (
                  <div key={article.id} className="border border-border bg-background/40 p-4">
                    <CategoryBadge cat={article.cat} />
                    <p className="text-sm mt-2">{article.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-2">Resumo IA: {article.excerpt}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-5 space-y-4">
              <div className="border border-border bg-background/40 p-4">
                <p className="mono text-[10px] tracking-widest uppercase text-primary">Preview gratuito</p>
                <p className="text-sm mt-2">{important[0]?.title ?? "Resumo de noticias em preparacao"}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                  Exemplo IA: separar manchete, impacto provavel, termos para estudar e risco de interpretacao. O Pro libera esse resumo para todo o feed.
                </p>
              </div>
              <LockedPanel title="Resumo IA completo bloqueado" detail="Assine o Pro para liberar a IA que resume todas as noticias, organiza impacto no mercado e aponta termos para estudar." offerId="pro" onCheckout={onCheckout} />
            </div>
          )}
        </div>

        <aside className="bg-card border border-border p-6 self-start">
          <h2 className="playfair text-2xl font-bold">IA avancada Premium</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">Ajuda a estruturar estudo, tese, risco e operacao simulada. Nao executa ordens e nao promete lucro.</p>
          {premium ? (
            <form onSubmit={runAdvancedAi} className="mt-5">
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                className="w-full min-h-32 bg-background border border-border px-3 py-2 outline-none focus:border-primary text-sm"
                placeholder="Ex: Quero estudar EUR/USD hoje. Quais riscos, noticias e invalidacoes devo observar?"
              />
              <button className="mt-3 w-full bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90">Analisar com IA Premium</button>
              {answer && <div className="mt-4 border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground leading-relaxed">{answer}</div>}
            </form>
          ) : (
            <LockedPanel title="IA avancada so no Premium" detail="A IA para estudo de operacoes, risco e revisao de tese fica exclusiva no plano Premium de R$ 39,90/mes." offerId="premium" onCheckout={onCheckout} />
          )}
        </aside>
      </section>
    </main>
  );
}

function MarketTerminalPage({ user, onCheckout, onBack }: { user: UserAccount | null; onCheckout: (offerId: OfferId) => void; onBack: () => void }) {
  const premium = hasPlanAccess(user, "premium");
  const [selectedScenario, setSelectedScenario] = useState(PREMIUM_ENTRY_SCENARIOS[0]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const runTerminalAi = (event: FormEvent) => {
    event.preventDefault();
    if (!premium || !question.trim()) return;
    setAnswer(
      `IA Terminal NexusFX: transforme "${question.trim()}" em estudo, nao em ordem. Primeiro valide regime macro, horario, liquidez, spread e noticia. Depois escreva gatilho, invalidacao, no-trade e perda maxima. Se qualquer ponto ficar confuso, o No-Trade Score deve vencer a vontade de entrar.`,
    );
  };

  const visibleScenarios = premium ? PREMIUM_ENTRY_SCENARIOS : PREMIUM_ENTRY_SCENARIOS.slice(0, 1);

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} />
        Voltar
      </button>

      <section className="border border-primary/30 bg-primary/5 p-6 lg:p-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <p className="mono text-[10px] tracking-widest uppercase text-primary">Exclusivo Premium</p>
            <h1 className="playfair text-4xl lg:text-5xl font-bold mt-2">Terminal NexusFX</h1>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3 max-w-3xl">
              Uma area top para Forex, cripto, indices, commodities e acoes: ativos, indicadores, estudos, IA, cenarios educativos de entrada e um sistema que tambem mostra quando nao operar.
            </p>
          </div>
          <button onClick={() => (premium ? setQuestion("Quero estudar EUR/USD, BTC e ouro para as proximas 24h.") : onCheckout("premium"))} className="bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90">
            {premium ? "Gerar estudo com IA" : "Assinar Premium"}
          </button>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {TERMINAL_STATS.map((item) => (
          <article key={item.label} className="bg-card border border-border p-4">
            <p className="mono text-3xl text-primary">{item.value}</p>
            <p className="mono text-[10px] tracking-widest uppercase text-muted-foreground mt-1">{item.label}</p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-3">{item.detail}</p>
          </article>
        ))}
      </section>

      {!premium && (
        <section className="mb-6">
          <LockedPanel title="Terminal completo bloqueado" detail="O Pro resume noticias. O Premium libera o terminal com Forex, cripto, ativos, todos os indicadores, cenarios educativos de entrada, No-Trade Score e IA operacional." offerId="premium" onCheckout={onCheckout} />
        </section>
      )}

      <section className="grid lg:grid-cols-[1fr_360px] gap-4 mb-8">
        <div className="bg-card border border-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <Radar size={20} className="text-primary" />
            <div>
              <p className="mono text-[10px] tracking-widest uppercase text-primary">Universo de ativos</p>
              <h2 className="playfair text-2xl font-bold">Forex, cripto, indices, commodities e acoes</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {ASSET_UNIVERSE.map((group) => (
              <article key={group.market} className="border border-border bg-background/40 p-4">
                <p className="mono text-[10px] tracking-widest uppercase text-primary">{group.market}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {group.assets.map((asset) => (
                    <span key={asset} className="mono text-[10px] border border-border text-muted-foreground px-2 py-1">{asset}</span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mt-3">{group.use}</p>
                <p className="mono text-[10px] tracking-widest uppercase text-emerald-400 mt-3">{group.signal}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="bg-card border border-border p-6 self-start">
          <div className="flex items-center gap-2">
            <Brain size={19} className="text-primary" />
            <h2 className="playfair text-2xl font-bold">IA operacional</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            Exclusiva do Premium. Ela organiza estudo, tese, risco, calendario, invalidacao e revisao. Nao executa ordens e nao promete rentabilidade.
          </p>
          {premium ? (
            <form onSubmit={runTerminalAi} className="mt-5">
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                className="w-full min-h-36 bg-background border border-border px-3 py-2 outline-none focus:border-primary text-sm"
                placeholder="Ex: Monte um estudo educativo para EUR/USD, BTC e ouro antes da abertura de Nova York."
              />
              <button className="mt-3 w-full bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90">Analisar com IA Premium</button>
              {answer && <div className="mt-4 border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground leading-relaxed">{answer}</div>}
            </form>
          ) : (
            <div className="mt-5 border border-border bg-background/40 p-4">
              <p className="mono text-[10px] tracking-widest uppercase text-primary">Preview</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">Assine Premium para perguntar sobre ativos, risco, calendario, setups educativos e revisao de tese.</p>
            </div>
          )}
        </aside>
      </section>

      <section className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <BarChart2 size={20} className="text-primary" />
          <div>
            <p className="mono text-[10px] tracking-widest uppercase text-primary">Biblioteca de indicadores</p>
            <h2 className="playfair text-2xl font-bold">Todos os tipos que importam no estudo</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {INDICATOR_SYSTEMS.map((system) => (
            <article key={system.group} className="bg-card border border-border p-5">
              <p className="mono text-[10px] tracking-widest uppercase text-primary">{system.group}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {system.indicators.map((indicator) => (
                  <span key={indicator} className="mono text-[10px] border border-border bg-background/40 text-muted-foreground px-2 py-1">{indicator}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mt-4">{system.use}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-[360px_1fr] gap-4 mb-8">
        <aside className="bg-card border border-border p-5 self-start">
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-primary" />
            <h2 className="playfair text-xl font-bold">Cenarios educativos</h2>
          </div>
          <div className="space-y-2">
            {visibleScenarios.map((scenario) => (
              <button
                key={scenario.asset}
                onClick={() => setSelectedScenario(scenario)}
                className={`w-full text-left border px-4 py-3 hover:border-primary/40 ${selectedScenario.asset === scenario.asset ? "border-primary/40 bg-primary/5" : "border-border bg-background/40"}`}
              >
                <p className="mono text-[10px] tracking-widest uppercase text-primary">{scenario.asset}</p>
                <p className="text-xs text-muted-foreground mt-1">Nexus Score {scenario.score}</p>
              </button>
            ))}
          </div>
          {!premium && <p className="text-xs text-muted-foreground leading-relaxed mt-4">Premium libera todos os cenarios, comparacao entre ativos e IA para revisar sua propria tese.</p>}
        </aside>

        <div className="bg-card border border-border p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <p className="mono text-[10px] tracking-widest uppercase text-primary">Previsao educativa de entrada</p>
              <h2 className="playfair text-3xl font-bold mt-1">{selectedScenario.asset}</h2>
            </div>
            <span className="mono text-sm text-emerald-400 border border-emerald-400/30 px-3 py-1">Nexus Score {selectedScenario.score}</span>
          </div>
          <div className="grid md:grid-cols-2 gap-3 mt-5">
            {[
              ["Contexto", selectedScenario.context],
              ["Gatilho educativo", selectedScenario.trigger],
              ["Invalidacao", selectedScenario.invalidation],
              ["No-trade", selectedScenario.noTrade],
              ["Risco", selectedScenario.risk],
              ["Aviso", "Nao e recomendacao de compra ou venda. Use como roteiro de estudo, simulado e disciplina de risco."],
            ].map(([label, text]) => (
              <div key={label} className="border border-border bg-background/40 p-4">
                <p className="mono text-[10px] tracking-widest uppercase text-primary">{label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-3">
        {NEXUS_EDGE.map((item) => (
          <article key={item.title} className="border border-primary/25 bg-primary/5 p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              <h3 className="playfair text-xl font-bold">{item.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-3">{item.detail}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

function ArticlePage({ article, related, onBack, onOpen }: { article: NewsArticle; related: NewsArticle[]; onBack: () => void; onOpen: (article: NewsArticle) => void }) {
  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} />
        Voltar para a capa
      </button>

      <article className="grid lg:grid-cols-[1fr_340px] gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <CategoryBadge cat={article.cat} />
            {article.live && <span className="mono text-[10px] text-emerald-400 tracking-widest uppercase">tempo real</span>}
          </div>
          <h1 className="playfair text-3xl lg:text-5xl font-bold leading-tight mb-4">{article.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-5">{article.excerpt}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mono mb-8">
            <span>{article.author}</span>
            <span>·</span>
            <Clock size={12} />
            <span>{article.time}</span>
            {article.source && (
              <>
                <span>·</span>
                <span>{article.source}</span>
              </>
            )}
          </div>
          <img src={article.image} alt={article.title} className="w-full aspect-[16/9] object-cover bg-muted mb-8" />
          <div className="space-y-5 text-base leading-8 text-foreground/85">
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 grid sm:grid-cols-3 gap-3">
            {[
              { label: "Resumo", text: article.excerpt },
              { label: "Impacto", text: "Acompanhe possiveis efeitos em mercados, tecnologia, politica e comportamento do publico." },
              { label: "Contexto", text: article.live ? "Noticia em tempo real: detalhes podem mudar conforme novas fontes publicam atualizacoes." : "Analise editorial com base no tema e no historico recente." },
            ].map((item) => (
              <div key={item.label} className="border border-border bg-card p-4">
                <p className="mono text-[10px] tracking-widest uppercase text-primary mb-2">{item.label}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm mono hover:bg-primary/90"
            >
              Ler na fonte original
              <ArrowUpRight size={14} />
            </a>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 self-start">
          <div className="border border-border bg-card">
            <div className="px-5 py-4 border-b border-border">
              <p className="mono text-[10px] tracking-widest uppercase text-muted-foreground">Mais sobre {CAT_LABELS[article.cat]}</p>
            </div>
            <div className="divide-y divide-border">
              {related.slice(0, 5).map((item) => (
                <button key={item.id} onClick={() => onOpen(item)} className="w-full text-left p-4 hover:bg-secondary/50 transition-colors">
                  <CategoryBadge cat={item.cat} />
                  <p className="text-sm leading-snug mt-2">{item.title}</p>
                  <span className="mono text-[10px] text-muted-foreground mt-2 block">{item.time}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </article>
    </main>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("TODOS");
  const [view, setView] = useState<AppView>("home");
  const [checkoutOfferId, setCheckoutOfferId] = useState<OfferId>(DEFAULT_OFFER_ID);
  const [navOpen, setNavOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });
  const [time, setTime] = useState(new Date());
  const [selectedPair, setSelectedPair] = useState(FOREX_PAIRS[0]);
  const [liveNews, setLiveNews] = useState<NewsArticle[]>([]);
  const [liveStatus, setLiveStatus] = useState("Conectando ao tempo real");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  });
  const [refreshTick, setRefreshTick] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const chartData = useMemo(() => generateSparkline(selectedPair.value, 60), [selectedPair]);

  const allNews = useMemo(() => [...liveNews, ...NEWS], [liveNews]);
  const filtered = activeTab === "TODOS" ? allNews : allNews.filter((n) => n.cat === activeTab);
  const topStories = filtered.length ? filtered : allNews;
  const featured = topStories[0] ?? NEWS[0];
  const related = selectedArticle ? allNews.filter((item) => item.id !== selectedArticle.id && item.cat === selectedArticle.cat) : [];
  const currentPlan = getUserPlan(user);
  const hasPaidPlan = hasPlanAccess(user, "pro");
  const checkoutOffer = OFFERS[checkoutOfferId];
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return allNews.slice(0, 6);

    return allNews
      .filter((article) => {
        const haystack = `${article.title} ${article.excerpt} ${article.cat} ${article.author} ${article.body.join(" ")}`.toLowerCase();
        return haystack.includes(query);
      })
      .slice(0, 9);
  }, [allNews, searchQuery]);
  const notifications = useMemo(
    () => [
      {
        title: hasPaidPlan ? `Plano ${currentPlan.toUpperCase()} ativo` : "Plano pago bloqueado",
        detail: hasPaidPlan ? `Acesso liberado ate ${formatDate(user?.premiumUntil)}.` : "Assine Pro ou Premium para abrir estudos, newsletter e IA.",
        tone: hasPaidPlan ? "text-emerald-400" : "text-amber-400",
      },
      {
        title: "Tempo real",
        detail: liveStatus,
        tone: "text-sky-400",
      },
      {
        title: `${selectedPair.pair} em foco`,
        detail: `${selectedPair.pct >= 0 ? "Alta" : "Queda"} de ${Math.abs(selectedPair.pct).toFixed(2)}% no painel atual.`,
        tone: selectedPair.pct >= 0 ? "text-emerald-400" : "text-red-400",
      },
    ],
    [currentPlan, hasPaidPlan, liveStatus, selectedPair, user?.premiumUntil],
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Theme persistence is optional in restricted browser modes.
    }
  }, [theme]);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash;
      const newsMatch = hash.match(/^#\/noticia\/(.+)$/);
      const categoryMatch = hash.match(/^#\/categoria\/(.+)$/);
      const checkoutMatch = hash.match(/^#\/checkout\/(.+)$/);

      if (hash === "#/login") {
        setView("login");
        setSelectedArticle(null);
        return;
      }

      if (hash === "#/plans" || hash === "#/planos") {
        setView("plans");
        setSelectedArticle(null);
        return;
      }

      if (hash === "#/studies" || hash === "#/estudos") {
        setView("studies");
        setSelectedArticle(null);
        return;
      }

      if (hash === "#/newsletter") {
        setView("newsletter");
        setSelectedArticle(null);
        return;
      }

      if (hash === "#/course" || hash === "#/curso") {
        setView("course");
        setSelectedArticle(null);
        return;
      }

      if (hash === "#/ai" || hash === "#/ia") {
        setView("ai");
        setSelectedArticle(null);
        return;
      }

      if (hash === "#/terminal") {
        setView("terminal");
        setSelectedArticle(null);
        return;
      }

      if (checkoutMatch) {
        const offerId = checkoutMatch[1];
        setCheckoutOfferId(isOfferId(offerId) ? offerId : DEFAULT_OFFER_ID);
        setView("checkout");
        setSelectedArticle(null);
        return;
      }

      if (hash === "#/checkout") {
        setCheckoutOfferId(DEFAULT_OFFER_ID);
        setView("checkout");
        setSelectedArticle(null);
        return;
      }

      if (hash === "#/premium") {
        setView("premium");
        setSelectedArticle(null);
        return;
      }

      if (newsMatch) {
        setView("home");
        const articleId = decodeURIComponent(newsMatch[1]);
        const article = allNews.find((item) => item.id === articleId);
        if (article) {
          setSelectedArticle(article);
          setActiveTab(article.cat);
        }
        return;
      }

      if (categoryMatch) {
        setView("home");
        const category = categoryMatch[1].toUpperCase();
        if (CATS.includes(category)) setActiveTab(category);
        setSelectedArticle(null);
        return;
      }

      setView("home");
      setSelectedArticle(null);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [allNews]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLiveStatus("Atualizando feeds em tempo real...");
        const articles = await fetchLiveNews();
        if (!active) return;
        setLiveNews(articles);
        setLiveStatus(articles.length ? `Atualizado às ${new Date().toLocaleTimeString("pt-BR")}` : "Sem manchetes novas agora");
      } catch {
        if (active) setLiveStatus("Tempo real indisponível no momento");
      }
    };

    load();
    const timer = setInterval(load, 120000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [refreshTick]);

  const closeOverlays = () => {
    setSearchOpen(false);
    setNotificationsOpen(false);
    setNavOpen(false);
  };

  const openArticle = (article: NewsArticle) => {
    closeOverlays();
    setView("home");
    setSelectedArticle(article);
    window.location.hash = articleHash(article);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCategory = (cat: string) => {
    closeOverlays();
    setView("home");
    setSelectedArticle(null);
    setActiveTab(cat);
    window.location.hash = cat === "TODOS" ? "#/" : categoryHash(cat);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openHome = () => {
    closeOverlays();
    setView("home");
    setSelectedArticle(null);
    setActiveTab("TODOS");
    window.location.hash = "#/";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openPage = (nextView: AppView) => {
    closeOverlays();
    setSelectedArticle(null);
    const hashes: Record<AppView, string> = {
      home: "#/",
      login: "#/login",
      checkout: `#/checkout/${checkoutOfferId}`,
      premium: "#/premium",
      plans: "#/planos",
      studies: "#/estudos",
      newsletter: "#/newsletter",
      course: "#/curso",
      ai: "#/ia",
      terminal: "#/terminal",
    };
    window.location.hash = hashes[nextView];
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveUser = (nextUser: UserAccount | null) => {
    setUser(nextUser);
    if (nextUser) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(USER_STORAGE_KEY);
  };

  const openLogin = () => {
    closeOverlays();
    window.location.hash = "#/login";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCheckout = (offerId: OfferId = DEFAULT_OFFER_ID) => {
    closeOverlays();
    setCheckoutOfferId(offerId);
    localStorage.setItem(PENDING_OFFER_KEY, offerId);
    window.location.hash = user ? (hasOfferAccess(user, offerId) ? "#/premium" : `#/checkout/${offerId}`) : "#/login";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openPremium = () => {
    closeOverlays();
    window.location.hash = hasPaidPlan ? "#/premium" : "#/planos";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmPayment = (payment: CheckoutPayment) => {
    if (!user) return;
    const offer = OFFERS[payment.offerId];
    const paidAt = new Date();
    const validUntil = addDays(paidAt, SUBSCRIPTION_DAYS);
    const nextUser: UserAccount = {
      ...user,
      name: payment.payerName || user.name,
      lastPayment: {
        id: createReceiptId(),
        method: payment.method,
        amount: offer.price,
        paidAt: paidAt.toISOString(),
        offerId: payment.offerId,
        cardLast4: payment.cardLast4,
      },
    };

    if (payment.offerId === "pro" || payment.offerId === "premium") {
      nextUser.plan = payment.offerId;
      nextUser.premium = true;
      nextUser.premiumSince = paidAt.toISOString();
      nextUser.premiumUntil = validUntil.toISOString();
    }

    if (payment.offerId === "newsletter") {
      nextUser.newsletterUntil = validUntil.toISOString();
      nextUser.premium = hasPlanAccess(nextUser, "pro");
    }

    if (payment.offerId === "course") {
      nextUser.coursePurchased = true;
      nextUser.coursePurchasedAt = paidAt.toISOString();
      nextUser.premium = hasPlanAccess(nextUser, "pro");
    }

    localStorage.removeItem(PENDING_OFFER_KEY);
    saveUser(nextUser);

    window.location.hash =
      payment.offerId === "newsletter" ? "#/newsletter" : payment.offerId === "course" ? "#/curso" : "#/premium";
  };

  const logout = () => {
    closeOverlays();
    saveUser(null);
    openHome();
  };

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .playfair { font-family: 'Playfair Display', Georgia, serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .line-clamp-2, .line-clamp-3 { display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { -webkit-line-clamp: 2; }
        .line-clamp-3 { -webkit-line-clamp: 3; }
        [data-theme="light"] .ticker-strip,
        [data-theme="light"] .market-strip,
        [data-theme="light"] .site-footer { background: #eef3f8; }
        [data-theme="light"] .hero-fade { background: linear-gradient(to top, rgba(9, 12, 20, 0.86), rgba(9, 12, 20, 0.46), transparent); }
      `}</style>

      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button onClick={openHome} className="flex items-center gap-2 shrink-0 mr-4">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="playfair text-xl font-bold tracking-tight">NEXUS<span className="text-primary">FX</span></span>
            </button>
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              {CATS.filter((cat) => cat !== "TODOS").map((cat) => (
                <button key={cat} onClick={() => openCategory(cat)} className="text-[12px] xl:text-[13px] text-muted-foreground hover:text-foreground whitespace-nowrap">
                  {CAT_LABELS[cat]}
                </button>
              ))}
              <button onClick={() => openPage("studies")} className="text-[12px] xl:text-[13px] text-muted-foreground hover:text-foreground whitespace-nowrap">Estudos</button>
              <button onClick={() => openPage("newsletter")} className="text-[12px] xl:text-[13px] text-muted-foreground hover:text-foreground whitespace-nowrap">Newsletter</button>
              <button onClick={() => openPage("course")} className="text-[12px] xl:text-[13px] text-muted-foreground hover:text-foreground whitespace-nowrap">Curso</button>
              <button onClick={() => openPage("ai")} className="text-[12px] xl:text-[13px] text-muted-foreground hover:text-foreground whitespace-nowrap">IA Nexus</button>
              <button onClick={() => openPage("terminal")} className="text-[12px] xl:text-[13px] text-primary hover:text-foreground whitespace-nowrap">Terminal</button>
            </div>
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-muted-foreground hidden md:block">{time.toLocaleTimeString("pt-BR")} BRT</span>
              <button
                onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
                className="inline-flex w-8 h-8 items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
                title={theme === "dark" ? "Modo claro" : "Modo escuro"}
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>
              <button onClick={openPremium} className="hidden sm:inline-flex items-center gap-1.5 text-[11px] mono border border-primary/30 text-primary px-3 py-1.5 hover:bg-primary/10">
                {hasPaidPlan ? <CheckCircle2 size={12} /> : <LockKeyhole size={12} />}
                {hasPaidPlan ? currentPlan.toUpperCase() : "Planos"}
              </button>
              {user ? (
                <button onClick={logout} className="hidden sm:inline-flex items-center gap-1.5 text-[11px] mono text-muted-foreground hover:text-foreground">
                  <LogOut size={13} />
                  Sair
                </button>
              ) : (
                <button onClick={openLogin} className="hidden sm:inline-flex items-center gap-1.5 text-[11px] mono text-muted-foreground hover:text-foreground">
                  <User size={13} />
                  Entrar
                </button>
              )}
              <button
                onClick={() => {
                  setSearchOpen((value) => !value);
                  setNotificationsOpen(false);
                }}
                className={`w-8 h-8 flex items-center justify-center hover:text-foreground ${searchOpen ? "text-primary" : "text-muted-foreground"}`}
                aria-label="Buscar noticias"
              >
                <Search size={16} />
              </button>
              <button
                onClick={() => {
                  setNotificationsOpen((value) => !value);
                  setSearchOpen(false);
                }}
                className={`relative w-8 h-8 flex items-center justify-center hover:text-foreground ${notificationsOpen ? "text-primary" : "text-muted-foreground"}`}
                aria-label="Abrir alertas"
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
              </button>
              <button className="lg:hidden w-8 h-8 flex items-center justify-center text-muted-foreground" onClick={() => setNavOpen((v) => !v)}>
                {navOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
        </div>
        {navOpen && (
          <div className="lg:hidden border-t border-border bg-card px-4 py-4 flex flex-col gap-3">
            {CATS.filter((cat) => cat !== "TODOS").map((cat) => (
              <button key={cat} onClick={() => { openCategory(cat); setNavOpen(false); }} className="text-left text-sm text-muted-foreground py-1">
                {CAT_LABELS[cat]}
              </button>
            ))}
            <button onClick={() => { openPage("studies"); setNavOpen(false); }} className="text-left text-sm text-muted-foreground py-1">Estudos</button>
            <button onClick={() => { openPage("newsletter"); setNavOpen(false); }} className="text-left text-sm text-muted-foreground py-1">Newsletter</button>
            <button onClick={() => { openPage("course"); setNavOpen(false); }} className="text-left text-sm text-muted-foreground py-1">Curso</button>
            <button onClick={() => { openPage("ai"); setNavOpen(false); }} className="text-left text-sm text-muted-foreground py-1">IA Nexus</button>
            <button onClick={() => { openPage("terminal"); setNavOpen(false); }} className="text-left text-sm text-primary py-1">Terminal Premium</button>
            <button onClick={() => { openPage(hasPaidPlan ? "premium" : "plans"); setNavOpen(false); }} className="text-left text-sm text-primary py-1">{hasPaidPlan ? "Hub do assinante" : "Planos"}</button>
            <button onClick={() => { user ? logout() : openLogin(); setNavOpen(false); }} className="text-left text-sm text-muted-foreground py-1">
              {user ? "Sair" : "Entrar"}
            </button>
          </div>
        )}
      </nav>

      {searchOpen && (
        <section className="border-b border-border bg-card/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
            <div className="flex items-center gap-3 border border-border bg-background px-3 py-2">
              <Search size={15} className="text-muted-foreground shrink-0" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full bg-transparent outline-none text-sm"
                placeholder="Buscar por Forex, IA, economia, dolar..."
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground" aria-label="Fechar busca">
                <X size={15} />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {searchResults.map((article) => (
                <button key={article.id} onClick={() => openArticle(article)} className="text-left border border-border bg-background/50 p-4 hover:border-primary/30">
                  <CategoryBadge cat={article.cat} />
                  <p className="text-sm leading-snug mt-2 line-clamp-2">{article.title}</p>
                  <p className="mono text-[10px] text-muted-foreground mt-2">{article.time} · {article.author}</p>
                </button>
              ))}
            </div>
            {!searchResults.length && <p className="text-sm text-muted-foreground mt-4">Nenhum resultado encontrado.</p>}
          </div>
        </section>
      )}

      {notificationsOpen && (
        <section className="border-b border-border bg-card/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4 mb-3">
              <p className="mono text-[10px] tracking-widest uppercase text-primary">Alertas NexusFX</p>
              <button onClick={() => setNotificationsOpen(false)} className="text-muted-foreground hover:text-foreground" aria-label="Fechar alertas">
                <X size={15} />
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {notifications.map((item) => (
                <div key={item.title} className="border border-border bg-background/50 p-4">
                  <p className={`mono text-[10px] tracking-widest uppercase ${item.tone}`}>{item.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground mt-2">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Ticker />

      <div className="market-strip bg-[#0b0f1a] border-b border-border overflow-x-auto">
        <div className="flex items-stretch px-4 lg:px-8 max-w-7xl mx-auto">
          {INDICES.map((idx) => (
            <div key={idx.name} className="flex items-center gap-3 px-5 py-2.5 border-r border-border/50 shrink-0 first:pl-0">
              <div>
                <p className="mono text-[10px] text-muted-foreground tracking-wider">{idx.name}</p>
                <p className="mono text-[13px] font-medium text-foreground">{idx.value}</p>
              </div>
              <span className={`mono text-[11px] flex items-center gap-0.5 ${idx.up ? "text-emerald-400" : "text-red-400"}`}>
                {idx.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {idx.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {view === "login" ? (
        <LoginPage
          onBack={openHome}
          onLogin={(nextUser) => {
            saveUser(nextUser);
            const pendingOffer = localStorage.getItem(PENDING_OFFER_KEY);
            window.location.hash = pendingOffer && isOfferId(pendingOffer) ? `#/checkout/${pendingOffer}` : "#/planos";
          }}
        />
      ) : view === "checkout" ? (
        <CheckoutPage user={user} offer={checkoutOffer} onLoginRequired={openLogin} onConfirm={confirmPayment} onAccess={() => openPage("premium")} onBack={() => openPage("plans")} />
      ) : view === "plans" ? (
        <PlansPage user={user} onCheckout={openCheckout} onBack={openHome} />
      ) : view === "premium" ? (
        <PremiumArea user={user} onSubscribe={() => openPage("plans")} onBack={openHome} onOpenPage={openPage} onCheckout={openCheckout} />
      ) : view === "studies" ? (
        <StudiesPage user={user} onCheckout={openCheckout} onBack={openHome} />
      ) : view === "newsletter" ? (
        <NewsletterPage user={user} onCheckout={openCheckout} onBack={openHome} />
      ) : view === "course" ? (
        <CoursePage user={user} onCheckout={openCheckout} onBack={openHome} />
      ) : view === "ai" ? (
        <AiLabPage user={user} articles={allNews} selectedPair={selectedPair} onCheckout={openCheckout} onBack={openHome} />
      ) : view === "terminal" ? (
        <MarketTerminalPage user={user} onCheckout={openCheckout} onBack={openHome} />
      ) : selectedArticle ? (
        <ArticlePage article={selectedArticle} related={related.length ? related : allNews} onBack={openHome} onOpen={openArticle} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="mono text-[11px] tracking-widest uppercase">Notícias em tempo real</span>
            </div>
            <span className="mono text-[11px] text-muted-foreground">{liveStatus}</span>
          </div>

          {activeTab !== "TODOS" && (
            <div className="mb-6 border-l-2 border-primary pl-4">
              <p className="mono text-[10px] tracking-widest uppercase text-primary">Categoria selecionada</p>
              <h1 className="playfair text-3xl font-bold mt-1">{CAT_LABELS[activeTab]}</h1>
            </div>
          )}

          <section className="grid lg:grid-cols-[1fr_340px] gap-1 mb-14">
            <button onClick={() => openArticle(featured)} className="text-left group relative overflow-hidden bg-card">
              <div className="relative h-[360px] sm:h-[420px] lg:h-[520px]">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                <div className="hero-fade absolute inset-0 bg-gradient-to-t from-[#090c14] via-[#090c14]/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-3 mb-4">
                    {featured.live && <span className="mono text-[9px] tracking-widest uppercase text-primary border border-primary/40 px-2 py-0.5">AO VIVO</span>}
                    <CategoryBadge cat={featured.cat} />
                  </div>
                  <h1 className="playfair text-2xl lg:text-4xl font-bold leading-tight text-white mb-3">{featured.title}</h1>
                  <p className="text-sm text-foreground/70 leading-relaxed mb-4 max-w-xl hidden lg:block">{featured.excerpt}</p>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <span>{featured.author}</span>
                    <span>·</span>
                    <Clock size={11} />
                    <span>{featured.time}</span>
                  </div>
                </div>
              </div>
            </button>

            <div className="flex flex-col gap-0">
              {topStories.slice(1, 5).map((item) => (
                <button key={item.id} onClick={() => openArticle(item)} className="text-left flex gap-4 p-4 border-b border-border bg-card hover:bg-secondary/50 transition-colors group">
                  <img src={item.image} alt={item.title} className="w-20 h-14 object-cover shrink-0 bg-muted" />
                  <div className="flex flex-col justify-between min-w-0">
                    <div>
                      <CategoryBadge cat={item.cat} />
                      <p className="text-[13px] leading-snug mt-1.5 text-foreground group-hover:text-primary transition-colors line-clamp-2">{item.title}</p>
                    </div>
                    <span className="mono text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock size={9} /> {item.time}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="mb-14">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="playfair text-xl font-bold">Painel Forex</h2>
                <p className="text-muted-foreground text-sm">Indicadores técnicos em tempo real</p>
              </div>
              <button onClick={() => setRefreshTick((value) => value + 1)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-sm">
                <RefreshCw size={11} /> Atualizar
              </button>
            </div>

            <div className="grid lg:grid-cols-[1fr_300px] gap-4">
              <div className="bg-card border border-border p-5">
                <div className="flex items-start justify-between mb-5 gap-4">
                  <div>
                    <p className="mono text-xs text-muted-foreground mb-1">Par selecionado</p>
                    <p className="playfair text-3xl font-bold">{selectedPair.pair}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="mono text-2xl">{selectedPair.value.toFixed(selectedPair.value > 100 ? 2 : 4)}</span>
                      <span className={`mono text-sm flex items-center gap-0.5 ${selectedPair.pct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {selectedPair.pct >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {selectedPair.pct >= 0 ? "+" : ""}{selectedPair.pct.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {FOREX_PAIRS.map((p) => (
                      <button key={p.pair} onClick={() => setSelectedPair(p)} className={`mono text-[10px] px-2 py-1 border ${selectedPair.pair === p.pair ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:border-foreground/30"}`}>
                        {p.pair}
                      </button>
                    ))}
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={chartData}>
                    <YAxis domain={["auto", "auto"]} hide />
                    <Tooltip content={({ payload }) => payload?.[0] ? <div className="bg-card border border-border px-2 py-1 mono text-[11px]">{(payload[0].value as number).toFixed(4)}</div> : null} />
                    <Line type="monotone" dataKey="v" dot={false} stroke={selectedPair.pct >= 0 ? "#22d3a0" : "#e0364a"} strokeWidth={1.5} />
                  </LineChart>
                </ResponsiveContainer>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {INDICATORS.map((ind) => (
                    <div key={ind.name} className="bg-secondary/50 border border-border p-3">
                      <p className="mono text-[10px] text-muted-foreground">{ind.name}</p>
                      <p className="mono text-sm font-medium mt-0.5">{ind.value}</p>
                      <span className="mono text-[9px] tracking-widest uppercase mt-1 block" style={{ color: ind.color }}>{ind.signal}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid md:grid-cols-2 gap-3">
                  {FOREX_STUDIES.map((study) => (
                    <div key={study.title} className="border border-border bg-background/40 p-4">
                      <p className="mono text-[10px] tracking-widest uppercase text-muted-foreground">{study.title}</p>
                      <p className={`text-sm font-medium mt-1 ${study.tone}`}>{study.value}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-2">{study.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 border border-amber-400/20 bg-amber-400/5 p-4">
                  <p className="mono text-[10px] tracking-widest uppercase text-amber-400">Estudo gratuito</p>
                  <p className="text-sm leading-relaxed mt-2 text-muted-foreground">
                    Leitura educacional: combine tendencia, momentum, volatilidade e calendario economico antes de qualquer decisao. Este painel nao e recomendacao de investimento.
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border">
                <div className="px-5 py-4 border-b border-border">
                  <p className="text-sm font-medium">Principais Pares</p>
                </div>
                <div className="divide-y divide-border">
                  {FOREX_PAIRS.map((p) => (
                <button key={p.pair} onClick={() => setSelectedPair(p)} className={`w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 hover:bg-secondary/50 ${selectedPair.pair === p.pair ? "bg-secondary/60" : ""}`}>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-1 h-8 rounded-full ${p.pct >= 0 ? "bg-emerald-400" : "bg-red-400"}`} />
                        <div className="text-left">
                          <p className="mono text-xs font-medium">{p.pair}</p>
                          <p className="mono text-[10px] text-muted-foreground">{p.pct >= 0 ? "+" : ""}{p.change.toFixed(4)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <SparkLine base={p.value} up={p.pct >= 0} />
                        <div className="text-right">
                          <p className="mono text-xs">{p.value.toFixed(p.value > 100 ? 2 : 4)}</p>
                          <p className={`mono text-[10px] ${p.pct >= 0 ? "text-emerald-400" : "text-red-400"}`}>{p.pct >= 0 ? "+" : ""}{p.pct.toFixed(2)}%</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <PremiumBox
                title="Conheca o Terminal Premium"
                items={PREMIUM_FOREX}
                premium={hasPlanAccess(user, "premium")}
                onSubscribe={() => openCheckout("premium")}
                onAccess={() => openPage("terminal")}
                price="R$ 39,90"
                planLabel="Premium / mes"
                eyebrow="Plano top"
              />
            </div>
          </section>

          <section className="mb-14">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 mb-5">
              <div>
                <h2 className="playfair text-xl font-bold">Aprenda Inteligencia Artificial</h2>
                <p className="text-muted-foreground text-sm">Conteudo rapido para usar IA melhor no trabalho, estudos e negocios.</p>
              </div>
              <button onClick={() => openCategory("IA")} className="self-start lg:self-auto border border-border px-3 py-1.5 text-xs mono text-muted-foreground hover:text-foreground">
                Ver noticias de IA
              </button>
            </div>

            <div className="grid lg:grid-cols-[1fr_360px] gap-4">
              <div className="grid sm:grid-cols-3 gap-3">
                {AI_LESSONS.map((lesson, index) => (
                  <div key={lesson.title} className="bg-card border border-border p-5">
                    <p className="mono text-[10px] tracking-widest uppercase text-primary">Aula {index + 1}</p>
                    <h3 className="playfair text-lg font-bold mt-2">{lesson.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground mt-2">{lesson.detail}</p>
                  </div>
                ))}
              </div>
              <PremiumBox title="Curso de IA completo" items={PREMIUM_AI} premium={hasPaidPlan} onSubscribe={() => openPage("plans")} onAccess={openPremium} />
            </div>
          </section>

          <section className="mb-14">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              {CATS.map((cat) => (
                <button key={cat} onClick={() => openCategory(cat)} className={`flex items-center gap-1.5 mono text-[10px] tracking-widest uppercase px-3 py-1.5 border ${activeTab === cat ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:border-foreground/30"}`}>
                  {CAT_ICONS[cat]}
                  {CAT_LABELS[cat]}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((article) => (
                <ArticleCard key={article.id} article={article} onOpen={openArticle} />
              ))}
            </div>
          </section>

          <section className="mb-14">
            <h2 className="playfair text-xl font-bold mb-5">Agenda Econômica</h2>
            <div className="bg-card border border-border divide-y divide-border overflow-x-auto">
              {[
                { time: "09:30", country: "EUA", event: "Pedidos de auxílio-desemprego", impact: "alto", consensus: "235K", prev: "238K" },
                { time: "11:00", country: "BRA", event: "Relatório Focus do Banco Central", impact: "médio", consensus: "-", prev: "-" },
                { time: "14:30", country: "EUR", event: "PMI Composto da Zona do Euro", impact: "médio", consensus: "51.3", prev: "50.9" },
                { time: "15:00", country: "EUA", event: "Discurso de dirigente do Fed", impact: "alto", consensus: "-", prev: "-" },
              ].map((ev) => (
                <div key={`${ev.time}-${ev.event}`} className="min-w-[680px] grid grid-cols-[60px_60px_1fr_80px_80px] gap-4 px-5 py-3.5 items-center hover:bg-secondary/40">
                  <span className="mono text-[11px] text-muted-foreground">{ev.time}</span>
                  <span className="mono text-[10px] text-foreground/60 bg-secondary/60 px-2 py-0.5 rounded text-center">{ev.country}</span>
                  <span className="text-[13px] text-foreground">{ev.event}</span>
                  <span className={`mono text-[9px] tracking-widest uppercase text-center ${ev.impact === "alto" ? "text-red-400" : "text-amber-400"}`}>{ev.impact}</span>
                  <div className="text-right">
                    <p className="mono text-[10px] text-muted-foreground">Prev: {ev.prev}</p>
                    <p className="mono text-[11px] text-foreground">{ev.consensus}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      <footer className="site-footer border-t border-border bg-[#060910]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="mono text-[10px] text-muted-foreground">© 2026 NexusFX. Conteúdo informativo. Não constitui recomendação de investimento.</p>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="mono text-[10px]">Feeds ao vivo via Google News RSS · atualização a cada 2 min</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

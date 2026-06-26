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
  Radar,
  RefreshCw,
  Search,
  ShieldCheck,
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
};

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
  "Mapa de suporte, resistencia, liquidez e contexto por par",
  "Checklists de entrada, nao-entrada, stop e invalidacao",
  "Estudo com calendario economico e risco por noticia",
  "Diario de execucao para acompanhar processo e disciplina",
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

const PREMIUM_SOURCES = [
  { label: "BIS FX Survey 2025", url: "https://www.bis.org/statistics/rpfx25.htm" },
  { label: "CFTC Forex Fraud Advisory", url: "https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/fraudadv_forex.html" },
  { label: "NFA Forex Investor Resource", url: "https://www.nfa.futures.org/investors/investor-resources/files/forex.pdf" },
  { label: "Investor.gov Day Trading Risk", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks/day-trading-your-dollars-risk" },
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
    <div className="bg-[#060910] border-b border-border overflow-hidden">
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

function PremiumBox({ title, items, premium, onSubscribe, onAccess }: { title: string; items: string[]; premium: boolean; onSubscribe: () => void; onAccess: () => void }) {
  return (
    <div className="border border-primary/30 bg-primary/5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mono text-[10px] tracking-widest uppercase text-primary">Plano premium</p>
          <h3 className="playfair text-xl font-bold mt-1">{title}</h3>
        </div>
        <div className="text-right shrink-0">
          <p className="mono text-2xl font-bold text-primary">R$ 15</p>
          <p className="mono text-[10px] text-muted-foreground">por mes</p>
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
            Assinar por R$ 15/mes
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

function CheckoutPage({ user, onLoginRequired, onConfirm, onBack }: { user: UserAccount | null; onLoginRequired: () => void; onConfirm: () => void; onBack: () => void }) {
  return (
    <main className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
      <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} />
        Voltar
      </button>
      <div className="grid lg:grid-cols-[1fr_360px] gap-4">
        <section className="bg-card border border-border p-6">
          <p className="mono text-[10px] tracking-widest uppercase text-primary">Assinatura premium</p>
          <h1 className="playfair text-3xl font-bold mt-2">Forex + IA por R$ 15/mes</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mt-3">Libere estudos completos de Forex, briefings de todos os topicos, matriz de traders de referencia, prompts de IA e a area exclusiva do assinante.</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-6">
            {[...PREMIUM_FOREX.slice(0, 3), ...PREMIUM_AI.slice(0, 3)].map((item) => (
              <div key={item} className="border border-border bg-background/40 p-4 text-xs leading-relaxed text-muted-foreground">
                <LockKeyhole size={13} className="text-primary mb-2" />
                {item}
              </div>
            ))}
          </div>
        </section>
        <aside className="bg-card border border-border p-6 self-start">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <span className="text-sm">Plano mensal</span>
            <span className="mono text-xl text-primary">R$ 15,00</span>
          </div>
          <div className="space-y-3 text-xs text-muted-foreground mb-5">
            <p>Conta: {user?.email ?? "voce ainda nao entrou"}</p>
            <p>Pagamento de demonstracao. Em producao, troque este botao por Mercado Pago, Stripe ou PagSeguro com checkout seguro.</p>
          </div>
          {user ? (
            <button onClick={onConfirm} className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90">
              <CreditCard size={15} />
              Simular pagamento aprovado
            </button>
          ) : (
            <button onClick={onLoginRequired} className="w-full bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90">Entrar para assinar</button>
          )}
        </aside>
      </div>
    </main>
  );
}

function PremiumArea({ user, onSubscribe, onBack }: { user: UserAccount | null; onSubscribe: () => void; onBack: () => void }) {
  if (!user?.premium) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} />
          Voltar
        </button>
        <div className="bg-card border border-border p-6 text-center">
          <LockKeyhole size={30} className="mx-auto text-primary mb-4" />
          <h1 className="playfair text-3xl font-bold">Area premium bloqueada</h1>
          <p className="text-muted-foreground text-sm mt-3">Assine por R$ 15/mes para liberar os estudos completos de Forex e IA.</p>
          <button onClick={onSubscribe} className="mt-6 bg-primary text-primary-foreground px-4 py-2 mono text-sm hover:bg-primary/90">Assinar agora</button>
        </div>
      </main>
    );
  }

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
  const [view, setView] = useState<"home" | "login" | "checkout" | "premium">("home");
  const [navOpen, setNavOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [selectedPair, setSelectedPair] = useState(FOREX_PAIRS[0]);
  const [liveNews, setLiveNews] = useState<NewsArticle[]>([]);
  const [liveStatus, setLiveStatus] = useState("Conectando ao tempo real");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [user, setUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem("nexusfx-user");
    return saved ? JSON.parse(saved) : null;
  });
  const [refreshTick, setRefreshTick] = useState(0);
  const chartData = useMemo(() => generateSparkline(selectedPair.value, 60), [selectedPair]);

  const allNews = useMemo(() => [...liveNews, ...NEWS], [liveNews]);
  const filtered = activeTab === "TODOS" ? allNews : allNews.filter((n) => n.cat === activeTab);
  const topStories = filtered.length ? filtered : allNews;
  const featured = topStories[0] ?? NEWS[0];
  const related = selectedArticle ? allNews.filter((item) => item.id !== selectedArticle.id && item.cat === selectedArticle.cat) : [];

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash;
      const newsMatch = hash.match(/^#\/noticia\/(.+)$/);
      const categoryMatch = hash.match(/^#\/categoria\/(.+)$/);

      if (hash === "#/login") {
        setView("login");
        setSelectedArticle(null);
        return;
      }

      if (hash === "#/checkout") {
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

  const openArticle = (article: NewsArticle) => {
    setView("home");
    setSelectedArticle(article);
    window.location.hash = articleHash(article);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCategory = (cat: string) => {
    setView("home");
    setSelectedArticle(null);
    setActiveTab(cat);
    window.location.hash = cat === "TODOS" ? "#/" : categoryHash(cat);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openHome = () => {
    setView("home");
    setSelectedArticle(null);
    setActiveTab("TODOS");
    window.location.hash = "#/";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveUser = (nextUser: UserAccount | null) => {
    setUser(nextUser);
    if (nextUser) localStorage.setItem("nexusfx-user", JSON.stringify(nextUser));
    else localStorage.removeItem("nexusfx-user");
  };

  const openLogin = () => {
    window.location.hash = "#/login";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCheckout = () => {
    window.location.hash = user ? "#/checkout" : "#/login";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openPremium = () => {
    window.location.hash = "#/premium";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmPayment = () => {
    if (!user) return;
    saveUser({ ...user, premium: true });
    window.location.hash = "#/premium";
  };

  const logout = () => {
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
      `}</style>

      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button onClick={openHome} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="playfair text-xl font-bold tracking-tight">NEXUS<span className="text-primary">FX</span></span>
            </button>
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              {CATS.filter((cat) => cat !== "TODOS").map((cat) => (
                <button key={cat} onClick={() => openCategory(cat)} className="text-[12px] xl:text-[13px] text-muted-foreground hover:text-foreground whitespace-nowrap">
                  {CAT_LABELS[cat]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-muted-foreground hidden md:block">{time.toLocaleTimeString("pt-BR")} BRT</span>
              <button onClick={openPremium} className="hidden sm:inline-flex items-center gap-1.5 text-[11px] mono border border-primary/30 text-primary px-3 py-1.5 hover:bg-primary/10">
                <LockKeyhole size={12} />
                Premium
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
              <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"><Search size={16} /></button>
              <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"><Bell size={16} /></button>
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
            <button onClick={() => { openPremium(); setNavOpen(false); }} className="text-left text-sm text-primary py-1">Area premium</button>
            <button onClick={() => { user ? logout() : openLogin(); setNavOpen(false); }} className="text-left text-sm text-muted-foreground py-1">
              {user ? "Sair" : "Entrar"}
            </button>
          </div>
        )}
      </nav>

      <Ticker />

      <div className="bg-[#0b0f1a] border-b border-border overflow-x-auto">
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
            window.location.hash = "#/checkout";
          }}
        />
      ) : view === "checkout" ? (
        <CheckoutPage user={user} onLoginRequired={openLogin} onConfirm={confirmPayment} onBack={openHome} />
      ) : view === "premium" ? (
        <PremiumArea user={user} onSubscribe={openCheckout} onBack={openHome} />
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#090c14] via-[#090c14]/60 to-transparent" />
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
              <PremiumBox title="Desbloqueie o estudo Forex completo" items={PREMIUM_FOREX} premium={!!user?.premium} onSubscribe={openCheckout} onAccess={openPremium} />
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
              <PremiumBox title="Curso de IA completo" items={PREMIUM_AI} premium={!!user?.premium} onSubscribe={openCheckout} onAccess={openPremium} />
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

      <footer className="border-t border-border bg-[#060910]">
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

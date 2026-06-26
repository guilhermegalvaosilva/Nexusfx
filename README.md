# NexusFX

Plataforma React/Vite de noticias, Forex, IA e area premium por assinatura.

## Funcionalidades

- Noticias por categoria com feed ao vivo via Google News RSS.
- Painel Forex com pares, indicadores, grafico e estudos educacionais.
- Conteudo gratuito de IA e chamadas para assinatura.
- Login local para prototipo.
- Planos Free, Pro e Premium.
- Newsletter premium NexusFX Morning Brief.
- Curso separado Investimentos do Zero.
- Checkout demo com cartao/PIX, validacao de campos, aceite de risco e recibo por produto.
- Paginas separadas para Estudos, Newsletter, Curso, IA Nexus e Hub do assinante.
- IA de resumo de noticias para Pro/Premium.
- IA avancada para estudos e operacoes simuladas exclusiva do Premium.
- Busca de noticias e painel de alertas no topo.

## Rodar localmente

```bash
npm install
npm run dev
```

Para gerar build de producao:

```bash
npm run build
```

## Monetizacao

- Free: R$ 0, com noticias, artigos, glossario e painel basico.
- Pro: R$ 19,90/mes, com resumos premium, estudos, filtros, alertas, watchlist, simulador e quizzes.
- Premium: R$ 39,90/mes, com comunidade, aulas, relatorios educativos, PDFs e IA avancada.
- Newsletter: R$ 9,90/mes, com Morning Brief diario.
- Curso Investimentos do Zero: R$ 97, pagamento unico.

## Fluxo de compra

1. Escolher produto em Planos.
2. Entrar ou criar conta com nome e email.
3. Preencher cartao ou selecionar PIX demo.
4. Aceitar o aviso educacional/de risco.
5. Aprovar pagamento.
6. O app grava recibo, produto liberado e validade no `localStorage`.
7. Cada pagina valida o acesso correto antes de mostrar o conteudo.

## Pagamento real

O checkout esta pronto como fluxo de produto demonstravel. Para producao, substitua a aprovacao local por Mercado Pago, Stripe, PagSeguro ou outro provedor, validando a assinatura em backend via webhook antes de liberar o premium.

## Aviso

Conteudo informativo e educacional. Nao constitui recomendacao de investimento, promessa de rentabilidade ou ordem de compra/venda.

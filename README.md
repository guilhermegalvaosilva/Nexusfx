# NexusFX

Plataforma React/Vite de noticias, Forex, IA e area premium por assinatura.

## Funcionalidades

- Noticias por categoria com feed ao vivo via Google News RSS.
- Painel Forex com pares, indicadores, grafico e estudos educacionais.
- Conteudo gratuito de IA e chamadas para assinatura.
- Login local para prototipo.
- Checkout demo com cartao/PIX, validacao de campos, aceite de risco e recibo.
- Bloqueio de area premium antes do pagamento.
- Area premium liberada apos pagamento aprovado, com validade de 30 dias.
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

## Fluxo premium

1. Entrar ou criar conta com nome e email.
2. Ir para checkout.
3. Preencher cartao ou selecionar PIX demo.
4. Aceitar o aviso educacional/de risco.
5. Aprovar pagamento.
6. O app grava assinatura, recibo e validade no `localStorage`.
7. A area premium passa a ficar liberada ate o vencimento.

## Pagamento real

O checkout esta pronto como fluxo de produto demonstravel. Para producao, substitua a aprovacao local por Mercado Pago, Stripe, PagSeguro ou outro provedor, validando a assinatura em backend via webhook antes de liberar o premium.

## Aviso

Conteudo informativo e educacional. Nao constitui recomendacao de investimento, promessa de rentabilidade ou ordem de compra/venda.

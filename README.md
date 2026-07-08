# ATRINFO — Redesign do site

## O que tem aqui
- `atrinfo-redesign.html` — página completa (HTML + CSS + JS em um único arquivo, sem dependências externas além das fontes do Google Fonts).

## Como usar
Basta abrir o `atrinfo-redesign.html` em qualquer navegador para visualizar. Para publicar:
1. Suba o arquivo no mesmo servidor/hospedagem onde está o site atual (substituindo o `index2.html` ou renomeando para `index.html`, conforme a estrutura que vocês quiserem usar como definitiva).
2. Não há build/compilação — é HTML estático, funciona em qualquer hospedagem (inclusive GitHub Pages, Netlify, Vercel, cPanel comum, etc.).

## Pendências antes de publicar (marcado no código com comentários)
- [x] WhatsApp já configurado com o número real: (11) 98326-1838, com link direto (`wa.me`) no rodapé e no botão flutuante.

## Estrutura da página
1. Header fixo com navegação funcional (âncoras reais, sem links quebrados)
2. Hero com painel de "diagnóstico" animado (elemento de destaque)
3. Barra de números/estatísticas
4. Seção de Serviços (Implantação / Sustentação / Desenvolvimento)
5. Seção "Como Trabalhamos" (processo em 6 etapas)
6. Seção "Por que a ATRINFO" (diferenciais)
7. Banda de CTA
8. Rodapé com contato (telefone, e-mail, WhatsApp) + botão flutuante de WhatsApp

## Responsividade
Testado com breakpoints em 980px, 900px, 880px, 700px, 600px e 480px — menu vira hamburger, grids de 3 colunas colapsam para 1–2 colunas conforme a largura da tela.

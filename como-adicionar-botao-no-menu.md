# Como adicionar o botão "Portal do Cliente" no menu do site

No `index3.html`, localize a lista de navegação que hoje tem:

```html
<a href="#servicos">Serviços</a>
<a href="#como-trabalhamos">Como Trabalhamos</a>
<a href="#por-que">Por que a ATRINFO</a>
<a href="#contato">Contato</a>
```

Insira o novo link **antes** de "Contato" (isso vale tanto no menu desktop quanto no menu mobile, que no seu site aparecem duplicados):

```html
<a href="#servicos">Serviços</a>
<a href="#como-trabalhamos">Como Trabalhamos</a>
<a href="#por-que">Por que a ATRINFO</a>
<a href="portal-login.html" class="btn-portal-cliente">Portal do Cliente</a>
<a href="#contato">Contato</a>
```

Sugestão de estilo para destacar o botão (adicione ao CSS do site, ajustando as cores caso os nomes de variáveis sejam diferentes das usadas no seu `:root`):

```css
.btn-portal-cliente{
  border: 1px solid var(--accent, #2dd4bf);
  border-radius: 6px;
  padding: 6px 14px;
  color: var(--accent, #2dd4bf) !important;
}
.btn-portal-cliente:hover{
  background: var(--accent, #2dd4bf);
  color: #04211d !important;
}
```

Coloque os arquivos `portal-login.html`, `portal-dashboard.html` e a pasta `assets/` na mesma
raiz onde está o `index3.html` (ou ajuste os caminhos dos `href`/`src` conforme a estrutura de
pastas real do seu hospedeiro).

> Se preferir, me envie o HTML de origem real do `index3.html` (arquivo, não só o texto) que eu
> insiro o botão diretamente no arquivo, respeitando exatamente as classes e estrutura existentes.

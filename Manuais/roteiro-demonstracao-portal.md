# Roteiro de Demonstração — Portal do Cliente ATRINFO

Sem precisar de chamada ao vivo nem vídeo: basta enviar este roteiro junto com o
link do site. A pessoa segue os passos no próprio ritmo dela.

**Link:** https://www.atrinfo.com.br/index3.html
**Login de demonstração:** usuário `cliente` / senha `atrinfo2026`

---

### 1. Ponto de partida
Abra o site institucional e localize o botão **"Portal do Cliente"** no menu
(no topo, ou no menu mobile ☰ se estiver no celular).

### 2. Login
Clique no botão. Você verá duas formas de entrar:
- **Usuário e senha** (use as credenciais acima), ou
- **SSO Corporativo** (fluxo simulado, mostra como seria o login único da empresa)

### 3. Menu principal
Depois de autenticado, repare no menu lateral com 4 áreas:
- **Cadastros** — tabela de registros (Código, Nome, Tabela, Valor)
- **Planilhas** — área reservada para modelos/exportações
- **Integrações** — importação de arquivos CSV
- **Manutenção** — área reservada para logs e rotinas administrativas

### 4. Teste o cadastro
Em **Cadastros**, clique em **"+ Novo registro"**, preencha os campos e salve.
Experimente editar e excluir um registro existente também.

### 5. Teste a importação
Vá em **Integrações → Importar**. Baixe o arquivo de exemplo
(`exemplo-importacao-cadastros.csv`, em anexo) e selecione-o na janela de
importação. Você verá uma prévia linha a linha — repare que uma das linhas
aparece marcada como erro de propósito, para mostrar a validação funcionando.
Confirme a importação e veja os registros aparecerem na tabela de Cadastros.

### 6. Encerrar
Use o botão **"Sair"** no canto inferior do menu lateral para encerrar a sessão.

---

**Observação:** este é um protótipo funcional para validar fluxo e visual.
Login, dados e importação rodam no navegador para fins de demonstração —
a versão de produção conectará a um SSO corporativo real e a um banco de
dados/API no backend.

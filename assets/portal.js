/* ==========================================================================
   ATRINFO — Portal do Cliente — lógica do dashboard
   Protótipo funcional em front-end puro. Persistência real (banco de dados,
   API REST) deve substituir o uso de localStorage indicado nos comentários.
   ========================================================================== */

(function(){

  // ---------------------------------------------------------------------
  // 0) Sessão / guarda de rota
  // ---------------------------------------------------------------------
  const sessionRaw = sessionStorage.getItem('atrinfo_portal_session');
  if(!sessionRaw){
    window.location.href = 'portal-login.html';
    return;
  }
  const session = JSON.parse(sessionRaw);
  document.getElementById('userLabel').textContent = session.name;
  document.getElementById('userAvatar').textContent = session.name.slice(0,2).toUpperCase();

  document.getElementById('logoutBtn').addEventListener('click', function(){
    sessionStorage.removeItem('atrinfo_portal_session');
    window.location.href = 'portal-login.html';
  });

  // ---------------------------------------------------------------------
  // 1) Dados do cadastro (TROCAR por chamadas a uma API real em produção)
  //    Estrutura: Código (6), Nome (50), Tabela (3), Valor numérico (8, 2 casas)
  // ---------------------------------------------------------------------
  const STORAGE_KEY = 'atrinfo_cadastros';

  function loadRegistros(){
    try{
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }catch(e){ return []; }
  }
  function saveRegistros(list){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
  let registros = loadRegistros();

  // seed inicial de exemplo, só na primeira execução
  if(registros.length === 0 && localStorage.getItem(STORAGE_KEY) === null){
    registros = [
      { codigo:'ABC123', nome:'Tabela de Preço Padrão', tabela:'PPD', valor:1250.50 },
      { codigo:'XYZ789', nome:'Desconto Comercial Regional', tabela:'DCR', valor:87.90 }
    ];
    saveRegistros(registros);
  }

  // ---------------------------------------------------------------------
  // 2) Validação de campos (regras do cadastro)
  // ---------------------------------------------------------------------
  const FIELD_RULES = {
    codigo: { label:'Código', maxLen:6 },
    nome:   { label:'Nome',   maxLen:50 },
    tabela: { label:'Tabela', maxLen:3 },
  };
  const VALOR_MAX = 999999.99; // 8 dígitos no total (6 inteiros + 2 decimais)

  function validarRegistro(r){
    const erros = [];
    if(!r.codigo || r.codigo.length > 6) erros.push('Código deve ter até 6 caracteres.');
    if(!r.nome || r.nome.length > 50) erros.push('Nome deve ter até 50 caracteres.');
    if(!r.tabela || r.tabela.length > 3) erros.push('Tabela deve ter até 3 caracteres.');
    const valorNum = typeof r.valor === 'number' ? r.valor : parseValorBR(r.valor);
    if(valorNum === null || isNaN(valorNum)) erros.push('Valor numérico inválido.');
    else if(valorNum < 0 || valorNum > VALOR_MAX) erros.push('Valor deve estar entre 0 e 999.999,99.');
    return erros;
  }

  function parseValorBR(str){
    if(str === undefined || str === null || str === '') return null;
    if(typeof str === 'number') return str;
    // aceita "1.234,56" ou "1234.56" ou "1234,56"
    let s = String(str).trim();
    if(s.indexOf(',') > -1 && s.indexOf('.') > -1){
      s = s.replace(/\./g,'').replace(',', '.');
    } else if(s.indexOf(',') > -1){
      s = s.replace(',', '.');
    }
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
  }

  function formatValorBR(n){
    return Number(n).toLocaleString('pt-BR', { minimumFractionDigits:2, maximumFractionDigits:2 });
  }

  // ---------------------------------------------------------------------
  // 3) Navegação entre seções (SPA simples por hash)
  // ---------------------------------------------------------------------
  const sections = ['cadastros','planilhas','integracoes','manutencao'];
  const navItems = document.querySelectorAll('.nav-item[data-section]');
  const titleEyebrow = document.getElementById('sectionEyebrow');
  const titleH1 = document.getElementById('sectionTitle');

  const SECTION_META = {
    cadastros:   { eyebrow:'Cadastros',   title:'Tabela de Cadastros' },
    planilhas:   { eyebrow:'Planilhas',   title:'Planilhas' },
    integracoes: { eyebrow:'Integrações', title:'Integrações' },
    manutencao:  { eyebrow:'Manutenção',  title:'Manutenção' },
  };

  function showSection(name){
    if(sections.indexOf(name) === -1) name = 'cadastros';
    sections.forEach(function(s){
      document.getElementById('section-'+s).style.display = (s===name) ? 'block' : 'none';
    });
    navItems.forEach(function(el){
      el.classList.toggle('active', el.getAttribute('data-section') === name);
    });
    titleEyebrow.textContent = SECTION_META[name].eyebrow;
    titleH1.textContent = SECTION_META[name].title;
    window.location.hash = name;
    document.getElementById('sidebar').classList.remove('open');
  }

  navItems.forEach(function(el){
    el.addEventListener('click', function(){
      showSection(el.getAttribute('data-section'));
    });
  });

  document.getElementById('menuToggle').addEventListener('click', function(){
    document.getElementById('sidebar').classList.toggle('open');
  });

  showSection((window.location.hash || '#cadastros').replace('#',''));

  // ---------------------------------------------------------------------
  // 4) Render da tabela de Cadastros
  // ---------------------------------------------------------------------
  const tbody = document.getElementById('cadastrosBody');
  const emptyState = document.getElementById('cadastrosEmpty');
  const countBadge = document.getElementById('cadastrosCount');

  function renderTabela(){
    tbody.innerHTML = '';
    countBadge.textContent = registros.length + (registros.length === 1 ? ' registro' : ' registros');
    if(registros.length === 0){
      emptyState.style.display = 'block';
      document.getElementById('cadastrosTableWrap').style.display = 'none';
      return;
    }
    emptyState.style.display = 'none';
    document.getElementById('cadastrosTableWrap').style.display = 'block';

    registros.forEach(function(r, idx){
      const tr = document.createElement('tr');
      tr.innerHTML =
        '<td class="code">'+escapeHtml(r.codigo)+'</td>'+
        '<td>'+escapeHtml(r.nome)+'</td>'+
        '<td class="code">'+escapeHtml(r.tabela)+'</td>'+
        '<td class="num">'+formatValorBR(r.valor)+'</td>'+
        '<td><div class="row-actions">'+
          '<button class="icon-btn" data-act="edit" data-idx="'+idx+'">Editar</button>'+
          '<button class="icon-btn danger" data-act="del" data-idx="'+idx+'">Excluir</button>'+
        '</div></td>';
      tbody.appendChild(tr);
    });
  }

  tbody.addEventListener('click', function(e){
    const btn = e.target.closest('button[data-act]');
    if(!btn) return;
    const idx = parseInt(btn.getAttribute('data-idx'), 10);
    if(btn.getAttribute('data-act') === 'edit') openRegistroModal(idx);
    if(btn.getAttribute('data-act') === 'del') excluirRegistro(idx);
  });

  function excluirRegistro(idx){
    if(!confirm('Excluir o registro "'+registros[idx].codigo+'"?')) return;
    registros.splice(idx,1);
    saveRegistros(registros);
    renderTabela();
    toast('Registro excluído.');
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  // ---------------------------------------------------------------------
  // 5) Modal — Novo / Editar registro
  // ---------------------------------------------------------------------
  const registroModal = document.getElementById('registroModal');
  let editingIdx = null;

  document.getElementById('novoRegistroBtn').addEventListener('click', function(){
    openRegistroModal(null);
  });

  function openRegistroModal(idx){
    editingIdx = idx;
    const isEdit = idx !== null;
    document.getElementById('registroModalTitle').textContent = isEdit ? 'Editar registro' : 'Novo registro';
    const r = isEdit ? registros[idx] : { codigo:'', nome:'', tabela:'', valor:'' };
    document.getElementById('f_codigo').value = r.codigo;
    document.getElementById('f_nome').value = r.nome;
    document.getElementById('f_tabela').value = r.tabela;
    document.getElementById('f_valor').value = r.valor === '' ? '' : formatValorBR(r.valor);
    document.getElementById('registroFormError').classList.remove('show');
    registroModal.classList.add('show');
    document.getElementById('f_codigo').focus();
  }
  function closeRegistroModal(){
    registroModal.classList.remove('show');
  }
  document.getElementById('registroModalClose').addEventListener('click', closeRegistroModal);
  document.getElementById('registroCancelBtn').addEventListener('click', closeRegistroModal);

  document.getElementById('registroForm').addEventListener('submit', function(e){
    e.preventDefault();
    const novo = {
      codigo: document.getElementById('f_codigo').value.trim().toUpperCase(),
      nome:   document.getElementById('f_nome').value.trim(),
      tabela: document.getElementById('f_tabela').value.trim().toUpperCase(),
      valor:  parseValorBR(document.getElementById('f_valor').value)
    };
    const erros = validarRegistro(novo);
    const errBox = document.getElementById('registroFormError');
    if(erros.length){
      errBox.textContent = erros.join(' ');
      errBox.classList.add('show');
      return;
    }
    if(editingIdx !== null){
      registros[editingIdx] = novo;
    } else {
      registros.push(novo);
    }
    saveRegistros(registros);
    renderTabela();
    closeRegistroModal();
    toast(editingIdx !== null ? 'Registro atualizado.' : 'Registro incluído.');
  });

  // ---------------------------------------------------------------------
  // 6) Integrações — Importar CSV
  // ---------------------------------------------------------------------
  const importModal = document.getElementById('importModal');
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('csvFileInput');
  const importPreviewWrap = document.getElementById('importPreviewWrap');
  const importSummary = document.getElementById('importSummary');
  const importConfirmBtn = document.getElementById('importConfirmBtn');
  let parsedRows = []; // { data, erros }

  document.getElementById('abrirImportarBtn').addEventListener('click', function(){
    resetImportModal();
    importModal.classList.add('show');
  });
  document.getElementById('importModalClose').addEventListener('click', closeImportModal);
  document.getElementById('importCancelBtn').addEventListener('click', closeImportModal);

  function closeImportModal(){ importModal.classList.remove('show'); }
  function resetImportModal(){
    fileInput.value = '';
    importPreviewWrap.innerHTML = '';
    importSummary.textContent = '';
    importConfirmBtn.disabled = true;
    parsedRows = [];
  }

  dropzone.addEventListener('click', function(){ fileInput.click(); });
  dropzone.addEventListener('dragover', function(e){ e.preventDefault(); dropzone.style.borderColor='var(--accent)'; });
  dropzone.addEventListener('dragleave', function(){ dropzone.style.borderColor=''; });
  dropzone.addEventListener('drop', function(e){
    e.preventDefault();
    dropzone.style.borderColor='';
    if(e.dataTransfer.files.length) handleCsvFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function(){
    if(fileInput.files.length) handleCsvFile(fileInput.files[0]);
  });

  function handleCsvFile(file){
    if(!/\.csv$/i.test(file.name)){
      toast('Selecione um arquivo .csv', true);
      return;
    }
    const reader = new FileReader();
    reader.onload = function(evt){
      parseCsv(evt.target.result);
    };
    reader.onerror = function(){
      toast('Não foi possível ler o arquivo.', true);
    };
    reader.readAsText(file, 'UTF-8');
  }

  // Espera cabeçalho: Codigo;Nome;Tabela;Valor  (separador ; ou ,)
  function parseCsv(text){
    const lines = text.split(/\r\n|\n|\r/).filter(function(l){ return l.trim().length; });
    if(lines.length < 2){
      toast('Arquivo CSV vazio ou sem dados.', true);
      return;
    }
    const sep = lines[0].indexOf(';') > -1 ? ';' : ',';
    const header = lines[0].split(sep).map(function(h){ return normalizeHeader(h); });

    const idxCodigo = header.indexOf('codigo');
    const idxNome   = header.indexOf('nome');
    const idxTabela = header.indexOf('tabela');
    const idxValor  = header.indexOf('valor');

    if([idxCodigo, idxNome, idxTabela, idxValor].indexOf(-1) > -1){
      importSummary.innerHTML = '<span style="color:var(--danger)">Cabeçalho não reconhecido. '+
        'Esperado: <b>Codigo;Nome;Tabela;Valor</b></span>';
      importPreviewWrap.innerHTML = '';
      importConfirmBtn.disabled = true;
      return;
    }

    parsedRows = [];
    for(let i=1;i<lines.length;i++){
      const cols = lines[i].split(sep);
      const row = {
        codigo: (cols[idxCodigo]||'').trim().toUpperCase(),
        nome:   (cols[idxNome]||'').trim(),
        tabela: (cols[idxTabela]||'').trim().toUpperCase(),
        valor:  parseValorBR((cols[idxValor]||'').trim())
      };
      const erros = validarRegistro(row);
      parsedRows.push({ row: row, erros: erros });
    }

    renderImportPreview();
  }

  function normalizeHeader(h){
    return h.trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,''); // remove acentos
  }

  function renderImportPreview(){
    const total = parsedRows.length;
    const validos = parsedRows.filter(function(p){ return p.erros.length === 0; }).length;
    const invalidos = total - validos;

    importSummary.innerHTML =
      '<b>'+total+'</b> linha(s) lida(s) · <b style="color:var(--ok)">'+validos+'</b> válida(s)'+
      (invalidos ? ' · <b style="color:var(--danger)">'+invalidos+'</b> com erro' : '');

    let html = '<div class="preview-table"><table><thead><tr>'+
      '<th>Código</th><th>Nome</th><th>Tabela</th><th class="num">Valor</th><th>Situação</th>'+
      '</tr></thead><tbody>';
    parsedRows.forEach(function(p){
      const ok = p.erros.length === 0;
      html += '<tr class="'+(ok?'':'row-error')+'">'+
        '<td class="code">'+escapeHtml(p.row.codigo)+'</td>'+
        '<td>'+escapeHtml(p.row.nome)+'</td>'+
        '<td class="code">'+escapeHtml(p.row.tabela)+'</td>'+
        '<td class="num">'+(p.row.valor===null? '—' : formatValorBR(p.row.valor))+'</td>'+
        '<td>'+(ok ? '<span class="badge ok"><span class="d"></span>OK</span>' : '<span class="badge danger" title="'+escapeHtml(p.erros.join(' '))+'"><span class="d"></span>Erro</span>')+
        '</td></tr>';
    });
    html += '</tbody></table></div>';
    importPreviewWrap.innerHTML = html;
    importConfirmBtn.disabled = validos === 0;
  }

  importConfirmBtn.addEventListener('click', function(){
    const validos = parsedRows.filter(function(p){ return p.erros.length === 0; }).map(function(p){ return p.row; });
    // Upsert por Código: se já existir, atualiza; senão, inclui.
    validos.forEach(function(novo){
      const pos = registros.findIndex(function(r){ return r.codigo === novo.codigo; });
      if(pos > -1) registros[pos] = novo; else registros.push(novo);
    });
    saveRegistros(registros);
    renderTabela();
    closeImportModal();
    toast(validos.length + ' registro(s) importado(s) com sucesso.');
    showSection('cadastros');
  });

  // ---------------------------------------------------------------------
  // 7) Toast simples
  // ---------------------------------------------------------------------
  let toastTimer = null;
  function toast(msg, isError){
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.toggle('error', !!isError);
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ el.classList.remove('show'); }, 3200);
  }

  renderTabela();

})();

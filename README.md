# 📚 Notion Study Insights PWA (Dashboard de Estudos para Concursos)

Aplicação PWA analítica de alta performance desenvolvida com **Gatsby**, **Netlify Functions** e **API do Notion** projetada especificamente para monitorar e otimizar rotinas de estudo para concursos públicos.

---

## 🎯 Funcionalidades Principais

- **📊 Análise das 11 Colunas Específicas do Notion**:
  1. `Matéria`: Disciplina estudada (ex: Direito Constitucional, Português, AFO).
  2. `Aula`: Identificador da aula/unidade (ex: Aula 01).
  3. `Conteúdo`: Título principal do conteúdo.
  4. `Assunto`: Tópico detalhado.
  5. `Data de Criação`: Data do estudo.
  6. `Tempo de Estudo Líquido`: Minutos ou horas de estudo concentrado.
  7. `Total de Questões`: Meta de questões.
  8. `Feitas`: Quantidade de questões resolvidas.
  9. `Acertos`: Quantidade de acertos.
  10. `Erros`: Quantidade de erros.
  11. `Observações`: Anotações e alertas de revisão.

- **⚡ Netlify Serverless Proxy (`netlify/functions/notion.js`)**:
  - Comunicação segura com a API oficial do Notion sem expor chaves no navegador e sem problemas de CORS.

- **📱 PWA Ready (Progressive Web App)**:
  - Instalável em dispositivos móveis (Android/iOS) e Desktop.
  - Funciona totalmente **Offline** via Service Worker caching.

- **🔥 Métricas e Insights Automáticos**:
  - **Tempo Total Líquido & Média Diária** (horas e minutos formatados).
  - **Taxa de Assertividade Global (%)** (`(Acertos / Feitas) * 100`).
  - **Rendimento por Matéria**: Gráfico interativo destacando matérias acima de 80% (Verde), 70-79% (Amarelo) e <70% (Vermelho).
  - **Matérias Críticas**: Alerta automático de revisão para disciplinas com menor rendimento.
  - **Evolução Diária**: Histórico de horas estudadas e questões por dia.

---

## 🚀 Como Executar Localmente

1. **Instalar Dependências**:
   ```bash
   npm install
   ```

2. **Iniciar Servidor de Desenvolvimento Gatsby**:
   ```bash
   npm run develop
   ```
   Acesse em `http://localhost:8000`.

3. **Gerar Build de Produção & PWA Service Worker**:
   ```bash
   npm run build
   ```

---

## 🌐 Como Fazer Deploy no Netlify

1. Conecte o repositório ao Netlify.
2. Defina as seguintes configurações de build:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `public`
   - **Functions Directory**: `netlify/functions`
3. *(Opcional)* Configure as variáveis de ambiente no Netlify:
   - `NOTION_KEY`: `secret_...`
   - `NOTION_DATABASE_ID`: `3a1f...`

---

## ⚙️ Conectando sua Tabela do Notion

1. Acesse [notion.so/my-integrations](https://www.notion.so/my-integrations) e crie uma nova integração.
2. Copie o **Internal Integration Token** (`secret_...`).
3. Abra sua tabela de estudos no Notion > Clique nos `...` > **Connections** > Adicione sua integração.
4. Clique no botão **⚙️ Configurações Notion** dentro da aplicação e cole seu Token e o ID da Base de Dados!

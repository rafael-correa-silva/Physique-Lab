<div align="center">

# PhysiqueLab

**Sistema de avaliação física pessoal — HTML · CSS · JavaScript puro**

![PhysiqueLab](https://img.shields.io/badge/status-em%20desenvolvimento-00d4ff?style=flat-square)
![Licença](https://img.shields.io/badge/licença-MIT-blue?style=flat-square)
![Tecnologia](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-00d4ff?style=flat-square)
![Sem framework](https://img.shields.io/badge/framework-nenhum-333?style=flat-square)

> Central de avaliação corporal com bonecos SVG interativos, cálculos científicos automatizados e histórico local — tudo sem backend.

</div>

---

## 📸 Visão Geral

PhysiqueLab é um projeto de portfólio avançado que simula um software fitness profissional, construído do zero com **HTML, CSS e JavaScript puro com ES Modules**. O projeto demonstra domínio de:

- Geração e manipulação dinâmica de **SVG interativo**
- **ES Modules** com separação real de responsabilidades
- **Cálculos científicos** aplicados (Jackson & Pollock, Siri)
- Persistência de dados via **localStorage**
- Design **glassmorphism** dark premium sem frameworks CSS
- **Chart.js** para visualização de evolução temporal

---

## ✨ Funcionalidades

### Dashboard
- Cards com IMC, % Gordura, Massa Magra, Massa Gorda e Relação Cintura/Quadril
- Campo de peso com cálculo automático em tempo real
- Todos os resultados calculados automaticamente ao preencher os dados

### Avaliação Corporal
- **Boneco 1 — Medidas** (9 regiões clicáveis): Ombro, Braço, Antebraço, Peito, Cintura, Abdômen, Quadril, Coxa e Panturrilha
- **Boneco 2 — Adipometria** (7 dobras): Tríceps, Peitoral, Subescapular, Abdominal, Supra-ilíaca, Coxa e Axilar Média
- Clique no **boneco** ou no **nome da região na tabela** para inserir valores
- Labels flutuantes com valores aparecendo direto no corpo (`38cm`, `12mm`)
- Regiões preenchidas mudam de cor com glow neon
- Tabelas laterais atualizando em tempo real

### Histórico
- Gráficos de linha com 4 métricas: Peso, % Gordura, Massa Magra, IMC
- Lista de avaliações salvas com dados expandíveis
- **Comparação entre avaliações** com deltas `+1.5 cm`, `−2.0%`

### Qualidade Técnica
- Auto-save da avaliação em andamento
- Exportação para **PDF** via `@media print` (`window.print()`)
- Totalmente **responsivo** (desktop → mobile com header 2 linhas)
- Tooltip em hover + suporte a touch em mobile

---

## 🔬 Protocolos Científicos

| Cálculo | Protocolo |
|---|---|
| % Gordura Corporal | **Jackson & Pollock 7 dobras** (1978) — equações separadas por sexo |
| Conversão Gordura | **Equação de Siri** (1956): `%G = ((4.95/DC) − 4.50) × 100` |
| IMC | `peso / altura²` com classificação da OMS |
| Relação C/Q | `cintura / quadril` com classificação por sexo |
| Massa Magra/Gorda | Derivadas diretas de peso + %G |

> ⚠️ Os valores são estimativas científicas e não substituem avaliação profissional.

---

## 🗂️ Estrutura do Projeto

```
PhysiqueLab/
├── index.html              # Página única (single-scroll page)
├── README.md
│
├── css/
│   ├── style.css           # Variáveis globais, reset, header, modais, layout
│   ├── dashboard.css       # Cards de métricas, campo de peso
│   ├── bodymap.css         # SVG, tabelas, labels flutuantes, células clicáveis
│   ├── history.css         # Gráficos, lista histórico, comparação
│   └── print.css           # @media print — exportação PDF
│
└── js/
    ├── app.js              # Boot, fluxo principal, handlers globais
    ├── state.js            # AppState global + pub/sub (subscribe/notify)
    ├── ui.js               # DOM: dashboard, tabelas, toast, tooltip, scroll
    ├── bodyMap.js          # SVG muscular inline + interatividade + labels
    ├── calculations.js     # Fórmulas: JP7, Siri, IMC, RCQ, composição
    ├── storage.js          # CRUD no localStorage
    ├── charts.js           # Config Chart.js (cores, options, helpers)
    └── history.js          # Histórico, gráficos, comparação de avaliações
```

---

## 🚀 Como Executar

> ⚠️ ES Modules exigem um servidor local. **Não funciona com `file://`**.

### Opção 1 — VS Code Live Server
Instale a extensão **Live Server** e clique em `Go Live`.

### Opção 2 — Node.js
```bash
npx serve .
# Acesse: http://localhost:3000
```

### Opção 3 — Python
```bash
python3 -m http.server 8080
# Acesse: http://localhost:8080
```

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| **HTML5** | Estrutura semântica, SVG inline |
| **CSS3** | Variáveis, glassmorphism, grid, flexbox, `@media print` |
| **JavaScript ES2020** | ES Modules, `IntersectionObserver`, `localStorage` |
| **Chart.js 4** | Gráficos de linha via CDN |
| **Google Fonts** | Rajdhani (display) + Inter (corpo) |

**Zero dependências de desenvolvimento. Zero frameworks.**

---

## 📐 Arquitetura de Estado

O estado global é centralizado em `state.js` com um sistema pub/sub leve:

```js
// Qualquer módulo pode subscrever mudanças
subscribe((scope, AppState) => {
  recalcularMetricas();
  atualizarDashboard();
  atualizarTabelas();
  refreshSVG();
});

// Qualquer módulo pode notificar
notifyStateChange('measurements');
```

---

## 📱 Responsividade

| Breakpoint | Layout |
|---|---|
| `> 1100px` | Desktop: bonecos lado a lado, 5 cards de métricas |
| `900–1100px` | Cards em 3 colunas, bonecos em coluna única |
| `640–900px` | Layout compacto, header simplificado |
| `< 640px` | Mobile: header 2 linhas, SVG reduzido, tabelas empilhadas |

---

## 🗺️ Roadmap / Melhorias Futuras

- [ ] Suporte a múltiplos usuários (perfis separados)
- [ ] Exportação para JSON/CSV do histórico
- [ ] Protocolo de Pollock 3 dobras como alternativa
- [ ] Modo claro (light theme)
- [ ] PWA com ícone e funcionamento offline
- [ ] Avaliação postural com segundo boneco (vista lateral)

---

## 👤 Autor

Projeto pessoal de portfólio — desenvolvido como demonstração de habilidades em frontend puro, UX de dados e arquitetura de aplicações JavaScript sem frameworks.

---

## 📄 Licença

MIT — livre para uso, modificação e distribuição.

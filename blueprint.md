# 🚀 Blueprint MVP: RepoScore (CodeValuation)

## 📌 Visão Geral
Uma ferramenta gamificada de avaliação de repositórios do GitHub focada em desenvolvedores iniciantes. O sistema utiliza Inteligência Artificial para analisar o esforço, a criatividade e a organização do código (mesmo sem estrelas ou forks). O design segue uma estética de "luxo utilitário", lembrando um painel de controle de alta performance com forte ênfase em contraste, *glassmorphism* e mistério competitivo.

---

## 🛠️ Stack Tecnológica
* **Frontend & Backend:** Next.js
* **Estilização:** TailwindCSS (com tokens customizados)
* **Banco de Dados:** Supabase (tabela `ranking`)
* **Motor de Avaliação:** API pública do GitHub + API de LLM (OpenAI/Anthropic) para análise de metadados.

---

## 🧠 Core Mechanics: Motor de Avaliação via IA
O sistema não foca em popularidade, mas em esforço técnico e documentação. 

**O Fluxo de Dados:**
1. O usuário insere a URL do repositório.
2. O Next.js consome a API do GitHub para extrair: `README.md`, `languages` (proporção da stack) e `size`/`commits`.
3. Um prompt de sistema envia os dados para a IA: *"Você é um avaliador de projetos de software. Leia o README e as linguagens. Retorne um JSON com as notas de 0 a 100 para: `ideia` (criatividade/utilidade), `readme` (clareza e formatação) e `stack` (peso/esforço técnico)."*
4. O servidor calcula o **Score Final** através de uma média ponderada.

---

## 🗺️ Fluxo do Usuário (UI/UX)

### 1. Hero Section (A Entrada)
* **Visual:** Tela escura, minimalista, tipografia hiper-legível e centralizada. Um feixe de luz diagonal amarelo-âmbar com textura de ruído (noise) corta o fundo de forma oblíqua.
* **Ação:** Um único input de comando chamativo e elegante: *"Cole o link do seu repositório do GitHub e descubra o valor da sua ideia."*

### 2. O Motor de Análise (A Espera)
* **Visual:** O input é substituído por um painel *glassmorphism* simulando um terminal.
* **Comportamento:** Linhas de log aparecem progressivamente (`[+] Lendo README...`, `[+] Extraindo metadados...`, `[+] IA analisando Fator Genialidade...`). A animação é instantânea ("snappy"), sem atrasos elásticos.

### 3. O Resultado (O "Aha! Moment")
* **Visual:** O card brilha e revela o **Score Final** em destaque.
* **Ação:** Um botão sólido de CTA (texto escuro, fundo claro/amarelo): *"Ver Ranking"*.

### 4. O Ranking Misterioso (O Gatilho)
* **Visual:** Tabela minimalista com Posição, Projeto e Nota.
* **Ação:** A nota do projeto atual do usuário fica nítida e em amarelo. **Todas as outras notas da comunidade recebem um filtro CSS de blur (`blur-md`)**, criando mistério sobre o valor dos competidores.

---

## 🎨 Design System: "Developer Luxury" FINGERPRINT

### 1. Atmosfera e Personalidade
* **Tom:** Autoridade técnica, precisão cirúrgica. Escuro profundo (#0F0F0F) contrastando com explosões volumétricas de amarelo (#FFC531).
* **Profundidade:** Uso agressivo de opacidade, *backdrop-filter* (blur + saturate) e sombras internas para separar os painéis do abismo escuro.
* **Textura:** Ruído (noise) em SVG aplicado globalmente com baixa opacidade (`mix-blend-mode: overlay`) para remover o aspecto "plástico" e dar uma sensação analógica ao gradiente.

### 2. Tipografia (Geist / Satoshi)
* **Hero/Display:** *Tracking* (espaçamento) negativo rigoroso para blocos sólidos.
* **Micro-labels (UI):** Geometria perfeita para legibilidade, com suporte a *monospace* para hex codes, números e atalhos de teclado (ex: `⌘ K`).

### 3. Tailwind Configuration (Tokens Essenciais)

Adicionar ao `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: '#0F0F0F',
        primary: {
          DEFAULT: '#FFC531', // Amarelo elétrico
          dim: 'rgba(255, 197, 49, 0.15)',
          glow: 'rgba(255, 197, 49, 0.4)',
        },
        surface: {
          base: 'rgba(20, 20, 20, 0.65)',
          elevated: 'rgba(35, 35, 35, 0.85)',
          hover: 'rgba(255, 255, 255, 0.06)',
          active: 'rgba(255, 197, 49, 0.12)',
        },
        text: {
          primary: '#F9FAFB',
          secondary: 'rgba(249, 250, 251, 0.65)',
          muted: 'rgba(249, 250, 251, 0.4)',
          inverse: '#0F0F0F',
        },
        border: {
          DEFAULT: 'rgba(249, 250, 251, 0.08)',
          strong: 'rgba(249, 250, 251, 0.15)',
        }
      },
      backgroundImage: {
        'noise': "url('/noise.svg')", // Vital para o Fundo
      },
      boxShadow: {
        'glass-panel': '0 25px 50px -12px rgba(0,0,0,0.7), inset 0 1px 0 0 rgba(255,255,255,0.05)',
        'kbd': '0 1px 1px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
      }
    }
  }
}

### 4. Estilos Críticos (CSS Base)
/* O Painel Principal (Glassmorphism de Alta Performance) */
.launcher-window {
  background: var(--color-surface-base);
  backdrop-filter: blur(40px) saturate(150%);
  -webkit-backdrop-filter: blur(40px) saturate(150%);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.7), 
    0 0 0 1px inset rgba(255, 255, 255, 0.05); /* Inner glow */
}

/* Teclas de Atalho (Visual Tátil) */
.kbd-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  background: rgba(255,255,255, 0.08);
  border: 1px solid rgba(255,255,255, 0.1);
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0,0,0,0.3);
}

/* O CTA "Ver Ranking" */
.btn-primary {
  background: var(--color-text-primary);
  color: var(--color-bg);
  border-radius: 8px;
  font-weight: 500;
  transition: all 100ms cubic-bezier(0.4, 0, 0.2, 1);
}
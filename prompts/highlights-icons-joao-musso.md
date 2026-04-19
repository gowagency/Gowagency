# Prompt — Ícones de Destaque (Joao Musso)

> Cole este prompt inteiro em uma nova conversa do projeto Gowagency no Claude.
> O `CLAUDE.md` do projeto já carrega a identidade da marca (paleta, fontes,
> tom). Este prompt assume esse contexto e endurece a barra de qualidade.

---

## Papel

Você é **diretor de arte sênior** de um estúdio editorial (pensa Pentagram × Base
Design × It's Nice That). Seu trabalho não é "desenhar ícone de app" — é
desenhar **marcas pequenas**: cada ícone é um mini-logo autônomo, com peso
editorial, e precisa sobreviver a uma análise de portfólio.

Antes de entregar qualquer arte, escreva **3 linhas de diretriz criativa**
justificando a decisão formal de cada ícone (metáfora + escolha tipográfica +
por que não é óbvio). Só depois entregue os SVGs.

## Entrega

12 ícones de destaque para o perfil pessoal **Joao Musso**, em 2 variações
(fundo branco / fundo preto) = **24 arquivos finais**.

| # | Destaque | Eixo semântico |
|---|----------|----------------|
| 01 | Tese | Mercado — convicção, posição |
| 02 | Curva | Mercado — juros compostos, tempo |
| 03 | Ativo | Mercado — retorno, alocação |
| 04 | Lifestyle | Lifestyle — estética, pausa |
| 05 | Vida | Lifestyle — presença, família |
| 06 | GOW | Logo oficial da agência |
| 07 | Método | O método contraintuitivo — **ausência é o conceito** |
| 08 | Dia a dia | Ritual, tempo linear |
| 09 | Artigos | Escrita, editoria |
| 10 | Teses | Argumento, cotação |
| 11 | Território | Governar > competir |
| 12 | Evolução | Progressão, degrau |

## Linguagem visual — regras duras

- **Tipografia é protagonista.** Um caractere só (letra, número, símbolo de
  pontuação) pode carregar o ícone inteiro. Use Fraunces Italic para peso
  editorial; mono grotesco (JetBrains / IBM Plex Mono) para o lado frio.
- **Brutalismo editorial**, não "flat icon". Referências obrigatórias: ACNE
  Paper, Wallpaper*, Another Magazine, It's Nice That, System Magazine. Se o
  ícone poderia estar num template do Figma Community, **refaça**.
- **Centralização matemática** (canvas 1080×1920, elementos ancorados em 50,50
  com tolerância óptica — não geométrica cega).
- **Contraste brutal:** preto absoluto `#000` sobre branco `#FFFFFF` — sem
  cinzas, sem sombras, sem gradientes, sem stroke fino decorativo.
- **Um gesto só por ícone.** Se você precisou de 3 elementos para explicar,
  você falhou. Edite até sobrar o essencial.
- **Metáfora visual > literalidade.** "Dia a dia" não é um relógio. "Artigos"
  não é uma folha com linhas. Busque o símbolo tipográfico que carrega a ideia.

## Direção por ícone (ponto de partida — refine)

- **Tese** → `"` (aspa serifada Fraunces gigante, cropada no topo).
- **Curva** → `%` serifado italico gigante, levemente rotacionado.
- **Ativo** → `01` mono grande, ou seta `↗` brutal com peso editorial.
- **Lifestyle** → em-dash `—` largo, centralizado, como pausa editorial.
- **Vida** → `•` sólido, escala calibrada (presença, não decoração).
- **GOW** → logo oficial da agência, sem reinterpretação.
- **Método** → `c` serifado italico gigante recortado como **forma negativa**
  dentro de disco sólido. Conceito: o método é a ausência.
- **Dia a dia** → `→` mono, baseline definida, um único movimento horizontal.
- **Artigos** → `¶` pilcrow de Fraunces Italic (não o pilcrow padrão do sistema
  — o desenhado da fonte, com peso editorial real).
- **Teses** → aspas de abertura `"` serifadas, cropadas.
- **Território** → `+` grosso como cruz/marco cartográfico.
- **Evolução** → `↗` diagonal brutal, ou escada de 3 degraus sólidos.

Você **pode** propor alternativas melhores para qualquer um. Justifique.

## Anti-padrões (reprovação automática)

- Ícone de linha fina estilo Feather / Lucide / Material.
- "Rabisco geométrico" sem conceito (círculo + quadrado + triângulo empilhados).
- Emojis estilizados, pictogramas literais, clipart.
- Mais de um peso tipográfico por ícone.
- Sombras, gradientes, highlights, efeito 3D, "glassmorphism".
- Elemento descentrado por acidente (se é offset, tem que ser intencional e
  consistente no grid da coleção).
- Repetir a mesma metáfora em dois ícones diferentes.

## Especificação técnica

- Canvas: **1080×1920 px** (formato stories do Instagram, nativo do highlight).
- Safe area do destaque: círculo central ø 880 px. Nada crítico fora disso.
- Export: **PNG 1080×1920** + **SVG vetorial** para cada ícone.
- Nomenclatura: `destaque-<slug>-paper.png` (fundo branco) e
  `destaque-<slug>-ink.png` (fundo preto). Ex: `destaque-metodo-ink.png`.
- Entregar também um **contact sheet** (PNG único) com os 12 ícones em grid
  4×3, fundo branco, para revisão rápida.
- ZIP final com tudo organizado em subpastas `/paper`, `/ink`, `/svg`,
  `/contact-sheet`.

## Processo esperado

1. **Diretriz criativa** (3 linhas por ícone, antes de desenhar).
2. **Sketches em ASCII/texto** da composição de cada um, para validar conceito
   antes de renderizar.
3. **Entrega v1** — contact sheet + arquivos.
4. Aguardar feedback pontual e iterar apenas nos ícones marcados.

## Barra de qualidade

O teste final: se eu colocar esses 12 ícones lado a lado com os highlights
atuais de **Virgil Abloh, Kanye (Yeezy), Jacquemus, ou de um estúdio como
Order ou Porto Rocha**, eles precisam **não parecer amadores**. Premium aqui
significa: cada ícone aguenta crítica de designer. Se não aguenta, refaça.

---

_Se qualquer instrução conflitar com o `CLAUDE.md` da marca, o CLAUDE.md vence.
Se algo não estiver coberto, pergunte antes de chutar._

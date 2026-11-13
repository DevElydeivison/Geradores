# ForgeData — Central de Geradores

Aplicação front-end responsiva que gera **dados sintéticos para testes de software** sem depender de backend, API ou cadastro.

## Funcionalidades

- Senhas com comprimento de 8 a 64 caracteres e opções de maiúsculas, minúsculas, números e símbolos.
- CPF com dígitos verificadores matematicamente válidos.
- Celulares com DDD e formatação brasileira.
- CEPs formatados.
- Placas Mercosul (LLLNLNN) e antigas (LLL-NNNN).
- Nomes completos fictícios.
- Identidade fictícia combinando todos os geradores.
- Geração de 1 a 20 resultados por ferramenta e cópia individual ou em lote.
- Layout dark e responsivo.

## Como executar

O projeto usa **ES Modules**, então abra com um servidor local (não diretamente pelo protocolo `file://`).

**Opção 1 — VS Code:** instale a extensão Live Server, clique com o botão direito em `index.html` e selecione **Open with Live Server**.

**Opção 2 — Python:** na pasta do projeto, execute:

```bash
python -m http.server 5500
```

Acesse http://localhost:5500.

**Opção 3 — Vite não é necessário.** Pode publicar diretamente no GitHub Pages, Netlify ou Vercel como site estático.

## Estrutura

```text
index.html
src/
  generators.js  # Lógica de geração
  main.js        # Interface e eventos
  styles.css     # Estilos e responsividade
README.md
LICENSE
```

## Observações importantes

- **CPF:** os dígitos verificadores são válidos, mas isso **não comprova cadastro, emissão ou titularidade**.
- **CEP, telefone e placa:** seguem formatos brasileiros, mas **não são consultados em bases oficiais**. Podem ser inexistentes ou coincidir com registros reais.
- **Nomes:** combinações sintéticas podem coincidir com nomes de pessoas reais.
- **Senhas:** usam a Web Crypto API (`crypto.getRandomValues`), adequada para aleatoriedade forte. Não são armazenadas pelo aplicativo.
- **Identidades:** somente para dados de exemplo, prototipagem e testes. Nunca apresentar como pessoas reais nem utilizar para falsidade ideológica ou cadastros fraudulentos.
- A fonte Google Fonts é opcional e é a única requisição externa visual; remova o `@import` de `styles.css` se desejar execução totalmente offline.

## Ideias para evolução

Histórico local opcional, exportação CSV/JSON, testes unitários, filtros de região, tema claro/escuro e geração em lote de perfis.

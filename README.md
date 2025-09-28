# Amani Store

Loja online de produtos veganos e sustentáveis da marca Amani, construída com React, Tailwind CSS e React Router.

## Estrutura do projeto

```
src/
 ├─ components/        # Header, Footer
 ├─ context/           # CartContext para gerenciar o carrinho
 ├─ data/              # products.json com os produtos
 ├─ pages/             # Páginas: Home, Produtos, Carrinho, Sobre, Contato
 ├─ App.jsx            # Componente principal com rotas
 ├─ index.jsx          # Ponto de entrada React
 └─ main.css           # Tailwind CSS
```

## Scripts

Instale as dependências:
```
npm install
```

Para rodar em desenvolvimento:
```
npm run dev
```

Para build de produção:
```
npm run build
```

Para servir o build:
```
npm run preview
```

## Funcionalidades

- Carrinho de compras persistente usando localStorage
- Editor de produtos em JSON direto pelo site
- Busca de produtos
- Páginas separadas: Home, Produtos, Carrinho, Sobre, Contato
- Design responsivo com Tailwind CSS

## Tecnologias

- React
- React Router DOM
- Tailwind CSS
- JavaScript moderno (ES6+)
- LocalStorage para persistência de carrinho e produtos

## Deploy

Você pode hospedar no GitHub Pages ou Vercel:
- GitHub Pages: use `gh-pages` ou exporte a pasta `dist`
- Vercel: deploy automático conectando o repositório

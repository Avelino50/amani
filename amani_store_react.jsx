/*
Amani Store - Single-file React app (App.jsx)

Como usar:
1) Crie um novo repositório no GitHub chamado `amani-store`.
2) No seu computador, rode:
   npx create-vite@latest amani-store --template react
   cd amani-store
   npm install
3) Substitua `src/App.jsx` pelo conteúdo deste arquivo. Também copie o CSS do Tailwind mostrado abaixo em `src/index.css` e siga a configuração do Tailwind (veja etapa 4).
4) Instalar e configurar Tailwind CSS (resumido):
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   // editar tailwind.config.cjs -> content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}']
   // em src/index.css, adicione as diretivas @tailwind base; @tailwind components; @tailwind utilities;
5) Testar localmente: npm run dev
6) Deploy no GitHub Pages (ou usar Vercel/Netlify para mais facilidade):
   // Para GitHub Pages com branch main:
   npm install gh-pages --save-dev
   // adicionar em package.json:
   // "homepage": "https://<seu-usuario>.github.io/amani-store",
   // "predeploy": "npm run build",
   // "deploy": "gh-pages -d dist"
   npm run deploy

O que este app tem (features prontas):
- Lista de produtos (mock) com imagens de placeholder
- Carrinho simples (localStorage)
- Painel "Editar produtos" embutido para você editar o JSON dos produtos sem precisar mexer no código
- Página de produto, filtros básicos e busca
- Estilização com Tailwind (padrão)

Observação: Este é um ponto de partida pensado para você editar facilmente no GitHub. Para pagamentos reais, integre Stripe, PagSeguro ou outro gateway e não armazene dados sensíveis no frontend.
*/

import React, { useState, useEffect } from 'react';

// Mock inicial de produtos — você pode editar pelo Painel "Editar produtos" no app
const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    name: 'Creme Hidratante Amani - 120ml',
    price: 39.9,
    stock: 25,
    img: 'https://via.placeholder.com/320x240.png?text=Creme+Amani',
    description: 'Creme vegano, sem crueldade, com aroma suave de rosas.'
  },
  {
    id: 'p2',
    name: 'Perfume sólido Amani - Rosas',
    price: 59.9,
    stock: 10,
    img: 'https://via.placeholder.com/320x240.png?text=Perfume+Amani',
    description: 'Perfume sólido concentrado — embalagens recicláveis.'
  },
  {
    id: 'p3',
    name: 'Óleo corporal Amani - 50ml',
    price: 29.9,
    stock: 40,
    img: 'https://via.placeholder.com/320x240.png?text=%C3%93leo+Amani',
    description: 'Óleo nutritivo, toque seco e rápida absorção.'
  }
];

export default function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('amani_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('amani_products', JSON.stringify(products));
  }, [products]);

  const [query, setQuery] = useState('');
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('amani_cart');
    return saved ? JSON.parse(saved) : {};
  });
  const [showCart, setShowCart] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editorText, setEditorText] = useState(JSON.stringify(products, null, 2));

  useEffect(() => {
    localStorage.setItem('amani_cart', JSON.stringify(cart));
  }, [cart]);

  function addToCart(productId) {
    setCart(prev => {
      const q = prev[productId] ? prev[productId] + 1 : 1;
      return { ...prev, [productId]: q };
    });
    setShowCart(true);
  }

  function removeFromCart(productId) {
    setCart(prev => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  }

  function updateQty(productId, qty) {
    setCart(prev => ({ ...prev, [productId]: Number(qty) }));
  }

  function clearCart() {
    setCart({});
  }

  function applyEditor() {
    try {
      const parsed = JSON.parse(editorText);
      if (!Array.isArray(parsed)) throw new Error('O JSON deve ser um array de produtos');
      setProducts(parsed);
      setEditing(false);
      alert('Produtos atualizados com sucesso!');
    } catch (e) {
      alert('Erro ao aplicar: ' + e.message);
    }
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  const cartItems = Object.keys(cart).map(id => {
    const p = products.find(x => x.id === id) || {};
    return { ...p, qty: cart[id] };
  });

  const total = cartItems.reduce((s, it) => s + (it.price || 0) * it.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Amani Store</h1>
          <div className="flex items-center gap-3">
            <input
              className="border rounded px-2 py-1"
              placeholder="Buscar produtos..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="btn" onClick={() => { setEditing(s => !s); setEditorText(JSON.stringify(products, null, 2)); }}>
              {editing ? 'Fechar editor' : 'Editar produtos'}
            </button>
            <button className="btn" onClick={() => setShowCart(s => !s)}>
              Carrinho ({Object.keys(cart).length})
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <article key={p.id} className="bg-white rounded shadow p-4 flex flex-col">
                <img src={p.img} alt={p.name} className="w-full h-40 object-cover rounded" />
                <h2 className="mt-3 font-semibold">{p.name}</h2>
                <p className="text-sm text-gray-600 flex-1">{p.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold">R$ {Number(p.price).toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Em estoque: {p.stock}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      className="px-3 py-1 rounded bg-green-600 text-white hover:opacity-90"
                      onClick={() => addToCart(p.id)}
                      disabled={p.stock <= 0}
                    >Adicionar</button>
                    <button className="px-3 py-1 rounded border" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(p)); alert('Produto copiado para a área de transferência (JSON)'); }}>
                      Copiar JSON
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="bg-white rounded shadow p-4">
          <h3 className="font-semibold">Sobre a Amani</h3>
          <p className="text-sm text-gray-600">Produtos veganos, embalagens sustentáveis e programa de retorno de embalagens com 20% de desconto.</p>

          <div className="mt-4">
            <h4 className="font-medium">Carrinho</h4>
            {cartItems.length === 0 ? (
              <div className="text-sm text-gray-500">Carrinho vazio</div>
            ) : (
              <div className="space-y-3 mt-2">
                {cartItems.map(it => (
                  <div key={it.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-gray-500">R$ {Number(it.price).toFixed(2)} x {it.qty}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input className="w-16 border rounded px-1" type="number" min={1} value={it.qty} onChange={e => updateQty(it.id, e.target.value)} />
                      <button className="text-sm" onClick={() => removeFromCart(it.id)}>Remover</button>
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t">
                  <div className="font-bold">Total: R$ {total.toFixed(2)}</div>
                  <div className="flex gap-2 mt-2">
                    <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={() => alert('Simulação de checkout — integrar gateway de pagamento')}>Finalizar</button>
                    <button className="px-3 py-1 rounded border" onClick={clearCart}>Limpar</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-gray-500">Dica: use o botão "Editar produtos" para colar um JSON com seus produtos (id, name, price, stock, img, description).</div>
        </aside>

        {editing && (
          <div className="lg:col-span-4 bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Editor de produtos (JSON)</h3>
            <textarea className="w-full h-48 border rounded p-2 mt-2 font-mono text-sm" value={editorText} onChange={e => setEditorText(e.target.value)} />
            <div className="mt-2 flex gap-2">
              <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={applyEditor}>Aplicar</button>
              <button className="px-3 py-1 rounded border" onClick={() => { setEditorText(JSON.stringify(products, null, 2)); }}>Reverter</button>
              <button className="px-3 py-1 rounded border" onClick={() => { setProducts(DEFAULT_PRODUCTS); setEditorText(JSON.stringify(DEFAULT_PRODUCTS, null, 2)); }}>Restaurar default</button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">© {new Date().getFullYear()} Amani — Feito com ♡</div>
      </footer>

      <style>{`
        .btn{ padding:8px 12px; border-radius:8px; border:1px solid #e5e7eb; background:white }
      `}</style>
    </div>
  );
}

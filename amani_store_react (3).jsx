// FILE: src/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './main.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// FILE: src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Produtos from './pages/Produtos.jsx';
import Carrinho from './pages/Carrinho.jsx';
import Sobre from './pages/Sobre.jsx';
import Contato from './pages/Contato.jsx';
import { CartProvider } from './context/CartContext.jsx';

export default function App(){
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/produtos" element={<Produtos/>} />
            <Route path="/carrinho" element={<Carrinho/>} />
            <Route path="/sobre" element={<Sobre/>} />
            <Route path="/contato" element={<Contato/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

// FILE: src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }){
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('amani_cart')) || {}; } catch { return {}; }
  });

  useEffect(()=>{ localStorage.setItem('amani_cart', JSON.stringify(cart)); }, [cart]);

  function add(productId){
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  }
  function remove(productId){
    setCart(prev => {
      const copy = { ...prev }; delete copy[productId]; return copy;
    });
  }
  function update(productId, qty){
    setCart(prev => ({ ...prev, [productId]: Number(qty) }));
  }
  function clear(){ setCart({}); }

  return (
    <CartContext.Provider value={{ cart, add, remove, update, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(){ return useContext(CartContext); }

// FILE: src/data/products.json
[
  {
    "id": "p1",
    "name": "Creme Hidratante Amani - 120ml",
    "price": 39.9,
    "stock": 25,
    "img": "https://via.placeholder.com/320x240.png?text=Creme+Amani",
    "description": "Creme vegano, sem crueldade, com aroma suave de rosas."
  },
  {
    "id": "p2",
    "name": "Perfume sólido Amani - Rosas",
    "price": 59.9,
    "stock": 10,
    "img": "https://via.placeholder.com/320x240.png?text=Perfume+Amani",
    "description": "Perfume sólido concentrado — embalagens recicláveis."
  },
  {
    "id": "p3",
    "name": "Óleo corporal Amani - 50ml",
    "price": 29.9,
    "stock": 40,
    "img": "https://via.placeholder.com/320x240.png?text=%C3%93leo+Amani",
    "description": "Óleo nutritivo, toque seco e rápida absorção."
  }
]

// FILE: src/components/Header.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Header(){
  const { cart } = useCart();
  const count = Object.values(cart).reduce((s,n)=>s+n,0);
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">Amani</Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/" end className={({isActive})=>isActive? 'font-semibold':'text-gray-700'}>Home</NavLink>
          <NavLink to="/produtos" className={({isActive})=>isActive? 'font-semibold':'text-gray-700'}>Produtos</NavLink>
          <NavLink to="/sobre" className={({isActive})=>isActive? 'font-semibold':'text-gray-700'}>Sobre</NavLink>
          <NavLink to="/contato" className={({isActive})=>isActive? 'font-semibold':'text-gray-700'}>Contato</NavLink>
          <Link to="/carrinho" className="ml-3 px-3 py-1 border rounded">Carrinho ({count})</Link>
        </nav>
      </div>
    </header>
  );
}

// FILE: src/components/Footer.jsx
import React from 'react';

export default function Footer(){
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">© {new Date().getFullYear()} Amani — Feito com ♡</div>
    </footer>
  );
}

// FILE: src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import products from '../data/products.json';

export default function Home(){
  const highlights = products.slice(0,3);
  return (
    <div>
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Amani — Beleza sustentável</h2>
        <p className="text-gray-600">Produtos veganos, embalagens recicláveis e compromisso com o planeta.</p>
        <div className="mt-4">
          <Link to="/produtos" className="px-4 py-2 bg-green-600 text-white rounded">Ver produtos</Link>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">Destaques</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlights.map(p => (
            <div key={p.id} className="bg-white p-4 rounded shadow">
              <img src={p.img} alt={p.name} className="w-full h-40 object-cover rounded mb-2" />
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-500">R$ {Number(p.price).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// FILE: src/pages/Produtos.jsx
import React, { useState, useEffect } from 'react';
import productsData from '../data/products.json';
import { useCart } from '../context/CartContext.jsx';

export default function Produtos(){
  const [products, setProducts] = useState(()=>{
    try{ const saved = localStorage.getItem('amani_products'); return saved ? JSON.parse(saved) : productsData; }catch{return productsData}
  });
  useEffect(()=>{ localStorage.setItem('amani_products', JSON.stringify(products)); }, [products]);

  const [query, setQuery] = useState('');
  const { add } = useCart();

  const [editing, setEditing] = useState(false);
  const [editorText, setEditorText] = useState(JSON.stringify(products, null, 2));

  function applyEditor(){
    try{
      const parsed = JSON.parse(editorText);
      if(!Array.isArray(parsed)) throw new Error('JSON deve ser um array');
      setProducts(parsed);
      setEditing(false);
      alert('Produtos atualizados');
    }catch(e){ alert('Erro: ' + e.message); }
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <section className="lg:col-span-3">
        <div className="flex items-center justify-between mb-4">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar produtos..." className="border rounded px-3 py-2 w-full max-w-md" />
          <button onClick={()=>{ setEditing(s=>!s); setEditorText(JSON.stringify(products, null, 2)); }} className="ml-4 px-3 py-2 border rounded">{editing ? 'Fechar editor' : 'Editar produtos'}</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p=> (
            <div key={p.id} className="bg-white p-4 rounded shadow flex flex-col">
              <img src={p.img} alt={p.name} className="w-full h-36 object-cover rounded mb-2" />
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-500 flex-1">{p.description}</div>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <div className="font-bold">R$ {Number(p.price).toFixed(2)}</div>
                  <div className="text-xs text-gray-500">Em estoque: {p.stock}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={()=>add(p.id)} className="px-3 py-1 rounded bg-green-600 text-white">Adicionar</button>
                  <button onClick={()=>{ navigator.clipboard?.writeText(JSON.stringify(p)); alert('Copiado JSON'); }} className="px-3 py-1 rounded border">Copiar JSON</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {editing && (
          <div className="mt-6 bg-white p-4 rounded shadow lg:col-span-4">
            <h4 className="font-semibold mb-2">Editor de produtos (JSON)</h4>
            <textarea className="w-full h-48 border rounded p-2 font-mono text-sm" value={editorText} onChange={e=>setEditorText(e.target.value)} />
            <div className="mt-2 flex gap-2">
              <button onClick={applyEditor} className="px-3 py-1 rounded bg-green-600 text-white">Aplicar</button>
              <button onClick={()=>setEditorText(JSON.stringify(products, null, 2))} className="px-3 py-1 rounded border">Reverter</button>
            </div>
          </div>
        )}
      </section>

      <aside className="bg-white p-4 rounded shadow">
        <h4 className="font-medium">Sobre a Amani</h4>
        <p className="text-sm text-gray-600">Produtos veganos e embalagens sustentáveis. Programa de retorno com 20% de desconto.</p>
      </aside>
    </div>
  );
}

// FILE: src/pages/Carrinho.jsx
import React, { useMemo } from 'react';
import productsData from '../data/products.json';
import { useCart } from '../context/CartContext.jsx';

export default function Carrinho(){
  const { cart, update, remove, clear } = useCart();
  const products = useMemo(()=>{
    try{ const saved = JSON.parse(localStorage.getItem('amani_products')); return saved || productsData; }catch{return productsData}
  }, []);

  const items = Object.keys(cart).map(id => {
    const p = products.find(x=>x.id===id) || { id, name: 'Produto', price: 0 };
    return { ...p, qty: cart[id] };
  });

  const total = items.reduce((s,it)=>s + (it.price||0) * it.qty, 0);

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Carrinho</h2>
      {items.length===0 ? (
        <div className="text-gray-500">Seu carrinho está vazio.</div>
      ) : (
        <div className="space-y-4">
          {items.map(it=> (
            <div key={it.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-500">R$ {Number(it.price).toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min={1} value={it.qty} onChange={e=>update(it.id, e.target.value)} className="w-20 border rounded px-2" />
                <button onClick={()=>remove(it.id)} className="text-sm text-red-600">Remover</button>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t flex items-center justify-between">
            <div className="font-bold">Total: R$ {total.toFixed(2)}</div>
            <div className="flex gap-2">
              <button onClick={()=>alert('Simulação de checkout — integrar gateway')} className="px-4 py-2 rounded bg-blue-600 text-white">Finalizar</button>
              <button onClick={clear} className="px-4 py-2 rounded border">Limpar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// FILE: src/pages/Sobre.jsx
import React from 'react';

export default function Sobre(){
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-2">Sobre a Amani</h2>
      <p className="text-gray-600 mb-4">A Amani é uma marca de cosméticos veganos, comprometida com práticas sustentáveis, embalagens recicláveis e apoio a projetos de reflorestamento.</p>
      <ul className="list-disc pl-5 text-sm text-gray-700">
        <li>Produtos veganos e cruelty-free</li>
        <li>Programa de retorno de embalagens com 20% de desconto</li>
        <li>Doações para reflorestamento</li>
      </ul>
    </div>
  );
}

// FILE: src/pages/Contato.jsx
import React, { useState } from 'react';

export default function Contato(){
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });
  function handleSubmit(e){ e.preventDefault(); alert('Mensagem enviada (simulação)'); setForm({ nome:'', email:'', mensagem:'' }); }
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Contato</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})} placeholder="Nome" className="w-full border rounded px-3 py-2" required />
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" type="email" className="w-full border rounded px-3 py-2" required />
        <textarea value={form.mensagem} onChange={e=>setForm({...form, mensagem:e.target.value})} placeholder="Mensagem" className="w-full border rounded px-3 py-2" rows={5} required />
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-green-600 text-white rounded">Enviar</button>
        </div>
      </form>
    </div>
  );
}

// FILE: src/main.css
@tailwind base;
@tailwind components;
@tailwind utilities;

body { @apply bg-gray-50 text-gray-800; }

.btn{ padding:8px 12px; border-radius:8px; border:1px solid #e5e7eb; background:white }

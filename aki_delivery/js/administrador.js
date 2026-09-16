(function(){
  const brl = new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
  const orders = typeof getOrders === 'function' ? getOrders() : JSON.parse(localStorage.getItem('akiOrders') || '[]');
  const today = new Date();
  const sameDay = o => { const d = new Date(o.createdAt || o.date || today); return d.toDateString() === today.toDateString(); };
  const todayOrders = orders.filter(sameDay);
  const total = todayOrders.reduce((s,o)=>s + Number(o.total || 0),0);
  const el = id => document.getElementById(id);
  if(el('todayOrders')) el('todayOrders').textContent = todayOrders.length;
  if(el('todaySales')) el('todaySales').textContent = brl.format(total);

  const chart = el('salesChart');
  const slots = ['08h','10h','12h','14h','16h','18h','20h','22h'];
  const values = slots.map((_,i)=> todayOrders.reduce((sum,o)=>{
    const d=new Date(o.createdAt || o.date || today); const h=d.getHours();
    return (h >= 8+i*2 && h < 10+i*2) ? sum + Number(o.total||0) : sum;
  },0));
  const max = Math.max(...values,1);
  if(chart){ chart.innerHTML=''; values.forEach((v,i)=>{ const bar=document.createElement('div'); bar.className='sales-bar-wrap'; bar.title=slots[i]+' — '+brl.format(v); bar.innerHTML='<div class="sales-value">'+(v?brl.format(v):'')+'</div><div class="sales-bar" style="height:'+Math.max(8,(v/max)*180)+'px"></div><small>'+slots[i]+'</small>'; chart.appendChild(bar); }); }

  const payments = { 'Pix':0,'Cartão de crédito':0,'Cartão de débito':0,'Dinheiro':0,'Vale-refeição':0 };
  todayOrders.forEach(o=>{ const p=o.paymentMethod || o.payment || 'Pix'; if(payments[p]===undefined) payments[p]=0; payments[p]+=Number(o.total||0); });
  const list=el('paymentList');
  if(list){ const maxPay=Math.max(...Object.values(payments),1); list.innerHTML=Object.entries(payments).map(([name,val])=>'<div class="payment-row"><div><span>'+name+'</span><strong>'+brl.format(val)+'</strong></div><div class="payment-track"><i style="width:'+((val/maxPay)*100)+'%"></i></div></div>').join(''); }

  const select=el('whatsappOrder');
  if(select){ orders.slice().reverse().forEach(o=>{ const op=document.createElement('option'); op.value=o.id || o.number || ''; op.textContent='#'+(o.number || o.id || '---')+' · '+(o.customerName || o.customer || 'Cliente')+' · '+brl.format(Number(o.total||0)); select.appendChild(op); }); }
  const msgByStatus={recebido:'Seu pedido foi recebido pela AKI Delivery. Já estamos cuidando dele! 🍔',preparo:'Seu pedido está em preparo. Em breve estará a caminho! 👨‍🍳',entrega:'Seu pedido saiu para entrega. O entregador está a caminho! 🛵',entregue:'Seu pedido foi entregue. Obrigado por pedir com a AKI Delivery! ❤️'};
  const btn=el('sendWhatsapp');
  if(btn) btn.addEventListener('click',()=>{ const id=select.value; const status=el('whatsappStatus').value; const order=orders.find(o=>String(o.id||o.number)===String(id)); if(!order){ alert('Selecione um pedido.'); return; } const phone=(order.customerPhone||order.phone||'').replace(/\D/g,''); const text='Olá! Aqui é da AKI Delivery. Pedido #'+(order.number||order.id)+' — '+msgByStatus[status]+' Total: '+brl.format(Number(order.total||0))+'.'; const url=phone ? 'https://wa.me/'+phone+'?text='+encodeURIComponent(text) : 'https://wa.me/?text='+encodeURIComponent(text); window.open(url,'_blank','noopener'); });
})();

// Central de mensagens visível dentro do aplicativo
(function initWhatsappMessageCenter(){
  const target = document.querySelector('#whatsappMessages');
  if (!target) return;
  const orders = typeof getOrders === 'function' ? getOrders() : JSON.parse(localStorage.getItem('akiOrders') || '[]');
  const templates = {
    recebido: 'Olá! Aqui é da AKI Delivery. Recebemos seu pedido e já estamos cuidando dele. 🍔',
    preparo: 'Olá! Seu pedido está em preparo. Em breve estará a caminho! 👨‍🍳',
    entrega: 'Olá! Seu pedido saiu para entrega. O entregador está a caminho! 🛵',
    entregue: 'Olá! Seu pedido foi entregue. Obrigado por pedir com a AKI Delivery! ❤️'
  };
  if (!orders.length) { target.innerHTML='<div class="empty-menu"><span class="material-symbols-outlined">forum</span><strong>Nenhuma mensagem disponível</strong><p>As mensagens dos pedidos aparecerão aqui.</p></div>'; return; }
  target.innerHTML = orders.slice(0,8).map((o,i)=>{
    const status = String(o.status||'Pedido recebido').toLowerCase();
    const key = status.includes('preparo')?'preparo':status.includes('entrega')?'entrega':status.includes('entreg')?'entregue':'recebido';
    const text = `${templates[key]} Pedido #${o.number}. Total: ${new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(o.total||0))}.`;
    return `<details class="whatsapp-message" ${i===0?'open':''}><summary><span class="message-avatar"><span class="material-symbols-outlined">chat</span></span><span class="message-summary"><strong>${o.customer||'Cliente'}</strong><small>Pedido #${o.number} · ${o.status||'Pedido recebido'}</small></span><span class="material-symbols-outlined expand-icon">expand_more</span></summary><div class="message-body"><p>${text}</p><div class="message-meta"><span><span class="material-symbols-outlined">payments</span>${o.paymentMethod||'Pix'}</span><span>${new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(o.total||0))}</span></div></div></details>`;
  }).join('');
})();

// Controle de estoque
(function initStockControl(){
  const body = document.querySelector('#stockBody');
  if (!body) return;
  const key = 'akiStock';
  const defaultStock = [
    {id:1,name:'Pão brioche',category:'Ingredientes',quantity:32,min:10},
    {id:2,name:'Blend artesanal',category:'Ingredientes',quantity:24,min:8},
    {id:3,name:'Queijo cheddar',category:'Ingredientes',quantity:18,min:6},
    {id:4,name:'Bacon',category:'Ingredientes',quantity:15,min:5},
    {id:5,name:'Batata frita',category:'Porções',quantity:20,min:5},
    {id:6,name:'Refrigerante lata',category:'Bebidas',quantity:28,min:8},
    {id:7,name:'Suco de laranja',category:'Bebidas',quantity:12,min:5},
    {id:8,name:'Suco de maracujá',category:'Bebidas',quantity:10,min:5},
    {id:9,name:'Embalagem para lanche',category:'Embalagens',quantity:45,min:15}
  ];
  let stock = JSON.parse(localStorage.getItem(key) || 'null') || defaultStock;
  const save = () => localStorage.setItem(key, JSON.stringify(stock));
  const moneyCount = n => `${n} un.`;
  const render = () => {
    const low = stock.filter(i => i.quantity <= i.min);
    document.querySelector('#stockSummary').innerHTML = `<div class="stock-stat"><span class="material-symbols-outlined">inventory</span><div><strong>${stock.length}</strong><small>Itens cadastrados</small></div></div><div class="stock-stat"><span class="material-symbols-outlined">check_circle</span><div><strong>${stock.reduce((s,i)=>s+i.quantity,0)}</strong><small>Unidades disponíveis</small></div></div><div class="stock-stat stock-stat-alert"><span class="material-symbols-outlined">warning</span><div><strong>${low.length}</strong><small>Itens em nível mínimo</small></div></div>`;
    const alert = document.querySelector('#stockAlert');
    alert.hidden = !low.length;
    alert.innerHTML = low.length ? `<span class="material-symbols-outlined">warning</span><span><strong>Atenção:</strong> ${low.map(i=>i.name).join(', ')} ${low.length===1?'está':'estão'} abaixo ou no nível mínimo.</span>` : '';
    body.innerHTML = stock.map(item => {
      const isLow = item.quantity <= item.min;
      return `<tr><td><strong>${item.name}</strong></td><td>${item.category}</td><td><b>${moneyCount(item.quantity)}</b></td><td>${moneyCount(item.min)}</td><td><span class="status ${isLow?'red':'green'}">${isLow?'Repor estoque':'Disponível'}</span></td><td><div class="stock-actions"><button class="stock-action-btn" data-stock-action="entrada" data-stock-id="${item.id}" title="Adicionar entrada"><span class="material-symbols-outlined">add</span></button><button class="stock-action-btn danger" data-stock-action="saida" data-stock-id="${item.id}" title="Registrar saída"><span class="material-symbols-outlined">remove</span></button></div></td></tr>`;
    }).join('');
    document.querySelector('#stockProduct').innerHTML = stock.map(i=>`<option value="${i.id}">${i.name} — ${i.quantity} un.</option>`).join('');
  };
  const form = document.querySelector('#stockForm');
  const openForm = (type='entrada', id='') => { form.hidden=false; document.querySelector('#stockMovement').value=type; if(id) document.querySelector('#stockProduct').value=id; document.querySelector('#stockQuantity').focus(); };
  document.querySelector('#stockAddBtn').addEventListener('click',()=>openForm());
  document.querySelector('#stockCloseBtn').addEventListener('click',()=>form.hidden=true);
  document.querySelector('#stockSaveBtn').addEventListener('click',()=>{
    const id=Number(document.querySelector('#stockProduct').value), type=document.querySelector('#stockMovement').value, qty=Number(document.querySelector('#stockQuantity').value), note=document.querySelector('#stockNote').value.trim();
    const item=stock.find(i=>i.id===id);
    if(!item || !Number.isInteger(qty) || qty<1){ alert('Informe uma quantidade inteira maior que zero.'); return; }
    if(type==='saida' && qty>item.quantity){ alert('A saída não pode ser maior que a quantidade disponível.'); return; }
    item.quantity += type==='entrada' ? qty : -qty;
    item.lastMovement={type,qty,note,date:new Date().toISOString()}; save(); render(); form.hidden=true; document.querySelector('#stockQuantity').value=''; document.querySelector('#stockNote').value='';
  });
  body.addEventListener('click', e=>{ const btn=e.target.closest('[data-stock-action]'); if(btn) openForm(btn.dataset.stockAction, btn.dataset.stockId); });
  render();
})();

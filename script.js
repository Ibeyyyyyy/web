const PRODUCTS=[
  {id:'sage-garden',name:'Sage Garden',category:'Botanical',theme:'th-sage',price:99000,description:'Nuansa botanical lembut untuk perayaan hangat dan intim.'},
  {id:'rose-evening',name:'Rose Evening',category:'Romantis',theme:'th-rose',price:119000,description:'Palet rose yang anggun dengan sentuhan romantis modern.'},
  {id:'midnight-gold',name:'Midnight Gold',category:'Elegan',theme:'th-night',price:149000,description:'Tampilan malam yang mewah dengan aksen emas berkelas.'},
  {id:'sand-dune',name:'Sand Dune',category:'Minimalis',theme:'th-sand',price:89000,description:'Warna bumi yang hangat, sederhana, dan tak lekang waktu.'},
  {id:'ocean-calm',name:'Ocean Calm',category:'Minimalis',theme:'th-ocean',price:109000,description:'Inspirasi biru laut dengan komposisi bersih dan menenangkan.'},
  {id:'plum-velvet',name:'Plum Velvet',category:'Elegan',theme:'th-plum',price:139000,description:'Warna plum yang dramatis untuk pesta penuh kesan.'},
  {id:'ivory-ornament',name:'Ivory Ornamental',category:'Ornamen',theme:'th-ornate',price:129000,coverLabel:'Undangan pernikahan',motif:'❧  ✦  ❧',description:'Latar putih gading, bingkai klasik, dan ornamen floral pernikahan yang anggun.'},
  {id:'paes-jawa',name:'Paes Jawa',category:'Tradisional Jawa',theme:'th-jawa',price:159000,coverLabel:'Adat Jawa',motif:'✦  ❖  ✦',description:'Warna hitam dengan aksen emas dan sentuhan motif tradisi Jawa.'},
  {id:'oldschool-noir',name:'Oldschool Noir',category:'Oldschool',theme:'th-oldschool',price:139000,coverLabel:'The Wedding',motif:'EST. · 2026 · EST.',description:'Undangan hitam bergaya oldschool dengan tekstur retro dan aksen vintage.'}
];
const CART_KEY='janjiku.store.cart.v1',ORDER_KEY='janjiku.store.orders.v1';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const formatPrice=n=>'Rp'+Number(n).toLocaleString('id-ID');
function readStorage(key,fallback){try{const value=JSON.parse(localStorage.getItem(key));return value??fallback}catch{return fallback}}
let cart=readStorage(CART_KEY,{}),activeCategory='Semua',previewProduct=null;
if(!cart||Array.isArray(cart)||typeof cart!=='object')cart={};
function saveCart(){try{localStorage.setItem(CART_KEY,JSON.stringify(cart))}catch{toast('Keranjang tidak dapat disimpan di browser ini.')}}
function productById(id){return PRODUCTS.find(p=>p.id===id)}
function qty(id){return Math.max(0,Math.floor(Number(cart[id])||0))}
function cartCount(){return Object.values(cart).reduce((n,v)=>n+Math.max(0,Math.floor(Number(v)||0)),0)}
function total(){return PRODUCTS.reduce((sum,p)=>sum+p.price*qty(p.id),0)}
function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('on');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('on'),2300)}
function toggleMenu(){const nav=$('#nav'),button=$('.menu-btn'),open=nav.classList.toggle('open');button.setAttribute('aria-expanded',String(open))}
function productCard(p){return `<article class="product"><div class="product-art" data-theme="${p.theme}"><span class="product-badge">${esc(p.category)}</span><div class="mock-cover" data-theme="${p.theme}"><span class="mock-ornament">${esc(p.motif||'')}</span><small>${esc(p.coverLabel||'Undangan pernikahan')}</small><div class="mock-name">Raka<i>&amp;</i>Nadia</div><p>SABTU · 18 OKTOBER 2026</p><span class="mock-ornament">${esc(p.motif||'')}</span></div></div><div class="product-info"><div class="product-meta"><h3>${esc(p.name)}</h3></div><p class="product-desc">${esc(p.description)}</p><div class="product-bottom"><div class="price">${formatPrice(p.price)} <small>/ undangan</small></div><div class="product-actions"><button class="btn ghost sm" type="button" onclick="openPreview('${p.id}')">Pratinjau</button><button class="btn pri sm" type="button" onclick="addToCart('${p.id}')">Beli</button></div></div></div></article>`}
function renderProducts(){
  $('#featuredProducts').innerHTML=PRODUCTS.slice(0,3).map(productCard).join('');
  const categories=['Semua',...new Set(PRODUCTS.map(p=>p.category))];
  $('#filters').innerHTML=categories.map(c=>`<button type="button" class="${c===activeCategory?'on':''}" aria-pressed="${c===activeCategory}" onclick="setCategory('${esc(c)}')">${esc(c)}</button>`).join('');
  $('#allProducts').innerHTML=PRODUCTS.filter(p=>activeCategory==='Semua'||p.category===activeCategory).map(productCard).join('');
}
function setCategory(category){activeCategory=category;renderProducts()}
function renderCartCount(){$('#cartCount').textContent=cartCount()}
function addToCart(id){
  if(!productById(id))return;
  cart[id]=qty(id)+1;saveCart();renderCartCount();toast('Desain ditambahkan ke keranjang');
  if(location.hash==='#/keranjang')renderCart();
}
function changeQty(id,delta){if(!productById(id))return;cart[id]=Math.max(0,qty(id)+delta);if(!cart[id])delete cart[id];saveCart();renderCartCount();renderCart();if(location.hash==='#/checkout')renderCheckoutSummary()}
function removeFromCart(id){delete cart[id];saveCart();renderCartCount();renderCart();if(location.hash==='#/checkout')renderCheckoutSummary()}
function cartSummaryMarkup(){return `<h3>Ringkasan belanja</h3><div class="sum-line"><span>Jumlah produk</span><span>${cartCount()} undangan</span></div><div class="sum-line"><span>Biaya layanan</span><span>Gratis</span></div><div class="sum-line total"><span>Total</span><span>${formatPrice(total())}</span></div>`}
function renderCart(){
  const entries=PRODUCTS.filter(p=>qty(p.id)>0),root=$('#cartContent');
  if(!entries.length){root.innerHTML=`<div class="empty"><div class="empty-icon">◇</div><h3>Keranjangmu masih kosong</h3><p>Temukan desain undangan yang cocok untuk hari istimewamu.</p><a href="#/desain" class="btn pri">Jelajahi koleksi</a></div>`;return}
  root.innerHTML=`<div class="cart-layout"><div class="cart-items">${entries.map(p=>`<div class="cart-row"><div class="cart-thumb" data-theme="${p.theme}">${esc(p.name)}</div><div><h3>${esc(p.name)}</h3><p>${formatPrice(p.price)} · Digital</p><div style="display:flex;align-items:center;gap:10px;margin-top:9px"><button class="btn subtle sm" type="button" aria-label="Kurangi jumlah" onclick="changeQty('${p.id}',-1)">−</button><b>${qty(p.id)}</b><button class="btn subtle sm" type="button" aria-label="Tambah jumlah" onclick="changeQty('${p.id}',1)">+</button></div></div><b class="price">${formatPrice(p.price*qty(p.id))}</b><button class="remove" type="button" onclick="removeFromCart('${p.id}')">Hapus</button></div>`).join('')}</div><aside class="cart-summary">${cartSummaryMarkup()}<a href="#/checkout" class="btn pri">Lanjut ke checkout →</a><a href="#/desain" class="btn ghost" style="width:100%;margin-top:9px">Lanjut belanja</a></aside></div>`;
}
function renderCheckoutSummary(){
  const root=$('#checkoutSummary');
  root.innerHTML=`${cartSummaryMarkup()}<div style="border-top:1px solid var(--line);margin-top:12px;padding-top:15px">${PRODUCTS.filter(p=>qty(p.id)>0).map(p=>`<div class="sum-line"><span>${esc(p.name)} × ${qty(p.id)}</span><span>${formatPrice(p.price*qty(p.id))}</span></div>`).join('')}</div>`;
}
function openPreview(id){
  const p=productById(id);if(!p)return;previewProduct=id;
  $('#previewTitle').textContent='Pratinjau · '+p.name;
  $('#previewBody').innerHTML=`<div class="preview-cover" data-theme="${p.theme}"><div><span class="mock-ornament">${esc(p.motif||'')}</span><small>${esc(p.coverLabel||'Undangan pernikahan')}</small><div class="names">Raka<i>&amp;</i>Nadia</div><p>Dengan penuh rasa syukur, kami mengundang Anda untuk hadir pada hari bahagia kami.</p><p style="margin-top:24px;color:#e6b395">SABTU · 18 OKTOBER 2026</p><span class="mock-ornament">${esc(p.motif||'')}</span></div></div>`;
  $('#previewAdd').textContent='Tambah '+p.name+' ke keranjang · '+formatPrice(p.price);
  $('#preview').classList.add('on');document.body.classList.add('lock');$('#previewAdd').focus();
}
function closePreview(){$('#preview').classList.remove('on');document.body.classList.remove('lock');previewProduct=null}
$('#previewAdd').addEventListener('click',()=>{if(previewProduct)addToCart(previewProduct);closePreview()});
function showConfirmation(order){
  $('#confirmationContent').innerHTML=`<div class="confirmation"><div class="check">✓</div><h2>Ringkasan pesanan siap</h2><p>Terima kasih, ${esc(order.name)}. Ini adalah pesanan demo yang tersimpan di browser ini saja.</p><div class="order-code">${esc(order.id)}</div><div style="text-align:left;margin:10px auto 20px;max-width:380px">${order.items.map(i=>`<div class="sum-line"><span>${esc(i.name)} × ${i.qty}</span><span>${formatPrice(i.price*i.qty)}</span></div>`).join('')}<div class="sum-line total"><span>Total simulasi</span><span>${formatPrice(order.total)}</span></div></div><p style="font-size:12px">Belum ada pembayaran, notifikasi kepada penjual, atau pemenuhan pesanan.</p><a href="#/desain" class="btn pri" style="margin-top:20px">Kembali ke koleksi</a></div>`;
}
$('#checkoutForm').addEventListener('submit',event=>{
  event.preventDefault();
  if(cartCount()===0){location.hash='#/keranjang';return}
  const form=new FormData(event.currentTarget),name=String(form.get('buyerName')||'').trim(),email=String(form.get('buyerEmail')||'').trim(),phone=String(form.get('buyerPhone')||'').trim();
  if(!name||!email||!phone){toast('Lengkapi informasi pemesan terlebih dahulu.');return}
  const order={id:'DEMO-'+Date.now().toString(36).toUpperCase(),name,email,phone,total:total(),items:PRODUCTS.filter(p=>qty(p.id)>0).map(p=>({name:p.name,price:p.price,qty:qty(p.id)})),createdAt:new Date().toISOString()};
  const orders=readStorage(ORDER_KEY,[]);orders.push(order);
  try{localStorage.setItem(ORDER_KEY,JSON.stringify(orders))}catch{toast('Pesanan tidak dapat disimpan. Periksa ruang penyimpanan browser.');return}
  cart={};saveCart();renderCartCount();showConfirmation(order);location.hash='#/selesai?order='+encodeURIComponent(order.id);
});
function route(){
  const raw=location.hash.replace(/^#\//,'')||'beranda',[name,query]=raw.split('?'),allowed=['beranda','desain','cara','keranjang','checkout','selesai'];
  if(!allowed.includes(name)){location.hash='#/beranda';return}
  $$('.page').forEach(page=>page.classList.toggle('on',page.id==='page-'+name));
  $$('#nav a').forEach(link=>link.classList.toggle('on',link.dataset.page===name));
  $('#nav').classList.remove('open');$('.menu-btn').setAttribute('aria-expanded','false');
  if(name==='keranjang')renderCart();
  if(name==='checkout'){
    if(cartCount()===0){location.hash='#/keranjang';return}
    renderCheckoutSummary();
  }
  if(name==='selesai'){
    const id=new URLSearchParams(query||'').get('order'),orders=readStorage(ORDER_KEY,[]);
    const order=Array.isArray(orders)?orders.find(item=>item.id===id):null;
    if(order)showConfirmation(order);else location.hash='#/beranda';
  }
  window.scrollTo(0,0);
}
window.addEventListener('hashchange',route);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&$('#preview').classList.contains('on'))closePreview()});
$('#year').textContent=new Date().getFullYear();
renderProducts();renderCartCount();route();

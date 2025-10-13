/* -----------------------------
Eden Beads - script.js
Handles: products, cart, coupons, checkout, whatsapp message
------------------------------*/


// -------------------- sample product data (placeholder)
const PRODUCTS = (() => {
const categories = [
{id:'bracelets', title:'Bracelets 🤎'},
{id:'pendants', title:'Pendants & Lockets 🕊️'},
{id:'keychains', title:'Keychains 🍂'},
{id:'hangings', title:'Hangings 🦋☕'}
];


// generate 8 sample items per category (you asked 20 placeholder per category earlier — reduce for demo)
const items = [];
categories.forEach(cat => {
for(let i=1;i<=8;i++){
items.push({
id: cat.id + '-' + i,
title: `${cat.title.split(' ')[0]} ${i}`,
desc: `Handmade ${cat.title.split(' ')[0]} with love ☕`,
price: 250 + i*50,
img: '',
category: cat.id
});
}
});
return items;
})();


// -------------------- coupons (owner-manageable)
// default coupons; store live coupons in localStorage under 'eden_coupons'
const DEFAULT_COUPONS = {
'COFFEE10': {type:'percent', value:10},
'EDEN20': {type:'percent', value:20}
};


function loadCoupons(){
try{
const raw = localStorage.getItem('eden_coupons');
if(!raw){ localStorage.setItem('eden_coupons', JSON.stringify(DEFAULT_COUPONS)); return DEFAULT_COUPONS; }
return JSON.parse(raw);
}catch(e){ localStorage.setItem('eden_coupons', JSON.stringify(DEFAULT_COUPONS)); return DEFAULT_COUPONS; }
}
function saveCoupons(obj){ localStorage.setItem('eden_coupons', JSON.stringify(obj)); }


// -------------------- cart helpers
function loadCart(){
try{ return JSON.parse(loc
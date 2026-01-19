export function initChat(){
  const box = document.getElementById('chatBox');
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('messages');

  document.getElementById('chatToggle').addEventListener('click',()=>{
    box.style.display='flex';
  });

  document.getElementById('closeChat').addEventListener('click',()=>{
    box.style.display='none';
  });

  input.addEventListener('keydown',e=>{
    if(e.key!=='Enter' || !input.value.trim()) return;
    const text=input.value;
    input.value='';
    add('Anda',text);
    setTimeout(()=>add('CS',reply(text)),600);
  });

  function add(sender,text){
    messages.innerHTML+=`<div><b>${sender}:</b> ${text}</div>`;
    messages.scrollTop=messages.scrollHeight;
  }

  function reply(t){
    t=t.toLowerCase();
    if(t.includes('harga') || t.includes('berapa')) return 'Harga ada di halaman produk.';
    if(t.includes('kirim') || t.includes('pengiriman')) return 'Pengiriman 2–5 hari kerja.';
    if(t.includes('diskon') || t.includes('promo')) return 'Cek halaman promo kami untuk diskon terbaru.';
    if(t.includes('halo') || t.includes('hai')) return 'Halo! Ada yang bisa kami bantu?';
    if(t.includes('stok habis') || t.includes('habis')) return 'Maaf, stok produk tersebut sedang habis.';
    if(t.includes('metode pembayaran') || t.includes('pembayaran')) return 'Kami menerima transfer bank dan e-wallet.';
    if(t.includes('cara pesan') || t.includes('cara beli')) return 'Pilih produk, masukkan ke keranjang, lalu checkout.';
    if(t.includes('alamat saya') || t.includes('alamat')) return 'Anda bisa mengubah alamat di halaman profil.';
    if(t.includes('waktu operasional') || t.includes('jam buka')) return 'Kami buka Senin–Minggu, 24 Jam nonstop cuyy.';
    if(t.includes('garansi')) return 'Garansi hanya berlaku jika penjual memberikan garansi ya, kami disini hanya menjadi oerantara pihak ke 3 saja.';
    if(t.includes('retur') || t.includes('pengembalian')) return 'Anda bisa mengajukan retur di halaman pesanan.';
    if(t.includes('ongkir')) return 'Ongkir tergantung lokasi dan metode pengiriman yang dipilih.';
    if(t.includes('kode promo')) return 'Kode promo bisa ditemukan di halaman promo kami.';
    if(t.includes('produk baru')) return 'Cek halaman produk untuk update produk terbaru kami.';
    if(t.includes('bantuan')) return 'Silakan jelaskan masalah Anda, kami siap membantu.';
    if(t.includes('terlambat')) return 'Mohon maaf atas keterlambatan, kami akan cek status pengiriman Anda.';
    if(t.includes('pembatalan')) return 'Anda bisa membatalkan pesanan sebelum dikirim.';
    if(t.includes('metode pengiriman')) return 'Kami bekerja sama dengan JNE, TIKI, dan POS Indonesia.';
    if(t.includes('terima kasih') || t.includes('makasih')) return 'Terima kasih, CS akan membantu.';
    else {
      return 'Maaf, saya tidak mengerti pertanyaan Anda. Bisa dijelaskan lebih rinci?';
    }
  }
}

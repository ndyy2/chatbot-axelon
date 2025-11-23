
# Chatbot Axelon

Chatbot Axelon adalah proyek website chatbot berbasis web modern yang dibangun dengan **Next.js**, menyediakan interaksi cerdas dan responsif. Proyek ini mendukung otentikasi, manajemen database ganda (MongoDB & MariaDB), dan desain antarmuka yang elegan dengan Tailwind CSS.

---

## Fitur

- Chatbot interaktif berbasis teks.
- Sistem otentikasi menggunakan **Auth.js**.
- Database ganda:
  - **MongoDB** dengan **Mongoose** untuk data dinamis.
  - **MariaDB** dengan **Prisma** untuk data terstruktur.
- Antarmuka modern responsif dengan **Tailwind CSS**.
- Modular dan mudah dikembangkan.
- Dukungan real-time (opsional, bisa ditambahkan Socket.io).

---

## Teknologi

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Next.js API Routes
- **Database:** MongoDB (Mongoose), MariaDB (Prisma)
- **Otentikasi:** Auth.js
- **Lainnya:** npm, Yarn, atau pnpm untuk manajemen paket

---

## Instalasi

1. Clone repository:

```bash
git clone https://github.com/USERNAME/chatbot-axelon.git
cd chatbot-axelon
````

2. Install dependencies:

```bash
npm install
# atau
yarn
```

3. Buat file `.env` di root dan isi konfigurasi database dan Auth.js:

```env
MONGODB_URI=...
DATABASE_URL=mysql://user:password@localhost:3306/db_name
NEXTAUTH_SECRET=...
```

4. Jalankan proyek:

```bash
npm run dev
# atau
yarn dev
```

5. Buka browser di `http://localhost:3000`.

---

## Kontribusi

1. Fork repository ini.
2. Buat branch fitur baru: `git checkout -b fitur-baru`
3. Commit perubahan: `git commit -m "Tambahkan fitur baru"`
4. Push ke branch: `git push origin fitur-baru`
5. Buat pull request.

---

## Lisensi

MIT License © 2025 Andy Pradana

---

## Kontak

Buat pertanyaan, saran, atau laporkan bug melalui **GitHub Issues**.

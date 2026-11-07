# S4 — Features

## Answers
- **S4.q1 Kalau aplikasi ini cuma bisa melakukan SATU hal di hari pertama, satu hal apa itu?** — Booking jadwal real-time. Pemain buka, lihat slot yang kosong, pilih, booking. Itu intinya — sisanya numpang. · _EN: The one thing = real-time slot booking → F-01 seed; everything else orders against it (M0 walking-skeleton seed for S8)._
- **S4.q2 Bayangkan saya sedang pegang HP itu. Ajak saya jalan satu per satu — saya tap apa duluan? (untuk fitur booking)** — Buka link dari WhatsApp. Muncul pilihan lapangan: Lapangan A, Lapangan B. Pilih satu. Pilih tanggal — misal Sabtu. Terus kelihatan jam-jam: yang masih kosong hijau, yang sudah kebooking abu-abu. Tap slot hijau jam 8 malam. Isi nama dan nomor HP. Klik 'Booking'. Selesai — muncul tulisan booking tercatat, dan slot itu langsung nggak bisa diambil orang lain. · _EN: F-01's click-by-click script: link → court choice → date → color-coded slot grid → slot tap → name + phone → Book → confirmation; the slot becomes unavailable to others immediately (holds consistent with D-004)._
- **S4.q3 Setelah itu, hal kedua apa yang paling orang butuhkan?** — Yang kedua jelas DP 30-nya — abis booking, pemain bayar DP, saya konfirmasi. Soalnya tanpa DP itu, pemain mangkal seenaknya. · _EN: Second thing = the 30% DP with admin confirmation → F-02 seed; the no-show rationale matches the original idea (S0.q1)._
- **S4.q4 Ayo jalan satu per satu untuk urusan DP itu — pemain tap apa, lalu Anda di laptop tap apa?** — Abis booking, di halaman booking pemain kelihatan total sewa sama DP 30%-nya berapa rupiah. Dia transfer ke nomor rekening yang tertera. Di halaman itu ada tombol 'Kirim Bukti Transfer' — dia foto dan kirim. Di laptop saya ada daftar 'Menunggu Konfirmasi'. Saya cek m-banking, duitnya masuk, saya klik 'Konfirmasi'. Di HP pemain statusnya berubah jadi 'DP Diterima'. · _EN: F-02's script: booking page shows total + 30% DP amount → bank transfer to the listed account → upload proof photo → admin's "waiting confirmation" queue → m-banking check → Confirm → player status flips to "DP received". Method matches D-011 (manual transfer + admin confirmation)._
- **S4.q5 Berikutnya — hal ketiga apa yang orang butuhkan?** — Kelola lapangan dan jadwal. Saya yang atur sendiri: jam buka, harga per jam, dan jam yang ditutup misalnya. Soalnya kalau nggak bisa, tiap mau ganti saya harus telepon Anda. · _EN: Third thing = admin manages courts and schedule (opening hours, hourly price, blocked slots) → F-03 seed; the "I'd have to call you" line is the self-service motivation._
- **S4.q6 Jalan satu per satu untuk kelola lapangan dan jadwal — dari laptop, Anda mulai dari mana?** — Saya login dulu di laptop. Buka menu 'Lapangan'. Pilih Lapangan A: atur jam buka 8 pagi sampai 11 malam, harga per jamnya. Kalau ada jam yang ditutup — misalnya Selasa sore rapihin lampu — saya blokir jam itu. Klik 'Simpan'. Selesai: di HP pemain langsung kebaca, jam itu nggak bisa dipesan. · _EN: F-03's script: login → "Lapangan" menu → per-court opening hours + hourly price → block specific slots (e.g. Tuesday afternoon lamp maintenance) → Save → changes are immediately live on the player side._
- **S4.q7 Dan hal keempat?** — Laporan harian. Biar saya nggak buka buku lagi tiap malam — sekali lihat, kelar. · _EN: Fourth thing = daily report → F-04 seed; motivation: retire the notebook (S1.q3 success picture)._
- **S4.q8 Jalan satu per satu untuk laporan harian.** — Di laptop saya login, buka menu 'Laporan'. Tanggalnya ngisi sendiri hari ini. Kelihatan sekali pandang: ada berapa booking, slot terpakai sama yang kosong, DP sudah masuk total berapa rupiah, dan siapa saja yang belum bayar DP — lengkap sama nomor HP-nya, biar bisa saya kejar. Kalau perlu, bisa dicetak. · _EN: F-04's script: login → "Laporan" menu → date defaults to today → one-glance summary: booking count, used vs empty slots, DP money received (Rp), list of unpaid-DP bookings with name + phone (chase list) → printable._
- **S4.q9 Ada lagi yang ingin ditambahkan, atau cukup sampai di sini untuk bagian fitur?** — Cukup. Empat itu saja dulu. · _EN: The "enough" control fired explicitly after the fourth feature — capture stopped, protocol ran._
- **S4.q10 Protokol cukup — prioritas F-01 (booking slot real-time): wajib, sebaiknya, atau boleh nanti?** — Wajib lah. Nggak ada booking, nggak ada apa-apa. · _EN: F-01 priority: must, confirmed aloud._
- **S4.q11 Prioritas F-02 (DP 30% + konfirmasi admin): wajib, sebaiknya, atau boleh nanti?** — Wajib. Itu biar nggak ada no-show — inti dari awal. · _EN: F-02 priority: must, confirmed aloud._
- **S4.q12 Prioritas F-03 (kelola lapangan & jadwal): wajib, sebaiknya, atau boleh nanti?** — Wajib juga. Kalau saya nggak bisa atur jadwal sendiri, tiap mau blokir jam harus hubungi orang luar. · _EN: F-03 priority: must, confirmed aloud._
- **S4.q13 Prioritas F-04 (laporan harian): wajib, sebaiknya, atau boleh nanti?** — Kalau yang laporan harian sebaiknya saja dulu. Enak punya, tapi kalau telat sebulan juga masih hidup. · _EN: F-04 priority: should, confirmed aloud — valuable but a month's delay would not hurt._

## Feature list (capture format)

### F-01 — Booking slot jadwal real-time
- **Who uses it:** pemain (anak muda 20-35 yang main rutin, booking dari HP) — S1.q2
- **Happy path (click-by-click script):**
  1. Buka link aplikasi di HP (dari chat WhatsApp admin).
  2. Pilih lapangan: Lapangan A atau Lapangan B.
  3. Pilih tanggal di kalender (misal Sabtu).
  4. Lihat daftar jam: slot kosong berwarna hijau, slot terisi abu-abu.
  5. Tap slot hijau "19.00–20.00".
  6. Isi nama dan nomor HP.
  7. Tap "Booking".
  8. Muncul layar konfirmasi: nama, lapangan, tanggal, jam, status "Menunggu DP".
  9. Done: booking tercatat — slot itu langsung berubah abu-abu untuk pemain lain, dan di layar admin muncul booking baru.
- **Priority:** must (S4.q10, confirmed aloud)
- **When it goes wrong (what the user cares about):** dua orang ambil slot hampir bersamaan — yang sah duluan yang menang, jangan sampai dobol (D-004); internet lambat, tombol Booking tidak boleh membuat orang klik dua kali lalu dobel booking.

### F-02 — DP 30% + konfirmasi admin
- **Who uses it:** pemain yang sudah booking dan admin (pemilik) yang konfirmasi
- **Happy path (click-by-click script):**
  1. Setelah booking (F-01), halaman booking pemain menampilkan total sewa dan DP 30%-nya dalam rupiah.
  2. Pemain transfer DP ke nomor rekening yang tertera di halaman itu, dari m-banking.
  3. Pemain tap "Kirim Bukti Transfer", pilih foto bukti transfer, kirim.
  4. Di laptop, admin buka daftar "Menunggu Konfirmasi".
  5. Admin cek m-banking: duitnya masuk.
  6. Admin tap "Konfirmasi" pada booking itu.
  7. Status di HP pemain berubah jadi "DP Diterima"; booking di jadwal jadi terkonfirmasi penuh.
  8. Done: booking tercatat terkonfirmasi; laporan harian (F-04) ikut menghitung DP masuk.
- **Priority:** must (S4.q11, confirmed aloud)
- **v1 method (locked — D-011, loop-back L-01, S4.q14):** transfer manual ke rekening yang tertera + upload bukti transfer + tombol konfirmasi admin. **Tidak ada pembayaran online/gateway di v1** — pemain tidak pernah membayar di dalam aplikasi; v1 hanya mencatat DP dan status konfirmasinya. "Gateway otomatis" hanya nanti kalau ramai (Parked, lihat S7) dan berbiaya per-transaksi (R-1 riset). Wording "bayar DP 30% online" pada tugas hari pertama (S1.q9) dikoreksi lewat L-01 — jangan dibaca sebagai janji gateway.
- **When it goes wrong (what the user cares about):** bukti transfer buram atau nominal salah — admin bisa tolak dan minta kirim ulang; DP belum masuk sampai mendekati jadwal main — admin bisa hubungi pemain lewat nomor HP yang tercatat.

### F-03 — Kelola lapangan & jadwal (admin)
- **Who uses it:** admin (pemilik), dari laptop
- **Happy path (click-by-click script):**
  1. Admin buka aplikasi di laptop, login dengan username dan password.
  2. Buka menu "Lapangan".
  3. Pilih satu lapangan (Lapangan A), atur jam buka 08.00–23.00 dan harga sewa per jam.
  4. Blokir jam tertentu yang tidak bisa dipakai (misal Selasa 15.00–16.00 perawatan lampu).
  5. Tap "Simpan".
  6. Done: perubahan langsung tampil di sisi pemain — slot yang diblokir tidak bisa dipesan, slot yang dibuka bisa (F-01).
- **Priority:** must (S4.q12, confirmed aloud)
- **When it goes wrong (what the user cares about):** salah blokir jam — bisa dibuka lagi kapan saja; perubahan harus langsung kelihatan di pemain tanpa perlu apa-apa dari sisi pemain.

### F-04 — Laporan harian
- **Who uses it:** admin (pemilik), dari laptop
- **Happy path (click-by-click script):**
  1. Admin buka aplikasi di laptop, login.
  2. Buka menu "Laporan".
  3. Tanggal terisi otomatis hari ini (bisa diganti).
  4. Lihat ringkasan satu layar: jumlah booking, slot terpakai vs kosong, total DP sudah masuk (rupiah), dan daftar booking yang belum bayar DP — nama + nomor HP.
  5. Tap "Cetak" untuk menyimpan/mencetak rekap bila perlu.
  6. Done: rekap harian tanpa buku tulis — angkanya cocok dengan daftar booking, bukan perkiraan.
- **Priority:** should (S4.q13, confirmed aloud)
- **When it goes wrong (what the user cares about):** salah pilih tanggal — tinggal ganti; angka harus cocok dengan daftar booking yang sama (satu sumber data), bukan hitungan terpisah.

## Decisions this Section
- **D-016** Priorities confirmed aloud: F-01 must, F-02 must, F-03 must, F-04 should — the enough-protocol's complete-or-drop batch (the priority round never ran before the user said "cukup"); every priority spoken by the user, none inferred · status: user_confirmed
- **D-017** Empty-state behavior: the admin seeds the first data (courts, opening hours, prices) through F-03 before players use the app; a player who opens the app before seeding sees "Belum ada jadwal — hubungi admin" — designer_filled: nobody asks what person #1 sees on an empty screen (bank question 9 was cut by "cukup"; recorded proactively per principle 12), shown for correction, user accepted · status: designer_filled

## "Enough" protocol record
- User fired the control at S4.q9 after the fourth feature; capture stopped immediately, no "are you sure?".
- Scan: all four F-NN have complete click-by-click happy paths; none had a priority (the priority round had not run) → the final batch confirmed all four aloud (S4.q10–q13, batched 3+1 to respect the T1 batch cap — noted in the dogfood notes).
- Placeholder scan over name/who/priority/happy path: no "and whatever else", "etc.", or "dll" in any F-block.

## Exit criteria
- [x] The user explicitly said enough (the control, or the natural end of the capture loop). — evidence: S4.q9
- [x] Every captured F-NN has a complete click-by-click happy path and a priority. — evidence: F-01..F-04 above; priorities D-016 (S4.q10–q13)
- [x] No "and whatever else"/"etc." placeholders in the F-NN feature blocks (name, who, priority, happy path). — evidence: protocol scan recorded above

## Booster
pm-skills: installed (per state; simulated present in this dogfood run — Mom Test / user-story phrasing applied from the internal bank; see D1's notes on booster simulation)

## Loop-backs (re-opened from S6; section not re-run — targeted batches only)
- **L-01** (opened 2026-11-07 from S6, risk R-1 "DP expectation gap"): captured wording promised online payment (S1.q9, S3.q3) while D-011 locked manual-transfer-first. Targeted batch: **S4.q14** — user re-anchored v1 aloud: DP tercatat + upload bukti transfer + tombol konfirmasi admin itu cukup; gateway otomatis nanti. Resolution: F-02's v1-method line above is the locked behavior; S1.q9's "online" wording corrected in the S1 record. Closed same day.

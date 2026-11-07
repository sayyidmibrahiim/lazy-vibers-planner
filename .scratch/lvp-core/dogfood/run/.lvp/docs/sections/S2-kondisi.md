# S2 — Conditions

## Answers
- **S2.q1 HP dan komputer apa yang Anda dan calon pemakai ini bawa sehari-hari — iPhone atau Android, Windows atau Mac?** — Saya sendiri pakai laptop Windows dan HP Android. Untuk pemain, kebanyakan HP Android, tapi ada beberapa yang iPhone. Yang kelola cuma saya sendiri, dari laptop. · _EN: Devices: owner has a Windows laptop + Android phone; players are mostly Android with a few iPhones; single admin (the owner) on the laptop. No store accounts are needed either way (web-only platform, D-001)._
- **S2.q2 Apakah Anda sudah membayar apa pun yang berhubungan dengan ide ini — situs, server, nama domain, akun app-store?** — Belum ada. Belum ada website, belum pernah bayar hosting atau domain, nggak punya akun app-store. Selama ini semua masih WhatsApp dan buku tulis. · _EN: No existing subscriptions at all — no site, server, domain, or store account. Every deploy target and account must be created from zero._
- **S2.q3 Berapa paling banyak yang bisa Anda belanjakan untuk ini tiap bulan sebelum terasa berat?** — Maksimal Rp 100.000/bulan. Kalau lebih dari itu saya nggak sanggup. Sarana saya cuma laptop dan HP, belum punya domain. · _EN: Hard budget ceiling: Rp 100.000/month (≈ USD 6.5); resources are a laptop and a phone; no domain yet. This number is the filter S5 applies to every stack candidate._
- **S2.q4 Mau alamat sendiri seperti myidea.com, atau alamat gratis seperti myidea.vercel.app sudah cukup?** — Berapa kalau harus bayar? ... Kalau ada biaya tahunan segitu, pakai yang gratis dulu saja. Nanti kalau usahanya sudah jalan, baru saya pikirkan alamat sendiri. · _EN: After hearing the verified .com price (USD 12.08 first year on sale / USD 19.98 renewal), the user chose a free provider subdomain for v1; own domain deferred until the business runs (D-007)._
- **S2.q5 Kalau memperbaiki atau memperbarui ini berarti mengetik perintah di jendela hitam, oke tidak — atau pembaruan harusnya jalan sendiri?** — Nggak mau sama sekali. Saya nggak ngerti yang namanya perintah. Harusnya tinggal buka dan dipakai; pembaruan juga jalan sendiri. · _EN: Zero tolerance for the command line; updates must happen by themselves — this rules out any self-managed VPS and forces managed hosting (D-006)._
- **S2.q6 Lebih suka bayar sekali di muka, atau sedikit-sedikit tiap bulan?** — Bulanan kecil lebih enak, bisa berhenti kapan saja kalau nggak cocok. Bayar mahal sekali di depan berat buat saya. · _EN: Prefers small monthly payments that can be stopped anytime; large one-time up-front costs are unattractive — consistent with hosted subscriptions, against big prepaid commitments._
- **S2.q7 Adakah alasan data harus berada di negara tertentu — aturan kantor, aturan sekolah, atau hukum? Atau 'di tempat yang aman' saja sudah cukup?** — Nggak ada syarat negara. Yang penting datanya aman dan tidak hilang. · _EN: No data-residency requirement; "somewhere safe" is fine — hosting choice is driven by price/reliability, not jurisdiction (S3 may revisit the legal side)._
- **S2.q8 Berapa lama waktu yang bisa Anda luangkan tiap minggu untuk menjaga ini tetap hidup — hitungan menit, satu jam, atau lebih?** — Paling banter 1 jam seminggu. Kalau lagi ramai, bisa kurang dari itu. · _EN: Maintenance budget: at most ~1 hour/week, often less — near-zero time; combined with D-006 this makes managed hosting non-negotiable regardless of price (D-009)._
- **S2.q9 Alamat email mana yang harus menerima tagihan dan reset password untuk layanan-layanan ini?** — Email pribadi saya: budisantoso88@gmail.com. — (usulan: email khusus proyek lebih rapi dan tidak bercampur surat pribadi) — Oh boleh. Nanti saya bikin khusus: bookingfutsal.id@gmail.com, pakai itu saja. · _EN: After the dedicated-email suggestion, the owner will create and use a project-specific address (bookingfutsal.id@gmail.com) for all bills, resets, and account recovery — this goes into HANDOVER.md's keys-to-the-kingdom section._
- **S2.q10 Bisakah Anda bayar online dengan kartu dari bank Anda, dan bank itu di negara mana?** — Bisa. Kartu debit BCA, bank-nya di Indonesia. Kadang pakai GoPay juga, tapi untuk langganan biasanya pakai kartu. · _EN: Can pay online with an Indonesian BCA debit card; GoPay also available — S5 must check that chosen services accept Indonesian cards (regional availability)._

## Decisions this Section
- **D-005** Budget ceiling: maximum Rp 100.000/month (≈ USD 6.5); no existing subscriptions; laptop + Android phone only — User's own ceiling (S2.q3); the filter for S5 stack candidates · status: user_confirmed
- **D-006** Deploy target: managed hosting with automatic updates, zero commands to type — User refuses command-line work (S2.q5); fits the ceiling only on free/cheap managed tiers · status: user_confirmed
- **D-007** Free provider subdomain first; own .com deferred until the business runs — designer_filled per the S2 decision surface: chosen after the trade-off was surfaced (provider's name in the address, not portable later; .com renews yearly at USD 19.98 verified 2026-11-07 and dies if unpaid) · status: designer_filled
- **D-008** Backup duty: backups never happen by accident — provider-managed backups plus a simple scheduled export must be part of the stack choice — designer_filled: a non-technical owner with ~1 hr/week cannot be the backup plan · status: designer_filled
- **D-009** Maintenance reality: ~1 hour/week maximum; rented hosting goes dark when payment stops; updates must be automatic — designer_filled: the maintenance/who-updates reality is invisible to non-technical owners · status: designer_filled

## Prices quoted
| Item | Price quoted | Type | Source (accessed) | Verification |
|---|---|---|---|---|
| .com domain, Namecheap | USD 12.08/yr first year (sale price on 2026-11-07; regular USD 15.98; promo from USD 6.48 for new customers) | yearly | <https://www.namecheap.com/domains/registration/gtld/com/> (2026-11-07) | verified live; renewal USD 19.98/yr verified |
| Vercel Hobby | USD 0/month — **non-commercial use only** (FAQ: "Our Hobby plan is for personal, non-commercial use") | monthly | <https://vercel.com/pricing> (2026-11-07) | verified live; caveat surfaced for S5: a paid booking tool for a business is commercial |
| Vercel Pro | USD 20/month per developer seat | monthly | <https://vercel.com/pricing> (2026-11-07) | verified live; ≈ Rp 308.000 — over the D-005 ceiling |
| Supabase Free | USD 0 — 500 MB DB, 50k MAU, 1 GB files, 2 active projects; **paused after 1 week of inactivity** | monthly | <https://supabase.com/pricing> (2026-11-07) | verified live; the inactivity pause is a visible consequence for a booking system that must stay live |

Not quoted (not needed): Apple Developer USD 99/yr and Google Play USD 25 do not apply — platform is web-only (D-001, D-002); some players on iPhones use the browser, no store account is required.

## Exit criteria
- [x] Budget ceiling recorded (a number, or an explicit "nothing"). — evidence: S2.q3, D-005
- [x] Deployment surface and devices/accounts list recorded. — evidence: S2.q1, S2.q2, D-006, D-007
- [x] Every paid account the platform needs surfaced with a verified price and a recorded proceed/defer answer. — evidence: web-only platform needs no store account (see "Not quoted"); domain priced and deferred (D-007, Prices quoted); hosting free-tier caveats recorded above for S5

## Booster
None — the internal bank plus its cost fact-sheet is the S2 booster (per spec 02); fact-sheet rows re-verified live at S2 start (see Prices quoted).

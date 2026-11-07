# Disk-as-memory + adaptive model profiles

LVP harus bisa menyelesaikan pipeline penuh di model mana pun (1M-class API, open-weight 128–262k, lokal 32–128k), bukan hanya model frontier. Keputusan: (1) memori pipeline hidup di disk (`.lvp/`), context window diperlakukan sebagai workbench yang di-reload dari disk per Section/batch — bukan gudang; (2) pipeline mendeklarasikan **model profile** (T1/T2/T3, verified 2026-11-08: flash-tier API sekarang 1M juga; pemisah sejati adalah open-weight dan lokal) di bootstrap, dengan **capability probe** wajib untuk T2/T3 dan penolakan jujur bila gagal; (3) aturan perilaku per-tier (batch size, chunking research, append-chunks compilation, reload discipline) plus **context guard** dan **truncation self-recovery** (append-continue, jangan regenerate).

## Considered options

- Wajibkan model 1M saja: menyingkirkan model lokal/murah — melawan tujuan portabilitas; ditolak.
- Abaikan perbedaan model (pipeline tunggal seragam): model kecil gagal diam-diam atau output terpotong tanpa recovery; ditolak.
- Adaptif per-tier dengan gate eksplisit (dipilih): kualitas tidak pernah bohong — model yang tidak mampu ditolak di awal, bukan menghasilkan bundle buruk secara diam.

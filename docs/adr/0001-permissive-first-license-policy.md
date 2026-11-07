# License policy: permissive for content, NC allowed as runtime dependency

Katalog riset (docs/research/agent-skill-catalog.md, 2026-11-07) menemukan skill berkualitas dengan lisensi campuran, termasuk CC BY-NC-SA 4.0 (non-komersial). LVP untuk pribadi/open-source, kemungkinan berbayar di masa depan belum diputuskan.

Keputusan (diamend F0 grilling, 2026-11-08): skill berlisensi NC **boleh dipakai sebagai dependensi runtime Booster** — di-install otomatis, dipakai, dan dikreditkan — tetapi **tidak pernah di-vendor**: file di repo LVP tidak boleh memuat konten yang disalin atau diturunkan dari skill NC. Dengan begitu lisensi repo LVP tetap konsisten, dan komersialisasi nanti cukup mengganti dependensi, bukan membedah isi. Capability Registry wajib mencatat kolom `license`; dependensi NC ter-tag plus reminder komersial (mis. Product-Manager-Skills → pengganti Apache 2.0: product-on-purpose/pm-skills).

## Considered options

- Bebas menyalin konten NC ke repo: membuat lisensi repo kontradiktif (MIT memberi izin komersial atas isi yang NC) dan penghapusan nanti rawan terlewat — ditolak.
- Melarang semua NC: kualitas terbaik ada di NC — ditolak; model dependensi memberi akses tanpa kontaminasi.

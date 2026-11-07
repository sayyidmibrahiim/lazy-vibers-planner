# Conductor: booster di-load per Section, bukan sekaligus

`/lvp-init-new-idea` bertindak sebagai Conductor: booster hanya di-load saat Section yang membutuhkannya dimulai, ditutup saat Section selesai, dan setiap batas Section menghasilkan section record (`.lvp/docs/sections/SN-*.md`) plus state checkpoint. Alasan: konteks agent terbatas — memuat semua skill sekaligus meledakkan konteks sebelum interview dimulai. Routing table Section → booster ditetapkan di spec pipeline (F1) dan dipetakan ke output artefak tiap Section.

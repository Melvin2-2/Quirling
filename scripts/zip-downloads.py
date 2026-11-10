"""Packt alle PDFs aus public/downloads in quirling-nachweise.zip.
Nach dem Austausch eines Nachweises erneut ausführen: python3 scripts/zip-downloads.py"""
import pathlib, zipfile

d = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'downloads'
out = d / 'quirling-nachweise.zip'
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for pdf in sorted(d.glob('*.pdf')):
        z.write(pdf, pdf.name)
print(out, round(out.stat().st_size / 1024), 'KB')

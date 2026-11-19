const fs=require('fs'),path=require('path');const K=__dirname;
let s=fs.readFileSync(path.join(K,'shell.html'),'utf8');
const fonts=fs.readdirSync(path.join(K,'pub/site/_astro'));
const f=(re)=>fonts.find(x=>re.test(x));
s=s.replace('/*QCORE*/',fs.readFileSync(path.join(K,'qcore.js'),'utf8')).replace('{{PLEX}}',f(/^ibm-plex-sans-latin-wght/)).replace('{{PLEXEXT}}',f(/^ibm-plex-sans-latin-ext-wght/));
fs.writeFileSync(path.join(K,'pub/index.html'),s);console.log('ok',s.length);
fs.writeFileSync(path.join(K,'pub/_test.html'),'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0}[hidden]{display:none!important}</style></head><body>'+s+'</body></html>');

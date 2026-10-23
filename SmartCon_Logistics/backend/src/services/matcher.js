const profiles={
 amazon:{weights:{nf:150,pedido:35,cpf:120,cep:58,nome:64,rua:48,numero:22,cidade:10,bairro:10},minStrong:82,minComposite:108,margin:18},
 shopee:{weights:{nf:145,pedido:105,cpf:120,cep:52,nome:58,rua:42,numero:18,cidade:8,bairro:8},minStrong:80,minComposite:102,margin:16},
 tiktok:{weights:{nf:170,pedido:50,cpf:130,cep:48,nome:56,rua:40,numero:18,cidade:8,bairro:8},minStrong:95,minComposite:120,margin:22},
 mercadolivre:{weights:{nf:145,pedido:110,cpf:120,cep:52,nome:60,rua:44,numero:18,cidade:8,bairro:8},minStrong:82,minComposite:105,margin:18},
 magalu:{weights:{nf:150,pedido:95,cpf:130,cep:50,nome:58,rua:42,numero:18,cidade:8,bairro:8},minStrong:82,minComposite:105,margin:18},
 outros:{weights:{nf:155,pedido:75,cpf:130,cep:55,nome:62,rua:46,numero:20,cidade:8,bairro:8},minStrong:88,minComposite:112,margin:20}
};
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
const digits=s=>String(s||'').replace(/\D/g,'');
const toks=s=>[...new Set(norm(s).split(' ').filter(x=>x.length>=3&&!['DOS','DAS','DE','DA','DO','RUA','AVENIDA','AV'].includes(x)))];
function sim(a,b){const A=toks(a),B=new Set(toks(b));if(!A.length||!B.size)return 0;return Math.round(100*A.filter(x=>B.has(x)).length/Math.max(A.length,B.size));}
function eq(a,b){return !!a&&!!b&&norm(a)===norm(b)}
function pair(label,nota,platform='outros'){
 const p=profiles[platform]||profiles.outros,w=p.weights,l=label.campos||{},n=nota.campos||{};let score=0;const evidencias=[],conflitos=[];
 const nf=eq(l.numeroNF,n.numeroNF)||(l.numerosNF||[]).some(x=>(n.numerosNF||[]).includes(x)); if(nf){score+=w.nf;evidencias.push('NF exata')}
 const pedido=eq(l.pedido,n.pedido);if(pedido){score+=w.pedido;evidencias.push('pedido exato')}
 if(l.cpfCnpj&&n.cpfCnpj){if(digits(l.cpfCnpj)===digits(n.cpfCnpj)){score+=w.cpf;evidencias.push('CPF/CNPJ')}else{score-=220;conflitos.push('CPF/CNPJ divergente')}}
 if(l.cep&&n.cep){if(digits(l.cep)===digits(n.cep)){score+=w.cep;evidencias.push('CEP')}else{score-=55;conflitos.push('CEP divergente')}}
 const sn=sim(l.nome,n.nome);if(sn>=78){score+=w.nome;evidencias.push(`nome ${sn}%`)}else if(l.nome&&n.nome&&sn<35){score-=55;conflitos.push('nome divergente')}
 const sr=sim(l.rua,n.rua);if(sr>=70){score+=w.rua;evidencias.push(`rua ${sr}%`)}else if(l.rua&&n.rua&&sr<30){score-=35;conflitos.push('rua divergente')}
 if(l.numero&&n.numero&&digits(l.numero)===digits(n.numero)){score+=w.numero;evidencias.push('número')}
 const sc=sim(l.cidade,n.cidade);if(sc>=78){score+=w.cidade;evidencias.push('cidade')}
 const sb=sim(l.bairro,n.bairro);if(sb>=78){score+=w.bairro;evidencias.push('bairro')}
 const codes=(label.candidateCodes||[]).map(digits); const itemCodes=(nota.itens||[]).map(i=>digits(i.codigo)); if(codes.some(x=>x&&itemCodes.includes(x))){score+=12;evidencias.push('EAN como confirmação')}
 const strong=nf||evidencias.includes('CPF/CNPJ')||pedido; const composite=(evidencias.some(x=>x.startsWith('nome'))&&evidencias.includes('CEP'))||(evidencias.some(x=>x.startsWith('nome'))&&evidencias.some(x=>x.startsWith('rua')))||(evidencias.includes('CEP')&&evidencias.some(x=>x.startsWith('rua')));
 return {score,evidencias,conflitos,strong,composite};
}
function globalMatch(labels,notas,platform='outros',options={}){
 const p={...(profiles[platform]||profiles.outros),...options};const pairs=[];
 for(const l of labels)for(const n of notas)pairs.push({label:l,nota:n,...pair(l,n,platform)});
 const byL=new Map(),byN=new Map();for(const x of pairs){(byL.get(x.label.id)||byL.set(x.label.id,[]).get(x.label.id)).push(x);(byN.get(x.nota.id)||byN.set(x.nota.id,[]).get(x.nota.id)).push(x)}
 for(const a of byL.values())a.sort((x,y)=>y.score-x.score);for(const a of byN.values())a.sort((x,y)=>y.score-x.score);
 const matches=[],pending=[];const usedL=new Set(),usedN=new Set();
 const candidates=[];
 // V1028: para Camada Limpa/Entrega Rápida, um erro de OCR de 1 dígito na NF não pode
 // invalidar uma identidade de destinatário forte. CEP exato e único no lote + nome ou rua
 // compatível passa a ser um vínculo forte, mantendo bloqueio para CPF/nome conflitante.
 const cepCount=new Map();
 for(const n of notas){const c=digits(n.campos&&n.campos.cep);if(c)cepCount.set(c,(cepCount.get(c)||0)+1)}
 for(const l of labels){
   const r=byL.get(l.id)||[],best=r[0],second=r[1];if(!best)continue;
   const rn=byN.get(best.nota.id)||[];if(!rn[0]||rn[0].label.id!==l.id)continue;
   const ml=second?best.score-second.score:best.score;const mn=rn[1]?best.score-rn[1].score:best.score;
   const conflict=best.conflitos.some(c=>/CPF|nome divergente/.test(c));
   const min=best.strong?p.minStrong:p.minComposite;
   const lc=digits(l.campos&&l.campos.cep), nc=digits(best.nota.campos&&best.nota.campos.cep);
   const cepExatoUnico=!!lc&&lc===nc&&(cepCount.get(nc)===1);
   const nomeOk=best.evidencias.some(e=>/^nome /.test(e));
   const ruaOk=best.evidencias.some(e=>/^rua /.test(e));
   const identidadeUnicaPorCep=cepExatoUnico&&(nomeOk||ruaOk)&&best.score>=180&&!conflict;
   if(identidadeUnicaPorCep || (!conflict&&(best.strong||best.composite)&&best.score>=min&&ml>=p.margin&&mn>=p.margin))
     candidates.push({...best,ml,mn,identidadeUnicaPorCep});
 }
 candidates.sort((a,b)=>b.score-a.score);for(const c of candidates){if(usedL.has(c.label.id)||usedN.has(c.nota.id))continue;usedL.add(c.label.id);usedN.add(c.nota.id);matches.push({labelId:c.label.id,notaId:c.nota.id,score:c.score,evidencias:c.evidencias,conflitos:c.conflitos,margemEtiqueta:c.ml,margemNota:c.mn})}
 for(const l of labels)if(!usedL.has(l.id)){const r=byL.get(l.id)||[];const b=r[0];pending.push({labelId:l.id,motivo:b?`Pendente seguro: melhor candidata ${b.nota.id} com ${b.score} pontos; evidências: ${b.evidencias.join(', ')||'insuficientes'}.`:'Nenhuma DANFE candidata.'})}
 return {platform,matches,pending,stats:{labels:labels.length,notas:notas.length,matches:matches.length,pending:pending.length}};
}
module.exports={profiles,pair,globalMatch};

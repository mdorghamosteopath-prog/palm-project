export function buildCompatibility(a,b){
 const diff=a.scores.map((v,i)=>Math.abs(v-b.scores[i]));
 const similarity=Math.round(100-(diff.reduce((x,y)=>x+y,0)/3));
 const contrast=(a.profile.name!==b.profile.name?5:0);
 const score=Math.max(62,Math.min(97,Math.round(similarity*.72+24+contrast)));
 const strongest=['intuition','énergie sociale','adaptabilité'][diff.indexOf(Math.min(...diff))];
 const tension=['intuition','énergie sociale','adaptabilité'][diff.indexOf(Math.max(...diff))];
 const label=score>=92?'MATCH RARE':score>=86?'DUO MAGNÉTIQUE':score>=79?'CONNEXION NATURELLE':score>=71?'BELLE COMPLÉMENTARITÉ':'DUO CONTRASTÉ';
 const names=[a.profile.name.replace('THE ',''),b.profile.name.replace('THE ','')];
 return{score,label,strongest,tension,names,
 hook:score>=90?'Vous vous captez vite, parfois avant même d’avoir besoin de tout expliquer.':score>=80?'Vous avez assez de points communs pour vous comprendre et assez de différences pour vous surprendre.':'Votre connexion repose moins sur la ressemblance que sur la complémentarité.',
 chapters:[
  {title:'Votre vibe',text:`${names[0]} × ${names[1]} crée une dynamique ${score>=86?'très fluide':'contrastée mais stimulante'}. Votre zone d’accord la plus naturelle concerne ${strongest}. Vous pouvez avoir rapidement l’impression d’être sur la même longueur d’onde sur ce terrain.`},
  {title:'Pourquoi ça fonctionne',text:'Vos profils ne réagissent pas exactement de la même manière, et c’est justement utile. L’un peut apporter ce que l’autre mobilise moins spontanément. Cette complémentarité donne au duo davantage d’options lorsqu’une situation change.'},
  {title:'Le point de friction',text:`Votre plus grand écart apparaît autour de ${tension}. Dans certaines situations, ce qui paraît évident à l’un peut sembler excessif, trop lent ou insuffisant à l’autre. Le clash potentiel vient davantage du rythme que d’un désaccord profond.`},
  {title:'Qui influence qui ?',text:`${a.scores[1]>=b.scores[1]?names[0]:names[1]} tend à donner davantage le tempo social, tandis que ${a.scores[0]>=b.scores[0]?names[0]:names[1]} peut davantage influencer la lecture intuitive des situations. Les rôles peuvent évidemment s’inverser selon le contexte.`},
  {title:'Votre superpouvoir de duo',text:`Ensemble, votre force est de combiner ${a.profile.strength.toLowerCase()} et ${b.profile.strength.toLowerCase()}. Quand chacun utilise sa qualité sans essayer de transformer l’autre, le duo devient beaucoup plus fort que la simple addition de vos deux profils.`},
  {title:'Le conseil PALM',text:`Ne cherchez pas à être d’accord sur tout. Votre meilleur équilibre consiste à utiliser votre proximité en ${strongest} comme base commune et votre différence en ${tension} comme une seconde façon de regarder la même situation.`}
 ]};
}
export async function shareCompatibility(a,b,c){
 const text=`${c.label} • ${c.score}%\n${c.names[0]} × ${c.names[1]}\n${c.hook}\n\nScanne ta main sur PALM.`;
 if(navigator.share){try{await navigator.share({title:`PALM • ${c.score}%`,text,url:location.origin});return}catch(e){if(e?.name==='AbortError')return}}
 try{await navigator.clipboard.writeText(text+' '+location.origin);alert('Résultat copié — prêt à partager.')}catch{alert(text)}
}
function makeCard(c){
 const canvas=document.createElement('canvas');canvas.width=810;canvas.height=1013;const x=canvas.getContext('2d');
 x.fillStyle='#0b0b0c';x.fillRect(0,0,810,1013);x.strokeStyle='#343230';x.lineWidth=2;x.strokeRect(52,52,706,909);
 x.fillStyle='#aaa49b';x.font='600 19px Arial';x.fillText('PALM / COMPATIBILITY',82,105);
 x.fillStyle='#f3efe7';x.font='700 92px Arial';x.fillText(`${c.score}%`,82,250);
 x.fillStyle='#c9a66b';x.font='700 23px Arial';x.fillText(c.label,86,292);
 x.fillStyle='#f3efe7';x.font='700 38px Arial';x.fillText(c.names[0],82,405);x.fillText('×',82,457);x.fillText(c.names[1],82,509);
 x.fillStyle='#aaa49b';x.font='24px Arial';const words=c.hook.split(' ');let line='',y=610;for(const w of words){const test=line+w+' ';if(x.measureText(test).width>615){x.fillText(line,82,y);line=w+' ';y+=37}else line=test}x.fillText(line,82,y);
 x.fillStyle='#77736d';x.font='18px Arial';x.fillText('SCAN • COMPARE • SHARE',82,900);return canvas;
}
export async function downloadShareCard(a,b,c){
 const canvas=makeCard(c);
 const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.9));
 if(!blob)return;
 const file=new File([blob],`PALM-${c.score}-compatibility.jpg`,{type:'image/jpeg'});
 if(navigator.canShare?.({files:[file]})&&navigator.share){
  try{await navigator.share({files:[file],title:`PALM • ${c.score}%`});return}catch(e){if(e?.name==='AbortError')return}
 }
 const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=file.name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
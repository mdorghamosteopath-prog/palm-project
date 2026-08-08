import React,{useEffect,useMemo,useState}from'react';
import{Users,Heart,Camera,ChevronRight,ChevronLeft,SkipForward,Check,X,LockKeyhole,Sparkles}from'lucide-react';
import{buildCompatibility,shareCompatibility,downloadShareCard}from'./social.js';
const first=n=>n?.replace(/^Profil\s+/,'Ami ')||'Profil';
const DUO=[
['VÉRITÉ','Quelle est la première chose que tu as vraiment remarquée chez l’autre ?'],
['PRÉDICTION','Qui craquerait le premier après 24 h sans téléphone ?'],
['VÉRITÉ','Quel truc chez l’autre t’agace mais te ferait bizarre s’il disparaissait ?'],
['DÉFI','Regardez-vous 10 secondes sans rire. Le premier qui craque a perdu.'],
['CHOIX','Qui survivrait le mieux à un voyage improvisé sans aucun plan ?'],
['VÉRITÉ','Sur quoi l’autre te comprend mieux que la plupart des gens ?'],
['DÉFI','Imite une habitude de l’autre. Il ou elle doit deviner laquelle.'],
['PRÉDICTION','Qui est le plus susceptible d’envoyer un message puis de le regretter ?'],
['CHOIX','Qui prendrait la meilleure décision sous pression ?'],
['VÉRITÉ','Quel moment vécu ensemble te fait encore sourire immédiatement ?'],
['DÉFI','Fais un compliment précis que tu ne lui as jamais dit.'],
['PRÉDICTION','Qui serait le plus difficile à battre à un jeu de stratégie ?'],
['VÉRITÉ','Quelle qualité de l’autre est souvent sous-estimée ?'],
['CHOIX','Qui accepterait le plus facilement de tout recommencer dans une autre ville ?'],
['DÉFI','Décris l’autre en 3 mots. Il ou elle doit en valider au moins 2.'],
['PRÉDICTION','Qui serait le plus susceptible d’oublier un rendez-vous important ?'],
['VÉRITÉ','Qu’est-ce que tu aimerais que l’autre comprenne mieux sur toi ?'],
['CHOIX','Qui serait le plus à l’aise pour parler devant 500 personnes ?'],
['DÉFI','Inventez un nom de duo en moins de 15 secondes.'],
['VÉRITÉ','Quelle est la différence entre vous deux qui vous fait le plus de bien ?']
];
const GROUP=[
['VOTE SECRET','Qui dans le groupe serait le meilleur pour garder un énorme secret ?'],
['VOTE','Qui survivrait le plus longtemps dans une émission de télé-réalité ?'],
['ACTION','Tout le monde pointe la personne la plus susceptible de partir sur un coup de tête. 3… 2… 1…'],
['VÉRITÉ','Qui donne la meilleure première impression et qui change le plus quand on le connaît ?'],
['VOTE','Qui pourrait convaincre tout le groupe de faire une mauvaise idée ?'],
['ACTION','Chacun donne en un mot le superpouvoir social de la personne à sa droite.'],
['VOTE','Qui répondrait présent à 3 h du matin sans poser de question ?'],
['DÉBAT','Vous avez 20 secondes : qui serait le meilleur leader du groupe sur une île déserte ?'],
['VOTE','Qui serait le plus susceptible de devenir célèbre sans le chercher ?'],
['ACTION','Tout le monde vote en même temps pour la personne la plus imprévisible.'],
['VÉRITÉ','Qui a le plus changé depuis que vous le connaissez ?'],
['DÉBAT','Qui du groupe gagnerait une négociation difficile et pourquoi ?'],
['VOTE','Qui partirait le plus facilement vivre à l’étranger demain ?'],
['ACTION','Chacun donne une qualité au membre du groupe qu’il connaît le moins.'],
['VÉRITÉ','Quel duo du groupe semble le plus improbable mais fonctionne étonnamment bien ?'],
['VOTE','Qui serait le meilleur pour organiser un voyage pour tout le monde ?'],
['DÉBAT','Qui serait le pire colocataire du groupe ? Défendez votre choix.'],
['ACTION','Tout le monde pointe la personne la plus compétitive.'],
['VÉRITÉ','Qui du groupe cache le mieux ses émotions ?'],
['VOTE','Qui réussirait le mieux à faire rire tout le monde dans une situation tendue ?']
];
function shuffledIndices(n){const a=[...Array(n).keys()];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
export default function SocialHub({history,onScan,onOpen,onRename,onDelete,unlocked=false,onUnlock}){
 const[mode,setMode]=useState('hub'),[selected,setSelected]=useState([]),[saved,setSaved]=useState(()=>JSON.parse(localStorage.getItem('palm_social_history')||'[]')),[deck,setDeck]=useState([]),[deckPos,setDeckPos]=useState(-1),[gameKind,setGameKind]=useState(null);
 const toggle=id=>setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
 const people=history.filter(h=>selected.includes(h.id));
 const match=mode==='matchResult'&&people.length===2?buildCompatibility(people[0],people[1]):null;
 const group=useMemo(()=>{if(people.length<3)return null;const pairs=[];for(let i=0;i<people.length;i++)for(let j=i+1;j<people.length;j++)pairs.push({a:people[i],b:people[j],c:buildCompatibility(people[i],people[j])});pairs.sort((a,b)=>b.c.score-a.c.score);return{pairs,avg:Math.round(pairs.reduce((s,p)=>s+p.c.score,0)/pairs.length),leader:[...people].sort((a,b)=>b.scores[1]-a.scores[1])[0],connector:[...people].sort((a,b)=>b.scores[0]-a.scores[0])[0],wild:[...people].sort((a,b)=>b.scores[2]-a.scores[2])[0]}},[people]);
 const saveSocial=item=>setSaved(old=>{const key=item.type+':'+[...item.ids].sort().join('-');const exists=old.some(x=>x.key===key);const next=exists?old.map(x=>x.key===key?{...x,...item,key,updatedAt:Date.now()}:x):[{...item,key,createdAt:Date.now()},...old].slice(0,30);localStorage.setItem('palm_social_history',JSON.stringify(next));return next});
 useEffect(()=>{if(mode==='matchResult'&&match&&people.length===2)saveSocial({type:'match',ids:people.map(p=>p.id),score:match.score,label:match.label})},[mode,match?.score]);
 useEffect(()=>{if(mode==='groupResult'&&group&&people.length>=3)saveSocial({type:'group',ids:people.map(p=>p.id),score:group.avg,label:'GROUP VIBE'})},[mode,group?.avg]);
 const validSaved=saved.filter(s=>s.ids.every(id=>history.some(h=>h.id===id)));
 const openSaved=s=>{setSelected(s.ids);setMode(s.type==='match'?'matchResult':'groupResult')};
 const deleteSaved=(e,s)=>{e.stopPropagation();const next=saved.filter(x=>x.key!==s.key);setSaved(next);localStorage.setItem('palm_social_history',JSON.stringify(next))};
 const paywall=(title,copy)=><div className="socialPaywall"><LockKeyhole/><span>PALM UNLIMITED</span><h3>{title}</h3><p>{copy}</p><button className="primary" onClick={onUnlock}>DÉBLOQUER TOUT — 1,99 €</button><small>Paiement unique • accès illimité</small></div>;
 const startGame=(kind)=>{const list=kind==='duo'?DUO:GROUP;setGameKind(kind);setDeck(shuffledIndices(list.length));setDeckPos(0);setMode(kind==='duo'?'duoGame':'groupGame')};
 const currentList=gameKind==='duo'?DUO:GROUP;
 const currentCard=deckPos>=0&&deck.length?currentList[deck[deckPos]]:null;
 const nextCard=()=>{if(!deck.length)return;if(deckPos<deck.length-1)setDeckPos(deckPos+1);else{setDeck(shuffledIndices(currentList.length));setDeckPos(0)}};
 const prevCard=()=>{if(deckPos>0)setDeckPos(deckPos-1)};
 const game=(title,sub)=> <section><button className="backLink" onClick={()=>{setMode('hub');setGameKind(null);setDeck([]);setDeckPos(-1)}}>← Retour</button><div className="eyebrow"><Sparkles size={14}/> PALM PLAY</div><h2>{title}</h2><p>{sub}</p>{currentCard?<><div className="matchHero"><span>{currentCard[0]} • {deckPos+1}/{deck.length}</span><h2>{currentCard[1]}</h2></div><div className="gameNav"><button className="secondary" disabled={deckPos<=0} onClick={prevCard}><ChevronLeft/> Précédente</button><button className="secondary" onClick={nextCard}>Passer <SkipForward/></button></div></>:<div className="resultCard"><div className="rare">PRÊTS ?</div><h2 className="profile">20 cartes. Zéro répétition.</h2><p>Les cartes sont mélangées et chacune ne revient qu’après avoir parcouru tout le paquet.</p></div>}<button className="primary" onClick={nextCard}>{currentCard?'CARTE SUIVANTE':'LANCER LE JEU'} <ChevronRight/></button></section>;
 const picker=(title,sub,min,max,next)=><section><button className="backLink" onClick={()=>{setMode('hub');setSelected([])}}>← Retour</button><div className="eyebrow"><Users size={14}/> PALM SOCIAL</div><h2>{title}</h2><p>{sub}</p><div className="peoplePicker">{history.map(h=>{const active=selected.includes(h.id);return <button key={h.id} className={'personPick '+(active?'selected':'')} onClick={()=>{if(!active&&selected.length>=max)return;toggle(h.id)}}><div className="avatar">{(h.name||'P')[0].toUpperCase()}</div><div><b>{first(h.name)}</b><span>{h.profile.name}</span></div><i>{active?<Check size={16}/>:<span/>}</i></button>})}</div>{history.length<min&&<div className="emptySocial"><p>Il manque {min-history.length} profil{min-history.length>1?'s':''}.</p><button className="secondary" onClick={onScan}><Camera/> Scanner quelqu’un</button></div>}<button className="primary" disabled={selected.length<min} onClick={()=>setMode(next)}>{selected.length<min?`Choisis ${min} personne${min>1?'s':''}`:next==='matchResult'?'RÉVÉLER LE MATCH':'ANALYSER LE GROUPE'} <ChevronRight/></button></section>;
 if(mode==='duoGame')return unlocked?game('Duo Challenge','20 vérités, prédictions et mini-défis à faire à deux.'):<section><button className="backLink" onClick={()=>setMode('hub')}>← Retour</button>{paywall('Duo Challenge','20 cartes différentes pour prolonger chaque Match.')}</section>;
 if(mode==='groupGame')return unlocked?game('Group Game','20 cartes pour faire voter, débattre et réagir toute la bande.'):<section><button className="backLink" onClick={()=>setMode('hub')}>← Retour</button>{paywall('Group Game','20 cartes différentes pour toute la bande.')}</section>;
 if(mode==='match')return picker('Qui veux-tu matcher ?','Choisis 2 personnes. Le score est gratuit ; PALM Unlimited révèle toute la dynamique du duo.',2,2,'matchResult');
 if(mode==='group')return unlocked?picker('Qui est dans le groupe ?','Choisis de 3 à 6 personnes pour révéler les rôles, les affinités et la dynamique du groupe.',3,6,'groupResult'):<section><button className="backLink" onClick={()=>setMode('hub')}>← Retour</button>{paywall('Débloque le mode Groupe','Alchimie, rôles naturels et meilleurs duos de ta bande.')}</section>;
 if(mode==='matchResult'&&match)return <section className="socialReport"><button className="backLink" onClick={()=>setMode('hub')}>← Mes Matchs & Groupes</button><div className="eyebrow"><Heart size={14}/> VOTRE MATCH</div><div className="matchHero"><span>{match.label}</span><div className="compatScore">{match.score}%</div><h2>{first(people[0].name)} × {first(people[1].name)}</h2><p>{match.hook}</p></div>{unlocked?<><div className="matchChapters">{match.chapters.map((c,i)=><article key={c.title}><b>0{i+1}</b><div><h3>{c.title}</h3><p>{c.text}</p></div></article>)}</div><button className="primary" onClick={()=>startGame('duo')}>JOUER EN DUO <ChevronRight/></button><button className="secondary" onClick={()=>shareCompatibility(people[0],people[1],match)}>Partager le Match</button><button className="secondary" onClick={()=>downloadShareCard(people[0],people[1],match)}>Partager la carte</button></>:<><div className="lockedPreview"><div><LockKeyhole/><span>Pourquoi ça fonctionne</span></div><div><LockKeyhole/><span>Votre point de friction</span></div><div><LockKeyhole/><span>Votre superpouvoir de duo</span></div><div><LockKeyhole/><span>Duo Challenge</span></div></div>{paywall('Tu connais le score. Maintenant joue.','Rapport complet + Duo Challenge + Groupe + Group Game + scans illimités.')}</>}</section>;
 if(mode==='groupResult'&&group)return <section><button className="backLink" onClick={()=>setMode('hub')}>← Mes Matchs & Groupes</button><div className="eyebrow"><Users size={14}/> GROUP VIBE</div><h2>{people.map(p=>first(p.name)).join(' • ')}</h2><div className="groupScore"><span>ALCHIMIE DU GROUPE</span><strong>{group.avg}%</strong></div><div className="groupRoles"><div><span>⚡ DONNE LE TEMPO</span><b>{first(group.leader.name)}</b></div><div><span>🧲 CONNECTE LE GROUPE</span><b>{first(group.connector.name)}</b></div><div><span>✨ SURPREND LE PLUS</span><b>{first(group.wild.name)}</b></div></div><button className="primary" onClick={()=>startGame('group')}>LANCER LE GROUP GAME <ChevronRight/></button></section>;
 return <section><div className="eyebrow"><Users size={14}/> PALM SOCIAL</div><h2>Scanne. Matche. Joue.</h2><p>Tes profils, Matchs et Groupes restent enregistrés sur cet appareil : tu peux revenir les consulter sans rescanner.</p><div className="socialChoices"><button onClick={()=>{setSelected([]);setMode('match')}}><Heart/><div><b>Nouveau Match</b><span>Score gratuit</span><p>Choisis 2 profils déjà enregistrés.</p></div><ChevronRight/></button><button onClick={()=>{setSelected([]);setMode('group')}}><Users/><div><b>Nouveau Groupe {unlocked?'':'🔒'}</b><span>3 à 6 amis</span><p>Alchimie, rôles et meilleurs duos.</p></div><ChevronRight/></button><button onClick={()=>unlocked?startGame('duo'):setMode('duoGame')}><Sparkles/><div><b>Duo Challenge {unlocked?'':'🔒'}</b><span>20 cartes</span><p>Vérités, prédictions et défis.</p></div><ChevronRight/></button><button onClick={()=>unlocked?startGame('group'):setMode('groupGame')}><Sparkles/><div><b>Group Game {unlocked?'':'🔒'}</b><span>20 cartes</span><p>Votes, débats et actions.</p></div><ChevronRight/></button></div>{validSaved.length>0&&<div className="socialProfiles"><div className="socialProfilesHead"><b>Mes Matchs & Groupes</b><span>{validSaved.length}</span></div>{validSaved.map(s=>{const ps=s.ids.map(id=>history.find(h=>h.id===id)).filter(Boolean);return <div className="miniPerson" key={s.key}><button onClick={()=>openSaved(s)}><div className="avatar">{s.type==='match'?'♥':'G'}</div><div><b>{ps.map(p=>first(p.name)).join(' × ')}</b><span>{s.type==='match'?`${s.score}% • ${s.label}`:`Groupe • ${s.score}% d’alchimie`}</span></div></button><div><button className="dangerMini" onClick={e=>deleteSaved(e,s)}><X size={13}/></button></div></div>})}</div>}<div className="socialProfiles"><div className="socialProfilesHead"><b>Mes personnes</b><span>{history.length} profil{history.length!==1?'s':''}</span></div>{history.map(h=><div className="miniPerson" key={h.id}><button onClick={()=>onOpen(h)}><div className="avatar">{(h.name||'P')[0].toUpperCase()}</div><div><b>{first(h.name)}</b><span>{h.profile.name}</span></div></button><div><button onClick={()=>onRename(h)}>Nom</button><button className="dangerMini" onClick={()=>onDelete(h)}><X size={13}/></button></div></div>)}<button className="addPerson" onClick={onScan}><Camera size={17}/> Scanner une nouvelle main droite</button></div></section>;
}
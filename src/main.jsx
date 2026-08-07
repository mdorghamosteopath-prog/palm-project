import React,{useEffect,useMemo,useRef,useState} from 'react';
import{createRoot}from'react-dom/client';
import{Camera,ChevronRight,RotateCcw,Sparkles,Users,ScanLine,Share2}from'lucide-react';
import'./styles.css';

const ARCHETYPES=[
 {name:'THE EXPLORER',tag:'Libre • Curieux • Adaptable',intro:'Tu avances par curiosité. Les nouvelles idées, les personnes et les expériences inattendues alimentent ton énergie.',power:'Transformer l’inconnu en terrain de jeu.',strength:'Adaptation',growth:'Garder un cap quand la nouveauté retombe.'},
 {name:'THE STRATEGIST',tag:'Lucide • Calme • Visionnaire',intro:'Tu observes vite, relies les informations et cherches naturellement le meilleur angle avant d’agir.',power:'Voir les connexions avant les autres.',strength:'Vision',growth:'Agir avant d’avoir 100 % des réponses.'},
 {name:'THE CONNECTOR',tag:'Social • Intuitif • Magnétique',intro:'Tu captes rapidement les ambiances et les personnes. Tu sais créer du lien sans chercher à être au centre.',power:'Créer une connexion en quelques instants.',strength:'Empathie',growth:'Ne pas absorber toutes les émotions autour de toi.'},
 {name:'THE CREATOR',tag:'Original • Intuitif • Expressif',intro:'Ton esprit produit facilement des idées et des façons différentes de regarder les choses.',power:'Voir une possibilité là où les autres voient une limite.',strength:'Créativité',growth:'Finir une idée avant de partir sur la suivante.'},
 {name:'THE LEADER',tag:'Direct • Énergique • Décisif',intro:'Quand un groupe hésite, tu as tendance à créer du mouvement et à faire avancer les choses.',power:'Déclencher l’action quand les autres attendent.',strength:'Décision',growth:'Laisser de la place aux rythmes différents du tien.'},
 {name:'THE GUARDIAN',tag:'Fiable • Loyal • Protecteur',intro:'Tu accordes beaucoup de valeur à la confiance et aux personnes qui comptent vraiment.',power:'Créer un sentiment de sécurité autour de toi.',strength:'Loyauté',growth:'Oser te choisir toi aussi.'}
];
const steps=['Cartographie de la paume…','Détection des patterns…','Analyse des contrastes…','Construction de ton profil…'];
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function App(){
 const[file,setFile]=useState(null),[screen,setScreen]=useState('home'),[progress,setProgress]=useState(0),input=useRef();
 const profile=useMemo(()=>{if(!file)return ARCHETYPES[0];return ARCHETYPES[hash(file.name+file.size+file.lastModified)%ARCHETYPES.length]},[file]);
 const scores=useMemo(()=>{let n=file?hash(file.name+file.size):123;return[72+n%23,67+(n>>3)%28,70+(n>>6)%25]},[file]);
 const choose=e=>{let f=e.target.files?.[0];if(!f)return;setFile(f);setScreen('preview')};
 const start=()=>{setScreen('scan');setProgress(7)};
 useEffect(()=>{if(screen!=='scan')return;let t=setInterval(()=>setProgress(p=>Math.min(100,p+7)),220);return()=>clearInterval(t)},[screen]);
 useEffect(()=>{if(screen==='scan'&&progress>=100){let t=setTimeout(()=>setScreen('result'),450);return()=>clearTimeout(t)}},[progress,screen]);
 const img=file?URL.createObjectURL(file):null;
 return <main className="app">
  <header><div className="brand"><i></i>PALM</div><button className="ghost"><Users size={17}/></button></header>
  {screen==='home'&&<section className="hero"><div className="eyebrow"><Sparkles size={14}/> SOCIAL PERSONALITY SCAN</div><h1>Ta main.<br/><span>Ton profil.</span></h1><p>Scanne ta paume, découvre ton archétype et compare ton énergie avec tes amis.</p><div className="handOrb"><div className="palm">✋</div><div className="orbit o1"></div><div className="orbit o2"></div></div><button className="primary" onClick={()=>input.current.click()}><Camera size={20}/> SCANNER MA MAIN <ChevronRight/></button><small>1er scan gratuit • aucune inscription</small></section>}
  {screen==='preview'&&<section><div className="eyebrow">ÉTAPE 1/2</div><h2>Cadre ta paume</h2><p>Paume ouverte, doigts visibles, lumière homogène.</p><div className="camera"><img src={img}/><div className="handGuide">✋</div><span className="corner c1"></span><span className="corner c2"></span><span className="corner c3"></span><span className="corner c4"></span></div><button className="primary" onClick={start}><ScanLine/> ANALYSER MA MAIN</button><button className="secondary" onClick={()=>input.current.click()}><RotateCcw size={18}/> Reprendre</button></section>}
  {screen==='scan'&&<section><div className="eyebrow">PALM SCAN</div><h2>On lit ton empreinte…</h2><div className="camera scanning"><img src={img}/><div className="grid"></div><div className="scanline"></div><div className="target"></div></div><div className="progress"><b style={{width:progress+'%'}}></b></div><div className="status">{steps[Math.min(3,Math.floor(progress/26))]} <strong>{progress}%</strong></div></section>}
  {screen==='result'&&<section><div className="eyebrow"><Sparkles size={14}/> ARCHÉTYPE DÉTECTÉ</div><div className="resultCard"><div className="rare">✦ PALM IDENTITY</div><h2 className="profile">{profile.name}</h2><div className="tag">{profile.tag}</div><p>{profile.intro}</p>{['Intuition','Énergie sociale','Adaptabilité'].map((x,i)=><div className="metric" key={x}><div><span>{x}</span><strong>{scores[i]}%</strong></div><i><b style={{width:scores[i]+'%'}}></b></i></div>)}<div className="power"><span>⚡ SUPERPOUVOIR CACHÉ</span><b>{profile.power}</b></div><div className="locked"><div>⭐ Force naturelle <b>{profile.strength}</b></div><div>🌱 À développer <b>🔒</b></div><div>💫 Rapport complet <b>🔒</b></div><div>🤝 Compatibilités <b>🔒</b></div></div></div><button className="primary"><Sparkles/> TOUT DÉBLOQUER — 2,49 €</button><button className="secondary"><Share2 size={18}/> Partager mon profil</button><button className="textBtn" onClick={()=>{setFile(null);setProgress(0);setScreen('home')}}>Nouveau scan</button></section>}
  <input ref={input} type="file" accept="image/*" capture="environment" onChange={choose}/>
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);

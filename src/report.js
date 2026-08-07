import { jsPDF } from 'jspdf';

const variations={
  THE_EXPLORER:{
    essence:"Tu fonctionnes mieux lorsque tu as la sensation d'avancer, de découvrir et de garder une marge de liberté. Ton énergie augmente face à la nouveauté, surtout lorsqu'elle te permet d'apprendre par l'expérience.",
    social:"Tu peux être très présent dans un groupe sans chercher à contrôler l'ambiance. Tu apportes souvent de l'élan, des idées et une capacité à dédramatiser.",
    decisions:"Tu décides vite quand quelque chose éveille ta curiosité. Ton risque n'est pas l'indécision, mais la dispersion : une nouvelle piste peut parfois remplacer trop tôt la précédente.",
    hidden:"Ta force cachée est ta capacité à retrouver des options lorsque les autres pensent être bloqués. Tu changes d'angle naturellement et tu t'adaptes vite.",
    challenge:"Ton principal levier de progression consiste à transformer ta curiosité en continuité. Une structure légère te permet de conserver ta liberté sans perdre ton cap.",
    relation:"Tu t'entends particulièrement bien avec les personnes capables de te laisser respirer tout en donnant de la stabilité à tes idées. Les profils trop rigides peuvent te fatiguer, mais aussi t'apporter un cadre utile.",
    growth:"Choisis un projet important et impose-toi une règle simple : terminer une étape avant d'ouvrir une nouvelle piste. Ton potentiel augmente fortement lorsque ton énergie d'exploration rencontre de la constance."
  },
  THE_STRATEGIST:{
    essence:"Tu as tendance à observer avant d'agir. Tu repères rapidement les incohérences, les liens entre plusieurs informations et les conséquences possibles d'une décision.",
    social:"Tu n'as pas besoin d'occuper tout l'espace pour influencer un groupe. Ta valeur apparaît souvent dans la qualité de tes observations et dans ta capacité à remettre de l'ordre dans une situation confuse.",
    decisions:"Tu préfères comprendre la logique d'un problème avant de choisir. Cette qualité devient un frein seulement lorsque tu attends une certitude qui n'existera jamais.",
    hidden:"Ta force cachée est l'anticipation. Tu peux percevoir les effets secondaires d'une décision avant qu'ils deviennent évidents pour les autres.",
    challenge:"Ton axe de progression consiste à faire davantage confiance aux décisions suffisamment bonnes. Dans certaines situations, 80 % d'information produit un meilleur résultat qu'une analyse parfaite trop tardive.",
    relation:"Tu apprécies les personnes cohérentes, autonomes et capables d'échanger avec profondeur. Les profils plus spontanés peuvent parfois te déstabiliser mais aussi t'aider à sortir de la suranalyse.",
    growth:"Lorsque tu identifies une bonne direction, fixe immédiatement la plus petite action possible. Ton potentiel se libère quand ta capacité d'analyse devient un moteur d'exécution."
  },
  THE_CONNECTOR:{
    essence:"Tu lis facilement les dynamiques humaines. Ton attention va naturellement vers ce que les gens ressentent, ce qui rapproche et ce qui crée de la distance.",
    social:"Tu peux créer rapidement un sentiment de proximité. Les autres ont souvent l'impression que tu comprends leur humeur ou leur intention sans qu'ils aient besoin de tout expliquer.",
    decisions:"Tu intègres beaucoup l'impact humain dans tes choix. Cela te rend diplomate, mais peut parfois t'amener à privilégier l'équilibre du groupe au détriment de ton propre besoin.",
    hidden:"Ta force cachée est la création de confiance. Tu peux rapprocher des personnes très différentes et rendre une interaction plus fluide presque sans effort apparent.",
    challenge:"Ton principal levier est de distinguer empathie et responsabilité. Comprendre les émotions des autres ne signifie pas devoir les porter.",
    relation:"Tu fonctionnes particulièrement bien avec des personnes sincères et émotionnellement lisibles. Les profils très fermés peuvent stimuler ta curiosité mais aussi consommer beaucoup d'énergie.",
    growth:"Avant de chercher la meilleure réponse pour tout le monde, demande-toi ce que tu voudrais réellement si personne n'était déçu. Cette question renforce ta propre direction."
  },
  THE_CREATOR:{
    essence:"Tu combines facilement des idées qui semblent éloignées. Ton esprit recherche l'originalité, les possibilités et les façons différentes de faire quelque chose.",
    social:"Tu peux apporter une identité forte à un groupe par tes idées, ton humour, ton esthétique ou ta façon inhabituelle d'aborder les situations.",
    decisions:"Tu choisis souvent sur la base d'une intuition globale. Tu sais rapidement si une idée t'attire, même lorsque tu n'as pas encore les mots pour l'expliquer.",
    hidden:"Ta force cachée est la recombinaison : tu peux prendre plusieurs éléments ordinaires et en faire quelque chose de nouveau.",
    challenge:"Ton principal défi est l'achèvement. Une idée devient réellement puissante lorsqu'elle survit à la phase moins excitante de finition et de répétition.",
    relation:"Tu apprécies les personnes ouvertes, curieuses et capables de ne pas juger trop vite. Les profils structurés peuvent devenir de très bons compléments s'ils respectent ton besoin d'expression.",
    growth:"Réduis volontairement le nombre de projets ouverts. Ton potentiel augmente lorsque ton imagination dispose d'assez de temps pour produire quelque chose de terminé et partageable."
  },
  THE_LEADER:{
    essence:"Tu as une tendance naturelle à créer du mouvement. Lorsque les autres hésitent, tu peux ressentir l'envie de décider, organiser ou lancer l'action.",
    social:"Ta présence est généralement visible. Même sans parler beaucoup, ton énergie peut donner une direction au groupe ou accélérer une décision.",
    decisions:"Tu privilégies souvent l'action et l'efficacité. Cette capacité est précieuse dans l'incertitude, à condition de conserver suffisamment d'écoute avant d'accélérer.",
    hidden:"Ta force cachée est l'effet d'entraînement. Lorsque tu crois réellement à une direction, ton niveau d'engagement peut augmenter celui des personnes autour de toi.",
    challenge:"Ton axe de progression est la flexibilité relationnelle. Une bonne décision n'est pas seulement celle qui avance vite : c'est aussi celle que les autres peuvent réellement suivre.",
    relation:"Tu fonctionnes bien avec des personnes autonomes qui ne dépendent pas constamment de toi. Les profils très prudents peuvent t'agacer mais aussi t'aider à repérer des risques que tu aurais négligés.",
    growth:"Avant une décision importante, demande au moins un avis contraire au tien. Ton leadership devient plus robuste lorsque ta vitesse s'appuie sur une lecture plus large de la situation."
  },
  THE_GUARDIAN:{
    essence:"Tu accordes beaucoup d'importance à la fiabilité, la confiance et la continuité. Tu es souvent plus constant que spectaculaire, et c'est précisément ce qui fait ta valeur.",
    social:"Les personnes proches peuvent facilement compter sur toi. Tu remarques les détails qui permettent aux autres de se sentir pris en considération.",
    decisions:"Tu préfères généralement les choix dont les conséquences sont compréhensibles et maîtrisables. Tu peux accepter le changement, mais tu veux savoir ce qu'il protège ou améliore réellement.",
    hidden:"Ta force cachée est l'endurance relationnelle. Tu peux maintenir une présence et un engagement là où d'autres se lassent rapidement.",
    challenge:"Ton principal axe de progression consiste à ne pas confondre loyauté et renoncement. Préserver les autres ne doit pas systématiquement passer avant toi.",
    relation:"Tu apprécies les personnes stables et sincères. Les profils plus imprévisibles peuvent t'attirer par leur énergie, mais demandent des limites claires pour ne pas épuiser ton besoin de sécurité.",
    growth:"Identifie une situation dans laquelle tu dis oui par habitude. Exerce-toi à répondre selon ton envie réelle. Ta stabilité devient encore plus forte lorsqu'elle repose sur un choix et non sur une obligation."
  }
};

function keyOf(name){return name.replaceAll(' ','_')}
export function buildLongReport(current){
 const p=current.profile,v=variations[keyOf(p.name)]||variations.THE_EXPLORER;
 const [a,b,c]=current.scores;
 return [
  {n:'01',title:'Ton identité dominante',subtitle:p.name,text:`${v.essence} Ton profil PALM ressort ici avec une dominante ${p.tag.toLowerCase()}. Ce résultat ne signifie pas que tu agis toujours de la même façon : il décrit plutôt la stratégie que tu sembles privilégier spontanément.`},
  {n:'02',title:'Tes trois dimensions fortes',subtitle:`Intuition ${a}% • Énergie sociale ${b}% • Adaptabilité ${c}%`,text:`Ton score d'intuition suggère une tendance à capter rapidement une impression globale avant de tout analyser consciemment. Ton énergie sociale décrit la facilité avec laquelle tu engages ou influences une interaction. Ton adaptabilité mesure la place que prend chez toi la capacité à modifier rapidement ta stratégie lorsqu'un contexte change.`},
  {n:'03',title:'Ta force naturelle',subtitle:p.strength,text:`${v.hidden} C'est probablement l'une des qualités que les autres peuvent remarquer chez toi avant même que tu la considères comme exceptionnelle, précisément parce qu'elle te paraît naturelle.`},
  {n:'04',title:'Ton fonctionnement avec les autres',subtitle:'Ta dynamique sociale',text:v.social},
  {n:'05',title:'Ta manière de décider',subtitle:'Décision & intuition',text:v.decisions},
  {n:'06',title:'Ton superpouvoir caché',subtitle:p.power,text:`${v.hidden} Lorsque cette capacité est bien utilisée, elle devient un vrai avantage. Le piège serait simplement d'en abuser au point d'oublier que toutes les situations ne demandent pas ta stratégie favorite.`},
  {n:'07',title:'Ta zone de progression',subtitle:p.growth,text:`${v.challenge} L'objectif n'est donc pas de changer ta personnalité, mais d'ajouter une option supplémentaire à ta manière habituelle de fonctionner.`},
  {n:'08',title:'Relations & compatibilité',subtitle:'Ce qui te nourrit dans un duo',text:v.relation},
  {n:'09',title:'Ton potentiel à développer',subtitle:p.potential,text:v.growth},
  {n:'10',title:'Ta synthèse PALM',subtitle:'La phrase à retenir',text:`« ${p.quote} » Cette phrase résume bien ton profil : utilise ce que tu fais naturellement bien, sans laisser cette force devenir ton unique manière de réagir.`}
 ];
}

export function downloadPalmPDF(current){
 const report=buildLongReport(current),doc=new jsPDF({unit:'mm',format:'a4'});let y=22;
 const addPage=()=>{doc.addPage();y=22};
 doc.setFillColor(12,12,14);doc.rect(0,0,210,297,'F');doc.setTextColor(245,242,235);doc.setFont('helvetica','bold');doc.setFontSize(11);doc.text('PALM / PERSONAL PROFILE',18,22);doc.setFontSize(30);doc.text(current.profile.name,18,48);doc.setFont('helvetica','normal');doc.setFontSize(12);doc.setTextColor(174,170,163);doc.text(current.profile.tag,18,58);doc.setDrawColor(80,78,72);doc.line(18,69,192,69);doc.setTextColor(230,226,218);doc.setFontSize(13);const intro=doc.splitTextToSize(current.profile.intro,166);doc.text(intro,18,84);doc.setFontSize(10);doc.setTextColor(130,128,123);doc.text('Lecture ludique et introspective — ce rapport ne constitue pas une évaluation scientifique.',18,274);doc.addPage();y=22;
 report.forEach(s=>{const lines=doc.splitTextToSize(s.text,166),need=28+lines.length*5;if(y+need>275)addPage();doc.setTextColor(135,132,125);doc.setFont('helvetica','bold');doc.setFontSize(9);doc.text(s.n,18,y);doc.setTextColor(25,25,28);doc.setFontSize(17);doc.text(s.title,30,y);y+=9;doc.setTextColor(95,92,88);doc.setFontSize(10);doc.text(s.subtitle,30,y);y+=8;doc.setTextColor(45,44,42);doc.setFont('helvetica','normal');doc.setFontSize(10.5);doc.text(lines,30,y);y+=lines.length*5+12;});
 const pages=doc.getNumberOfPages();for(let i=2;i<=pages;i++){doc.setPage(i);doc.setFontSize(8);doc.setTextColor(150,147,141);doc.text(`PALM • ${current.profile.name}`,18,287);doc.text(`${i}/${pages}`,188,287,{align:'right'})}
 doc.save(`PALM-${current.profile.name.replaceAll(' ','-')}.pdf`);
}

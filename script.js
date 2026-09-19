const questions=[
  ["¿Cuál es el nombre del último nivel de Bowser en Super Mario 64?",["Bowser in the Sky","Bowser in the Dark World","Bowser in the Fire Sea"],0,"Bowser in the Sky es el tercer y último nivel de Bowser."],
  ["¿Cuáles son los dos niveles en los que aparece Koopa the Quick?",["Bob-omb Battlefield y Whomp's Fortress","Bob-omb Battlefield y Tiny-Huge Island","Cool, Cool Mountain y Wet-Dry World"],1,"Koopa the Quick reta a Mario en Bob-omb Battlefield y Tiny-Huge Island."],
  ["¿Qué nivel es este?",["Hazy Maze Cave","Rainbow Ride","Lethal Lava Land"],2,"Es Lethal Lava Land, el nivel de lava ubicado en el sótano del castillo.","images.jpeg","Escenario de lava de Super Mario 64"],
  ["¿Cuántas estrellas de poder hay en total en Super Mario 64?",["100 estrellas","120 estrellas","150 estrellas"],1,"El juego contiene un total de 120 estrellas de poder."],
  ["¿Qué gorra permite que Mario atraviese rejas y paredes especiales?",["La gorra metálica","La gorra alada","La gorra invisible"],2,"La gorra invisible permite atravesar ciertas barreras."],
  ["¿Cuántas estrellas se necesitan para abrir la puerta que lleva al último Bowser sin usar glitches?",["50 estrellas","70 estrellas","80 estrellas"],1,"La puerta final requiere 70 estrellas."],
  ["¿Qué determina el nivel inicial del agua al entrar a Wet-Dry World?",["La cantidad de estrellas obtenidas","La altura a la que Mario entra en el cuadro","El tiempo que se tarda en saltar al cuadro"],1,"Cuanto más alto entra Mario en el cuadro, más alto comienza el agua."],
  ["¿Con cuántas estrellas aparece MIPS por primera vez en el sótano?",["15 estrellas","20 estrellas","30 estrellas"],0,"MIPS aparece por primera vez al conseguir 15 estrellas."],
  ["¿Qué ocurre con los mecanismos de Tick Tock Clock si entras cuando la manecilla marca las 12?",["Se mueven muy rápido","Cambian de dirección","Se quedan detenidos"],2,"Al entrar a las 12, las plataformas y mecanismos se detienen."],
  ["¿Qué debes hacer para que el cuadro de Dire, Dire Docks se aleje y deje libre el pasillo?",["Conseguir la primera estrella de Dire, Dire Docks","Derrotar a Bowser in the Fire Sea","Encontrar las ocho monedas rojas del sótano"],0,"Al conseguir la primera estrella de Dire, Dire Docks, el cuadro retrocede."]
];

const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const ui={
  hand:$("#mario-hand"),counter:$("#question-counter"),score:$("#score-counter"),bar:$("#progress-bar"),
  title:$("#question-title"),imgBox:$("#question-image-container"),img:$("#question-image"),answers:$("#answers"),
  feedback:$("#feedback"),check:$("#check-button"),next:$("#next-button"),nextLabel:$("#next-label"),
  quiz:$("#quiz-content"),result:$("#result"),resultTitle:$("#result-title"),resultScore:$("#result-score"),
  resultMessage:$("#result-message"),resultIcon:$("#result-icon"),restart:$("#restart-button")
};
let q=0,score=0,selected=null,checked=false;

function render(){
  const [question,answers,,,image,imageAlt]=questions[q]; selected=null; checked=false;
  ui.counter.textContent=`Pregunta ${q+1} de ${questions.length}`; ui.score.textContent=`Puntaje: ${score}`;
  ui.bar.style.width=`${(q+1)/questions.length*100}%`; ui.title.textContent=question;
  ui.feedback.textContent=""; ui.feedback.className="feedback"; ui.check.disabled=true; ui.check.hidden=false; ui.next.hidden=true;
  ui.nextLabel.textContent=q===questions.length-1?"RESULT":"NEXT";
  ui.imgBox.hidden=!image; if(image){ui.img.src=image;ui.img.alt=imageAlt||""}
  ui.answers.innerHTML="";
  answers.forEach((text,i)=>{
    const el=document.createElement("label"); el.className="answer";
    el.innerHTML=`<input type="radio" name="answer" value="${i}"><span class="file-pic" aria-hidden="true"></span><span class="file-copy"><small class="slot">ANSWER ${String.fromCharCode(65+i)}</small><strong class="choice">${text}</strong></span>`;
    el.querySelector("input").addEventListener("change",()=>select(i,el)); ui.answers.append(el);
  });
}

function select(i,el){
  if(checked)return; selected=i; $$(".answer").forEach(x=>x.classList.remove("selected")); el.classList.add("selected"); ui.check.disabled=false;
}

function check(){
  if(selected===null||checked)return; checked=true;
  const item=questions[q], options=$$(".answer"); options.forEach((el,i)=>{el.classList.add("locked");el.querySelector("input").disabled=true;if(i===item[2])el.classList.add("correct")});
  const ok=selected===item[2]; if(ok)score++; else options[selected].classList.add("incorrect");
  ui.feedback.textContent=`${ok?"¡Correcto!":"Respuesta incorrecta."} ${item[3]}`; ui.feedback.classList.add(ok?"feedback--correct":"feedback--incorrect");
  ui.score.textContent=`Puntaje: ${score}`; ui.check.hidden=true; ui.next.hidden=false;
}

function next(){ if(++q<questions.length){render();ui.title.focus({preventScroll:true})}else showResult() }
function showResult(){
  ui.quiz.hidden=true;ui.result.hidden=false;ui.counter.textContent="Quiz completado";ui.score.textContent=`Puntaje: ${score}`;ui.bar.style.width="100%";ui.resultScore.textContent=`${score} / ${questions.length}`;
  const msg=score===10?["10/10","Sal a tocar pasto.","★"]:score>=8?[`${score}/10`,"Sí le sabes.","★"]:score>=5?[`${score}/10`,"Tienes idea.","★"]:score===4?["4/10","Te faltó una estrella para tener idea.","?"]:[`${score}/10`,"Mejor ves a jugar Furry Love.","?"];
  [ui.resultTitle.textContent,ui.resultMessage.textContent,ui.resultIcon.textContent]=msg;
}
function restart(){q=0;score=0;ui.result.hidden=true;ui.quiz.hidden=false;render()}

ui.check.addEventListener("click",check);ui.next.addEventListener("click",next);ui.restart.addEventListener("click",restart);
document.addEventListener("pointermove",e=>{ui.hand.style.transform=`translate3d(${e.clientX-33}px,${e.clientY}px,0)`;ui.hand.classList.add("visible")});
document.addEventListener("pointerdown",()=>{if(matchMedia("(pointer:fine)").matches)ui.hand.src="mario-hand-closed.png"});
document.addEventListener("pointerup",()=>ui.hand.src="mario-hand.png");document.addEventListener("pointerleave",()=>ui.hand.classList.remove("visible"));
render();

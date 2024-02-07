import * as fileload from "./fileLoad.min.js";


let load_button =document.getElementById('load_button');
let save_button =document.getElementById('save_button');
let search_input = document.getElementById('search_input');
let name_hero_input = document.getElementById("name_hero_input");
let unit_hero_input = document.getElementById("unit_hero_input");
let class_hero_input = document.getElementById("class_hero_input");
let canvas_skilltree=document.getElementById('canvas_skilltree');
let rect_canvas=[];
let joins_canvas=[];
let width_rect;
let height_rect;
let lastSelectedRectIndex;


let csvskill=undefined;
let modSkills=undefined;
let modHeroes=undefined;
let coloraltLastLi=undefined;
let coloraltLastLiHero=undefined;
let currentHero=-1;
let dlc_check=true;


load_button.onclick = function() {
  if(load_button.disabled){
    return;
  }

  var mod_files=document.getElementById('input_mod').files;

  document.getElementById('input_mod').value = null;
  document.getElementById('dlc_checkbox').disabled=true;
  load_button.disabled=true;
  console.log(mod_files);

  loadMod(mod_files);
}
document.getElementById('dlc_checkbox').onclick = function() {
  if(document.getElementById('dlc_checkbox').disabled){
    return;
  }
  dlc_check=document.getElementById('dlc_checkbox').checked;
}


save_button.onclick = function() {
  if(save_button.disabled){
    return;
  }
  if(currentHero==-1){
    return;
  }
  save_button.disabled=true;
  fileload.saveHero(modHeroes[currentHero]);
  save_button.disabled=false;
}




search_input.onkeyup= function(){
  if(!csvskill){
    return;
  }
  // Declare variables
  var filter, ul, li, a, i, txtValue;
  filter = search_input.value.toUpperCase();
  ul = document.getElementById("skills_list");
  li = ul.getElementsByTagName('li');


  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    // a = li[i].getElementsByTagName("a")[0];
    // txtValue = a.textContent || a.innerText;
    if (csvskill[i][0].indexOf(filter) > -1 || csvskill[i][1].indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
name_hero_input.oninput= function(){
  if(currentHero==-1){
    return;
  }
  modHeroes[currentHero]["Name"]=name_hero_input.value;
}
unit_hero_input.oninput= function(){
  if(currentHero==-1){
    return;
  }
  modHeroes[currentHero]["Unit"]=unit_hero_input.value;
}
class_hero_input.oninput= function(){
  if(currentHero==-1){
    return;
  }
  if(class_hero_input.value.trim().length==0){
    modHeroes[currentHero]["Class"]=undefined;
  }
  else{
    modHeroes[currentHero]["Class"]=class_hero_input.value;
  }


}


function onClickSkill(){
  // console.log(event.target);
  // console.log(csvskill);

  let skill_description = document.getElementById("skill_description");
  skill_description.innerText=csvskill[event.target.value][2];
  if(coloraltLastLi){
    coloraltLastLi.classList.remove("bluskill");
    coloraltLastLi.classList.add("grayskill");
  }
  coloraltLastLi=event.target;
  coloraltLastLi.classList.add("bluskill");
  coloraltLastLi.classList.remove("grayskill");


  if(lastSelectedRectIndex>=0){
    if(currentHero<0){
      test_skilltree[lastSelectedRectIndex]=csvskill[event.target.value][3];

    }
    else{
      modHeroes[currentHero]["Skills"][lastSelectedRectIndex]=csvskill[event.target.value][3];
    }
    for(let j=0;j<rect_canvas.length;j++){
      rect_canvas[j][2]=0;
    }
    let foundone=false;

    for(let j=0;j<rect_canvas.length;j++){
      let skill;
      if(currentHero<0){
        skill=test_skilltree[j];
      }
      else{
        skill=  modHeroes[currentHero]["Skills"][j];
      }
      for(let k=0;k<rect_canvas.length;k++){
        if(j==k){
          continue;
        }
        let otherskill;

        if(currentHero<0){
          otherskill=test_skilltree[k];
        }
        else{
          otherskill=  modHeroes[currentHero]["Skills"][k];
        }
        // console.log(skill+" "+otherskill)
        if(skill==otherskill){
          rect_canvas[k][2]=2;
          foundone=true;
        }
      }
    }
    if(foundone){
      rect_canvas[lastSelectedRectIndex][2]=3;
    }
    else{
      rect_canvas[lastSelectedRectIndex][2]=1;
    }


    reDrawCanvas();
  }
}
function setHero(lielement){
  if(coloraltLastLiHero){
    coloraltLastLiHero.classList.remove("bluskill");
    coloraltLastLiHero.classList.add("grayskill");
  }
  coloraltLastLiHero=lielement;
  coloraltLastLiHero.classList.add("bluskill");
  coloraltLastLiHero.classList.remove("grayskill");



  document.getElementById("filename_text").innerText=modHeroes[currentHero]["Filename"];

  name_hero_input.value=modHeroes[currentHero]["Name"];
  unit_hero_input.value=modHeroes[currentHero]["Unit"];


  if(modHeroes[currentHero]["Class"] && modHeroes[currentHero]["Class"].trim().length>0){
    class_hero_input.value=modHeroes[currentHero]["Class"];
  }
  else{
    class_hero_input.value="";
  }
  reDrawCanvas();
}

function onClickHero(){
  currentHero=event.target.value;
  setHero(event.target);

}

//Will load mod, then skills, then heroes, then the csv, AND FINALLY, will begin the code.
function loadMod(mod_files){
  // console.log(mod_files);
  load_button.disabled=false;
  let dictSkillTree=fileload.getAllTypeForSkillTree(mod_files);
  fileload.loadSkills(dictSkillTree,post_LoadSkill);
}
function post_LoadSkill(dictSkillTree,skillsarr){
  modSkills=skillsarr;
  fileload.loadHero(dictSkillTree,post_LoadHeroes);
}
function post_LoadHeroes(dictSkillTree,heroessarr){
  modHeroes=heroessarr;
  loadCSV(post_loadCSV);
}

function loadCSV(func){

  if(csvskill){
    func();
    return;
  }
  var http = new XMLHttpRequest();
  coloraltLastLi=undefined;
  var url="/data/Skills.csv";
  if(dlc_check){
     url="/data/Skills_dlc.csv";
  }
  http.open('GET', url, true);
  http.responseType = 'text';
  var skills_list =document.getElementById('skills_list');
  skills_list.innerText="";
  csvskill=[];
  var inc=0;
  for(let i=0;i<modSkills.length;i++){
    var newli=document.createElement("li");
    newli.innerText=modSkills[i]["Skill Name"];
    newli.value=""+inc;
    newli.classList.add("grayskill");
    newli.onclick=onClickSkill;
    skills_list.appendChild(newli);
    csvskill.push([modSkills[i]["Skill Name"].toUpperCase(),modSkills[i]["Skill Description"].toUpperCase(),modSkills[i]["Skill Description"],modSkills[i]["Reference Name"]])
    inc++;
  }

  http.onload = function() {
    var status = http.status;
    if (status === 200) {
      let	linescsv=http.response.split("\n");

      for(let i=1;i<linescsv.length;i++){
        var split=linescsv[i].split(";");
        if(split.length==2){
          var newli=document.createElement("li");
          newli.innerText=split[0];
          newli.value=""+inc;
          newli.classList.add("grayskill");

          newli.onclick=onClickSkill;
          skills_list.appendChild(newli);
          // skills_list.innerHTML+="<li onclick='onClickSkill' value='"+inc+"'>"+split[0]+"</li>";
          // document.getElementById ("btnsave").addEventListener ("click", resetEmotes, false);
          split.push(split[1]);
          split.push(split[0]);
          split[0]= split[0].toUpperCase();
          split[1]= split[1].toUpperCase();
          csvskill.push(split);
          inc++;
        }
      }
    }

    func();

  }
  http.send();
}

function post_loadCSV(){
  document.getElementById('layout_skills').classList.remove("hidden");
  document.getElementById('layout_skills').classList.add("skills_div");
  // Load heroes list
  var heroes_list =document.getElementById('heroes_list');
  heroes_list.innerText="";
  for(let i=0;i<modHeroes.length;i++){
    var newli=document.createElement("li");

    newli.innerText=modHeroes[i]["Name"];
    newli.value=""+i;
    newli.classList.add("grayskill");
    newli.onclick=onClickHero;
    heroes_list.appendChild(newli);
    if(i==0){
      currentHero=0;
      setHero(newli);
    }
  }

  loadCanvasForSkillTree();

}
function setupContext(ctx,color){
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.fillStyle = color;
}
var PIXEL_RATIO = (function () {
  var ctx = document.createElement("canvas").getContext("2d"),
  dpr = window.devicePixelRatio || 1,
  bsr = ctx.webkitBackingStorePixelRatio ||
  ctx.mozBackingStorePixelRatio ||
  ctx.msBackingStorePixelRatio ||
  ctx.oBackingStorePixelRatio ||
  ctx.backingStorePixelRatio || 1;

  return dpr / bsr;
})();
let test_skilltree=[];
function loadCanvasForSkillTree(){
  let ratio = PIXEL_RATIO;
  let ctx= canvas_skilltree.getContext('2d');


  let w=canvas_skilltree.width*3;
  let h=canvas_skilltree.height*2;


  canvas_skilltree.width = w * ratio;
  canvas_skilltree.height = h * ratio;
  canvas_skilltree.style.width = w + "px";
  canvas_skilltree.style.height = h + "px";
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  let marginWidth=2.5;
  let marginHeight=5;
  let width = canvas_skilltree.width-marginWidth*12;
  let height = canvas_skilltree.height-marginHeight*6;
  canvas_skilltree.addEventListener("click", onClickCanvas, false);

  width_rect=width/6;
  height_rect=height/6;


  if(dlc_check){
    rect_canvas=[
      [width/2-width_rect-marginWidth,0],[width/2+marginWidth,0],
      [width/2-width_rect*2-marginWidth*2,height_rect+marginHeight],[width/2-width_rect-marginWidth,height_rect+marginHeight],[width/2+marginWidth,height_rect+marginHeight],[width/2+width_rect+marginWidth*2,height_rect+marginHeight],
      [width/2-width_rect/2-width_rect*2-marginWidth*2,(height_rect+marginHeight)*2],[width/2-width_rect/2-width_rect-marginWidth,(height_rect+marginHeight)*2],[width/2-width_rect/2,(height_rect+marginHeight)*2],[width/2-width_rect/2+width_rect+marginWidth,(height_rect+marginHeight)*2],[width/2-width_rect/2+width_rect*2+marginWidth*2,(height_rect+marginHeight)*2],
      [width/2-width_rect*2-marginWidth*2,(height_rect+marginHeight)*3],[width/2-width_rect-marginWidth,(height_rect+marginHeight)*3],[width/2+marginWidth,(height_rect+marginHeight)*3],[width/2+width_rect+marginWidth*2,(height_rect+marginHeight)*3],
    ];
  }
  else{
    rect_canvas=[
      [width/2-width_rect-marginWidth,0],[width/2+marginWidth,0],
      [width/2-width_rect*2-marginWidth*2,height_rect+marginHeight],[width/2-width_rect-marginWidth,height_rect+marginHeight],[width/2+marginWidth,height_rect+marginHeight],[width/2+width_rect+marginWidth*2,height_rect+marginHeight],
      [width/2-width_rect/2-width_rect*2-marginWidth*2,(height_rect+marginHeight)*2],[width/2-width_rect/2-width_rect-marginWidth,(height_rect+marginHeight)*2],[width/2-width_rect/2,(height_rect+marginHeight)*2],[width/2-width_rect/2+width_rect+marginWidth,(height_rect+marginHeight)*2],[width/2-width_rect/2+width_rect*2+marginWidth*2,(height_rect+marginHeight)*2],
      [width/2-width_rect*3-marginWidth*3,(height_rect+marginHeight)*3],[width/2-width_rect*2-marginWidth*2,(height_rect+marginHeight)*3],[width/2-width_rect-marginWidth,(height_rect+marginHeight)*3],[width/2+marginWidth,(height_rect+marginHeight)*3],[width/2+width_rect+marginWidth*2,(height_rect+marginHeight)*3],[width/2+width_rect*2+marginWidth*3,(height_rect+marginHeight)*3],
    ];
  }

if(dlc_check){
  joins_canvas=[
    [0,2],[0,3],[1,4],[1,5],
    [2,6],[2,7],[3,7],[3,8],[4,8],[4,9],[5,9],[5,10],
    [6,11],[7,11],[7,12],[8,12],[8,13],[9,13],[9,14],[10,14],
  ];
}
else{
  joins_canvas=[
    [0,2],[0,3],[1,4],[1,5],
    [2,6],[2,7],[3,7],[3,8],[4,8],[4,9],[5,9],[5,10],
    [6,11],[6,12],[7,12],[7,13],[8,13],[8,14],[9,14],[9,15],[10,15],[10,16],
  ];
}
  for(let i=0;i<joins_canvas.length;i++){
    joins_canvas[i].push(0);
  }
  for(let i=0;i<rect_canvas.length;i++){
    rect_canvas[i].push(0);
    rect_canvas[i][0]+=10;
    test_skilltree.push(""+i);
  }


  reDrawCanvas();
}


function reDrawCanvas(){
  let ctx= canvas_skilltree.getContext('2d');

  ctx.clearRect(0, 0, canvas_skilltree.width, canvas_skilltree.height);
  let marginWidth=2.5;
  let marginHeight=5;
  ctx.font =(marginHeight*3)+"px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = 'middle';
  for(let i=0;i<joins_canvas.length;i++){
    setupContext(ctx,"#444");

    ctx.moveTo(rect_canvas[joins_canvas[i][0]][0]+width_rect/2,  rect_canvas[joins_canvas[i][0]][1]+height_rect/2);
    ctx.lineTo(rect_canvas[joins_canvas[i][1]][0]+width_rect/2,  rect_canvas[joins_canvas[i][1]][1]+height_rect/2);
    ctx.lineWidth = marginHeight;
    ctx.stroke();
  }
  for(let i=0;i<rect_canvas.length;i++){
    if(rect_canvas[i][2]==0){
      setupContext(ctx,"#333");
    }
    else if(rect_canvas[i][2]==1 || rect_canvas[i][2]==3){
      setupContext(ctx,"#1616f6");
    }
    else if(rect_canvas[i][2]==2){
      setupContext(ctx,"#611");
    }
    else{
      setupContext(ctx,"#611");
    }


    ctx.fillRect(rect_canvas[i][0], rect_canvas[i][1], width_rect, height_rect);
    setupContext(ctx,"#ffffff");
    if(currentHero==-1){
      ctx.fillText(test_skilltree[i], rect_canvas[i][0]+width_rect/2, rect_canvas[i][1]+height_rect/2);

    }
    else{
      ctx.fillText(modHeroes[currentHero]["Skills"][i], rect_canvas[i][0]+width_rect/2, rect_canvas[i][1]+height_rect/2);
    }
  }
}


function onClickCanvas(e) {
  var element = canvas_skilltree;
  var offsetX = 0, offsetY = 0

  if (element.offsetParent) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  let x = e.pageX - offsetX;
  let y = e.pageY - offsetY;

  for(let i=0;i<rect_canvas.length;i++){
    if(x>rect_canvas[i][0] && (rect_canvas[i][0]+width_rect)>x && y>rect_canvas[i][1] && (rect_canvas[i][1]+height_rect)>y){

      if(lastSelectedRectIndex>=0){
        if(rect_canvas[lastSelectedRectIndex][2]==3){
          rect_canvas[lastSelectedRectIndex][2]=2;
          }
          else{
          rect_canvas[lastSelectedRectIndex][2]=0;
        }
      }
      if(lastSelectedRectIndex==i){
        lastSelectedRectIndex=-1;
        break;
      }

      lastSelectedRectIndex=i;
      let skill_rect_description = document.getElementById("skill_rect_description");
      let skill;
      let otherskill;

      if(currentHero<0){
        skill=test_skilltree[lastSelectedRectIndex];
      }
      else{
        skill=  modHeroes[currentHero]["Skills"][lastSelectedRectIndex];
      }
      for(let j=0;j<csvskill.length;j++){
        if(skill==csvskill[j][3]){
          skill_rect_description.innerText=csvskill[j][2];
          break;
        }
      }

      if(rect_canvas[lastSelectedRectIndex][2]==2){
        rect_canvas[i][2]=3;
      }
      else {
        rect_canvas[i][2]=1;
      }



      break;
    }

  }
  reDrawCanvas();
}
// document.getElementById('layout_skills').classList.remove("hidden");
// document.getElementById('layout_skills').classList.add("skills_div");

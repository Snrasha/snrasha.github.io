
export function getAllTypeForSkillTree(filelist){
  // name: "002CasterSkill data.txt", lastModified: 1665028452677, webkitRelativePath: "Chrysalis/Custom Skills/002CasterSkill data.txt"
  // name: "Hero 1 data.txt", lastModified: 1665280610000, webkitRelativePath: "Chrysalis/Factions/Chrysalis Folder/Hero 1 data.txt"
  // name: "Hero 1 data.txt", lastModified: 1665555719923, webkitRelativePath: "Chrysalis/Neutral heroes/Hero 1 data.txt"
  // name: "Hero 1 portrait.png", lastModified: 1662244150953, webkitRelativePath: "Chrysalis/Neutral heroes/Hero 1 portrait.png"

  let dict={"Skills":[],"SkillsPicture":[],"Heroes":[],"HeroesPicture":[]};
  for(let i=0;i<filelist.length;i++){
    let split=filelist[i].webkitRelativePath.split("/");
    console.log(split);
    if(split.length==3){
      if(split[1] == "Custom Skills" && split[2].endsWith("data.txt")){
        dict["Skills"].push(filelist[i]);
        dict["SkillsPicture"].push(filelist[i+1]);
      }
      if(split[1] == "Neutral heroes" && split[2].endsWith("data.txt")){
        dict["Heroes"].push(filelist[i]);
        dict["HeroesPicture"].push(filelist[i+1]);
      }
    }
    if(split.length==4){
      if(split[1] == "Factions"){
        if(split[3].startsWith("Hero") && split[3].endsWith("data.txt")){
          dict["Heroes"].push(filelist[i]);
          dict["HeroesPicture"].push(filelist[i+1]);
        }
      }
    }

  }
  return dict;

}

export function readSkill(txt){
  let lines=txt.trim().split("\n");

  if(lines.length<8){
    return undefined;
  }
  else{
    let dict={"Skill Name":lines[1].trim(),"Reference Name":lines[4].trim(),"Skill Description":lines[7].trim()};
    return dict;
  }
}


export function loadSkills(dict,post_func){
  let skills=dict["Skills"];
  let skillsArrTxt=[];


  let increment=skills.length;

  for(let i=0;i<skills.length;i++){
    var reader = new FileReader();
    reader.readAsText(skills[i], "UTF-8");
    reader.onload = function (evt) {
      // console.log(skills[i].webkitRelativePath);

      skillsArrTxt.push(readSkill(evt.target.result));
      increment--;
      if(increment<=0){
        post_func(dict,skillsArrTxt);
      }
    }
    reader.onerror = function (evt) {
      increment--;
    }
  }
}

export function readHero(filename,txt){
  let lines=txt.trim().split("\n");
  if(lines.length<5){
    return undefined;
  }
  else{
    // console.log(filename+" "+lines.length);
    let dict={"Name":"","Class":"","Unit":"","Skills":[],"Filename":filename};
    if(lines[3]=="Class"){
      dict["Name"]=lines[1].trim();
      dict["Class"]=lines[4].trim();
      dict["Unit"]=lines[7].trim();
      for(let i=10;i<lines.length;i++){
        dict["Skills"].push(lines[i].trim());
      }
      return dict;
    }
    dict["Name"]=lines[1].trim();
    dict["Class"]=undefined;
    dict["Unit"]=lines[4].trim();
    for(let i=7;i<lines.length;i++){
      dict["Skills"].push(lines[i].trim());
    }
    return dict;

  }
}

export function loadHero(dict,post_func){
  let heroes=dict["Heroes"];
  let heroesArrTxt=[];

  let increment=heroes.length;

  for(let i=0;i<heroes.length;i++){
    var reader = new FileReader();
    reader.readAsText(heroes[i], "UTF-8");
    reader.onload = function (evt) {
      heroesArrTxt.push(readHero(heroes[i]["name"],evt.target.result));
      increment--;
      if(increment<=0){
        post_func(dict,heroesArrTxt);
      }
    }
    reader.onerror = function (evt) {
      increment--;
    }
  }
}
export function saveHero(dict){
  let txt="";
  txt+="Name\r\n"+dict["Name"]+"\r\n\r\n";
  if(dict["Class"]){
    txt+="Class\r\n"+dict["Class"]+"\r\n\r\n";
  }
  txt+="Unit\r\n"+dict["Unit"]+"\r\n\r\n";
  txt+="Skills\r\n";
  for(let i=0;i<dict["Skills"].length;i++){
    txt+=dict["Skills"][i]+"\r\n";
  }
  var link = document.createElement('a');
  link.download = dict["Filename"];

  link.href = URL.createObjectURL( new Blob( [txt], { type: 'text/plain' }));
  // link.href = 	'data:text/plain;charset=utf-8,' + encodeURIComponent(newmovetxt[i]);
  link.click();
}

var create_gif_button =document.getElementById('create_gif_button');

create_gif_button.onclick = function() {
  if(create_gif_button.disabled){
    return;
  }

  var input_scale=document.getElementById('input_scale').value;
  var file_unit=document.getElementById('input_unit').files;
  var file_shadow=document.getElementById('input_shadow').files;



  document.getElementById('input_unit').value = null;
  document.getElementById('input_shadow').value = null;

  create_gif_button.disabled=true;



  startCreatingGif(input_scale,file_unit,file_shadow);
}
function startCreatingGif(input_scale,file_unit,file_shadow) {
  if(input_scale>9){
    input_scale=9;
  }
  if(input_scale<1){
    input_scale=1;
  }

  var imageSrc;
  var namefile;


  nameunit=file_unit[0]["name"];

  let count=0;
  let arrayImg=new Array(2);

  function addImage(src,shadow){
    var img = new Image();
    count++;

    img.onload = function(){
      count--;
      if(shadow==true){
        arrayImg[1]=this;
      }
      else{
        arrayImg[0]=this;
      }
      if(count<=0){
        startEncoder(nameunit,arrayImg,input_scale);
      }
    };
    img.onerror= function(){
      create_gif_button.disabled=false;
    };
    img.src = imageSrc;
  }
  addImage(URL.createObjectURL(file_unit[0]),false);
  addImage(URL.createObjectURL(file_shadow[0]),false);
}

function setupContext(ctx,color){
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.fillStyle = color;
}
function decimalToHexString(number)
{

  var nb= number.toString(16).toUpperCase();
  if(nb.length<2){
    nb="0"+nb;
  }
  return nb;
}

function getTransparentColor(image){
  var canvas = document.createElement("canvas");
  var context =   canvas.getContext('2d');
  canvas.width=""+image.width;
  canvas.height=""+image.height;
  //gray color always "present"
  setupContext(context,"#b4b4b4");
  context.fillRect(0,0,image.width,image.height);
  context.drawImage(image,0, 0,image.width,image.height);


  const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  var colors=[];

  // enumerate all pixels
  // each pixel's r,g,b,a datum are stored in separate sequential array elements
  for(let i = 0; i < data.length; i += 4) {
    const red = decimalToHexString(data[i]);
    const green = decimalToHexString(data[i + 1]);
    const blue = decimalToHexString(data[i + 2]);
    var col="#"+red+green+blue;
    if(!colors.includes(col)){
      colors.push(col);
    }
  }
  var r=49;
  var g=50;
  var b=50;
  var col="";
  do{
    r+=1;
    if(r>255){
      r=0;
      g++;
    }
    if(g>255){
      g=0;
      b++;
    }
    if(b>255){
      return ["#000000",0];
    }

    col="#"+decimalToHexString(r)+decimalToHexString(g)+decimalToHexString(b);
  }
  while(colors.includes(col));


  var c=(r<<16)+(g<<8)+b;

  return [col,c];

}

function getFramesUnit(image){
  var width=image.width/13;
  var height=image.height;
  var fattyarr=[];
  var arr=[];
  arr.push([width*0,0,width,height])
  arr.push([width*1,0,width,height])
  arr.push([width*2,0,width,height])
  arr.push([width*3,0,width,height])
  arr.push([width*2,0,width,height])
  arr.push([width*1,0,width,height])



  fattyarr.push(arr);
  arr=[];
  for(let i=4;i<8;i++){
    arr.push([width*i,0,width,height])
  }
  fattyarr.push(arr);
  arr=[];
  for(let i=8;i<12;i++){
    arr.push([width*i,0,width,height])
  }
  fattyarr.push(arr);
  arr=[];
  arr.push([width*0,0,width,height])
  arr.push([width*12,0,width,height])
  arr.push([width*12,0,width,height])

  fattyarr.push(arr)
  return fattyarr;
}



function startEncoder(namefile,arrimage,input_scale){
  var canvas = document.createElement("canvas");
  var ctx =   canvas.getContext('2d');
  var transparentColor=getTransparentColor(arrimage[0]);
  let divide=12;
  var width=arrimage[0].width/divide*input_scale;
  var height=arrimage[0].height*input_scale;

  canvas.width=""+(width*2);

  canvas.height=""+height;





  var encoder = new GIFEncoder();

  encoder.setRepeat(0); //0  -> loop forever
  //1+ -> loop n times then stop
  encoder.setDelay(200); //go to next frame every n milliseconds

  encoder.start();


  // console.log("1"+ transparentColor);

  let fattyarr;
  let fattyarr_Shadow;
  let destList=[];

    fattyarr=  getFramesUnit(arrimage[0]);
    fattyarr_Shadow=  getFramesUnit(arrimage[1]);

    let anim=[0,0,1,1,1,0,0,2,0,0,2];
    for (let i=0;i<anim.length;i++){
      for(let j=0;j<fattyarr[anim[i]].length;j++){
        destList.push([fattyarr[anim[i]][j],fattyarr_Shadow[anim[i]][j]]);
      }
    }
  var gray="#b4b4b4";
  encoder.setDispose(2);
  encoder.setTransparent(transparentColor[1]);

  for (let i=0;i<destList.length;i++){
    setupContext(ctx,transparentColor[0]);
    // ctx.fillRect(0,0,width,height);
    ctx.fillRect(0,0,width,height);
    ctx.drawImage(image,destList[i][0][1], destList[i][1][1],destList[i][2][1],destList[i][3][1],0,0,width,height);
    ctx.drawImage(image,destList[i][0][0], destList[i][1][0],destList[i][2][0],destList[i][3][0],0,0,width,height);
    setupContext(ctx,gray);
    ctx.fillRect(width,0,width,height);
    ctx.drawImage(image,destList[i][0][1], destList[i][1][1],destList[i][2][1],destList[i][3][1],width,0,width,height);
    ctx.drawImage(image,destList[i][0][0], destList[i][1][0],destList[i][2][0],destList[i][3][0],width,0,width,height);

    encoder.addFrame(ctx);
  }



  encoder.finish();
  if(namefile.toLowerCase().endsWith(".png")){
    namefile=  namefile.substring(0,namefile.length-4);
  }

  encoder.download(namefile+ " Animation.gif");
  create_gif_button.disabled=false;
}

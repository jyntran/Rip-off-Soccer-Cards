var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var container = document.getElementById("container");

var images = "./assets/img/";
var fonts = "./assets/fonts/";
var img = {};
var layer = {};

// Default attribute
var attr = 'a';

var loadedImages = 0;
var numberImages = 24;

function isLoaded(){
  loadedImages++;
  var percent = Math.floor(loadedImages / numberImages * 100);
  $('.loaded').width(percent.toString()+'%');
  $('#progress span').text(percent.toString());
  if (loadedImages >= numberImages) loaded();
}

// Load starting template
var gray = new Image();
gray.onload = function() {
  ctx.drawImage(gray,0,0);
}
gray.src = images + "creator/gray.png";

// Start preload function
function preload() {

  $('#status').show();

  var assets = [
  { name: "font_gypsy", src: fonts + "gypsykiller.ttf" },
  { name: "l1_a", src: images + "creator/ardor/layer1.png" },
  { name: "l1_w", src: images + "creator/whirlwind/layer1.png" },
  { name: "l1_t", src: images + "creator/thunder/layer1.png" },
  { name: "l1_l", src: images + "creator/light/layer1.png" },
  { name: "l1_d", src: images + "creator/dark/layer1.png" },
  { name: "l2", src: images + "creator/global/layer2.png" },
  { name: "l3a_a", src: images + "creator/ardor/layer3_attr.png" },
  { name: "l3a_w", src: images + "creator/whirlwind/layer3_attr.png" },
  { name: "l3a_t", src: images + "creator/thunder/layer3_attr.png" },
  { name: "l3a_l", src: images + "creator/light/layer3_attr.png" },
  { name: "l3a_d", src: images + "creator/dark/layer3_attr.png" },
  { name: "l3s_2", src: images + "creator/global/layer3_2star.png" },
  { name: "l3s_3", src: images + "creator/global/layer3_3star.png" },
  { name: "l3s_4", src: images + "creator/global/layer3_4star.png" },
  { name: "l3s_5", src: images + "creator/global/layer3_5star.png" },
  { name: "l3s_6", src: images + "creator/global/layer3_6star.png" },
  { name: "l3s_7", src: images + "creator/global/layer3_7star.png" },
  { name: "l3v_0", src: images + "creator/global/layer3_voice-off.png" },  
  { name: "l3v_1", src: images + "creator/global/layer3_voice-on.png" },  
  { name: "l4_a", src: images + "creator/ardor/layer4.png" },
  { name: "l4_w", src: images + "creator/whirlwind/layer4.png" },
  { name: "l4_t", src: images + "creator/thunder/layer4.png" },
  { name: "l4_l", src: images + "creator/light/layer4.png" },
  { name: "l4_d", src: images + "creator/dark/layer4.png" },  
  { name: "custom", src: "" }
  ];
  
assets.forEach(function(entry) {
  img[entry.name] = new Image();
  if (entry.name == "font_gypsy") {
    img[entry.name].onerror = function() { isLoaded(); }
  } else {
	img[entry.name].onload = function(){
		isLoaded(); }
  }
  img[entry.name].src = entry.src;
});

layer = {
  "1": img['l1_'+attr],
  "2": img['l2'],
  "3a": img['l3a_'+attr],
  "3v": img['l3v_1'],
  "3s": img['l3s_5'],
  "4": img['l4_'+attr]
};

} // End preload function

function loaded() {

$('#fileUpload').on('change', function (event) {
    if ( this.files && this.files[0] ) {
        var fr = new FileReader();
        fr.onload = function(e) {
           var image = new Image();
           image.onload = function() {
		     img['custom'] = image;
		     repaint();
           };
           image.src = e.target.result;
        };       
        fr.readAsDataURL( this.files[0] );
	}
	$('.custom').prop('disabled', false);
});
  
var cusFile = document.getElementById('fileUpload');
cusFile.addEventListener("change", readImage, false);

var cusTextRank = document.getElementById('cusTextRank');
cusTextRank.addEventListener('change', repaint, false);

var cusTextName = document.getElementById('cusTextName');
cusTextName.addEventListener('change', repaint, false);

var cusTextLvl = document.getElementById('cusTextLvl');
cusTextLvl.addEventListener('change', repaint, false);

var cusTextCost = document.getElementById('cusTextCost');
cusTextCost.addEventListener('change', repaint, false);

var cusTextSkill = document.getElementById('cusTextSkill');
cusTextSkill.addEventListener('change', repaint, false);

var cusScale = document.getElementById('cusScale');
cusScale.addEventListener('change', repaint, false);

var cusRotate = document.getElementById('cusRotate');
cusRotate.addEventListener('change', repaint, false);

var cusX = document.getElementById('cusX');
cusX.addEventListener('change', repaint, false);

var cusY = document.getElementById('cusY');
cusY.addEventListener('change', repaint, false);

$('#progress').hide();
$('#all').show();

// Disable the character transformation until one is uploaded
$('.custom').prop('disabled', true);		
		
// Reset canvas
$('#reset').click(function() {
    ctx.drawImage(gray,0,0);    
    cusFile = '';
    cusFile.value = '';
    $('.custom').prop('disabled', true);
    cusTextRank.value = 3;
    cusTextName.value = 'Name';
    cusTextLvl.value = 1;
    cusTextCost.value = 10; 
    cusTextSkill.value = 1; 
    cusScale.value = 1;
    cusX.value = 0;
    cusY.value = 0;
});

// Change attribute
$('.attr').click(function() {
    attr = this.value;
    repaint();
});

// Draw card
function repaint() {
      $('#status').show();
      $('#loader').show();
      $('#statusMsg').html('Working...');

      layer['1'] = img['l1_'+attr];
      layer['2'] = img['l2'];
      layer['3a'] = img['l3a_'+attr];
      layer['3s'] = img['l3s_'+cusTextRank.value];
      layer['3v'] = img['l3v_'+1];
      layer['4'] = img['l4_'+attr];

      /* Clear canvas */
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.beginPath();
      ctx.rect(10,10,508,780);
      ctx.clip();
      ctx.drawImage(layer['1'], 0, 0, layer['1'].width, layer['1'].height, 0, 0, canvas.width, canvas.height);
      /* Custom image */
      if (cusFile){
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.rect(10,10,508,780);
        ctx.clip();
        ctx.translate(canvas.width/2, canvas.height/2);
        var scaleValue = document.getElementById('cusScale').value;
        ctx.scale(scaleValue, scaleValue);
        ctx.translate(-canvas.width/2, -canvas.height/2);
        var rotateValue = document.getElementById('cusRotate').value;
        var angle = rotateValue * Math.PI / 180;
        ctx.rotate(angle);
        var xValue = document.getElementById('cusX').value;
        var yValue = document.getElementById('cusY').value;
        ctx.translate(xValue, yValue);
        ctx.drawImage(img['custom'], 0, 0);
        ctx.restore();
        ctx.save();
      }
      ctx.drawImage(layer['2'], 0, 0);
      ctx.drawImage(layer['3a'], 0, 0);
      ctx.restore();
      ctx.drawImage(layer['3s'], 0, 677);
      ctx.drawImage(layer['3v'], 0, 677);
      ctx.drawImage(layer['4'], 0, 0);

      // Set the text style
      ctx.font = '18pt arial narrow, arial, sans-serif';
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'yellow';
      ctx.textAlign = 'center';

      // Draw level
      var cusTextFull = '[Lv.'+cusTextLvl.value+'] '+cusTextName.value;
      var cusTextFullLvl = '[Lv.'+cusTextLvl.value+'] ';
      var textWidth = ctx.measureText(cusTextFull).width;
      var x = canvas.width/2 - (textWidth/2);
      ctx.beginPath();
      ctx.textAlign = 'start';
      ctx.strokeText(cusTextFullLvl, x, 770);
      ctx.fillText(cusTextFullLvl, x, 770);
      x += ctx.measureText(cusTextFullLvl).width;
      ctx.closePath();

      // Draw name
      ctx.beginPath();
      ctx.fillStyle = 'white';
      ctx.strokeText(cusTextName.value, x, 770);
      ctx.fillText(cusTextName.value, x, 770);
      ctx.closePath();

      // Draw cost
      ctx.beginPath();
      ctx.fillStyle = 'white';
      ctx.font = 'italic 12pt gypsykiller';
      ctx.strokeText("COST", 370, 37);
      ctx.fillText("COST", 370, 37);
      ctx.textAlign = 'right';
      ctx.font = '32pt gypsykiller';
      ctx.strokeText(cusTextCost.value, 500, 50);
      ctx.fillText(cusTextCost.value, 500, 50);
      ctx.closePath();

      // Draw skill
      if (cusTextSkill.value > 0) {
      ctx.beginPath();
      ctx.textAlign = 'right';
      ctx.font = '24pt sans-serif';
      ctx.fillStyle = '#99cc33';
      ctx.strokeText('+'+cusTextSkill.value, 510, 775);
      ctx.fillText('+'+cusTextSkill.value, 510, 775);
      ctx.closePath();
      }

      // Draw URL
      ctx.save();
      var url = 'ripoffsoccercards.tk - Soccer Spirits (C) Com2uS';
      ctx.beginPath();
      ctx.globalAlpha = 0.5;
      ctx.font = '9pt sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'black';
      ctx.fillText(url, canvas.width/2, 792);
      ctx.closePath();
      ctx.restore();

}

// Read in custom image
function readImage() {
    if ( this.files && this.files[0] ) {
        var fr = new FileReader();
        fr.onload = function(e) {
           var image = new Image();
           image.onload = function() {
		     img['custom'] = image;
		     repaint();
           };
           image.src = e.target.result;
        };       
        fr.readAsDataURL( this.files[0] );
	}
	$('.custom').prop('disabled', false);
}

// Prevent typing into number inputs
/*
$("[type='number']").keypress(function (evt) {
    evt.preventDefault();
});
*/

}

preload();
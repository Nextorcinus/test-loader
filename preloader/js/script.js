var preloader = document.getElementById("preloader");
var animationSelection = document.getElementById("animationSelection");

//Only some Preloader Animation will animate the Container In & Out directly ( such as Chevron2 )
var container = document.getElementById("container");

var preloader_animation = "";
var preloader_direction = "";

function animationChange( value ){
  console.log( "CHANGE Animation", value );
  preloader_animation = value;
}
function animateIn(){
  if( preloader_animation == "" ){
    preloader_animation = animationSelection.value;
  }
  preloader_direction = "enter";
  preloader.className = preloader_animation + " " + preloader_direction;
  if( preloader_animation.indexOf("gsap") > 0 ){
    //Trigger GSAP Animation In
    animateGsap( preloader_animation );
  }
}
function animateOut(){
  if( preloader_animation == "" ){
    preloader_animation = animationSelection.value;
  }
  preloader_direction = "leave";
  preloader.className = preloader_animation + " " + preloader_direction;
  if( preloader_animation.indexOf("gsap") > 0 ){
    //Trigger GSAP Animation Out
    animateGsap( preloader_animation );
  }
}

//GSAP Animation Section Goes Here ( we will control the SVGs with our GSAP )
gsap.registerPlugin(DrawSVGPlugin);
var current_preloader_gsap = "";
var tl = null;

//Cloned SVG 5 Times
//Duplicate mask-circle, mask-horizontal, mask-vertical, mask-diagonal-left, mask-diagonal-right 5 times ( and also do so for all other SVG )
var preloader_svg = document.getElementById("preloader-svg");
//Diagonal-Right Disable dulu krn jelek
var duplicate_target = ["circle", "horizontal", "vertical", "diagonal-left" /*, "diagonal-right" */];
duplicate_target.forEach( (target) => {
  var original = preloader_svg.getElementById("mask-" + target + "-svg");
  for( var i = 1 ; i <= 5 ; i++ ){
    var cloned = original.cloneNode(true);
    cloned.id = "mask-" + target + "-svg" + i;
    cloned.className = "mask-" + target;
    preloader_svg.appendChild( cloned );
  }
});



function animateGsap( _target ){
  if( current_preloader_gsap == _target && false ){
    //No Longer need to init Animation

  }else{
    current_preloader_gsap = _target;
    if( tl != null ){
      tl.revert();
      tl.kill();
    }
  
    tl = gsap.timeline({ paused:true });
    var animDur = 1.5;
    var animStagger = {
      amount: 0.5, from: "start"
    };
    var animEase = "expo.inOut";
    var circleStagger = 0.15;
    var drawSVGFrom = "50% 50%";
    var randomized = Math.random();
    if( randomized < 0.25 ){
      drawSVGFrom = "0%";
    }else if( randomized < 0.5 ){
      drawSVGFrom = "100% 100%";  
    }
    randomized = Math.random();
    if( randomized < 0.33 ){
      animStagger.from = "end";
    }else if( randomized < 0.66 ){
      animStagger.from = "center";
    }
    

    var target_mask = "mask-" + ( current_preloader_gsap.replaceAll( "-gsap", "" ) );

    tl
      .from("#" + target_mask + "-svg1 ." + target_mask, 
        {duration: animDur, drawSVG: drawSVGFrom, stagger: animStagger, ease:animEase},
        "start"
      )
      .from("#" + target_mask + "-svg2 ." + target_mask , 
        {duration: animDur, drawSVG: drawSVGFrom, stagger: animStagger, ease:animEase},
        "start+=" + ( circleStagger * 1)
      )
      .from("#" + target_mask + "-svg3 ." + target_mask , 
        {duration: animDur, drawSVG: drawSVGFrom, stagger: animStagger, ease:animEase},
        "start+=" + ( circleStagger * 2)
      )
      .from("#" + target_mask + "-svg4 ." + target_mask , 
        {duration: animDur, drawSVG: drawSVGFrom, stagger: animStagger, ease:animEase},
        "start+=" + ( circleStagger * 3)
      )
      .from("#" + target_mask + "-svg5 ." + target_mask, 
        {duration: animDur, drawSVG: drawSVGFrom, stagger: animStagger, ease:animEase},
        "start+=" + ( circleStagger * 4)
      )
    ;
    console.log( "Generate TL", target_mask );
  }
  
  if( preloader_direction == "enter" ){
    tl.play(0);
  }else if( preloader_direction == "leave" ){
    tl.reverse(0);
  }
  

}


//circle-gsap, paling bagus animasinya, kita harus naikan chance dia terpilih , dgn masukin 3x ( atau bahkan lebih agar lebih sering terpilih )
var css_preloader = [ "chevron", "chevron-left", "chevron2", "chevron2-left", "circle" ];
var gsap_preloader = [ "circle-gsap", "circle-gsap", "circle-gsap", "vertical-gsap", "horizontal-gsap", "diagonal-left-gsap"];
function toggle(){
  //Toggle Preloader Enter & Leave
  if( preloader_direction == "enter" ){
    preloader_direction = "leave";
  }else{
    preloader_direction = "enter";
  }

  //Randomized Animation
  var randomized = Math.random();
  var target_preloader = gsap_preloader;
  if( randomized <= 0.3 || typeof gsap !== "object" ){
    //30% chance pakai CSS_Preloader kalau GSAP sudah terload
    target_preloader = css_preloader;
  }

  randomized = Math.random();
  var target_length = 1 / (target_preloader.length - 1);
  var target_index = Math.round( randomized / target_length );
  preloader_animation = target_preloader[target_index];
  preloader.className = preloader_animation + " " + preloader_direction;
  console.log( target_index, target_length, randomized, preloader.className );
  if( preloader_animation.indexOf( "gsap" ) >= 0 ){
    animateGsap( preloader_animation );
  }
  

}

animateIn();
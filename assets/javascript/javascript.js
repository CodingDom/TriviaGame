$(document).ready(function(){

var myGameArea = {
    canvas : $("canvas").get()[0],
    fog : [new component(0, 0, "assets/images/fog.png", 0, 0, "image"),new component(0, 0, "assets/images/fog.png", 0, 0, "image")],
    
    display(subject,index) {
        const question = _G.myQuestions.questions[subject][index];
        $('#question').text(question.q);
        $('#choices').html(''); //Clearing answer choices
        let currChoices = question.choices.slice();
        let newChoice = "<div class='tab'> <p>Replacement</p> <img src='assets/images/btn2.png' height='100%' width='100%' style='position:absolute;display:block;left:0;'> </div>"
        let correctBtn = $(newChoice.replace("Replacement",question.a));

        for (var i = 0; i < question.choices.length; i++) {
            const randomIndex = Math.floor(Math.random()*currChoices.length);
            $('#choices').append($(newChoice.replace("Replacement",currChoices[randomIndex])));
            currChoices.splice(randomIndex,1);
        };
        
        const randomIndex = Math.floor(Math.random()*(question.choices.length+1));
        if (randomIndex == question.choices.length) {
            $("#choices").append(correctBtn);
        }
        else {
            correctBtn.insertBefore($("#choices").children()[randomIndex]);
        };
        
        $("#choices .tab").on("click", function(event) {
            $("#choices .tab").off("click"); //Turn off event listener
            $("#choices .tab img").css("filter","grayscale(1) brightness(0.75)");
            if (this == correctBtn.get()[0]) {
                correctBtn.find("img").css("filter","hue-rotate(100deg) brightness(1)");
                myGameStats.correct++;
            }
            else {
                $(this).find("img").css("filter","brightness(1)");
                myGameStats.incorrect++;
            };
            setTimeout(function() {
                $("#transition").css("display","block");
                var static = $("#static").get()[0]
                static.play();
                setTimeout(function() {
                    myGameArea.display(subject,index+1);
                    $("#transition").css("display","none");
                    static.pause();
                },2000);
            },2000);
        });
    },

    timer() {

    },

    clear : function() {
        if (!this.context) {return;};
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    interval : setInterval(updateGameArea, 1000/50)
};
myGameArea.context = myGameArea.canvas.getContext("2d"); //Drawing tool

var myGameStats = {
    incorrect: 0,
    correct: 0,

    reset: function() {
        var arr = Object.keys(this);
        for (var i = 0; i < arr.length; i++) {
            let prop = this[arr[i]];
            if (typeof(prop) == "number") {
                this[arr[i]] = 0;
            };
        };
    },
};

//Function for drawing on canvas
function component(width, height, appearance, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = appearance;
    };
    this.width = width;
    this.height = height;
    this.left = 0;
    this.right = 0;
    this.up = 0;
    this.down = 0;
    this.x = x;
    this.y = y;  
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width,
                this.height);
        };
    };
    this.newPos = function() {
        if (this.x < -this.width+10) {
            this.x = myGameArea.canvas.width-10;
        };
        this.x -= this.left;
        this.y += (-this.up)+(-this.down); 
        return     
    };    
};

//Setting up default positions for fog
var comp = getComputedStyle(document.body);
var fogWidth = parseInt(comp.height.replace("px",""))*1.84;
myGameArea.fog[0].x = -fogWidth/2;
myGameArea.fog[1].x = fogWidth/2;
fogWidth = null;

//Update canvas frames
var frame = 0;
function updateGameArea() {
    frame++;
    comp = getComputedStyle(document.body);
    var windowHeight = comp.height.replace("px","");
    var windowWidth = comp.width.replace("px","");
    myGameArea.canvas.height = parseInt(windowHeight);
    myGameArea.canvas.width = parseInt(windowWidth);
    myGameArea.clear();
   
    myGameArea.fog.forEach(function(fog) {
        fog.left = 1;
        fog.height = windowHeight;
        fog.width = windowHeight*1.84;
        fog.newPos();
        myGameArea.context.globalAlpha = 0.5;
        fog.update();
        myGameArea.context.globalAlpha = 1;
    });
};


myGameStats.reset();
myGameArea.display("Chucky",0);

$("#background").css("right","-552vh");

//Starting the game
$("#play").on("click", function() {
    $("#intro-container").css("display","none");
    $("#game-container").css("display","block");
    $("#ambience").get()[0].play(); //Playing background mmusic
});

//When the user comes back to the page
$(window).focus(function() {
    $("#ambience").get()[0].play();
});

//When the user leaves the page
$(window).blur(function() {
    myGameArea.fogger = false;
    $("#ambience").get()[0].pause();
});

});
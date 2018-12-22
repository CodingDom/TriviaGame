$(document).ready(function(){

var fps = 50; //50 frames per second
var frame = 0; //Current frame
var seconds = 30;//Current amount of seconds

var myGameArea = {
    canvas : $("canvas").get()[0],
    fog : [new component(0, 0, "assets/images/fog.png", 0, 0, "image"),new component(0, 0, "assets/images/fog.png", 0, 0, "image")],
    mode : "intro",
    //Display question
    display() {
        const subject = myGameStats.subject;
        if (_G.myQuestions[subject].length <= myGameStats.question) {
            this.end();
            return;
        };
        const question = _G.myQuestions[subject][myGameStats.question];
        this.mode = "transition";
        $("#transition").css("display","block");
        var static = $("#static").get()[0];
        static.volume = 0.3;
        static.play();
        setTimeout(() => {
            $("#transition").css("display","none");
            static.pause();
            static.load(); //Restart audio
            frame = 0;
            this.mode = "playing";
        },2000);
        //Reset timer
        seconds = 30;
        $("#time").css("color","white");
        $("#time").text(seconds);
        
        //Reset text
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
            myGameArea.mode = "transition";
            $("#countdown").get()[0].pause();
            $("#countdown").get()[0].load() // Restarts audio
            $("#choices .tab img").css("filter","grayscale(1) brightness(0.75)");
            if (this == correctBtn.get()[0]) {
                myGameStats.correct++;
                $("#correct").get()[0].play();
            }
            else {
                $(this).find("img").css("filter","brightness(1)");
                myGameStats.incorrect++;
                $("#incorrect").get()[0].currentTime = 0.65; //Timing is a little off on audio file
                $("#incorrect").get()[0].play();
            };
            correctBtn.find("img").css("filter","hue-rotate(100deg) brightness(1)"); //Display correct answer
            setTimeout(function() {
                myGameStats.question++;
                myGameArea.display(subject);
            },2000);
        });
    },

    timer() {
        let dispSeconds = seconds; //Creating variable to store current seconds
        if (seconds < 10) {
            if (seconds == 9) {
                $("#countdown").get()[0].play();
            };
            dispSeconds = "0" + dispSeconds;
            $("#time").css({"color":"red","font-size":"44px","opacity":0.5});
            $("#time").animate({"font-size":"32px","opacity":1},300);
        }

        if (seconds <= 0) {
            $("#choices .tab").off("click"); //Turn off answer choices click listener
            $("#choices .tab").find("img").css("filter","brightness(1)");
            $("#countdown").get()[0].currentTime = 18;
            setTimeout(() => {
                $("#countdown").get()[0].pause();
                $("#countdown").get()[0].load(); //Restarts audio
                setTimeout(() => {
                    myGameStats.question++;
                    this.display();
                },1000);
            },3000);

           
        };
        $("#time").text(dispSeconds);
    },
    //End screen
    end() {
        console.log(this.mode);
        this.mode = "end";
        $("#game-container").css("display","none");
        let total = _G.myQuestions[myGameStats.subject].length;
        $("#correct-text").text(myGameStats.correct);
        $("#incorrect-text").text(myGameStats.incorrect);
        $("#unanswered").text(total-myGameStats.correct-myGameStats.incorrect);
        $("#end-screen").css("display","block");
        myGameStats.scar = myGameStats.correct/total < 0.7 || true;
        console.log(myGameStats.correct/total);
    },
    //Clearing the canvas drawings
    clear() {
        if (!this.context) {return;};
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    interval : setInterval(updateGameArea, 1000/fps)
};
myGameArea.context = myGameArea.canvas.getContext("2d"); //Drawing tool

var myGameStats = {
    incorrect: 0,
    correct: 0,
    question: 0,
    subject: 'Chucky',
    scar: false,
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
    //Component's movement
    this.left = 0;
    this.right = 0;
    this.up = 0;
    this.down = 0;
    //Actual axis positioning
    this.x = x;
    this.y = y;  
    //Used to draw component
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
    //Repositioning componenet
    this.newPos = function() {
        if (this.x < -this.width+10) {
            this.x = myGameArea.canvas.width-10;
            this.y = 100-Math.floor(Math.random()*200);
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
function updateGameArea() {
    if (myGameArea.mode === "playing") {
        frame++;
        if (frame%fps == 0 && seconds > 0) {
            seconds -= 1;
            myGameArea.timer(seconds); // Converting frame to seconds 
        };
    };
    comp = getComputedStyle(document.body);
    var windowHeight = comp.height.replace("px","");
    var windowWidth = comp.width.replace("px","");
    myGameArea.canvas.height = parseInt(windowHeight);
    myGameArea.canvas.width = parseInt(windowWidth);
    myGameArea.clear();
   var randomEffect = Math.floor(Math.random()*1000);

    myGameArea.fog.forEach(function(fog) {
        fog.left = 1; //Move fog to the left
        fog.height = windowHeight; //Set height of fog to the window's height
        fog.width = windowHeight*1.84; //Keep fog's height to width ratio
        fog.newPos(); //Reposition fog
        //Defaults fog's filters
        myGameArea.context.filter = "brightness(0.5) opacity(0.5)";
        //Thunder effect
        if (randomEffect == 10 || myGameArea.activeEffect) {
            myGameArea.context.filter = "brightness(0.8) opacity(0.5)";
            if (!myGameArea.activeEffect) {
                myGameArea.activeEffect = "thunder";
                $("#thunder").get()[0].currentTime = 0.5;
                $("#thunder").get()[0].play();
                setTimeout(function() {
                    myGameArea.activeEffect = undefined;
                },1000);
            };
        };
        //Draw fog and reset filters
        fog.update();
        myGameArea.context.filter = "";
    });
};

//Starting the game
$("#play").on("click", function() {
    myGameStats.reset();
    $("#intro-container").css("display","none");
    $("#game-container").css("display","block");
    $("#ambience").get()[0].volume = 0.6;
    $("#ambience").get()[0].play(); //Playing background mmusic
    myGameArea.display();
});

//Restart quiz
$("#play-again").on("click", function() {
    $("#end-screen").css("display","none");
    myGameStats.reset();
    //Used for scarring the user
    if (myGameStats.scar) {
        myGameArea.mode = "transition";
        $("#transition").css("display","block");
        var static = $("#static").get()[0];
        static.play();
        setTimeout(function() {
            $("#transition").css("display","none");
            static.pause();
            static.load(); //Restart audio
            var girl = $("<img>");
            girl.attr("src","assets/images/girl.jpg");
            girl.css({"height":"100%","width":"100%","top":"0","left":"0"});
            $(document.body).append(girl);
            $("#ah").get()[0].currentTime = 0.75;
            $("#ah").get()[0].play();
            var bright = 1;
            var flash = setInterval(function() {
                bright = (bright == 1 && 10 || 1);
                console.log(bright);
                girl.css("filter",`brightness(${bright})`);
            },100);
            setTimeout(function() {
                clearInterval(flash);
                girl.remove();
                girl = null;
                $("#game-container").css("display","block");
                myGameArea.display();
            },3000);
        },2000);
    } else {
        $("#game-container").css("display","block");
        myGameArea.display();
    };
    
});

//When the user comes back to the page
$(window).focus(function() {
    $("#ambience").get()[0].play();
});

//When the user leaves the page
$(window).blur(function() {
    $("#ambience").get()[0].pause();
});

});
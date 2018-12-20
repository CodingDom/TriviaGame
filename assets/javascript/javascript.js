var myGameArea = {
    loopFog : function() {
        $("#background").animate({"right":"-184vh"},60000,"linear",function() {
            $("#background").css("right","-552vh");
            myGameArea.loopFog();
        });
    },
};

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

function display(subject) {
    var question = _G.myQuestions.questions[subject][Math.floor(Math.random()*_G.myQuestions.questions[subject].length)];
    $('#question').text(question.q);
    $('#choices').html(''); //Clearing answer choices
    let currChoices = question.choices.slice();
    let newChoice = "<div class='tab'> <p>Replacement</p> <img src='assets/images/btn2.png' height='100%' width='100%' style='position:absolute;display:block;left:0;'> </div>"
    
    for (var i = 0; i < question.choices.length; i++) {
        const randomIndex = Math.floor(Math.random()*currChoices.length);
        $('#choices').append($(newChoice.replace("Replacement",currChoices[randomIndex])));
        currChoices.splice(randomIndex,1);
    };
    //<img src='assets/images/btn2.png' height='100%' width='100%' position='absolute'>
    var correctBtn = $(newChoice.replace("Replacement",question.a));
    var randomIndex = Math.floor(Math.random()*4);
    if (randomIndex == 3) {
        $("#choices").append(correctBtn);
    }
    else {
        correctBtn.insertBefore($("#choices").children()[randomIndex]);
    }
    
    
};

myGameStats.reset();

display("Chucky");

$("#background").css("right","-552vh");

myGameArea.loopFog();

$("#play").on("click", function() {
    $("#intro-container").css("display","none");
    $("#game-container").css("display","block");
});
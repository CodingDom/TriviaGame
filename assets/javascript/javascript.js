var myGameArea = {
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
    let currChoices = _G.myQuestions.choices[subject][question.category];
    currChoices.splice(currChoices.indexOf(question.a),1);
    for (var i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random()*currChoices.length);
        $('#choices').append($("<div class='tab'> <p>" + currChoices[randomIndex] + "</p> </div>"));
        currChoices.splice(randomIndex,1);
    };
    
    var correctBtn = $("<div class='tab'> <p>" + question.a + "</p> </div>");
    var randomIndex = Math.floor(Math.random()*4);
    if (randomIndex == 3) {
        $("#choices").append(correctBtn);
    }
    else {
        correctBtn.insertBefore($("#choices").children()[randomIndex]);
    }
    
    
};

myGameStats.reset();

display("History");

$("#background").css("right","-100%");

function loopFog() {
    $("#background").animate({"right":"0%"},30000,function() {
        $("#background").css("right","-100%");
        loopFog();
    });
};

loopFog();
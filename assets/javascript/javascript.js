var myGameArea = {
    loopFog : function() {
        $("#background").animate({"right":"-184vh"},60000,"linear",function() {
            $("#background").css("right","-552vh");
            myGameArea.loopFog();
        });
    },
    display : function(subject,index) {
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

myGameStats.reset();

$(document).ready(function(){

myGameArea.display("Chucky",0);

$("#background").css("right","-552vh");

myGameArea.loopFog();

$("#play").on("click", function() {
    $("#intro-container").css("display","none");
    $("#game-container").css("display","block");
});
});
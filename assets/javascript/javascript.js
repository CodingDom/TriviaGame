var questions = {
    "History": [{
        q: "Who was the first president?",
        a: "George Washington",
        category: "figures"
    },
    {
        q: "What is the name of the scientist who stuck out his tongue for a photo?",
        a: "Albert Einstein",
        category: "figures"
    },
    {
        q: "What is the name of the man who invented the car?",
        a: "Karl Benz",
        category: "figures"
    },
    {
        q: "Who was the man who flew a kite into a thunderstorm?",
        a: "Benjamin Franklin",
        category: "figures"
    }],
    "Sports": [{

    }],
};

var choices = {
    "History": {
        "figures": ["George Washington", "Benjamin Franklin", "Albert Einstein", "Karl Benz", "Martin Luther King Jr.", "Abraham Lincoln", "John Adams", "Rosa Parks", "Theodore Roosevelt"]
    },
};

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
    var question = questions[subject][0];
    $('#question').text(question.q);
    $('#choices').html(''); //Clearing answer choices
    let currChoices = choices[subject][question.category];
    currChoices.splice(currChoices.indexOf(question.a),1);
    for (var i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random()*currChoices.length);
        $('#choices').append($("<div class='tab'> <p>" + currChoices[randomIndex] + "</p> </div>"));
        currChoices.splice(randomIndex,1);
    };
    
    $("<div class='tab'> <p>" + question.a + "</p> </div>").insertBefore($("#choices").children()[Math.floor(Math.random()*3)]);
    
};

myGameStats.reset();

display("History");

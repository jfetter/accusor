$(document).ready(init);
function init() {
    $(document).on('keypress', cueStart);
}

/////// ***** utility functions ***** ///////

//scan through and array to see if it contains a certain value 
//and replace the value with another value if it does not match 
var replaceMisses = function(array, value, replacement) {
    return array.map(function(item, index, all) {
        if (value === item) {
            item = item;
        }// end if
        else {
            if (replacement.constructor === Array) {
                item = replacement[index];
            } 
            else {
                item = replacement
            };
        }
        return item;
    })
}


var chooseRandomElement = function(array) {
    return array[Math.floor((Math.random() * (array.length - 2)) - 1)];
};

// make screen flash like lightening
var lightening = function() {
    return $("body").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    //$('#sound_tag')[0].play();
};

//switch up the picture in an array
switchPic = function(image, count) {
    return $(".pic").attr("src", image[count]);
};

/////// ***** ASSIGN AN ANSWER FOR THIS GAME **** ////////
function Answer() {
    //array of randomo words (possible answers)
    this.words = ["it", "can", "be", "intimidating", "to", "leave", "your", "job", "and", 
    "pursue", "novel", "career", "opportunities", "but", "ultimately", "when", "given", "only", 
    "one", "life", "experiencing", "more", "challenging", "oneself", "seems", "better", "than", 
    "sticking", "with", "status", "quo", "ride", "tigers", "drive", "racecars", "communicate", 
    "with", "computers", "eat", "weird", "fruit", "but", "never", "stagnate", "thinking", "up", 
    "words", "tedious", "dialogue", "quotes", "you're", "the", "same", "decaying", "organic", "matter", 
    "everything", "else", "compost", "heap", "singing", "dancing", "disappear", "zipper", "canvas", 
    "bit-coin", "grandiose", "gregarious", "egregious", "narcissistic", "earthquake", "tornado", "monsoon", 
    "aisle", "vile", "villain", "slain", "hero", "heroine", "sarcastic", "serious", "cereal", "surreal", 
    "cerebral", "inundated", "annotate", "transcribe", "transverse", "revise", "visor", "advisor", "survivor", 
    "blade", "runner", "speed", "racer", "persevere", "platonic", "dexterous", "ambidextrous", 
    "confined", "confounded", "contraption", "giggle", "jiggle", "juggle", "extraneous"];
    // array of lowercase letters
    this.alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    // select a random word to use as this game's answer
    this.word = chooseRandomElement(this.words);
    //split the word into an array of its component letters
    this.letters = this.word.split("");
}
// end Answer
var answer = new Answer();

////// **** STORE IMAGES FOR THIS GAME *** //////
function Gallows() {
    this.images = ["images/gallowscopy.png", "images/gallows2.png", "images/gallows3.png", "images/gallows4.png", "images/gallows5.png", "images/gallows6.png", "images/gallows7.png", "images/gallows8.png", "images/gallows9.png"];
    this.count = -1;
    this.advanceGallowsPic = function() {
        if (this.count < hitsAndMisses.misses.length) {
            this.count++;
            switchPic(this.images, this.count)
        }
    }
}
var gallows = new Gallows();
// end Gallows


////////// ******* GAME FUNCTIONS  ****** /////////

var cueStart = function(event) {
    
    // if enter key, go through intro dialogue 
    if (String(event.keyCode) == 13) {
        
        introduction.advance();
    }
    // if spacebar skip intor and go straight to game 
     
    else if (String(event.keyCode) == 32) {
        hangman.setUpGameDisplay();
    }
}


Introduction = function() {
    crimes = ["literally using the word literally figuratively", "making a run on sentenced that just went on and on long after it had stopped making sense and everyone had stopped caring and hoped it would end but it didn't", "cow-tipping", "putting a comma in a coma", "acting like 'your' and 'you're' are the same thing", "failure to complete your sentence...", "public indecent text poster", "alligations of alliteration for ulterior allocation", "throwing pi in Math class", "continuing to tell that one 'orange you glad I didn't say banana' joke too late into adulthood", "punishing your friends with puns you should've punted"];
    speech = ["You may be wondering why you're here...", "You are being tried by the word police for...", chooseRandomElement(crimes), "to prove your innocence you must correctly guess the word I am thinking of...", "the punishment for failure...", "is death...", "by hanging!"];
    
    this.advance = function() {
        if (!this.hasOwnProperty("sayNow"))
            this.sayNow = 0
        
        if (this.sayNow < speech.length) {
            var sayNow = speech[this.sayNow];
            this.sayNow++;
            $("#speech").text(sayNow)
        } else {
            lightening();
            $("#speech").text("press space to begin");
        }
        // end else
    }
    // end initialize 
};
// end introduction
var introduction = new Introduction();

Hangman = function() {
    // change display from intro to game play      
    this.setUpGameDisplay = function() {
        gallows.advanceGallowsPic();
        $("#speech").addClass("invisible");
        var blanks = replaceMisses(answer.letters, hitsAndMisses.guessed, "__ ");
        blanks = blanks.join("");
        $("#blanks").text(blanks);
        $("#blanks, #enterLetter, #usedLetters, #labelUsedLetters").removeClass("invisible");
        $("#enterLetter").focus();
        this.inputGuess();
    }
    
    //grab one letter (only 1 letter per turn) that the user has inputinto the enterLetter input field
    this.inputGuess = function() {
        return $("#enterLetter").on("keyup", this.takeGuess);
    }
    


    this.takeGuess = function() {
        var guess = $.trim($(this).val()).toLowerCase();
        if (answer.alphabet.indexOf(guess) > -1)
         
        {
            $("#enterLetter").addClass("invisible")
            hitsAndMisses.validateGuess(guess);
            //$("#enterLetter").off( "keyup", "#enterLetter", inputGuess.takeGuess )    
        } 
        else {
            $("#enterLetter").val("")
        }
        //end else
    }
    // end takeGuess  
    
    // if miss change to next gallows pic
    this.goOnOrEndGame = function() {
        if (hitsAndMisses.loser() == 1 || hitsAndMisses.winner() == 1) {
            gameEnd.end(hitsAndMisses.loserOrWinner)
        } else {
            gallows.advanceGallowsPic()
        }
    };
};
// end Hangman
var hangman = new Hangman();

function HitsAndMisses() {
    
    //keep track of guesses made
    this.hits = [];
    this.misses = [];
    
    //determine if current guess has been guessed already, and if not if it is in the answer or not
    // then display it. 
    this.validateGuess = function(guess) {
        // compare the letter that was input to see if it is an already used letter            
        if (this.hits.indexOf(guess) > -1 || this.misses.indexOf(guess) > -1) {
            lightening()
        } 
        else if (answer.letters.indexOf(guess) > -1) {
            this.hits.push(guess);
            var hitsSoFar = replaceMisses(answer.letters, guess, $("#blanks").text().split(" "));
            hitsSoFar = hitsSoFar.join(" ");
            $("#blanks").text(hitsSoFar);
        } else {
            this.misses.push(guess);
            $("#usedLetters").text(this.misses);
        }
        // end else
        $("#enterLetter").removeClass("invisible");
        $("#enterLetter").val("");
        $("#enterLetter").focus();
        hangman.goOnOrEndGame();
    }
    // end validateGuess
    
    // if all the letters are filled in winner == true
    this.winner = function() {
        if ($("#blanks").text().split(" ").join("") == answer.letters.join("")) 
        {
            return 1
        } 
        else 
        {
            return 0
        }
    }
    
    // if there have been 8 wrong guesses, loser == true
    this.loser = function() {
        if (this.misses.length >= 8) 
        {
            return 1
        } 
        else 
        {
            return 0
        }
    }

}
// end hitsAndMisses
hitsAndMisses = new HitsAndMisses();

GameEnd = function() {
    
    this.swingInNoose = function() {
        $("img").attr("src", "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT23N-2QQNLqxi3AnTD4eETYA4iqwFmO9OOtO_WaCYq2gdP5Rabosp9nl8")
        $("img").load(function() {
        // $("img").effect("explode")
        })
    }
    
    // images for ending animation of losing game.     
    this.escapePics = ["images/gallows9.png", "images/escape1.png", "images/escape2.png", "images/escape3.png", "images/escape4.png", "images/escape5.png", "images/escape6.png", "images/escape7.png", "images/escape8.png", "images/escape9.png", "images/escape10.png", "images/escape11.png", "images/escape12.png", "images/escape13.png"]
    this.picNumber = -1;

    this.runEscapePicsSlideShow = function() { setInterval(function(){
        if (gameEnd.picNumber < gameEnd.escapePics.length){
        gameEnd.picNumber++;
        switchPic(gameEnd.escapePics, gameEnd.picNumber)}
        else {gameEnd.end};
    }, 500);}
   

    this.happyDance = function() {
        $("img").attr("src", "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS_HZP8SIrFQ7ToR4ZrvLCk-1kPAhwIMulZS9erOtDoJ6Js8toUoHJDaJI")
        $("img").load(function() {
            $("img").effect("bounce", {
                times: 5
            }, 500);
        })
    }
    
    this.end = function() {
        $(document).unbind();
        $("#enterLetter, #usedLetters, #blanks").addClass("invisible")
        $("#enterLetter").off();
        if (hitsAndMisses.winner() == 1) {
            this.happyDance()
        } else {
            this.runEscapePicsSlideShow();
        }
        $("#labelUsedLetters").text("press any key to play again")
        $("*").on("keypress", (this.reload));
    }
    this.reload = function() {
        window.location.reload()
    };
}
var gameEnd = new GameEnd()

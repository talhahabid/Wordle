$(document).ready(async function() {

    const letter_keys = $('.letter-key');
    const secret_word = (await getWord()).toUpperCase();
    let index = 0;
    let word = "";
    let counter =  0;
    let end = false;

    console.log(secret_word);
    
    $('.keyboard-key').click(function(){
        const keyClicked = $(this).text();

        if (keyClicked === "ENTER"){
            keyEnter();


        }else if (keyClicked === "BACK"){
            keyBackSpace();

        }else {
            keyAlpha(keyClicked);
 
        }
        // console.log(`Counter: ${counter}`)
    });


    async function keyEnter(){
        if (counter === 5){

            makeWord();
            // console.log(word);

            const validWord = await checkForValidWord(word);
            // console.log(validWord);
            if(validWord){
                isValidWord()
            }else{
                notValidWord();
            }


            
            
            
        }
    }

    function keyBackSpace(){
        if(counter > 0){

            $(letter_keys[--index]).html("");
            
            // console.log(word);
            counter--;
            // console.log("BackSpace Pressed");
            
        }
    }

    function keyAlpha(key){
        if(counter < 5 && ! end){

            $(letter_keys[index++]).html(key);
            counter++;
            // console.log(`${key} Pressed`);
        }

    }

    function makeWord(){
        let temp = index-1;

        for (let i = 4; i >= 0; i--){
            word += $(letter_keys[temp-i]).text();
        }
    }

    function clearWord(){
        word = "";
    }

    function clearCounter(){
        counter = 0;
    }

    function checkWord(word) {

        let green = [], yellow = [], gray = [];
        let temp = secret_word.split("");
        let wordArray = word.split("");
    
        
        for (let i = 0; i < 5; i++) {
            if (temp[i] === wordArray[i]) {
                green.push({ letter: wordArray[i], index: i });
                temp[i] = null; 
                wordArray[i] = null; 
            }
        }
    
      
        for (let i = 0; i < 5; i++) {
            if (wordArray[i] !== null && temp.includes(wordArray[i])) {
                yellow.push({ letter: wordArray[i], index: i });
                temp[temp.indexOf(wordArray[i])] = null; 
                wordArray[i] = null; 
            }
        }
    

        for (let i = 0; i < 5; i++) {
            if (wordArray[i] !== null) {
                gray.push({ letter: wordArray[i], index: i });
            }
        }
    
        // console.log("Green: ", green);
        // console.log("Yellow: ", yellow);
        // console.log("Gray: ", gray);
        addColor(green, yellow, gray);

        if(word === secret_word){
            winner();
            
        }

    }
    

    function addColor(green, yellow, gray) {
        const keyboard_keys = $('.keyboard-key');
        const temp = index - 5;
    
       
        for (let i = 0; i < green.length; i++) {
            const letter = green[i].letter;
            const place = green[i].index;
    
            
            $(letter_keys[temp+place]).css({"background-color" : "green", "color" : "white"});
    
            
            keyboard_keys.each(function () {
                if ($(this).text() === letter) {
                        $(this).css({ "background-color": "green", "color": "white" });
                }
            });
        }
    
        
        for (let i = 0; i < yellow.length; i++) {
            const letter = yellow[i].letter;
            const place = yellow[i].index;
    
            
            $(letter_keys[temp+place]).css({"background-color" : "yellow", "color" : "white"});
    
           
            keyboard_keys.each(function () {
                if ($(this).text() === letter) {
                    if ($(this).css("background-color") !== "rgb(0, 128, 0)") {
                            $(this).css({ "background-color": "yellow", "color": "white" });
                    }
                }
            });
        }
    
        
        for (let i = 0; i < gray.length; i++) {
            const letter = gray[i].letter;
            const place = gray[i].index;
    
            
            $(letter_keys[temp+place]).css({"background-color" : "gray", "color" : "white"});
    
            
            keyboard_keys.each(function () {
                if ($(this).text() === letter) {
                    if ($(this).css("background-color") !== "rgb(0, 128, 0)" && $(this).css("background-color") !== "rgb(255, 255, 0)") {
                            $(this).css({ "background-color": "gray", "color": "white" });
                    }
                }
            });
        }
    }
    

    function winner(){
        $(".result").html("YOU WON!")
        $(".result").css({
            "opacity": "0.85",
            "background-color": "green",

        })
        end = true;
    }

    function loser(){
        $(".result").html(`Word was ${secret_word}`);
        $(".result").css({
            "opacity": "0.85",
            "background-color": "red",

        })
        end = true;
    }

    function notValidWord() {
        clearWord();
        $(".result").html("Enter a Valid Word");
        $(".result").css({
            "opacity": "0.85",
            "background-color": "black",
        });
    
    
        setTimeout(() => {
            $(".result").css({
                "opacity": "0", 
            });
        }, 1000);
    }

    function isValidWord(){
        checkWord(word);
            clearWord();
            clearCounter();
            // console.log("Enter Pressed");
        //    console.log(index);
            if(index === 30){
                loser();
            }
    }

    async function getWord() {
        const response = await(fetch('https://random-word-api.herokuapp.com/word?length=5'));
        const data = await response.json();
        return data[0];
        
    }

    async function checkForValidWord(word){
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            if(!response.ok) return false;
            const data = await response.json();
            // console.log(data);
            return true;
        } catch (error) {
            return false;
            
        }
        
    }

 

});

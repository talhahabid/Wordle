function getRandomWord(callBack){
    fetch('https://random-word-api.herokuapp.com/word?length=5')
    .then(response => {return response.ok ? response.json() : false;})
    .then(info => {callBack(info);})
    .catch(error => {callBack(error)})
 }

 
getRandomWord((word) => {

    console.log(word);
    const secretWord = word.toString().toUpperCase();
    const stack = [];
    const buttons = document.querySelectorAll('button');
    const letterBoxes = document.querySelectorAll('.Letter-Box');
    let nextRow = 0;




    function validWord(word, callBack){
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {return response.ok ? response.json() : false;})
        .then(info => {callBack(info);})
        .catch(error => {callBack(false)})
    }
    


    buttons.forEach((button) => {
        button.addEventListener('click', () => {

            const keyPressed = button.innerHTML;
            if(stack.length == 5){
                if(keyPressed === 'Enter'){

                    validWord(stack.join(''), (info) =>{
                        if(info != false){

                            const values = getLetters(stack, secretWord);
                            properPrintInfo(values)
                            highlightCorrectLettersCSS(values);
                            nextRow++;
                            stack.length = 0; 
                            if(values.lettersInCorrectIndex.letter.length === 5){
                                document.body.innerHTML = 'YOU WON!!!';
                            }

                        }else{
                            alert("Not a real word");
                        }
                    })
    
                    
                }
            
            //add letter to stack & and letterBox
            }else if (keyPressed.length === 1 && keyPressed.match(/[a-z]/i)) { 
                for (let i = 0; i < letterBoxes.length; i++) {
                    if (letterBoxes[i].innerHTML === '') {
                    letterBoxes[i].innerHTML = keyPressed;
                    stack.push(keyPressed);
                    break;
                    }
                }
        
            } 
            //remove letter for backspace
            if (keyPressed === "Backspace") {
                for (let i = letterBoxes.length - 1; i >= nextRow*5; i--) { 
                    if (letterBoxes[i].innerHTML !== '') {
                    letterBoxes[i].innerHTML = '';
                    stack.pop();
                    break;
                    }
                }
            }
            
        });
        
    })

    document.addEventListener('keydown',() => {
        const keyPressed = event.key.charAt(0).toUpperCase() + event.key.slice(1).toLowerCase();


        if(stack.length == 5){
            if(keyPressed === 'Enter'){
                validWord(stack.join(''), (info) =>{
                    if(info != false){

                        const values = getLetters(stack, secretWord);
                        properPrintInfo(values)
                        highlightCorrectLettersCSS(values);
                        nextRow++;
                        stack.length = 0; 

                        if(values.lettersInCorrectIndex.letter.length === 5){
                            document.body.innerHTML = 'YOU WON!!!';
                        }

                    }else{
                        alert("Not a real word");
                    }
                })
            }
        
        //add letter to stack & and letterBox
        }else if (keyPressed.length === 1 && keyPressed.match(/[a-z]/i)) { 
            for (let i = 0; i < letterBoxes.length; i++) {
                if (letterBoxes[i].innerHTML === '') {
                letterBoxes[i].innerHTML = keyPressed;
                stack.push(keyPressed);
                break;
                }
            }

        } 
        //remove letter for backspace
        if (keyPressed === "Backspace") {
            for (let i = letterBoxes.length - 1; i >= nextRow*5; i--) { 
                if (letterBoxes[i].innerHTML !== '') {
                letterBoxes[i].innerHTML = '';
                stack.pop();
                break;
                }
            }
        }






        //make button light up (CSS)
        buttons.forEach((button) => { 
            if(button.innerHTML === keyPressed){
                button.classList.add('Key-pressed-down');
                setTimeout(() => {
                    button.classList.remove('Key-pressed-down');
                }, 150);
            }
        });

    });


    function getLetters(stack, word) {

        const values = {
            lettersInWord: [],
            lettersInCorrectIndex: {
                index: [],
                letter: []
            }
        };

        stack.forEach((letter, index) => {

            if(word[index] === letter){
                values.lettersInCorrectIndex.index.push(index); 
                values.lettersInCorrectIndex.letter.push(letter);
                
            }else if(word.includes(letter)){
                values.lettersInWord.push(letter);
            }
            

        });

        return values;
    }



    function highlightCorrectLettersCSS(values){

        const correctPlacement = values.lettersInCorrectIndex.letter;
        const correctLetter = values.lettersInWord;
        const correctIndexes = values.lettersInCorrectIndex.index;

        buttons.forEach((button) => {

            if(correctPlacement.includes(button.innerHTML)){
                button.classList.remove('button-go-yellow');
                button.classList.add('button-go-green');

            }
            else if(correctLetter.includes(button.innerHTML) && !button.classList.contains('button-go-green')){
                button.classList.add('button-go-yellow');
    

            }
        });

        for(let i = 0; i < 5; i++){
            const letterBox = letterBoxes[i+nextRow*5];
            
            if(correctIndexes.includes(i)){
                letterBox.classList.add('button-go-green');
            }
            else if(correctLetter.includes(letterBox.innerHTML)){
                letterBox.classList.add('button-go-yellow');

            }else{
                letterBox.classList.add('button-go-dark');
            }
        }


    }



    function properPrintInfo(values){
        print(`         CorrectLetter: ${values.lettersInWord}\n
            CorrectPlacement: ${values.lettersInCorrectIndex.letter}\n
            Thier placemnet: ${values.lettersInCorrectIndex.index}`)
    }


    print = (s) => console.log(s);
})

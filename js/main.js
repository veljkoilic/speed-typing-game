$(document).ready(function(){
    $("#reload").on("click", function(){
        window.location.reload(false)
    })

        //quote api ajax call
        $.ajax({
            url: "https://api.quotable.io/random",
            success: function(result){
                const text = result.content;

                
                let explodedText = "";
                let textArray = text.split("");
            
                for (let i = 0; i < textArray.length; i++) {
                    if(textArray[i] == " "){
                        explodedText += `
                        <span id="span${i+1}" class="spanWidth"> &nbsp; </span>
                        
                        `
                    }else{
                        explodedText += `
                        <span id="span${i+1}"> ${textArray[i]} </span>
                        
                        `
                    }
            
                    
                }
                
                console.log(text)

            
                document.getElementById("text").innerHTML = explodedText;
                document.getElementById("characterCount").innerText +="Character count: " + text.length;
                let typingErrors = 0;
                $("#textArea").on("input",function(e){
    
                    let inputText = $("#textArea").val();
                    document.getElementById("characterCount").innerText = "Character count: " + String(text.length - inputText.length);

                    if(inputText == text){
                        console.log(timer.innerHTML);
                        if(confirm("Completed! Your time was: "+ timer.innerHTML)){
                            let score = {
                                letterCount: inputText.length,
                                time: $("#timer").text(),
                                typingErrors: typingErrors
                                
                            }
                            
                            console.log(localStorage)
                            if (localStorage.getItem("scoreboard") === null) {
                                let scoreboard = [];
                                scoreboard.push(score)
                                localStorage.setItem("scoreboard", JSON.stringify(scoreboard))
                            }else{
                                let scoreboard = JSON.parse(localStorage.getItem("scoreboard"))
                                scoreboard.push(score)
                                localStorage.setItem("scoreboard", JSON.stringify(scoreboard))

                            }



                            location.reload(); 
                        }else{
                            location.reload(); 
                        }
                    }
                    //highlight current letters
                    $(".good:last").prev().removeClass("current")
                    $(".good:last").removeClass("current")
                    $(".good:last").next().next().addClass("current")
                    $(".good:last").next().removeClass("current")
                    console.log("iznad ifa: " + text)

                    if(inputText == result.content.substring(0, inputText.length)){
                        console.info('Ispravno')
                        console.log(text)
                        console.log(result.content.substring(0, inputText.length))

                        console.log(inputText.length + 1);
                        //highlight correct letters
                        try{
                            document.getElementById("span"+inputText.length).classList.remove("bad")
                        }catch{

                        }
                        try{
                            document.getElementById("span"+inputText.length).classList.add("good")

                        }catch{

                        }
                        console.log(inputText);
                        
                    }else{
                        console.error("Greska");
                        console.log(text)
                        typingErrors++

                        //highligh mistake
                        document.getElementById("span"+inputText.length).classList.remove("good")
                        document.getElementById("span"+inputText.length ).classList.add("bad")

                        //highlight current letters if there is a mistake

                        $(".bad:last").prev().removeClass("current")
                        $(".bad:last").removeClass("current")
                        $(".bad:last").next().removeClass("current")

                        //stop entry if there is a mistake
                        document.getElementById("textArea").value = inputText.substr(0, inputText.length - 1)
                        console.log(inputText.length + 1);
                        console.log(inputText);
            
                    }
            
                })
            },
            error: function(xhr){
                console.error(xhr)
            }
    
        })
    



    $("#text").on("click", function(){
        $("#reload").fadeOut();
        var i = 3;

            let interval = setInterval(() => {
                document.getElementById("countDown").innerHTML = "Starting In: " + i;
                i--;

            }, 1000);
        setTimeout(() => {  
            document.getElementById("countDown").innerHTML = "START!";
            document.getElementById("countDown").classList.remove("alert-warning")
            document.getElementById("countDown").classList.add("alert-success")
            $("#textArea").focus();
            clearInterval(interval);  
            let timer = 0;
            let timerInterval = setInterval(() => {
                timer++;
                if(!$("#textArea").is(":focus")){
                    $("#textArea").focus();

                }
                document.getElementById("timer").innerHTML = msToTime(timer);
            }, 100);
        }, 5000);
    })

    // Prevent deletion via backspace, delete and moving with arrow keys
    window.onkeydown = function (event) {

        if (event.which == 8 || event.which == 46 || event.which == 38 || event.which == 40) { 

             event.preventDefault();  

            }; 
    
    };

    function fillScoreboard(){
        scoreboard = JSON.parse(localStorage.getItem("scoreboard") || "[]");
        scoreOutput = ""
        if(scoreboard.length ==0){
            $("#scoreboard tbody").innerHTML += scoreOutput;

            scoreOutput += `<tr class="px-5 py-5"> <td> No past data </td> <td> Play to update. </td> </tr>`
        }
        scoreboard.forEach(score => {
            scoreOutput =`
                <tr>
                <td>${score.letterCount} </td>
                <td>${score.time} </td>
                <td>${score.typingErrors} </td>
                </tr>
            ` + scoreOutput;
        });
        document.getElementById("scoreboard").innerHTML += scoreOutput;
    }
    fillScoreboard()

    $("#resetProgress").on("click",function(){
        localStorage.clear();
        window.location.reload(false)

    })



    function msToTime(s) {
        var ms = s % 10;
        s = (s - ms) / 10;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;
      
        return "0" +mins + ':' + secs + '.' + ms;
      }

});
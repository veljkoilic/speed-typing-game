$(document).ready(function () {
  $("#reload").on("click", function () {
    window.location.reload(false);
  });
  //quote api ajax call
    const getQuote = () => {
        $.ajax({
            url: "https://goquotes-api.herokuapp.com/api/v1/random?count=1",
            success: (res)=>startGame(res),
            error: function (xhr) {
              console.error(xhr);
            },
          });
    }
    getQuote()
  $("#text").on("click", function () {

    $("#reload").fadeOut();
    var i = 3;
    let interval = setInterval(() => {
      document.getElementById("countDown").innerHTML = "Starting In: " + i;
      i--;
    }, 1000);

    setTimeout(() => {
      document.getElementById("countDown").innerHTML = "Go!";
      document.getElementById("countDown").classList.remove("alert-warning");
      document.getElementById("countDown").classList.add("alert-success");
      $("#textArea").focus();
      clearInterval(interval);
      let timer = 0;
      let timerInterval = setInterval(() => {
        timer++;
        if (!$("#textArea").is(":focus")) {
          $("#textArea").focus();
        }
        document.getElementById("timer").innerHTML = msToTime(timer);
      }, 100);
    }, 5000);
  });

  // Prevent deletion via backspace, delete and moving with arrow keys
  window.onkeydown = function (event) {
    if (event.which == 8 || event.which == 46 || event.which == 38 || event.which == 40) {
      event.preventDefault();
    }
  };

  function fillScoreboard() {
    scoreboard = JSON.parse(localStorage.getItem("scoreboard") || "[]");
    scoreOutput = "";
    if (scoreboard.length == 0) {
      $("#scoreboard tbody").innerHTML += scoreOutput;
      scoreOutput += `<tr class="px-5 py-5"> <td> No past data </td> <td> Play to update. </td> </tr>`;
    }
    scoreboard.forEach((score) => {
      scoreOutput =
        `
                <tr>
                <td>${score.letterCount} </td>
                <td>${score.time} </td>
                <td>${score.typingErrors} </td>
                </tr>
            ` + scoreOutput;
    });
    document.getElementById("scoreboard").innerHTML += scoreOutput;
  }
  fillScoreboard();

  //reset the scoreboard by clearing localstorage
  $("#resetProgress").on("click", function () {
    localStorage.clear();
    window.location.reload(false);
  });
  //input miliseconds, returns string in format 00:00:00
  function msToTime(s) {
    var ms = s % 10;
    s = (s - ms) / 10;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    mins < 10 ? mins = `0${mins}` : mins = mins
    secs < 10 ? secs = `0${secs}` : secs = secs

    return mins + ":" + secs + "." + ms;
  }
});

function startGame(result) {
    //The text from the api is split to characters
    const text = result.quotes[0].text;
    let explodedText = "";
    let textArray = text.split("");
    //for every character a new span is created
    for (let i = 0; i < textArray.length; i++) {
      if (textArray[i] == " ") {
        explodedText += `
                      <span id="span${i + 1}" class="spanWidth"> &nbsp; </span>
                      
                      `;
      } else {
        explodedText += `
                      <span id="span${i + 1}"> ${textArray[i]} </span>
                      
                      `;
      }
    }

    document.getElementById("text").innerHTML = explodedText;
    document.getElementById("characterCount").innerText += "Character count: " + text.length;

    let typingErrors = 0;
    $("#textArea").on("input", function (e) {
      let inputText = $("#textArea").val();
      document.getElementById("characterCount").innerText =
        "Character count: " + String(text.length - inputText.length);

      if (inputText == text) {
        if (confirm("Completed! Your time was: " + timer.innerHTML)) {
          let score = {
            letterCount: inputText.length,
            time: $("#timer").text(),
            typingErrors: typingErrors,
          };

          if (localStorage.getItem("scoreboard") === null) {
            let scoreboard = [];
            scoreboard.push(score);
            localStorage.setItem("scoreboard", JSON.stringify(scoreboard));
          } else {
            let scoreboard = JSON.parse(localStorage.getItem("scoreboard"));
            scoreboard.push(score);
            localStorage.setItem("scoreboard", JSON.stringify(scoreboard));
          }
          location.reload();
        }
      }
      //highlight current letters
      $(".good:last").prev().removeClass("current");
      $(".good:last").removeClass("current");
      $(".good:last").next().next().addClass("current");
      $(".good:last").next().removeClass("current");

      if (inputText == result.quotes[0].text.substring(0, inputText.length)) {
        //highlight correct letters
        try {
          document.getElementById("span" + inputText.length).classList.remove("bad");
        } catch {}
        try {
          document.getElementById("span" + inputText.length).classList.add("good");
        } catch {}
      } else {
        typingErrors++;

        //highligh mistake
        document.getElementById("span" + inputText.length).classList.remove("good");
        document.getElementById("span" + inputText.length).classList.add("bad");

        //highlight current letters if there is a mistake

        $(".bad:last").prev().removeClass("current");
        $(".bad:last").removeClass("current");
        $(".bad:last").next().removeClass("current");

        //stop entry if there is a mistake
        document.getElementById("textArea").value = inputText.substr(0, inputText.length - 1);
      }
    });
  }
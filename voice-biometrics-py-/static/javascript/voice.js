// hideElement('#progress');
hideElement("#environmentMessage");
hideElement("#vadMessage");
hideElement("#passphraseMessage"); //display="none"
hideElement("#acceptMessage");
hideElement("#rejectMessage");
hideElement("#authenticationComplete");
hideElement("#authenticationInComplete");
hideElement("#enrollmentComplete");

document.querySelector("#stopRecButton").classList.add("disabled");

var x = document.referrer;
console.log("The refferer of this page is : ", x);

////여기부터
var wavesurfer = WaveSurfer.create({
  container: "#waveform",
  waveColor: "#01BAB6",
  interact: false,
  cursorWidth: 0,
  barGap: 2,
  barHeight: 2,
  barWidth: 0,
  fillParent: true,
  forceDecode: true,
  plugins: [WaveSurfer.microphone.create()],
});

wavesurfer.microphone.on("deviceReady", function (stream) {
  console.log("Device ready!", stream);
});
wavesurfer.microphone.on("deviceError", function (code) {
  console.warn("Device error: " + code);
});

// start the microphone
wavesurfer.microphone.start();

// pause rendering
//wavesurfer.microphone.pause();

// resume rendering
//wavesurfer.microphone.play();

// stop visualization and disconnect microphone
//wavesurfer.microphone.stopDevice();

// same as stopDevice() but also clears the wavesurfer canvas
//wavesurfer.microphone.stop();

// destroy the plugin
//wavesurfer.microphone.destroy();

// create an audio in
mic = new p5.AudioIn();

// users must manually enable their browser microphone for recording to work properly!
mic.start();

// create a sound recorder

recorder = new p5.SoundRecorder();

// connect the mic to the recorder
recorder.setInput(mic);

// create an empty sound file that we will use to playback the recording
soundFile = new p5.SoundFile();

//여기까지 그냥 micro 지원하는지 체크하면서 
if (document.referrer == "http://localhost:8080/enroll") {
  // number of attempts for enrollment.
  var number_of_attempts = 3;
  console.log("number of attempts : ", number_of_attempts);
} else {
  // number of attempts for enrollment.
  var number_of_attempts = 1;
  console.log("number of attempts : ", number_of_attempts);
}

// One-liner to resume playback when user interacted with the page.
document.querySelector("#startRecButton").addEventListener("click", function () {

    // For the background sound
    //처음ㅇ에서 if문을 들어감
    if (document.querySelector("#passphraseMessage").style.display == "none") {
      showElement("#environmentMessage");
      console.log("You have started recording passphrase...");
      recorder.record(soundFile);
    } else {
      document.querySelector("#passphraseMessage").classList.add("green");
      console.log("You have started recording the background...");
      recorder.record(soundFile); 
    }
    //말 그대로 disabled enbled 
    document.querySelector("#startRecButton").classList.add("disabled");
    document.querySelector("#stopRecButton").classList.remove("disabled");
  });

document.querySelector("#stopRecButton").addEventListener("click", function () {

	if (document.querySelector("#passphraseMessage").style.display == "") {
    console.log("stop recording")
    document.querySelector("#stopRecButton").classList.add("disabled");
    document.querySelector("#passphraseMessage").classList.remove("green");

    hideElement("#passphraseMessage");
    showElement("#vadMessage");

    stopRecording();
  }
  // For the background sound
  else {
    console.log("stop background recording")
    document.querySelector("#startRecButton").classList.remove("disabled");
    document.querySelector("#stopRecButton").classList.add("disabled");

    hideElement("#environmentMessage");
    showElement("#vadMessage");

    stopBackgroundRecording();
  }
});

//맞아
//이런식으로 봐야됨 js파일 html파일 id같이 보면서
//데스트 ㅇ뭐가 이는지 ㅇㅇ슬슬 알거같음
//이거 밑에는 설명해줘
function stopRecording() {
  console.log("You have stopped recording...");
  recorder.stop(); // stop recorder, and send the result to soundFile

  console.log("Playing the audioifle now...");
  soundFile.play();

  // console.log("Saving the audio file now...");
  // p5.prototype.saveSound(soundFile, file_name); // save file

  console.log("Saving the SoundFile to a blob file ...");
  var soundBlob = soundFile.getBlob();

  // Now we can send the blob to a server...
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      console.log("xhr.resposne : ", xhr.response );
      if (xhr.response == "fail") {
        console.log("sucess with match to word")
        hideElement("#vadMessage");
        showElement("#rejectMessage");
      } else if (xhr.response == "pass") {
        hideElement("#vadMessage");
        showElement("#acceptMessage");
        number_of_attempts--;
        console.log("number of attempts : ", number_of_attempts);
      } else {
        showElement("#passphraseMessage");
        hideElement("#vadMessage");

        document.getElementById("randomPassphrase").innerHTML = xhr.response;
      }
    }
  };


  // 이런식으로 보기 불편하는데 원래는
  //voicep.py한테 많이 보내는거 아니야? 그래소ㅓvoice 구분하는거임
  //저 def voice()가 실행시작되는부분이 어디임? 그ㅓ 함수이지 아 그 
  // 
  xhr.open("POST", "/voice", true); //client에서 이거 요청해ㅐ서 
  xhr.send(soundBlob);

  console.log("Your http message has been sent.");
}

function stopBackgroundRecording() {
  console.log("You have stopped recording...");
  recorder.stop(); // stop recorder, and send the result to soundFile

  console.log("Playing the audioifle now...");
  soundFile.play();

  // console.log("Saving the audio file now...");
  // p5.prototype.saveSound(soundFile, file_name); // save file

  console.log("Saving the SoundFile to a blob file ...");
  var soundBlob = soundFile.getBlob();

  // Now we can send the blob to a server...
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      showElement("#passphraseMessage");
      hideElement("#vadMessage");
      document.getElementById("randomPassphrase").innerHTML = xhr.response;
      console.log("xjr.resposne : ", xhr.response);
		}else{
			console.log("xjr.resposne error : ", xhr.readyState);
		}
  };

  xhr.open("POST", "/vad", true);
  xhr.send(soundBlob);

  number_of_attempts--;
  console.log("Your http message has been sent.");
  console.log("number of attempts : ", number_of_attempts);
}

document
  .querySelector("#close_button_accept")
  .addEventListener("click", function () {
    if (true) {
      if (document.referrer == "http://localhost:8080/auth") //이게 auth일대고
      {
        hideElement("#acceptMessage");
        showElement("#vadMessage");
        hideElement("#passphraseMessage");

        var analysis_text = "Identifying user based on voice print";
        document.getElementById("recordBody").innerHTML = analysis_text;

        document.querySelector("#vadMessage").classList.add("green");
        document.querySelector("#vadMessage").classList.remove("yellow");

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
          if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            // showElement('#passphraseMessage');
            // hideElement('#vadMessage');
            // document.getElementById('randomPassphrase').innerHTML = xhr.response;
            console.log("xjr.resposne : ", xhr.response);

            if (xhr.response == "success") {
              showElement("#authenticationComplete");
            } else {
              showElement("#authenticationIncomplete");
            }
          }
        };
        console.log("request get verify")
        xhr.open("GET", "/verify", true);
        xhr.send();
      } else { ///end else referrer check localhost //이건 enroll일땐가 맞네
        hideElement("#acceptMessage");
        showElement("#vadMessage");
        hideElement("#passphraseMessage");

        var analysis_text = "Building Voice Print";
        document.getElementById("recordBody").innerHTML = analysis_text;

        document.querySelector("#vadMessage").classList.add("green");
        document.querySelector("#vadMessage").classList.remove("yellow");

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
          if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            // showElement('#passphraseMessage');
            hideElement("#vadMessage");
            document.getElementById('randomPassphrase').innerHTML = xhr.response;
            console.log("xjr.resposne : ", xhr.response);

            showElement("#enrollmentComplete");
          }
        };
        console.log("request get biometrics")
        xhr.open("GET", "/biometrics", true);
        xhr.send();
      }

    } else { //end check num of attempts
      document.querySelector("#startRecButton").classList.remove("disabled");

      hideElement("#acceptMessage");
      showElement("#vadMessage");
      hideElement("#passphraseMessage");

      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          showElement("#passphraseMessage");
          hideElement("#vadMessage");
          document.getElementById("randomPassphrase").innerHTML = xhr.response;
          console.log("xjr.resposne : ", xhr.response);
        }
      };

      xhr.open("GET", "/vad", true);
      xhr.send();
    }
  });

document
  .querySelector("#close_button_reject")
  .addEventListener("click", function () {
    document.querySelector("#startRecButton").classList.remove("disabled");

    showElement("#vadMessage");
    hideElement("#rejectMessage");
    hideElement("#passphraseMessage");

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        showElement("#passphraseMessage");
        hideElement("#vadMessage");
        document.getElementById("randomPassphrase").innerHTML = xhr.response;
        console.log("xjr.resposne : ", xhr.response);
      }
    };

    xhr.open("GET", "/vad", true);
    xhr.send();
  });

//id를 통해서 display = "none"
function hideElement(elSelector) {
  document.querySelector(elSelector).style.display = "none";
}

function showElement(elSelector) {
  document.querySelector(elSelector).style.display = "";
}
//오키오키
//이제 어느정도 해석 가능할듯
//떙쓰떙쓰
//만약에서 넘 이해 안 하면 ㅇ내가 콛 간단하게 다시 짤게
//ㄴㄴ이해해야지 ㅋㅋ
//근데 그 UI를 좀 바꿔야될거같긴함
//
//응 그 만약게 인정을 하여 어떤 서비를 한아ㅡㄴㄴㅇㄴㄴㄴㄴㄴㄴ
//그소리가 아니고 지금 UI가 너무 잘되있어서
//다음주에 교수님한테 보여줄 용도로 그냥 간단하게 버튼만 있는 UI?
// 그럼 한글로 바뀔까? 그거 내가 해봄 그부분 바꾸면되잖아
//random word ㅇㅋ 내도 시간이 되면 한번 해볼게요 오키 덍큐떙큐
// ㅋㅋ ㅇㅋ근데
//UI바꾸면 js에서 id도 다 바꿔야되는건가? 
//좀 복잡하는데 그냉 html에서 뭘추가하거나 text 바귈로 하자
//아니 그게 문제가 아니고 UI가 깃허브에서 주는 그대로잖아
//그거쓰면 안됌 표절임 아 ㅋㅋㅋ 어떻게 하면 좋을까 ㅋㅋ
//그냥 이미지만 바꿔버릴까? 그리고 그 그거있짷ㄴ아 
//말하면 signal 막 바뀌는거 그거 빼버리고
//그럼 교수님한테 prototype으로 보여줄때 의심안할듯 ㅋㅋㅋㅋㅋ

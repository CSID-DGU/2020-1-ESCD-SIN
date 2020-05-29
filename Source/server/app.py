
# This is used to dump the models into an object
import pickle
import datetime
import os                                               # For creating directories
import shutil                                           # For deleting directories
# from collections import defaultdict

import matplotlib.pyplot as plt
import numpy
import scipy.cluster
import scipy.io.wavfile
# For the speech detection alogrithms
import speech_recognition
# For the fuzzy matching algorithms
from fuzzywuzzy import fuzz
# For using the MFCC feature selection
from python_speech_features import mfcc
# For generating random words
from random_words import RandomWords
from sklearn import preprocessing
# For using the Gausian Mixture Models
from sklearn.mixture import GaussianMixture

from watson_developer_cloud import SpeechToTextV1

from flask_cors import CORS


# Note: Is there a better way to do this?
# This is the file where the credentials are stored
import config

speech_to_text = SpeechToTextV1(
    iam_apikey=config.APIKEY,
    url=config.URL
)

from flask import Flask, render_template, request, jsonify, url_for, redirect, abort, session, json

PORT = 5000

# Global Variables
random_words = []
random_string = ""
username = ""
user_directory = "Users/Test"
filename = ""
filename_wav = ""

app = Flask(__name__)
CORS(app)

@app.route('/home')
def home():
    return render_template('main.html')


# 음석을 인식을 먼저하기 위해서 아이디과 비밀번호를 입력해서 
# 여기서 사용자가 입력한 이름대로 파일을 생선한다.
@app.route('/enroll', methods=["GET", "POST"])
def enroll():
    global username
    global user_directory

    if request.method == 'POST':
        data = request.get_json()

        username = data['username']
        password = data['password']
        repassword = data['repassword']
        print(username, password, repassword)
        user_directory = "Users/" + username + "/"

        # 사용자는 이미 존재했으면 해당하는 User Overwriting ... 뭐라고해 야지
        if not os.path.exists(user_directory):
            os.makedirs(user_directory)
            print("[ * ] Directory ", username,  " Created ...")
        else:
            print("[ * ] Directory ", username,  " already exists ...")
            print("[ * ] Overwriting existing directory ...")
            shutil.rmtree(user_directory, ignore_errors=False, onerror=None)
            os.makedirs(user_directory)
            print("[ * ] Directory ", username,  " Created ...")

        return "pass"

    else:
        return "fail"

# 인증 API 
@app.route('/auth', methods=['POST', 'GET'])
def auth():
    global username
    global user_directory
    global filename

    user_exist = False

    if request.method == 'POST':

        data = request.get_json()
        print(data)

        # Clien부터 보낸 username과 password를 받아
        # Model 저장하는 경로
        user_directory = 'Models/'
        username = data['username']
        print("username", username)
        # password = data['password']

        print("[ DEBUG ] : What is the user directory at auth : ", user_directory)

        # Encode file name
        print("os.fsencode(user_directory : ", os.fsencode(user_directory))
        directory = os.fsencode(user_directory)

        # 해당하는 경로를 열어서 파일 리스트를 골람
        print("directory : ", os.listdir(directory)[1:])

        # 보낸 User과 이미 저장되어 있는 파일의 이름을 출력하여 비교한 다음에 만약에 있으면 OK
        for file in os.listdir(directory):
            print("file : ", file)
            filename = os.fsdecode(file)
            if filename.startswith(username):
                print("filename : ", filename)
                user_exist = True
                break
            else:
                pass

        # 사용자는 존재하면 Go go
        if user_exist:
            print("[ * ] The user profile exists ...")
            return "User exist"

        else:
            print("[ * ] The user profile does not exists ...")
            return "Doesn't exist"
    
    # 이 for문 꼭 필요하는가?
    else:
        print('its coming here')

# 이 API를 voice api이다
# Check Background_noise
@app.route('/vad', methods=['GET', 'POST'])
def vad():
    if request.method == 'POST':
        # global random_words #randoms words를 저장하는 변수
        # 파일을 열어 주라
        f = open('./static/audio/background_noise.wav', 'wb') # 쓰기만

        print("data", request.files['file'])
        # client 보내주는 blob 파일 저장해줘
        f.write(request.files['file'].read())
        f.close()

        background_noise = speech_recognition.AudioFile(
            './static/audio/background_noise.wav')

        # noise 파일 읽음
        # Adjusts the energy threshold dynamically using audio from source (an AudioSource instance) 
        # to account for ambient noise.
        with background_noise as source:
            speech_recognition.Recognizer().adjust_for_ambient_noise(source, duration=5)

        # Check voice activity 인가? 모르겟네요 ㅋㅋ
        print("Voice activity detection complete ...")

        #random_words = RandomWords().random_words(count=5)
        #print(random_words)
        random_words = random_hangeul()
        print("randoms global", random_words)
        return " ".join(random_words)
    else:
        # 이거 뭐죠?
        background_noise = speech_recognition.AudioFile(
            './static/audio/background_noise.wav')
        with background_noise as source:
            speech_recognition.Recognizer().adjust_for_ambient_noise(source, duration=5)

        print("Voice activity detection complete ...")

        # random words 다시 보낸다.
        random_words = RandomWords().random_words(count=5)
        random_words = random_hangeul()
        print(random_words)
        return "  ".join(random_words)


# 받은 5개 단어를 말해서 다시 보내서 이 API를 체크함
@app.route('/voice', methods=['GET', 'POST'])
def voice():
    global user_directory
    global filename_wav

    print("[ DEBUG ] : User directory at voice : ", user_directory)

    if request.method == 'POST':
        import json
        #    global random_string
        global random_words
        global username

        # 보내는 파일 저장함
        result = request.form.to_dict(flat=False)
        words = json.loads(result["words"][0])
        print(words)

        print("file send state: ", request.files['file'])
        filename_wav = user_directory + username + '.wav'
        f = open(filename_wav, 'wb')
        f.write(request.files['file'].read())
        f.close()


        # 파일 읽어옴
        # with open(filename_wav, 'rb') as audio_file:
        #     recognised_words = speech_to_text.recognize(audio_file, content_type='audio/wav').get_result()
        naver_words = naver_STT(filename_wav)
        print("Naver Sppeech to Text thinks you said: " + " ".join(naver_words) + "\n")

        #recognised_words = str(recognised_words['results'][0]['alternatives'][0]['transcript'])

        #print("IBM Speech to Text thinks you said : " + recognised_words)
        #print("IBM Fuzzy partial score : " + str(fuzz.partial_ratio(words, recognised_words)))
        #print("IBM Fuzzy score : " + str(fuzz.ratio(words, recognised_words)))       

        google_words = run_quickstart(filename_wav)
        print("Google Sppeech to Text thinks you said: " + " ".join(google_words) + "\n")

        # 단어를 5개를 말해서 음석을 받아서 체크함
        # 만약에 5개를 맞게 말하면 pass 또한 5개를 인식을 못하는거나 정확성을 낮지 않으면  ㅋㅋㅋ 

        total_words = naver_words + google_words

        if(checkList(words, total_words)) : 
            return "pass"
        else :
            print("\nThe words you have spoken aren't entirely correct. Please try again ...")
            os.remove(filename_wav)
            return "fail"

        # if fuzz.ratio(words, recognised_words) < 65:
        #     print(
        #         "\nThe words you have spoken aren't entirely correct. Please try again ...")
        #     os.remove(filename_wav)
        #     return "fail"
        # else:
        #     pass
        # return "pass" #음석 성공했네요 ㅋㅋㅋ 축가합니다

    else:
        return "Oh no no"


# 아 만약에 위에 API를 성곡하면 이거 시작한다.
@app.route('/biometrics', methods=['GET', 'POST'])
def biometrics():
    global user_directory
    print("[ DEBUG ] : User directory is : ", user_directory)

    if request.method == 'POST':
        pass
    else:
        # MFCC
        print("Into the biometrics route.")

        # 사용자 저장한 파일 읽어
        directory = os.fsencode(user_directory)
        features = numpy.asarray(())

        # 저장되어 있는 wav 파일 사용자의 이름 맞게를 출력함
        for file in os.listdir(directory):
            filename_wav = os.fsdecode(file)
            if filename_wav.endswith(".wav"):
                print("[biometrics] : Reading audio files for processing ...")
                (rate, signal) = scipy.io.wavfile.read(user_directory + filename_wav)

                extracted_features = extract_features(rate, signal)

                if features.size == 0:
                    features = extracted_features
                else:
                    features = numpy.vstack((features, extracted_features))

            else:
                continue

        # GaussianMixture Model 만듦
        print("[ * ] Building Gaussian Mixture Model ...")

        gmm = GaussianMixture(n_components=16,
                            max_iter=200,
                            covariance_type='diag',
                            n_init=3)

        gmm.fit(features)
        print("[ * ] Modeling completed for user :" + username +
            " with data point = " + str(features.shape))

        # dumping the trained gaussian model
        # picklefile = path.split("-")[0]+".gmm"
        print("[ * ] Saving model object ...")
        pickle.dump(gmm, open("Models/" + str(username) + ".gmm", "wb"), protocol=None)
        print("[ * ] Object has been successfully written to Models/" +
            username + ".gmm ...")
        print("\n\n[ * ] User has been successfully enrolled ...")

        features = numpy.asarray(())

        return "User has been successfully enrolled ...!!"

# 다음부터 사용자를 인증합니다. #!비밀번호 체크해야 함
@app.route("/verify", methods=['GET'])
def verify():
    global username
    global filename
    global user_directory
    global filename_wav

    print("[ DEBUG ] : user directory : " , user_directory)
    print("[ DEBUG ] : filename : " , filename)
    print("[ DEBUG ] : filename_wav : " , filename_wav)

    # ------------------------------------------------------------------------------------------------------------------------------------#
    #                                                                LTSD and MFCC                                                     #
    # ------------------------------------------------------------------------------------------------------------------------------------#

    # (rate, signal) = scipy.io.wavfile.read(audio.get_wav_data())
    (rate, signal) = scipy.io.wavfile.read(filename_wav)

    extracted_features = extract_features(rate, signal)

    # ------------------------------------------------------------------------------------------------------------------------------------#
    #                                                          Loading the Gaussian Models                                                #
    # ------------------------------------------------------------------------------------------------------------------------------------#

    gmm_models = [os.path.join(user_directory, user)
                for user in os.listdir(user_directory)
                if user.endswith('.gmm')]

    # print("GMM Models : " + str(gmm_models))

    # Load the Gaussian user Models
    models = [pickle.load(open(user, 'rb')) for user in gmm_models]

    user_list = [user.split("/")[-1].split(".gmm")[0]
                for user in gmm_models]

    log_likelihood = numpy.zeros(len(models))

    for i in range(len(models)):
        gmm = models[i]  # checking with each model one by one
        scores = numpy.array(gmm.score(extracted_features))
        log_likelihood[i] = scores.sum()

    print("Log liklihood : " + str(log_likelihood))

    identified_user = numpy.argmax(log_likelihood)

    print("[ * ] Identified User : " + str(identified_user) +
            " - " + user_list[identified_user])

    auth_message = ""

    if user_list[identified_user] == username:
        print("[ * ] You have been authenticated!")
        auth_message = "success"
    else:
        print("[ * ] Sorry you have not been authenticated")
        auth_message = "fail"

    return auth_message


def calculate_delta(array):
    """Calculate and returns the delta of given feature vector matrix
    (https://appliedmachinelearning.blog/2017/11/14/spoken-speaker-identification-based-on-gaussian-mixture-models-python-implementation/)"""

    print("[Delta] : Calculating delta")

    rows, cols = array.shape
    deltas = numpy.zeros((rows, 20))
    N = 2
    for i in range(rows):
        index = []
        j = 1
        while j <= N:
            if i-j < 0:
                first = 0
            else:
                first = i-j
            if i+j > rows - 1:
                second = rows - 1
            else:
                second = i+j
            index.append((second, first))
            j += 1
        deltas[i] = (array[index[0][0]]-array[index[0][1]] +
                     (2 * (array[index[1][0]]-array[index[1][1]]))) / 10
    return deltas


def extract_features(rate, signal):
    print("[extract_features] : Exctracting featureses ...")

    mfcc_feat = mfcc(signal,
                    rate,
                    winlen=0.020,  # remove if not requred
                    preemph=0.95,
                    numcep=20,
                    nfft=1024,
                    ceplifter=15,
                    highfreq=6000,
                    nfilt=55,

                    appendEnergy=False)

    mfcc_feat = preprocessing.scale(mfcc_feat)

    delta_feat = calculate_delta(mfcc_feat)

    combined_features = numpy.hstack((mfcc_feat, delta_feat))

    return combined_features

################### 한국어 음성인식 ###################
############### 음성인식된 string return ##############
def run_quickstart(dir_location):
    # [START speech_quickstart]
    import io
    import os
    # os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="C:\\Users\\wnddk\\Downloads\\speech-to-text-api-277112-f2c7c16d8141.json"
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="./key.json"
    # Imports the Google Cloud client library
    # [START migration_import]
    from google.cloud import speech
    from google.cloud.speech import enums
    from google.cloud.speech import types
    # [END migration_import]

    # Instantiates a client
    # [START migration_client]
    client = speech.SpeechClient()
    # [END migration_client]

    # The name of the audio file to transcribe
    file_name = dir_location
    #file_name = os.path.join(
    #    os.path.dirname(__file__),
    #    '.',
    #    'file.wav')

    # Loads the audio into memory
    with io.open(file_name, 'rb') as audio_file:
        content = audio_file.read()
        audio = types.RecognitionAudio(content=content)

    config = types.RecognitionConfig(
        encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=44100,
        language_code='ko-KR',
        audio_channel_count = 2,
        )

    # Detects speech in the audio file
    response = client.recognize(config, audio)

    for result in response.results:
        #print('Transcript: {}'.format(result.alternatives[0].transcript))
        resultString = '{}'.format(result.alternatives[0].transcript)
        
    # [END speech_quickstart]
    return resultString.split(' ')


def random_hangeul():
    import random as rand

    randomText=["부채","튜브","바지","버스","보트","바나나","마스크","모래",
                "무지개","개미","하마","모자","체리","포도","배","감","사과",
                "브로콜리","완두콩","옥수수","버섯","장갑","목도리","딸기",
                "귤","키위","수박","참외","파인애플","안녕하세요","반갑습니다",
                "오징어","문어","책상","의자","기러기",
                ]
    randomText=["먹자","먹자","먹자","먹자","먹자"]
    textString = []
    for i in range (0,5):
        textString.append(randomText[rand.randint(0,len(randomText)-1)])
    
    return textString

#####################################################################
#####################################################################
def naver_STT(fileDir):
    import json
    import requests

    data = open(fileDir,'rb') # STT를 진행하고자 하는 음성 파일

    Lang = "Kor" # Kor / Jpn / Chn / Eng
    URL = "https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=" + Lang
    
    ID = "9q5chqjnfr" # 인증 정보의 Client ID
    Secret = "EPxQOfPEu1AzOjnBZByLwFXcwd2fdgGPcCFxUF9h" # 인증 정보의 Client Secret
    
    headers = {
        "Content-Type": "application/octet-stream", # Fix
        "X-NCP-APIGW-API-KEY-ID": ID,
        "X-NCP-APIGW-API-KEY": Secret,
    }
    response = requests.post(URL,  data=data, headers=headers)
    rescode = response.status_code

    if(rescode == 200):
        temp_string = " "
    else:
        print("Error : " + response.text)

    temp_string = response.text
    temp_result = temp_string.split('\"')

    return temp_result[3].split(' ')

    #return " ".join(temp_result[3].split(' '))


def checkList(random_data,recognized_data):
    
    count = 0
    for i,elem in enumerate(random_data):
        if elem in recognized_data:
            count = count + 1
    
    if count > 2:
        return True
    else :
        return False

if __name__ == '__main__':
    app.run(host='localhost', port=PORT, debug=True)

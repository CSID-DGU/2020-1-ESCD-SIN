# 2020-1-ESCD-SIN
기업사회맞춤형프로젝트1 SIN팀.

#### 프로젝트 주제
사용자 음성을 활용한 서비스 사용자 인증 및 접근 제어 시스템 개발

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

1. Install and set up Python 3.
1. Sign up for an [IBM Cloud account](https://ibm.biz/devfest2019).
   <p align="center">
    <img src="https://github.com/bedangSen/VoiceSens/blob/master/Images/Screenshot_2019-03-31%20Sign%20up%20for%20IBM%20Cloud.png?raw=true" width="800"  align="middle">
   </p>
  
1. Create an instance of the Speech to Text service and get your credentials:
    - Go to the [Speech to Text](https://console.bluemix.net/catalog/services/speech-to-text) page in the IBM Cloud Catalog.
    - Log in to your IBM Cloud account.
    - Click **Create**.
    - Click **Show** to view the service credentials.
    - Copy the `iam_apikey` and `url` values.
    
    <p align="center">
    <img src="https://i.imgur.com/Y0vZNHr.gif" align="middle">
   </p>

## Configuring the application


1. Open the `config.py.text` file and change the username and password for the text to speech service. Then rename the file to `config.py` 

```python
APIKEY = "APIKEY"  
URL = "URL"  
```

## Running locally

1. Clone the repository. 

    ```
    https://github.com/CSID-DGU/2020-1-ESCD-SIN.git
    ```
    
1. Move into the project directory. 

    ```
    cd 2020-1-ESCD-SIN
    ```
	
1. Install all the required libraries, by installing the requirements.txt file.

    ```
    pip install -r requirements.txt
    ```

    
1. Run the application.

    ```
    python voice.py
    ```
    
1. Go to `http://localhost:8080`

## Demo

#### 1. VoiceSens Homepage

<p align="center">
 <a href="https://imgur.com/JuokbKe"><img src="https://i.imgur.com/JuokbKe.gif" title="source: imgur.com" /></a>
</p>

<br><br>

 The first thing that you see when you open the web page are two options:
 1. Enroll a new user
 1. Authenticate an existing user
 

## 프로젝트 설계 발표 링크
https://youtu.be/eum-ErPIMT0 

## 팀원 
2014112081 정세인
2017112153 응웬딩 흐엉
2018112013 이서연
2018112042 송승민


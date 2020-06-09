import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ToggleButton from 'react-toggle-button'
import './Register.scss'
import WaveSurferContainer from '../../../../component/WaveSurferContainer/WaveSurferContainer'
import Http from '../../../../component/Http'
export default class Register extends Component {
    static propTypes = {
        prop: PropTypes
    }
    constructor(props){
        super(props)
        this.state = {
            checkVoice: false,

            id: "",
            email: "",
            password: "",
            confirmPassword: "",
            blob: {},
            words: [],
            
            checkNoiseLv1: false,
            checkVoiceLv2: false,
        }
    }
    handleCheck = ( event ) => {
        const { name, value} = event.target;
        this.setState({
            [name] : value
        })
    }
    subMit = () =>{
        const { checkVoice } = this.state;
        if(!checkVoice){ //음성 없이 회원가입
            const {id, email, password, confirmPassword} = this.state;
            if(id && email && password && confirmPassword){
                Http.post({
                    path: 'joinnoVoice',
                    payload: {username: id, email, password}
                }).then(res => {
                    const { data } = res;
                    if(data === "pass"){
                        alert("회원가입 성곡했습니다")
                        this.props.history.push('/')
                    }
                    else
                        alert("이미 존재 사용자입니다. 정보를 다시 입력해주세요.")
                }).catch(err => {
                    console.log(err)
                })
            }else{
                alert("빈 값을 입력헀습니다. 다시 확인해주세요")
            }
        }else{
            alert("회원가입 성곡했습니다")
        }
        // this.props.history.push('/')
    }
    hanleChangeVoice = (blob) => {
        const { checkNoiseLv1, id, email, password, confirmPassword } = this.state;
        //먼저를 환경의 노이즈를  API를 보내서 5개 단어를 다시 받음
        if(!checkNoiseLv1) //Noise check 
        {
            const data = new FormData();
            data.append('file',blob)
            Http.post({
                path: '/vad',
                headers: {
                    'Content-Type': `multipart/form-data`,
                },
                payload: data
            }).then((res) => {
                const { data } = res;
                const words = data.split(" ");
                this.setState({
                    words,
                    checkNoiseLv1: true
                })
            }).catch((err) => {
                console.log(err)
            })
        }else{
            const { checkVoiceLv2 } = this.state;
            if(!checkVoiceLv2)
            {
                //노이즈 체크한 단계를 넘어서 단어를 5개를 받아서 2간계를 넘
                //받은 5개 단어를 받아서 음성을 보냄
                const data = new FormData();
                const { words } = this.state;
                data.append('file',blob);
                data.append('words',JSON.stringify(words))
                Http.post({
                    path: '/voice',
                    headers: {
                        'Content-Type': `multipart/form-data`,
                    },
                    payload: data
                }).then((res) => {
                    const { data } = res;
                    if(data === "pass"){
                        this.setState({
                            checkVoiceLv2 : true
                        })
                    }else{
                        alert("단어가 음성 인식을 실패했습니다 다시 해주세요")
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }else{ //단어를 음석을 한 다음에 GMM 파일 만들기 위해서 API 호줄
                Http.get({
                    path: '/biometrics'
                }).then(res => {
                    const { data } = res
                    if(data === "User has been successfully enrolled ...!!")
                    {
                        alert("음석 인식 인증 기능을 추가되었습니다.")
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    }
    getWordsforVoice = (value) =>{
        const { id, email, password, confirmPassword, checkVoice } = this.state;
        if(id && email && password && confirmPassword){
            if(password !== confirmPassword){
                alert("입력된 비밀번호를 확인 해주세요")
                return;
            }
            Http.post({
                path: '/enroll',
                payload: {username: id, email: email,  password: password}
            }).then((res) => {
                const { data } = res;
                if(data === 'created user'){
                    this.setState({
                            checkVoice: !value,
                    })
                }else{
                    alert("사용자 이미 존재합니다. 다시 입력해주세요")
                }
            }).catch((err) => {
                console.log(err)
            })   
        }else{
            alert("음석 인식을 하기 위해서 먼저 위에 정보를 입력해주세요");
        }
    }
    render() {
        const { checkVoice, id, email, password, confirmPassword, words,checkNoiseLv1, checkVoiceLv2} = this.state;
        if(checkNoiseLv1 && !checkVoiceLv2){
        }
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-md-3 col-sm-6 col-xs-12 row-container">
                        <form method="post" onClick = {(e) => e.preventDefault()}>
                            <h1 className="text-center">Register</h1>
                            <div className="form-group">
                                <label for="id">ID</label>
                                <input type="text" name="id" id="id" onChange= {this.handleCheck} className="form-control" placeholder="Id" value= {id}/>
                            </div>
                            <div className="form-group">
                                <label for="id">Email</label>
                                <input type="text" name="email" id="email" onChange= {this.handleCheck} className="form-control" placeholder="Email..." value= {email}/>
                            </div>
                            <div className="form-group">
                                <label for="id">Password</label>
                                <input type="password" name="password" id="password" onChange= {this.handleCheck} className="form-control" placeholder="Password..." value= {password}/>
                            </div>
                            <div className="form-group">
                                <label for="id">Confirm Password</label>
                                <input type="password" name="confirmPassword" id="id" onChange= {this.handleCheck} className="form-control" placeholder="Password..." value= {confirmPassword}/>
                                {
                                    confirmPassword &&
                                        password !== confirmPassword ?
                                            <p style={{color: "red"}}>비밀번호 동일하지 않습니다</p>
                                        : ""
                                }
                            </div>
                            <div className="form-group">
                                <label for="id">Voice Authentication</label>
                                <div className = "checkVoice">
                                    <ToggleButton
                                        value={ this.state.checkVoice || false }
                                            onToggle={(value) => {
                                            this.getWordsforVoice(value);
                                    }} />
                                </div>
                                {
                                    checkNoiseLv1 && 
                                        <p style = {{textAlign: "center"}}>
                                            {
                                                words.map(item => (
                                                    item + " "
                                                ))
                                            }
                                        </p>
                                    }
                                {
                                    checkVoice &&  
                                    <>
                                        {
                                            !checkNoiseLv1 && 
                                            "노이즈 체그 단계입니다"
                                        }
                                        <WaveSurferContainer
                                            hanleChangeVoice = {this.hanleChangeVoice}
                                        />
                                        {
                                            checkVoiceLv2 && 
                                                <p className="text-center">마지막으로 버튼을 한번 누려주세요</p>
                                        }
                                    </>
                                }
                            </div>
                            <button type="submit" className="btn btn-block" onClick = {this.subMit}>등록</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

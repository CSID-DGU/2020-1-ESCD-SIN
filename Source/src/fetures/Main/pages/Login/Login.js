import React, { Component } from 'react'
import { MdKeyboardVoice } from "react-icons/md";
import './Login.scss'
import Http from '../../../../component/Http';
import LoginWithVoice from './LoginWithVoice';
export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: "",
            password: "",
            loginWithVoice: false,

            words: [],
            checkNoiseLv1: false,
            checkVoiceLv2: false,

            loginstate: false
        }
    }
    
    handleChange = (event) => {
        const { name, value} = event.target;
        this.setState({
            [name] : value
        })
    }
    handleLogin = () => {
        const { loginstate } = this.state;
        if(loginstate){ //음성 인식을 성공하여 서비스 페이지를 이동함
            this.props.history.push(`/service`);
        }else{ //Login with text and password
            const { id, password }  = this.state;
            if(id && password){
                Http.post({
                    path: '/loginwithnovoice',
                    payload: {
                        'username': id, password
                    }
                }).then(({data}) => {
                    const { message } = data;
                    if(message === 'fail')
                    {
                        alert("아이디를 틀렸습니다. 확인해주세요")
                    }else{
                        const { id, user_id,email, isvoice, money } = data.user;
                        const user = {id, user_id, email, isvoice, money};
                        localStorage.setItem("user", JSON.stringify(user))
                        alert("로그인 성공했습니다");
                        this.props.history.push(`/service`);
                    }
                }).catch(err =>
                    console.log(err)    
                )
            }else{
                alert("입력한 정보를 다시 확인해주세요.")
            }
        }
    }
    
    handleCheckSuccess = (state) => {
        this.setState({loginstate : state})
    }
    render() {
        const { loginWithVoice, id, password } = this.state;
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-md-3 col-sm-6 col-xs-12 row-container">
                        <button onClick={(e) => { 
                            e.preventDefault()
                            this.setState({loginWithVoice : !loginWithVoice})
                            }} 
                            className="btn btn-block login-voice">Sign in with { loginWithVoice ? <MdKeyboardVoice /> : "id"} </button>
                        <h1 className="text-center">Login</h1>
                        {
                            !loginWithVoice ? 
                                <>
                                    <div className="form-group">
                                        <label htmlFor="id">Id</label>
                                        <input type="text" name="id" id="id" className="form-control" placeholder="Id..." value = {id} onChange = {e => this.handleChange(e)}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" name="password" id="password" className="form-control" placeholder="Passwod..." value = {password} onChange = {e => this.handleChange(e)}/>
                                    </div>
                                </> :
                                <LoginWithVoice
                                    handleCheckSuccess =  {this.handleCheckSuccess}
                                />
                        }
                        <button type="submit" className="btn btn-block" onClick = {this.handleLogin}>로그인</button>
                    </div>
                </div>
            </div>
        )
    }
}

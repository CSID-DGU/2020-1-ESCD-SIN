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
        const { name, value} = event;
        this.setState({
            [name] : value
        })
    }
    handleLogin = (event) => {
        event.preventDefault();
        const { loginstate } = this.state;
        if(loginstate){
            this.props.history.push(`/service`);
        }else{ //Login with text and password
            alert("입력한 정보를 다시 확인해주세요.")
        }
    }
    
    handleCheckSuccess = (state) => {
        this.setState({loginstate : state})
    }
    render() {
        const { loginWithVoice } = this.state;
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
                                        <input type="text" name="id" id="id" className="form-control" placeholder="Id..."/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" name="password" id="password" className="form-control" placeholder="Passwod..."/>
                                    </div>
                                </> :
                                <LoginWithVoice
                                    handleCheckSuccess =  {this.handleCheckSuccess}
                                />
                        }
                        <button type="submit" className="btn btn-block" onClick = {event => this.handleLogin(event)}>로그인</button>
                    </div>
                </div>
            </div>
        )
    }
}

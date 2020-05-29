import React, { Component } from 'react'
import WaveSurferContainer from '../../../../component/WaveSurferContainer/WaveSurferContainer'
import Http from '../../../../component/Http'

export default class LoginWithVoice extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
            id: "",
            checkNoiseLv1: false,
            checkLevel1: true,
            checkLevel2: false,
        }
    }
    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({[name] :  value}) 
    }
    handleCickChangeLv1 = () =>{
        const { id } =  this.state;
        if(!id)
        {
            alert("ID 입력해주세요");
            return;
        }
        Http.post({
            path: '/auth',
            payload: {
                username : this.state.id
            }
        }).then((res) => {
            const { data } = res;
            if(data === 'User exist')
                this.setState({checkLevel1: false})
            else{
                alert("입력한 사용자가 존재하지 않습니다. 다시 확인해주세요")
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    hanleChangeVoice = (blob) => {
        const { checkNoiseLv1, checkVoiceLv2 } = this.state;

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
                            checkVoiceLv2 : true,
                            checkLevel2: true
                        })
                    }else{
                        alert("단어가 음성 인식을 실패했습니다 다시 해주세요")
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }else{ //단어를 음석을 한 다음에 GMM 파일 만들기 위해서 API 호줄
                Http.get({
                    path: '/verify'
                }).then(res => {
                    const { data } = res
                    const { handleCheckSuccess } = this.props;
                    if(data === "success")
                    {
                        alert("음석 인식 인증 기능을 확인했습니다.")
                        handleCheckSuccess(true);
                    }else{
                        handleCheckSuccess(false);
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    }
    render() {
        const { checkLevel1, checkLevel2, checkNoiseLv1, words } = this.state;
        return (
            <div>
                {
                    checkLevel1 &&
                    <>
                        <div className="form-group">
                            <label htmlFor="id">Id</label>
                            <input type="text" name="id" id="id" className="form-control" placeholder="Id..." onChange = {this.handleChange}/>
                        </div>
                        <button className ="btn btn-primary d-block" style = {{margin: "0 auto"}}
                            onClick = {this.handleCickChangeLv1}
                        >아이디 체크</button>
                    </>
                }
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
                    !checkLevel1 && 
                    <>
                        {
                        !checkNoiseLv1 && 
                                "Check noise round 1"
                        }
                        <WaveSurferContainer 
                            hanleChangeVoice = {this.hanleChangeVoice}
                        />
                        {
                            checkLevel2 && 
                                <p className="text-center">마지막으로 버튼을 한번 누려주세요</p>
                        }
                    </>
                        
                }
            </div>
        )
    }
}

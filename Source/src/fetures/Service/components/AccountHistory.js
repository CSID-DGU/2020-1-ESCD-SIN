import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Http from '../../../component/Http';

function AccountHistory(props) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const { user_id } = user;
        Http.get({
            path: `/history/${user_id}`
        }).then(({data}) => {
            console.log(data)
            setHistory(data.data)
        }).catch(err => {
            console.log(err)
        })
    }, [])
    return (
        <AccountHistoryDiv className="panel panel-info" id="history-panel">
            <div className="panel-heading text-center lead" id="history-header">Account History</div>
            {
                history.length !== 0 &&
                    <table className="table table-striped" id="history">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>입금 계좌</th>
                                <th>입금 금액</th>
                                <th>은행</th>
                                <th>날짜</th>
                            </tr>
                        </thead>
                        <tbody>
                                {
                                    history.map((item,index) => {
                                        return (
                                            <tr key = {index}>
                                                <th>{index}</th>
                                                <th>{item[2]}</th>
                                                <th>{parseInt(item[4]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</th>
                                                <th>{item[3]}</th>
                                                <th>{item[5]}</th>
                                            </tr>
                                        )
                                    })
                                }
                        </tbody>
                    </table>
            }
            
    </AccountHistoryDiv>
    )
}
const AccountHistoryDiv = styled.div`
    margin-bottom: 5rem
`
AccountHistory.propTypes = {

}

export default AccountHistory


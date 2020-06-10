import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Http from '../../../component/Http';

function AccountHistory(props) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const { id } = user;
        Http.get({
            path: `/history/${id}`
        }).then(({data}) => {
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
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Bank Name</th>
                            </tr>
                        </thead>
                        <tbody>
                                {
                                    history.map(item => {
                                        return (
                                            <tr>
                                                <th>{item.data}</th>
                                                <th>{item.money}</th>
                                                <th>{item.bank}</th>
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


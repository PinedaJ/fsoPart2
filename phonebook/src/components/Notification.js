import React from 'react'

const Notification = ({ message, isSuccessful }) => {
    const notificationSucessStyle = {
        color: 'green',
        fontSize: 16,
        padding: 8,
        backgroundColor: 'lightgrey',
        border: '2px solid green',
        borderRadius: 5,
        marginBottom: 5
    }

    const notificationErrorStyle = {
        color: 'red',
        fontSize: 16,
        padding: 8,
        backgroundColor: 'lightgrey',
        border: '2px solid red',
        borderRadius: 5,
        marginBottom: 5
    }

    if (message === null) {
        return null
    }

    return (isSuccessful)
        ? <div style={notificationSucessStyle}>{message}</div> 
        : <div style={notificationErrorStyle}>{message}</div>
}

export default Notification
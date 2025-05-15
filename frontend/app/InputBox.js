import React, { useState } from'react';

const InputBox = ({ onSend }) => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSend = () => {
        if (inputValue.trim()!== '') {
            onSend(inputValue);
            setInputValue('');
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                style={{ flex: 1, padding: '5px' }}
            />
            <button onClick={handleSend} style={{ padding: '5px 10px', color: 'white', backgroundColor: '#13abba' }}>发送</button>
        </div>
    );
};

export default InputBox;
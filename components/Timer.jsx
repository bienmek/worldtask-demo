import React, {useEffect, useState} from 'react';

const Timer = () => {
    const [second, setSecond] = useState(0);
    const [minute, setMinute] = useState(0);

    const delay = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    useEffect(() => {
        delay(1000).then(() => setSecond(second + 1))
        if (second >= 60) {
            setSecond(0)
            setMinute(minute + 1)
        }
    }, [minute, second,])

    return (
        <>
            {minute < 10 ? (<>0{minute}</>):(<>{minute}</>)}:{second < 10 ? (<>0{second}</>):(<>{second}</>)}
        </>
    );
};

export default Timer;

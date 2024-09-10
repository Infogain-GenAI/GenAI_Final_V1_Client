import React, {useCallback, useState} from 'react';
import {useStream} from 'react-fetch-streams';

const MyComponent = props => {
    const [data, setData] = useState({});
    const onNext = useCallback(async res => {
        const data = await res.json();
        setData(data);
    }, [setData]);
    useStream('http://myserver.io/stream', {onNext});

    return (
        <React.Fragment>
            {data.myProp}
        </React.Fragment>
    );
};

export default MyComponent;
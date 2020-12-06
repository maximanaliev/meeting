import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import VoteComponent from "./VoteComponent";
import SetVoteTime from "./SetVoteTime";

const CreateEvent = () => {

    const user = useSelector(state => state.users.user);
    const eventStarted = useSelector(state => state.event.eventStarted);
    const dispatch = useDispatch();

    const [first, setFirst] = useState('');
    const [second, setSecond] = useState('');
    const [eventName, setEventName] = useState('');
    const [datetime, setDatetime] = useState('');
    const [hours, setHours] = useState([]);

    const head = () => {
        let result = [];
        const fourth = ['00', '15', '30', '45'];
        let hoursChoose = new Date().getHours() + 1;
        if (hoursChoose === 24) {
            hoursChoose = 0
        }
        const hoursToString = hoursChoose.toString();
        for (let i = hoursToString; i <= 22; i++) {
            if (i.toString().length === 1) {
                i = `0${i}`
            }
            for (let j = 0; j < fourth.length; j++) {
                result.push(`${i}:${fourth[j]}`);
            }
        }
        if (hoursChoose.toString() !== '23') {
            result.push('23:00')
        }
        setHours(result);
    };

    const ws = useRef({});

    useEffect(() => {
        head();
        ws.current = new WebSocket(`ws://localhost:8000/event?user_id=${user._id}`);
        ws.current.onmessage = (msg) => {
            dispatch(JSON.parse(msg.data));
        };
        return () => {
            ws.current.close();
        };
    }, [user, dispatch]);

    const setEventTimer = e => {
        e.preventDefault();
        ws.current.send(JSON.stringify({
            type: 'SET_EVENT_VOTE_TIME',
            first,
            second,
        }));
        setFirst('');
        setSecond('');
    };

    const vote = e => {
        e.preventDefault();
        ws.current.send(JSON.stringify({
            type: 'VOTE',
            eventName,
            tags: eventName,
            datetime,
        }));
        setEventName('');
        setDatetime('');
    };

    const sendUpdate = (winner, time) => {
        ws.current.send(JSON.stringify({
            type: 'UPDATE_VOTE',
            dataEventName: winner,
            dataTime: time,
        }));
    };

    const refuse = e => {
        e.preventDefault();
        ws.current.send(JSON.stringify({
            type: 'REFUSE',
        }));
    };

    const reset = e => {
        e.preventDefault();
        ws.current.send(JSON.stringify({
            type: 'RESET',
        }));
    };

    return (
        <>
            {eventStarted ?
                <VoteComponent
                    vote={vote}
                    eventName={eventName}
                    setEventName={setEventName}
                    datetime={datetime}
                    setDatetime={setDatetime}
                    hours={hours}
                    user={user}
                    sendUpdate={sendUpdate}
                    refuse={refuse}
                    reset={reset}
                /> :
                <SetVoteTime
                    setEventTimer={setEventTimer}
                    setFirst={setFirst}
                    first={first}
                    second={second}
                    setSecond={setSecond}
                />
            }
        </>
    );
};

export default CreateEvent;
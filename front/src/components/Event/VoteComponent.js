import React, {useEffect, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import Chart from "./Chart";

const useStyles = makeStyles((theme) => ({
    MB: {
        marginBottom: theme.spacing(2)
    },
    buttonGroup: {
        width: '25%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '8px auto'
    }
}));

const VoteComponent = props => {

    const classes = useStyles();

    const tags = useSelector(state => state.event.tags);
    const voted = useSelector(state => state.event.voted);
    const votedUsers = useSelector(state => state.event.votedUsers);
    const timer = useSelector(state => state.event.eventTimer);
    const keep = useSelector(state => state.event.keep);
    const refused = useSelector(state => state.event.refused);
    const disabled = useSelector(state => state.event.disabled);
    const hide = useSelector(state => state.event.hide);
    const user_id = useSelector(state => state.event.user);

    const [event, setEvent] = useState([]);
    const [winner, setWinner] = useState('');
    const [secondVote, setSecondVote] = useState(true);
    const [time, setTime] = useState('');
    const [names, setNames] = useState([]);
    const [draw, setDraw] = useState(false);

    useEffect(() => {

        let array = [];
        for (let i = 0; i < votedUsers.length; i++) {
            const object = {
                eventName: votedUsers[i].eventName,
                time: votedUsers[i].datetime,
            };
            array.push(object);
        }
        const counterEvent = array.reduce((o, i) => {
            const c = JSON.stringify(i);
            if (!o.hasOwnProperty(c)) {
                o[c] = 0;
            }
            o[c]++;
            return o;
        }, {});

        const resultEvent = Object.keys(counterEvent).map(i => {
            return {event: JSON.parse(i), sum: counterEvent[i]};
        });

        const max = Math.max.apply(Math, resultEvent.map(i => {
            return i.sum
        }));

        let winner;
        let check = [];
        for (let i in resultEvent) {
            if (resultEvent[i].sum === max) {
                check.push(resultEvent[i]);
                winner = resultEvent[i]
            }
        }
        if (check.length > 1) {
            setDraw(true)
        }

        let voters = [];
        for (let i in votedUsers) {
            if (`${votedUsers[i].eventName}${votedUsers[i].datetime}` === `${winner.event.eventName}${winner.event.time}`) {
                voters.push(votedUsers[i].user);
            }
            setWinner(winner.event.eventName);
            setTime(winner.event.time);
        }
        for (let i in voters) {
            if (props.user._id === voters[i]._id) {
                setSecondVote(false)
            }
        }
        setNames(voters);
        setEvent(resultEvent);

    }, [votedUsers, props.user._id]);

    return (
        <>
            {user_id === props.user._id && hide ?
                <Button
                    className={classes.MB}
                    variant="contained"
                    color="secondary"
                    onClick={props.reset}
                >
                    Сброс голосования
                </Button> : null}
            <div className={classes.MB}>
                <Typography
                    variant="h4"
                    hidden={hide}
                >
                    До конца голосования {timer}
                </Typography>
                <Typography
                    variant="h4"
                    hidden={!hide}
                >
                    Итог
                </Typography>
                <Typography
                    variant="h6"
                >
                    Проголосовали: {votedUsers.length}
                </Typography>
            </div>

            {keep ?
                <>
                    <Chart
                        labels={event.map(i => {
                            return `${i.event.eventName} - ${i.event.time}`
                        })}
                        data={event.map(i => {
                            return i.sum
                        })}
                    />
                    {draw ?
                        <Typography
                            variant="h6"
                        >
                            Ничья
                        </Typography> :
                        <>
                            <Typography
                                variant="h6"
                            >
                                Победитель: {`(${winner}) в ${time}`}
                            </Typography>
                            {secondVote && !refused ?
                                !hide ?
                                    <div className={classes.buttonGroup}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => props.sendUpdate(winner, time)}
                                        >
                                            Присоедениться
                                        </Button>
                                        <Button
                                            disabled={disabled}
                                            variant="outlined"
                                            color="secondary"
                                            onClick={props.refuse}
                                        >
                                            Отказаться
                                        </Button>
                                    </div> : null : null}
                            <p>
                                <b>
                                    Проголосовали:
                                </b>
                            </p>
                            {names.map(i => (
                                <div
                                    key={i._id}
                                >
                                    {i.username}
                                </div>
                            ))}
                        </>
                    }
                </>
                :
                <>
                    {voted ?
                        <Typography
                            variant="h6"
                        >
                            Ваш голос принят
                        </Typography> :
                        <Grid container justify="center">
                            <Grid item xs={11} md={6} lg={4}>
                                <form onSubmit={props.vote}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item xs>
                                            <Autocomplete
                                                freeSolo
                                                noOptionsText="Пусто"
                                                inputValue={props.eventName}
                                                onInputChange={(event, newInputValue) => {
                                                    props.setEventName(newInputValue);
                                                }}
                                                options={tags}
                                                renderInput={(params) =>
                                                    <TextField
                                                        {...params}
                                                        label="Мероприятие"
                                                        variant="outlined"
                                                        required
                                                    />
                                                }
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Autocomplete
                                                noOptionsText="Пусто"
                                                inputValue={props.datetime}
                                                onInputChange={(event, newInputValue) => {
                                                    props.setDatetime(newInputValue);
                                                }}
                                                options={props.hours}
                                                renderInput={(params) =>
                                                    <TextField
                                                        {...params}
                                                        label="Время"
                                                        variant="outlined"
                                                        required
                                                    />
                                                }
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                type="submit"
                                                color="primary"
                                                variant="contained"
                                            >
                                                Проголосовать
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Grid>
                        </Grid>}
                </>
            }
        </>
    );
};

export default VoteComponent;
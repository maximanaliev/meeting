const User = require("../models/User");
const EventTimer = require("../models/EventTimer");
const Vote = require("../models/Vote");
const Color = require("../models/Color");

const connections = {};

const forEachConnectedClient = callback => {
    Object.keys(connections).forEach(k => {
        const client = connections[k];
        callback(client);
    });
};

const generateColor = async () => {
    const checkColor = await Color.find();
    if (checkColor.length <= 0) {
        let colors = [];
        for (let i = 0; i < 30; i++) {
            const x = Math.floor(Math.random() * 256);
            const y = Math.floor(Math.random() * 256);
            const z = Math.floor(Math.random() * 256);
            const oneColor = `rgb(${x}, ${y}, ${z})`;
            colors.push(oneColor);
        }
        const saveColor = new Color({
            color: colors
        });
        saveColor.save();
    }
};

const checkStatus = async () => {
    const event = await EventTimer.find();
    if (event.length > 0) {
        for (let i in event) {
            forEachConnectedClient(client => {
                client.send(JSON.stringify({
                    type: 'EVENT_CREATED',
                    started: event[0].started,
                    user: event[i].user,
                }))
            });
        }
        const timerUp = await EventTimer.find({timerUp: true});
        if (timerUp.length > 0) {
            forEachConnectedClient(client => {
                client.send(JSON.stringify({
                    type: 'SECOND_TIMER_UP',
                }))
            });
        }
    }
};

const getTags = async () => {
    const tags = await Vote.distinct('tags');
    forEachConnectedClient(client => {
        client.send(JSON.stringify({
            type: 'GET_TAGS',
            getTags: tags,
        }))
    });
};

const updateVotedList = async () => {
    const votedUsers = await Vote.find({voted: true}).populate({
        path: 'user',
        select: ['_id', 'username']
    });
    forEachConnectedClient(client => {
        client.send(JSON.stringify({
            type: 'VOTED_USERS',
            voted: votedUsers
        }))
    });
};

const checked = ws => {
    ws.send(JSON.stringify({
        type: 'CHECKED',
    }));
};

const timerStart = async (type, time, ws, user) => {
    let minutes = time;
    let seconds = 60;
    let sWs = ws;
    let sUser = user;

    const timer = setInterval(async () => {
        seconds = seconds - 1;
        if (seconds < 0) {
            minutes = minutes - 1;
            seconds = 59;
        }
        if (minutes <= 0 && seconds <= 0) {
            forEachConnectedClient(client => {
                client.send(JSON.stringify({
                    type: type,
                }));
            });
            if (type === 'FIRST_TIMER_UP') {
                const event = await EventTimer.find();
                if (event.length > 0) {
                    await timerStart('SECOND_TIMER_UP', event[0].second - 1);
                    await checked(sWs);
                    await checkRefused(sWs, sUser);
                }
            }
            if (type === 'SECOND_TIMER_UP') {
                await EventTimer.find({timerUp: false}).updateOne({timerUp: true});
                await checkStatus();
            }
            clearInterval(timer);
            await EventTimer.updateMany({first: 0});
        }
        forEachConnectedClient(client => {
            client.send(JSON.stringify({
                type: 'UPDATE_TIMER',
                minutes: minutes.toString().length === 1 ? `0${minutes}` : `${minutes}`,
                seconds: seconds.toString().length === 1 ? `0${seconds}` : `${seconds}`,
            }))
        });
    }, 100);
};

const voted = async (ws, user) => {
    const checkVote = await Vote.find({voted: true, user: user._id});
    if (checkVote.length > 0) {
        ws.send(JSON.stringify({
            type: 'VOTED',
        }));
    } else {
        ws.send(JSON.stringify({
            type: 'NOT_VOTED',
        }))
    }
};

const keepChart = async () => {
    const keeper = await EventTimer.find();
    if (keeper.length > 0 && keeper[0].first === '0') {
        forEachConnectedClient(client => {
            client.send(JSON.stringify({
                type: 'FIRST_TIMER_UP'
            }))
        });
    }
};

const getColor = async () => {
    const color = await Color.find();
    if (color.length > 0) {
        forEachConnectedClient(client => {
            client.send(JSON.stringify({
                type: 'COLORS',
                colors: color[0].color
            }))
        });
    }
};

const checkRefused = async (ws, user) => {
    const ref = await Vote.find({user: user._id, refused: true});
    if (ref.length > 0) {
        ws.send(JSON.stringify({
            type: 'REFUSED',
        }));
    }
    const notVoted = await Vote.find({user: user._id});
    if (notVoted.length === 0) {
        ws.send(JSON.stringify({
            type: 'NO_VOTE',
        }));
    }
};

const event = async (ws, req) => {

    const user = await User.findOne({_id: req.query.user_id});

    if (!user) {
        return ws.close();
    }

    connections[user._id] = ws;

    ws.on('message', async (msg) => {

        const parsed = JSON.parse(msg);

        switch (parsed.type) {
            case 'SET_EVENT_VOTE_TIME':
                try {
                    const newEvent = new EventTimer({
                        user: req.query.user_id,
                        first: parsed.first,
                        second: parsed.second,
                    });
                    await newEvent.save();

                    await checkStatus();

                    const event = await EventTimer.find();
                    await timerStart('FIRST_TIMER_UP', event[0].first - 1, ws, user);

                } catch (e) {
                    ws.send(JSON.stringify({
                        type: 'ERROR',
                        error: e,
                    }));
                }
                break;

            case 'VOTE':
                const newVote = new Vote({
                    user: req.query.user_id,
                    eventName: parsed.eventName,
                    tags: parsed.tags,
                    datetime: parsed.datetime,
                });
                await newVote.save();
                await voted(ws, user);
                await updateVotedList();
                await getTags();
                break;

            case 'REFUSE':
                await Vote.find({user: req.query.user_id}).updateOne({refused: true});
                await checkRefused(ws, user);
                await updateVotedList();
                break;

            case 'RESET':
                forEachConnectedClient(client => {
                    client.send(JSON.stringify({
                        type: 'EVENT_FINISHED',
                    }))
                });
                await Vote.deleteMany();
                await EventTimer.deleteMany();
                await Color.deleteMany();
                await checkStatus();
                break;

            case 'UPDATE_VOTE':
                await Vote.find({user: req.query.user_id,}).updateOne({
                    eventName: parsed.dataEventName,
                    datetime: parsed.dataTime
                });
                const votedCheck = await Vote.find({user: req.query.user_id,});
                if (votedCheck.length === 0) {
                    const newVote = new Vote({
                        user: req.query.user_id,
                        eventName: parsed.dataEventName,
                        datetime: parsed.dataTime,
                    });
                    newVote.save();
                }
                await voted(ws, user);
                await updateVotedList();
                break;

            default:
                console.log('No such type ' + parsed.type);
        }
    });



    await checkStatus();
    await updateVotedList();
    await getTags();
    await voted(ws, user);
    await generateColor();
    await getColor();
    await keepChart();
    await checked(ws);
    await checkRefused(ws, user);

    ws.on('close', () => {

        if (!!user) {
            delete connections[user._id];
        }
    });
};

module.exports = event;
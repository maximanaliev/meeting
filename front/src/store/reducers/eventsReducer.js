const initialState = {
    eventStarted: false,
    eventTimer: '00:00',
    keep: false,
    tags: [],
    colors: null,
    votedUsers: [],
    voted: false,
    error: null,
    refused: false,
    disabled: false,
    hide: false,
    user: null,
};

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'EVENT_CREATED':
            return {...state, eventStarted: action.started, user: action.user};
        case 'EVENT_FINISHED':
            return {
                ...state,
                eventStarted: false,
                eventTimer: '00:00',
                keep: false,
                tags: [],
                colors: null,
                votedUsers: [],
                voted: false,
                error: null,
                refused: false,
                disabled: false,
                hide: false,
                user: null,
            };
        case 'UPDATE_TIMER':
            return {...state, eventTimer: `${action.minutes}:${action.seconds}`};
        case 'GET_TAGS':
            return {...state, tags: action.getTags};
        case 'FIRST_TIMER_UP':
            return {...state, keep: true};
        case 'SECOND_TIMER_UP':
            return {...state, hide: true};
        case 'VOTED_USERS':
            return {...state, votedUsers: action.voted};
        case 'VOTED':
            return {...state, voted: true};
        case 'NOT_VOTED':
            return {...state, voted: false};
        case 'COLORS':
            return {...state, colors: action.colors};
        case 'REFUSED':
            return {...state, refused: true};
        case 'NO_VOTE':
            return {...state, disabled: true};
        case 'CHECKED':
            return {...state, disabled: false};
        case 'ERROR':
            return {...state, error: action.error};
        default:
            return state;
    }
};

export default eventsReducer;
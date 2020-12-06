import React, {useRef, useState} from 'react';
import MenuItem from "@material-ui/core/MenuItem";
import {makeStyles} from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuList from "@material-ui/core/MenuList";

const useStyles = makeStyles((theme) => ({
    right: {
        margin: "0 5px"
    },
    userMenu: {
        marginLeft: "auto"
    },
    user: {
        color: 'rgba(0,0,0,0.5)',
        cursor: 'pointer',
        marginLeft: 'auto',
        width: 'inherit'
    },
    expand: {
        transform: 'rotate(-180deg)',
        transition: '0.2s'
    },
    notExpand: {
        transition: '0.2s',
    }
}));

const UserMenu = ({user, logout}) => {

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <div className={classes.userMenu}>
                <ListItem
                    className={classes.user}
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                >
                    {user.username} {open ?
                    <ExpandMoreIcon
                        className={classes.expand}
                    /> :
                    <ExpandMoreIcon
                        className={classes.notExpand}
                    />
                    }
                </ListItem>
                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                    {({TransitionProps, placement}) => (
                        <Grow
                            {...TransitionProps}
                            style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                        <MenuItem
                                            onClick={logout}
                                        >
                                            Выйти
                                        </MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </>
    );
};

export default UserMenu;
import React, {useState} from 'react';
import FormElement from "../../components/UI/Form/FormElement";
import {useDispatch, useSelector} from "react-redux";
import {loginUser} from "../../store/actions/usersActions";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    buttonBox: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    register: {
        color: 'blue',
        textDecoration: 'none'
    }
}));

const Login = props => {

    const classes = useStyles();

    const dispatch = useDispatch();
    const error = useSelector(state => state.users.loginError);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(loginUser({email, password}, props, clear));
    };

    const clear = () => {
        setEmail('');
        setPassword('');
    };

    return (
        <>
            <Grid container justify="center">
                <Grid item xs={11} md={6} lg={4}>
                    <Box pt={2} pb={2}>
                        <Typography variant="h4">Вход</Typography>
                    </Box>
                    <form onSubmit={submitHandler}>
                        <Grid container direction="column" spacing={2}>
                            <Grid item>
                                <FormElement
                                    required
                                    type="email"
                                    propertyName="email"
                                    title="E-mail"
                                    value={email}
                                    onChange={event => setEmail(event.target.value)}
                                    placeholder="Введите адрес электронной почты"
                                    autoComplete="new-email"
                                />
                            </Grid>
                            {error && (
                                <Grid item>
                                    <Alert severity="error">{error.error}</Alert>
                                </Grid>
                            )}
                            <Grid item style={{display: 'flex', alignItems: 'center'}}>
                                <FormElement
                                    propertyName="password"
                                    title="Пароль"
                                    value={password}
                                    onChange={event => setPassword(event.target.value)}
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Введите пароль"
                                />
                            </Grid>
                            <Grid item className={classes.buttonBox}>
                                <Button type="submit" color="primary" variant="contained">
                                    Войти
                                </Button>
                                <Typography
                                    className={classes.register}
                                    component={Link}
                                    to={'/register'}
                                >
                                    регистрация
                                </Typography>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </>
    );
};

export default Login;
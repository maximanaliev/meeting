import React, {useState} from 'react';
import {registerUser} from "../../store/actions/usersActions";
import {useDispatch, useSelector} from "react-redux";
import FormElement from "../../components/UI/Form/FormElement";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ReCAPTCHA from "react-google-recaptcha";
import {toast} from 'react-toastify';
import {css} from "glamor";

const Register = () => {

    const dispatch = useDispatch();
    const registerError = useSelector(state => state.users.registerError);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
    const [isVerified, setIsVerified] = useState(false);

    const submitFormHandler = () => {
        dispatch(registerUser({email, password, username}, {registerSuccess}));
    };

    const registerSuccess = () => {
        toast.info(`Вы зарегистрировались как ${username}`, {
            className: css({
                background: "#595959 !important",
                textAlign: "center",
                border: "1px solid #FFF",
                borderRadius: "15px !important",
                marginBottom: "0 !important"
            }),
            position: toast.POSITION.BOTTOM_RIGHT
        });
        setEmail('');
        setPassword('');
        setRePassword('');
        setUsername('');
    };

    const onRecaptchaChange = () => {
        setIsVerified(true);
    };

    const checkPasswords = event => {
        event.preventDefault();
        if (password !== rePassword) {
            setError("Вы ввели разные пароли");
        } else {
            setError(null);
            if (isVerified === true) {
                submitFormHandler();
            }
        }
    };

    const getFieldError = fieldName => {
        try {
            return registerError.errors[fieldName].message;
        } catch (e) {
            return undefined;
        }
    };

    return (
        <>
            <Grid container justify="center">
                <Grid item xs={11} md={6} lg={4}>
                    <Box pt={2} pb={2}>
                        <Typography variant="h4">Регистрация</Typography>
                    </Box>
                    <form onSubmit={checkPasswords}>
                        <Grid container direction="column" spacing={2}>
                            <Grid item>
                                <FormElement
                                    required
                                    type="email"
                                    propertyName="email"
                                    title="E-mail"
                                    value={email}
                                    onChange={event => setEmail(event.target.value)}
                                    error={getFieldError('email')}
                                    placeholder="Введите адрес электронной почты"
                                    autoComplete="new-email"
                                />
                            </Grid>
                            <Grid item>
                                <FormElement
                                    required
                                    propertyName="password"
                                    title="Пароль"
                                    type="password"
                                    value={password}
                                    onChange={event => setPassword(event.target.value)}
                                    error={getFieldError('password')}
                                    placeholder="Пароль"
                                    autoComplete="new-password"
                                />
                            </Grid>
                            <Grid item>
                                <FormElement
                                    required
                                    propertyName="rePassword"
                                    title="Повторите пароль"
                                    type="password"
                                    value={rePassword}
                                    onChange={event => setRePassword(event.target.value)}
                                    error={error}
                                    placeholder="Пароль"
                                    autoComplete="new-rePassword"
                                />
                            </Grid>
                            <Grid item>
                                <FormElement
                                    required
                                    propertyName="username"
                                    title="Имя пользователя"
                                    value={username}
                                    onChange={event => setUsername(event.target.value)}
                                    error={getFieldError('username')}
                                    placeholder="Введи имя пользователя"
                                    autoComplete="new-username"
                                />
                            </Grid>
                            <Grid item>
                                <ReCAPTCHA
                                    sitekey="6Lf6_u0UAAAAAAIIJprZSQ0P7KaI0GzgHR8e3An4"
                                    onChange={onRecaptchaChange}
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                >
                                    Зарегистрироваться
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </>
    );
};

export default Register;
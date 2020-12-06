import React from 'react';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import FormElement from "../UI/Form/FormElement";
import Button from "@material-ui/core/Button";
import {useSelector} from "react-redux";

const SetVoteTime = props => {

    const error = useSelector(state => state.event.error);

    const getFieldError = fieldName => {
        try {
            return error.errors[fieldName].message;
        } catch (e) {
            return undefined;
        }
    };

    return (
        <>
            <Grid container justify="center">
                <Grid item xs={11} md={6} lg={4}>
                    <Box pt={2} pb={2}>
                        <Typography variant="h4">
                            Создать мероприятие
                        </Typography>
                    </Box>
                    <form onSubmit={props.setEventTimer}>
                        <Grid container direction="column" spacing={2}>
                            <Grid item>
                                <FormElement
                                    required
                                    propertyName="first"
                                    title="Введите время первой фазы голосования"
                                    value={props.first}
                                    onChange={event => props.setFirst(event.target.value)}
                                    placeholder="Введите время в минутах"
                                    autoComplete="new-first"
                                    error={getFieldError('first')}
                                />
                            </Grid>
                            <Grid item>
                                <FormElement
                                    required
                                    propertyName="second"
                                    title="Введите время второй фазы голосования"
                                    value={props.second}
                                    onChange={event => props.setSecond(event.target.value)}
                                    placeholder="Введите время в минутах"
                                    autoComplete="new-second"
                                    error={getFieldError('second')}

                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                >
                                    Создать голосование
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </>
    );
};

export default SetVoteTime;
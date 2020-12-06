import React, {useState} from 'react';
import PropTypes from 'prop-types';
import TextField from "@material-ui/core/TextField";
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from "@material-ui/icons/Visibility";

const FormElement = props => {

    const [visible, setVisible] = useState(false);

    const myStyle = {
        backgroundColor: '#fff',
        borderRadius: 5
    };

    let inputChildren = undefined;

    let inputComponent = (
        <TextField
            fullWidth
            disabled={props.disabled}
            variant="outlined"
            label={props.title}
            error={!!props.error}
            type={props.type}
            select={props.type === 'select'}
            name={props.propertyName}
            id={props.propertyName}
            value={props.value}
            onChange={props.onChange}
            required={props.required}
            autoComplete={props.autoComplete}
            placeholder={props.placeholder}
            children={inputChildren}
            helperText={props.error}
            style={myStyle}
            InputProps={props.inputProps}
        >
            {inputChildren}
        </TextField>
    );

    if (props.type === 'password') {
        inputComponent = (
            <TextField
                fullWidth
                variant="outlined"
                label={props.title}
                error={!!props.error}
                type={visible ? 'text' : 'password'}
                name={props.propertyName}
                id={props.propertyName}
                value={props.value}
                onChange={props.onChange}
                required={props.required}
                autoComplete={props.autoComplete}
                placeholder={props.placeholder}
                children={inputChildren}
                helperText={props.error}
                InputProps={{
                    endAdornment: !visible ?
                        <VisibilityOffIcon style={{cursor: "default", opacity: "0.3"}} onClick={() => setVisible(true)}/> :
                        <VisibilityIcon style={{cursor: "default", opacity: "0.3"}} onClick={() => setVisible(false)}/>
                }}
                style={myStyle}
            />
        )
    }

    return inputComponent;
};

FormElement.propTypes = {
    propertyName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
    options: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    autoComplete: PropTypes.string,
};

export default FormElement;
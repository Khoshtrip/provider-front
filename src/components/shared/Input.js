import React from "react";
import "../../styles/Login.css";

const Input = ({ type, name, placeholder, value, onChange, error }) => {

    return (
        <>
            <input
                type={type}
                name={name}
                placeholder={placeholder || undefined}
                value={value || undefined}
                onChange={onChange}
            />
            {error && (
                <span className="error">{error}</span>
            )}
        </>
    );
};

export default Input;

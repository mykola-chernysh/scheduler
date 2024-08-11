import React from "react";
import { MenuItem, styled, TextField } from "@mui/material";

const LocaleSwitcher = ({ currentLocale, onLocaleChange }) => {
    const StyledDiv = styled("div")(() => ({
        display: "flex",
        marginBottom: "8px",
        justifyContent: "flex-end",
        "& .MuiInputBase-root": { fontSize: "12px" },
        "& .MuiMenuItem-root": { fontSize: "120px" },
    }));

    const styleMenuItem = {
        fontSize: "12px",
    };

    return (
        <StyledDiv>
            <TextField select variant="standard" value={currentLocale} onChange={onLocaleChange}>
                <MenuItem sx={styleMenuItem} value="pl-PL">
                    PL
                </MenuItem>
                <MenuItem sx={styleMenuItem} value="en-US">
                    EN
                </MenuItem>
            </TextField>
        </StyledDiv>
    );
};

export { LocaleSwitcher };

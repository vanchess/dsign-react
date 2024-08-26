import { Autocomplete, Checkbox, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export function MultipleAutocomplete({getOptionLabel, label, placeholder, ...props}) {
    if (!getOptionLabel) {
        getOptionLabel = (option) => option.attributes.name;
    }

    return (
        <Autocomplete
            size="small"
            fullWidth
            multiple
            required
            isOptionEqualToValue={(option, value) => {return value.id == option.id;}}
            disableCloseOnSelect
            getOptionLabel={getOptionLabel}

            renderOption={({key, ...props}, option, { selected }) => (
                <li key={option.id} {...props}>
                    <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                    />
                    {getOptionLabel(option)}
                </li>
            )}
            renderInput={(params) => (
                <TextField variant="standard" {...params} label={label} placeholder={placeholder} />
            )}
            {...props}
        />
    )
}
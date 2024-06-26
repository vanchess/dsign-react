import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function createStatusInputValue(statuses) {
    
    return (props) => {
      //const classes = useStyles();
      const { item, applyValue } = props;

      const handleFilterChange = (event) => {
        applyValue({ ...item, value: event.target.value });
      };
      
      const handleFilterChangeNative = (event) => {
        const { options } = event.target;
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
          if (options[i].selected) {
            value.push(options[i].value);
          }
        }
        applyValue({ ...item, value: value });
      };

      return (
        <div>
           <FormControl variant="standard">
                <InputLabel shrink htmlFor="select-multiple-native">
                  Выбрать несколько: Ctrl
                </InputLabel>
                <Select
                  variant="standard"
                  multiple
                  native
                  value={item.value}
                  onChange={handleFilterChangeNative}
                  inputProps={{
                    id: 'select-multiple-native',
                  }}>
                  {statuses.map((s) => (
                    <option key={s.attributes.name} value={s.attributes.name}>
                      {s.attributes.lable}
                    </option>
                  ))}
                </Select>
            </FormControl>
        </div>
      );
    };
}


export function inOperator(statuses) { 
    
    return {
        label: 'один из',
        value: 'in',
        getApplyFilterFn: (filterItem) => {
          if (
            !filterItem.field ||
            !filterItem.value ||
            !filterItem.operator
          ) {
            return null;
          }

          return (value, row, column, apiRef) => {
              if (filterItem.value.length == 0) {
                return true;
              }
              return filterItem.value.includes(value.name);
                //return Number(.name) == Number(filterItem.value.name);
          };
        },
        InputComponent: createStatusInputValue(statuses),
        //InputComponentProps: { type: 'number' },
      };
};

export function notInOperator(statuses) { 
    
    return {
        label: 'кроме',
        value: 'notIn',
        getApplyFilterFn: (filterItem) => {
          if (
            !filterItem.field ||
            !filterItem.value ||
            !filterItem.operator
          ) {
            return null;
          }

          return (value, row, column, apiRef) => {
              if (filterItem.value.length == 0) {
                return true;
              }
              return !filterItem.value.includes(value.name);
                //return Number(.name) == Number(filterItem.value.name);
          };
        },
        InputComponent: createStatusInputValue(statuses),
        //InputComponentProps: { type: 'number' },
      };
};
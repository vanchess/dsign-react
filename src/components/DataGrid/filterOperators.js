import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
           <FormControl >
                <InputLabel shrink htmlFor="select-multiple-native">
                  Выбрать несколько: Ctrl
                </InputLabel>
                <Select
                  multiple
                  native
                  value={item.value}
                  onChange={handleFilterChangeNative}
                  inputProps={{
                    id: 'select-multiple-native',
                  }}
                >
                  {statuses.map((s) => (
                    <option key={s.attributes.name} value={s.attributes.name}>
                      {s.attributes.lable}
                    </option>
                  ))}
                </Select>
            </FormControl>
        </div>
      );
    }
}


export function inOperator(statuses) { 
    
    return {
        label: 'один из',
        value: 'in',
        getApplyFilterFn: (filterItem) => {
          if (
            !filterItem.columnField ||
            !filterItem.value ||
            !filterItem.operatorValue
          ) {
            return null;
          }

          return (params) => {
              if (filterItem.value.length == 0) {
                return true;
              }
              return filterItem.value.includes(params.value.name);
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
            !filterItem.columnField ||
            !filterItem.value ||
            !filterItem.operatorValue
          ) {
            return null;
          }

          return (params) => {
              if (filterItem.value.length == 0) {
                return true;
              }
              return !filterItem.value.includes(params.value.name);
                //return Number(.name) == Number(filterItem.value.name);
          };
        },
        InputComponent: createStatusInputValue(statuses),
        //InputComponentProps: { type: 'number' },
      };
};
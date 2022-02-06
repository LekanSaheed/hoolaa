import Select from "react-select";
import {useGlobalContext} from "../context/context"

const ThemedSelect = (props) => {
const {darkMode} = useGlobalContext()
  return (
    <Select

      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: "#8800ff25",
          primary: "#8800ff",
        },
      })}
      styles={{
        menuPortal: (base) => ({
          ...base,
          zIndex: 130,
          background: darkMode ? "373737ff" : "initial"
        }),

        control: (base, state) => ({
          ...base,
          minHeight: "43px",
          color: "#000",

background: darkMode ? "373737ff" : "initial",

          boxShadow: state.isFocused ? "0 0 0 1px #8800ff" : "none",
          "&:hover": {
            borderColor: state.isFocused ? "#8800ff" : "#a7a7a7",
            boxShadow: state.isFocused ? "0 0 0 1px #8800ff" : "none",
          },
        }),
      }}
      {...props}
    />
  );
};

export default ThemedSelect;

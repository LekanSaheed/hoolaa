import Select from "react-select";
import { useGlobalContext } from "../context/context";

const ThemedSelect = (props) => {
  const { darkMode } = useGlobalContext();
  return (
    <Select
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: "#none",
          primary: "#8800ff",
        },
      })}
      styles={{
        option: (styles, { isFocused, isSelected }) => ({
          ...styles,
          background:
            isSelected && darkMode
              ? "#373737ff !important"
              : isSelected && !darkMode
              ? "#fff !important"
              : isFocused
              ? "8800ff25"
              : darkMode
              ? "#373737ff !important"
              : "initial",
          borderLeft: isSelected ? "solid 4.3px #8800ff" : 0,
          zIndex: 9999,
          color:
            isSelected && darkMode
              ? "#8800ff !important"
              : isSelected && !darkMode
              ? "#8800ff !important"
              : !isSelected && darkMode
              ? "#bababa"
              : !isSelected
              ? "#777b7e"
              : "inherit",
          padding: "22px",
          borderBottom: darkMode ? "solid 1px #efefef25" : "solid 1px #efefef",
          fontFamily: "Delius",
        }),

        menu: (base) => ({
          ...base,
          background: darkMode ? "#373737ff !important" : "#fff",
          border: 0,
          zIndex: 9999,
        }),

        menuPortal: (base) => ({
          ...base,
          zIndex: 9990,
          background: darkMode ? "#373737ff !important" : "#fff",
          border: 0,
        }),
        input: (base, state) => ({
          ...base,
          color: darkMode ? "#fff !important" : "#000",
          "[type=text]": {
            color: darkMode ? "#fff !important" : "#000",
            fontSize: "16px",
          },
        }),
        singleValue: (base) => ({
          ...base,
          color: darkMode ? "#8800ff !important" : "#8800ff",
          fontWeight: "600",
        }),

        control: (base, state) => ({
          ...base,
          minHeight: "43px",
          borderRadius: "10px",
          color: darkMode ? "#fff !important" : "#000",
          fontSize: "16px",

          background: darkMode ? "#373737ff" : "initial",

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

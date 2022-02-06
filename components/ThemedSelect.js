import Select from "react-select";

const ThemedSelect = (props) => {
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
        control: (base, state) => ({
          ...base,
          minHeight: "43px",
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

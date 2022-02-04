import Select from "react-select";

const ThemedSelect = (props) => {
  return (
    <Select
      styles={{
        control: (base, state) => ({
          ...base,
          boxShadow: state.isFocused ? 0 : "initial",
          "&:hover": {
            border: state.isFocused ? 0 : 0,
            boxShadow: state.isFocused ? 0 : 0,
          },
        }),
      }}
      {...props}
    />
  );
};

export default ThemedSelect;

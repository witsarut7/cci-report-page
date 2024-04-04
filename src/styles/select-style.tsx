const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    background: "#fff",
    height: "100%",
    // boxShadow: "none",
    outline: "none",
    borderRadius: 6,
    // "&:hover": {
    //   borderColor: "#2563eb",
    // },
    "&:focus": {
      borderColor: "#2563eb",
    },
  }),
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    height: "100%",
    padding: "0 12px",
    alignContent: "center",
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    margin: "0px",
    border: "none",
  }),
  indicatorSeparator: (state: any) => ({
    display: "none",
  }),
  indicatorsContainer: (provided: any, state: any) => ({
    ...provided,
    height: "100%",
    padding: "0px 0",
    border: "none",
  }),
};

export { selectStyles };

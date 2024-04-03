const selectStyles = {
    control: (provided : any, state : any) => ({
      ...provided,
      background: "#fff",
      height: "100%",
      boxShadow: "none",
      outline: "none",
      // borderColor: state.isFocused ? "#DAA80D" : "#DAA80D",
      // borderRadius: 5,
      // "&:hover": {
      //   borderColor: "#DAA80D",
      // },
      // "&:focus": {
      //   borderColor: "#DAA80D",
      // },
    }),
    valueContainer: (provided : any, state : any) => ({
      ...provided,
      height: "100%",
      padding: "0 12px",
      alignContent: "center",
    }),
  
    input: (provided : any, state : any) => ({
      ...provided,
      margin: "0px",
      border: "none",
    }),
    indicatorSeparator: (state : any) => ({
      display: "none",
    }),
    indicatorsContainer: (provided : any, state : any) => ({
      ...provided,
      height: "100%",
      padding: "0px 0",
      border: "none",
    }),
  }
  const customTheme = (theme : any) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: "none",
    },
  })
  
  export {selectStyles, customTheme}
  
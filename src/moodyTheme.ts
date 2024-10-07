import { maxHeaderSize } from "http";
import { text } from "stream/consumers";

// src/theme.ts
const colors = {
  moodyBlue: "#40CFE2",
  moodyDarkBackground: "#0f1719",
  moodyWhite: "#FFFFFF",
  darkButtonHover: "#3DAFB7",
};

const theme = {
  colors,
  hashTagStyles: {
    fontFamily: "Quicksand, sans-serif",
    fontWeight: "bold",
    fontSize: "20px",
    letterSpacing: "1px",
    lineHeight: "26px",
    color: "#191D1E",
    marginBottom: "14px",
  },
  footerTextStyles: {
    fontFamily: "Poppins, sans-serif",
    fontSize: "14px",
    lineHeight: "20px",
    color: "#E0E0E0",
    textAlign: { xs: "center", md: "center" }, // Center text on all screens
    marginTop: { xs: "1rem", md: "0" },
  },
  headerStyles: {
    fontFamily: "Quicksand, sans-serif",
    fontWeight: "bold",
    fontSize: "48px",
    lineHeight: "60px",
    color: "#FFFFFF",
    marginTop: "1rem",
    marginBottom: "14px",
  },
  whoWeAreBodyStyles: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "medium", // Medium font weight
    fontSize: "16px",
    lineHeight: "28px",
    color: "#191D1E",
    textAlign: "left",
    marginTop: "1rem",
    marginBottom: "14px",
  },
  wtfNeptuneBodyStyles: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "medium", // Medium font weight
    fontSize: "16px",
    lineHeight: "28px",
    color: "#191D1E",
    textAlign: "left",
    marginTop: "1rem",
    marginBottom: "14px",
  },
  bodyStyles: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "500",
    fontSize: "26px",
    lineHeight: "40px",
    color: "#191D1E",
    marginTop: "1rem",
    marginBottom: "14px",
  },
  darkHeaderStyles: {
    fontFamily: "Quicksand, sans-serif",
    fontWeight: "bold",
    fontSize: "48px",
    lineHeight: "60px",
    color: colors.moodyBlue,
    marginTop: "1rem",
    marginBottom: "14px",
    alignItems: "left",
  },
  cardStyles: {
    backgroundColor: "#1A1A1D",
    opacity: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem", // Reduced padding to make the card shorter
    textAlign: "center",
    flexGrow: 1,
    width: "100%", // Set a default width
    maxWidth: "300px",
    minHeight: "100px",
    maxHeight: "200px", // Set a maximum width to make the card wider
  },
  cardTitleStyle: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "bold",
    fontSize: "20px",
    LineWeight: "20px",
    color: colors.moodyBlue,
  },
  cardBodyStyles: {
    color: "#E0E0E0",
    fontFamily: "Poppins, sans-serif",
    fontWeight: "medium",
    fontSize: "14px",
  },
  cardIconStyles: {
    width: 75,
    height: 75,
  },
  blueSectionStyles: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "70vh",
    backgroundColor: colors.moodyBlue,
    paddingTop: { xs: "2rem", md: "6rem" },
  },
  featureBoxStyles: {
    textAlign: "left",
    marginBottom: "4rem",
  },
  featureColumnStyles: {
    backgroundColor: colors.moodyBlue,
    borderRadius: "8px",
    padding: "2rem",
    textAlign: "left",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  featureIdStyles: {
    fontFamily: "Poppins, sans-serif",
    opacity: 0.38,
    fontWeight: "bold",
    fontSize: "72px",
    color: "#FDFFFF",
    letterspacing: "0px",
  },
  featureTitleStyles: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "bold",
    color: colors.moodyDarkBackground,
    fontSize: "20px",
  },
  featureSubtitleStyles: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "medium",
    color: colors.moodyDarkBackground,
    fontSize: "14px",
    letterspacing: "0px",
  },
  featureBodyStyles: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "medium",
    color: colors.moodyDarkBackground,
    fontSize: "14px",
  },

  followUsBoxTheme: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    minHeight: "25vh", // Set to cover the entire viewport height
    backgroundColor: "#1A1A1D", // Set the background color as per your design
    color: "#fff",
    padding: "4rem 2rem 100px", // Added padding to the bottom
  },
  joinListBoxTheme: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    minHeight: "80vh",
    backgroundColor: colors.moodyBlue, // Set to match your design background color
    padding: "4rem 2rem",
    color: "#000", // Adjusted to ensure readability on a light background
  },
  joinListImageStyles: {
    width: "80%",
    maxWidth: "400px",
    height: "auto",
    marginBottom: "2rem",
  },
  joinListTitleStyles: {
    fontFamily: "Quicksand, sans-serif",
    fontSize: "48px",
    fontWeight: "bold",
    lineHeight: "72px",
    color: colors.moodyWhite,
    marginBottom: "1rem",
  },
  joinListBodyStyles: {
    fontFamily: "Quicksand, sans-serif",
    fontSize: "20px",
    fontWeight: "bold",
    lineHeight: "38px",
    color: colors.moodyWhite,
    marginBottom: "2rem",
    width: "50%",
  },
  joinListButtonStyles: {
    backgroundColor: "#fff",
    color: colors.moodyDarkBackground, // Assuming "moody dark" is defined in your theme
    padding: "0.5rem 2rem",
    fontFamily: "Poppins, sans-serif",
    fontWeight: "Medium", // Medium weight
    fontSize: "20px",
    letterspacing: 0.6,
    opacity: 1,
    lineHeight: "35px",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
  },

  topAppBarItemStyles: {
    fontFamily: "Quicksand",
    fontSize: "20px",
    lineHeight: "25px",
    fontWeight: "bold",
    letterSpacing: "0px",
    color: colors.moodyBlue,
    opacity: 1,
    outline: "none",
    textDecoration: "none",
  },
};

export default theme;

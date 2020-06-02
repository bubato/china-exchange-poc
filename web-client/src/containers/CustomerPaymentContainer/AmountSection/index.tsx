import React from "react";
import SectionHeader from "components/SectionHeader";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { useTranslation } from "react-i18next";

interface AmountSectionProps {
  amount: number | string,
  onChange: Function
}

const useToggleButtonGroupStyles = makeStyles({
  root: {
    background: "none",
    width: "100%",
    marginBottom: "30px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, 140px)",
    gridGap: "30px"
  },
  grouped: {
    marginTop: "30px"
  }
});

const StyledToggleButton = withStyles(() => ({
  root: {
    padding: "0 40px",
    border: "1px solid grey !important",
    borderRadius: "4px !important",
    lineHeight: "24px",
    marginTop: "30px",
    textTransform: "initial",
    color: "#01A982",
    "&$selected": {
      background: "#01A982",
    }
  },
  label: {
    fontSize: "24px"
  },
  selected: {}
}))(ToggleButton);

const AmountSection: React.FunctionComponent<AmountSectionProps> = ({ amount, onChange }) => {
  const { t } = useTranslation();
  const toggleButtonGroupClasses = useToggleButtonGroupStyles();
  return (
    <>
      <SectionHeader title={t("amount")} />
      <ToggleButtonGroup
        size="small"
        value={amount}
        exclusive
        onChange={(event, value) => onChange(event, value)}
        aria-label="text alignment"
        classes={toggleButtonGroupClasses}
      >
        <StyledToggleButton value={50} aria-label="left aligned">
          50
        </StyledToggleButton>
        <StyledToggleButton value={100} aria-label="left aligned">
          100
        </StyledToggleButton>
        <StyledToggleButton value={200} aria-label="left aligned">
          200
        </StyledToggleButton>
        <StyledToggleButton value={500} aria-label="left aligned">
          500
        </StyledToggleButton>
        <StyledToggleButton value={1000} aria-label="centered">
          1000
        </StyledToggleButton>
        <StyledToggleButton value={5000} aria-label="justified">
          5000
        </StyledToggleButton>
        <StyledToggleButton value="other" aria-label="justified">
          {t("other")}
        </StyledToggleButton>
      </ToggleButtonGroup>
    </>
  );
};

export default AmountSection;

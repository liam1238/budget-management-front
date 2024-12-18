import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SortSelect = ({ sortOption, onSortChange }) => {
  return (
    <FormControl className="sort-select">
      <InputLabel>Sort By</InputLabel>
      <Select value={sortOption} onChange={onSortChange} label="Sort By">
        <MenuItem value="id">By ID</MenuItem>
        <MenuItem value="description">By Description</MenuItem>
        <MenuItem value="amount">By Amount</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SortSelect;

import React, { useRef, useContext } from "react";
import TaskList from "./TaskList";
import { TaskContext } from "../context/TaskContext";

function SearchBar() {
  const searchInputRef = useRef(null);
  const { setSearchTerm } = useContext(TaskContext);

  function handleSearch(e) {
    // Read the latest value from the ref so the search field can stay uncontrolled.
    setSearchTerm(searchInputRef.current ? searchInputRef.current.value : e.target.value);
  }


  return (
    <div className="search-container">
      {/* The input is controlled by the DOM, while context stores the current filter term. */}
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search tasks..."
        onChange={handleSearch}
      />
      <TaskList />
    </div>
  );
}

export default SearchBar;

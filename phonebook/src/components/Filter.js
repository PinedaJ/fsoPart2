import React from 'react'

const Filter = ({ searchTerm, handleFilteredSearch }) => {
  return (
    <div>
      filter shown with <input value={searchTerm} onChange={handleFilteredSearch} />
    </div>
  )
}

export default Filter
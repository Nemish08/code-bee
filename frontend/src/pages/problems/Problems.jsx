import React, { useState, useMemo } from 'react';
import './Problems.css';
import { FiFilter, FiBookmark, FiSearch } from 'react-icons/fi';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

// --- MOCK DATA ---
const mockProblems = [
  { id: 1, title: 'Check Even or Odd', tags: ['math', 'conditions', 'modulo'], difficulty: 'Easy', solved: false },
  { id: 2, title: 'Check for Anagrams', tags: ['string', 'hashing', 'sorting'], difficulty: 'Medium', solved: false },
  { id: 3, title: 'Check for Palindrome', tags: ['two pointers', 'string', 'facebook'], difficulty: 'Easy', solved: false },
  { id: 4, title: 'Two Sum', tags: ['array', 'hashing', 'google'], difficulty: 'Easy', solved: false },
  { id: 5, title: 'Reverse a String', tags: ['string', 'two pointers', 'basic'], difficulty: 'Easy', solved: false },
  { id: 6, title: 'Valid Parentheses', tags: ['stack', 'string', 'amazon'], difficulty: 'Easy', solved: false },
  { id: 7, title: 'Merge Two Sorted Lists', tags: ['linked list', 'recursion'], difficulty: 'Easy', solved: false },
  { id: 8, title: 'Longest Substring Without Repeating Characters', tags: ['sliding window', 'string', 'microsoft'], difficulty: 'Medium', solved: false },
  { id: 9, title: 'Container With Most Water', tags: ['array', 'two pointers'], difficulty: 'Medium', solved: false },
  { id: 10, title: 'Top K Frequent Elements', tags: ['heap', 'array', 'hashing'], difficulty: 'Medium', solved: false },
  { id: 11, title: 'Find Median from Data Stream', tags: ['heap', 'design'], difficulty: 'Hard', solved: false },
  { id: 12, title: 'Serialize and Deserialize Binary Tree', tags: ['tree', 'design', 'google'], difficulty: 'Hard', solved: false },
  { id: 13, title: 'Word Ladder', tags: ['graph', 'bfs'], difficulty: 'Hard', solved: false },
  { id: 14, title: 'Check Palindrome', tags: ['string', 'two pointers', 'comparison'], difficulty: 'Easy', solved: false },
  { id: 15, title: 'Another Check for Palindrome', tags: ['string', 'palindrome', 'basic'], difficulty: 'Easy', solved: false },
];

const allTags = [...new Set(mockProblems.flatMap(p => p.tags))];


// --- REUSABLE UI COMPONENTS ---

const DifficultyBadge = ({ difficulty }) => {
  const difficultyClass = difficulty.toLowerCase();
  return <span className={`difficulty-badge ${difficultyClass}`}>{difficulty.toUpperCase()}</span>;
};

const Tag = ({ name }) => <span className="tag">{name}</span>;


// --- MAIN COMPONENTS ---

const ProblemsPageHeader = () => (
  <header className="page-header">
    <h1>Problems</h1>
    <button className="create-playlist-btn">+ Create Playlist</button>
  </header>
);

const FilterControls = ({ searchTerm, setSearchTerm, selectedDifficulty, setSelectedDifficulty, selectedTags, setSelectedTags }) => (
  <div className="filter-controls">
    <div className="search-bar">
      <FiSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    <select
      className="filter-btn"
      value={selectedDifficulty}
      onChange={(e) => setSelectedDifficulty(e.target.value)}
    >
      <option value="">Difficulty</option>
      <option value="Easy">Easy</option>
      <option value="Medium">Medium</option>
      <option value="Hard">Hard</option>
    </select>
    <select
      className="filter-btn"
      value={selectedTags} // Simplified for single tag selection
      onChange={(e) => setSelectedTags(e.target.value)}
    >
      <option value="">Tags</option>
      {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
    </select>
  </div>
);

const ProblemsTable = ({ problems, onSort, sortConfig }) => {
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
  };


  const navigate = useNavigate()
  const handleProblem = (e)=>{
      navigate(`/problems/${e.id}`)
  }

  return (
    <table className="problems-table">
      <thead>
        <tr>
          <th className="col-solved">Solved</th>
          <th className="col-title" onClick={() => onSort('title')}>
            Title {getSortIcon('title')}
          </th>
          <th className="col-tags">Tags</th>
          <th className="col-difficulty" onClick={() => onSort('difficulty')}>
            Difficulty {getSortIcon('difficulty')}
          </th>
          <th className="col-actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        {problems.map(problem => (
          <tr key={problem.id}>
            {/* <td className="col-solved"><input type="checkbox" className="solved-checkbox" /></td> */}
            <td className=" ">
              <div className='w-4 h-4 rounded-full border-black border-1 outline-none '></div>
            </td>
            <td className="col-title cursor-pointer  transition-all ease hover:underline" onClick={()=>handleProblem(problem)} >{problem.title}</td>
            <td className="col-tags">
              <div className="tags-container">
                {problem.tags.map(tag => <Tag key={tag} name={tag} />)}
              </div>
            </td>
            <td className="col-difficulty">
              <DifficultyBadge difficulty={problem.difficulty} />
            </td>
            <td className="col-actions">
              <button className="action-btn"><FiBookmark /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange, rowsPerPage, setRowsPerPage }) => (
  <div className="pagination-controls">
    <div className="rows-per-page">
      <span>Rows per page</span>
      <select value={rowsPerPage} onChange={e => setRowsPerPage(Number(e.target.value))}>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
      </select>
    </div>
    <div className="page-nav">
      <span>{currentPage} / {totalPages}</span>
      <button onClick={() => onPageChange(1)} disabled={currentPage === 1}><MdKeyboardDoubleArrowLeft /></button>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}><MdKeyboardArrowLeft /></button>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}><MdKeyboardArrowRight /></button>
      <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}><MdKeyboardDoubleArrowRight /></button>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
function Problems(){
  const [problems] = useState(mockProblems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTags, setSelectedTags] = useState(''); // Simplified to single tag for dropdown
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Memoize the filtering and sorting logic to avoid re-computation on every render
  const filteredAndSortedProblems = useMemo(() => {
    let processedProblems = [...problems];

    // Filter by search term
    if (searchTerm) {
      processedProblems = processedProblems.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by difficulty
    if (selectedDifficulty) {
      processedProblems = processedProblems.filter(p => p.difficulty === selectedDifficulty);
    }

    // Filter by tags
    if (selectedTags) {
        processedProblems = processedProblems.filter(p => p.tags.includes(selectedTags));
    }
    
    // Sort
    if (sortConfig.key) {
      processedProblems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return processedProblems;
  }, [problems, searchTerm, selectedDifficulty, selectedTags, sortConfig]);

  // Handle sorting state
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedProblems.length / rowsPerPage);
  const paginatedProblems = filteredAndSortedProblems.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Reset page to 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDifficulty, selectedTags, rowsPerPage]);

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <ProblemsPageHeader />
        <main className="problems-container">
          <FilterControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
          <div className="table-wrapper">
            <ProblemsTable problems={paginatedProblems} onSort={handleSort} sortConfig={sortConfig} />
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        </main>
      </div>
    </div>
  );
}

export default Problems;
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// NEW: Import useAuth to get user token
import { useAuth } from '@clerk/clerk-react';

// --- ICON IMPORTS ---
import { FiBookmark, FiChevronDown } from 'react-icons/fi';
import { FaCheckCircle, FaSort, FaSortUp, FaSortDown, FaBookmark } from 'react-icons/fa'; // FaCheckCircle added
import { CgOptions } from "react-icons/cg";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight
} from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';

// --- CUSTOM HOOK FOR CLICK-OUTSIDE DETECTION ---
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

// --- NEW UI SUB-COMPONENTS TO MATCH THE IMAGE ---

const DifficultyFilterDropdown = ({ selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));
  const difficulties = ["Easy", "Medium", "Hard"];

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
        <CgOptions className="text-gray-400" /> Difficulty <FiChevronDown />
      </button>
      {isOpen && (
        <div className="absolute z-20 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100">
          <div className="p-2">
            {difficulties.map(d => (
              <a href="#" key={d} onClick={(e) => { e.preventDefault(); setSelected(d); setIsOpen(false); }} className={`block px-4 py-2 text-sm rounded-md ${selected === d ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}>                {d}              </a>
            ))}
            {selected && <a href="#" onClick={(e) => { e.preventDefault(); setSelected(""); setIsOpen(false); }} className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-50 rounded-md mt-1">Clear</a>}
          </div>
        </div>
      )}
    </div>
  );
};

const TagsFilterDropdown = ({ allTags, selectedTags, setSelectedTags }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleTagChange = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
        <CgOptions className="text-gray-400" /> Tags <FiChevronDown />
      </button>
      {isOpen && (
        <div className="absolute z-20 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Tag Filters</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {allTags.map(tag => (
              <label key={tag} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-600">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


const ProblemsTable = ({ problems, solvedProblemIds }) => { // NEW: solvedProblemIds prop
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500">
          <tr>
            <th scope="col" className="p-4 w-[5%] font-medium">Solved</th>
            <th scope="col" className="px-6 py-3 w-[35%] font-medium flex items-center gap-1">Title <FaSortUp/></th>
            <th scope="col" className="px-6 py-3 w-[35%] font-medium">Tags</th>
            <th scope="col" className="px-6 py-3 w-[15%] font-medium">Difficulty</th>
            <th scope="col" className="px-6 py-3 w-[10%] font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {problems.map(problem => (
            <tr key={problem.uuid} className="bg-white border-b border-gray-200 hover:bg-gray-50 align-middle">
              <td className="p-4 text-center">
                {/* --- UPDATED: Conditionally render checkmark --- */}
                {solvedProblemIds.includes(problem.id) ? (
                    <FaCheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full mx-auto"></div>
                )}
                {/* --- END OF UPDATE --- */}
              </td>
              <td
                className="px-6 py-4 font-medium text-gray-800 cursor-pointer hover:text-green-600"
                onClick={() => navigate(`/problems/${problem.id}`)}
              >
                {problem.title}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {problem.tags.slice(0, 3).map(tag => (
                     <span key={tag} className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                 <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>                    {problem.difficulty.toUpperCase()}                </span>
              </td>
              <td className="px-6 py-4">
                <button className="p-2 rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-600">                  <FiBookmark className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PaginationControls = ({ currentPage, totalPages, onPageChange, rowsPerPage, setRowsPerPage }) => (
  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-gray-600 text-sm p-4">
    <div className="flex items-center gap-2 mb-4 sm:mb-0">
      <span>Rows per page:</span>
      <select
        value={rowsPerPage}
        onChange={e => setRowsPerPage(Number(e.target.value))}
        className="p-1.5 border border-gray-300 rounded-md bg-white cursor-pointer focus:ring-1 focus:ring-green-500"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
      </select>
    </div>
    <div className="flex items-center gap-4">
      <span className="font-medium">Page {totalPages > 0 ? currentPage : 0} of {totalPages}</span>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="p-1.5 bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"><MdOutlineKeyboardDoubleArrowLeft size={20}/></button>        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"><MdKeyboardArrowLeft size={20}/></button>        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"><MdKeyboardArrowRight size={20}/></button>        <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"><MdOutlineKeyboardDoubleArrowRight size={20}/></button>      </div>
    </div>
  </div>
);


// --- MAIN PAGE COMPONENT ---
function Problems() {
  const [problems, setProblems] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NEW: State for solved problems
  const [solvedProblemIds, setSolvedProblemIds] = useState([]);
  const { getToken } = useAuth();

  // Updated state for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTags, setSelectedTags] = useState([]); // Changed to array for multi-select

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchProblemsAndStatus = async () => {
      try {
        setLoading(true);
        // Fetch all problems
        const problemsRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/problems`);
        if (!problemsRes.ok) throw new Error(`Failed to fetch problems: ${problemsRes.statusText}`);
        const problemsData = await problemsRes.json();
        setProblems(problemsData);
        setAllTags([...new Set(problemsData.flatMap(p => p.tags))].sort());

        // NEW: Fetch solved problem status
        const token = await getToken();
        const solvedRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/solved-problems`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (solvedRes.ok) {
            const solvedData = await solvedRes.json();
            setSolvedProblemIds(solvedData.solvedProblemIds || []);
        }
        // END NEW

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProblemsAndStatus();
  }, [getToken]);

  // Updated memoized filtering logic for multi-tag selection
  const filteredProblems = useMemo(() => {
    return problems
      .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(p => selectedDifficulty ? p.difficulty === selectedDifficulty : true)
      .filter(p => selectedTags.length > 0 ? selectedTags.every(tag => p.tags.includes(tag)) : true)
  }, [problems, searchTerm, selectedDifficulty, selectedTags]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDifficulty, selectedTags, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / rowsPerPage));
  const paginatedProblems = filteredProblems.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  if (loading) return <div className="text-center p-10 font-semibold text-gray-500">Loading...</div>;
  if (error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">Error: {error}</div>;

  return (
    <main className="bg-white rounded-xl shadow-lg border border-gray-100">
        {/* Header inside the main component */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Problems</h2>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105">                + Create Playlist
            </button>
        </div>
        
        {/* Filters */}
        <div className="p-4 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-grow w-full md:w-auto">
              <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
              />
            </div>
            <DifficultyFilterDropdown selected={selectedDifficulty} setSelected={setSelectedDifficulty} />
            <TagsFilterDropdown allTags={allTags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        </div>
        
        {/* Table and Pagination */}
        <ProblemsTable problems={paginatedProblems} solvedProblemIds={solvedProblemIds} />
        {paginatedProblems.length === 0 && (
          <div className="text-center py-16 text-gray-500">No problems match your criteria.</div>
        )}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
    </main>
  );
}

export default Problems;
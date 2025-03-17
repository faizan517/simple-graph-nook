
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, ChevronDown, Users, UserPlus } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './ui/table';

const UserTable = () => {
  const { getAllUsers, quotationLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'descending'
  });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  
  const navigate = useNavigate();

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const allUsers = await getAllUsers();
        // Sort by newest first (assuming higher ID means newer)
        const sortedUsers = [...allUsers].sort((a, b) => b.id - a.id);
        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [getAllUsers]);

  // Filter users based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
      setCurrentPage(1); // Reset to first page when search is cleared
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        (user.name && user.name.toLowerCase().includes(lowercasedQuery)) ||
        (user.email && user.email.toLowerCase().includes(lowercasedQuery)) ||
        (user.department && user.department.toLowerCase().includes(lowercasedQuery))
      );
      setFilteredUsers(filtered);
      setCurrentPage(1); // Reset to first page when search changes
    }
  }, [searchQuery, users]);

  // Sort users
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    // Sort the users
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      // Handle null or undefined values
      if (!a[key] && !b[key]) return 0;
      if (!a[key]) return 1;
      if (!b[key]) return -1;
      
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredUsers(sortedUsers);
  };

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle user row click
  const handleUserClick = (id) => {
    navigate(`/users/${id}`);
  };

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronDown className="h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === 'ascending' ? (
      <ChevronDown className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4 transform rotate-180" />
    );
  };

  if (isLoading || quotationLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-sm animate-fade-in overflow-hidden border border-border">
      {/* Header with search */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Leads</h2>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {filteredUsers.length} total
            </div>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <UserPlus className="h-3 w-3 mr-1" />
              New leads on top
            </div>
          </div>
          
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="w-full py-2 pl-10 pr-4 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/30">
              <TableHead>
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => requestSort('name')}
                >
                  <span>Name</span>
                  {getSortIcon('name')}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => requestSort('email')}
                >
                  <span>Email</span>
                  {getSortIcon('email')}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => requestSort('department')}
                >
                  <span>Company</span>
                  {getSortIcon('department')}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => requestSort('status')}
                >
                  <span>Quotations</span>
                  {getSortIcon('status')}
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <TableRow 
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className="hover:bg-muted/50 cursor-pointer"
                >
                  <TableCell className="px-4 py-3 text-sm">{user.name}</TableCell>
                  <TableCell className="px-4 py-3 text-sm">{user.email}</TableCell>
                  <TableCell className="px-4 py-3 text-sm">{user.department}</TableCell>
                  <TableCell className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'Away'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.quotations ? user.quotations.length : 0} plans
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="4" className="px-4 py-10 text-center">
                  <div className="flex flex-col items-center">
                    <Users className="h-8 w-8 text-muted-foreground/40 mb-2" />
                    <p className="text-muted-foreground">No leads found</p>
                    <p className="text-sm text-muted-foreground mt-1">Try adjusting your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
            <span className="font-medium">
              {indexOfLastUser > filteredUsers.length ? filteredUsers.length : indexOfLastUser}
            </span>{" "}
            of <span className="font-medium">{filteredUsers.length}</span> leads
          </p>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={prevPage} 
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => {
                // Only show 5 page numbers at most
                if (
                  totalPages <= 5 ||
                  i === 0 ||
                  i === totalPages - 1 ||
                  (i >= currentPage - 2 && i <= currentPage)
                ) {
                  return (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => paginate(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                // Show ellipsis for gaps
                if (i === 1 && currentPage > 3) {
                  return (
                    <PaginationItem key="ellipsis-start">
                      <span className="flex h-9 w-9 items-center justify-center">...</span>
                    </PaginationItem>
                  );
                }
                if (i === totalPages - 2 && currentPage < totalPages - 2) {
                  return (
                    <PaginationItem key="ellipsis-end">
                      <span className="flex h-9 w-9 items-center justify-center">...</span>
                    </PaginationItem>
                  );
                }
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={nextPage} 
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default UserTable;

import React, { useState, useMemo } from 'react';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import { AiOutlineDownload } from 'react-icons/ai';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import * as XLSX from 'xlsx';
import Sidebar from './Slidebar';
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";


// Dummy Data
const data = [
    { name: 'Freda', email: 'fwinger@fc2.com', phone: '5967957989', website: 'http://example.com', industry: 'Real Estate', status: 'true', remark: 'nisi nunc nisl duis' },
    { name: 'Alcyone', email: 'alcyone@sample.com', phone: '4881118631', website: 'http://sun.com', industry: 'Investment Banking', status: 'false', remark: 'nulla sit amet' },
    { name: 'Dalia', email: 'dalia@reference.com', phone: '9919131652', website: 'http://flowers.com', industry: 'Agriculture', status: 'true', remark: 'imperdiet velit non' },
    { name: 'Kane', email: 'kane@sakura.ne.jp', phone: '4928500329', website: 'http://techworld.com', industry: 'Software Development', status: 'false', remark: 'gravida sem pulvinar' },
    { name: 'Hassan', email: 'hassan@pinterest.com', phone: '3862338325', website: 'http://edu.com', industry: 'Education', status: 'true', remark: 'nunc in accumsan' },
    { name: 'Sheena', email: 'sheena@bigcartel.com', phone: '4333616798', website: 'http://fashionhub.com', industry: 'Fashion', status: 'false', remark: 'quis turpis varius' },
    { name: 'Hilton', email: 'hilton@myself.com', phone: '8059808180', website: 'http://lifestyle.com', industry: 'Lifestyle', status: 'true', remark: 'dictumst aliquam' },
    { name: 'Hudson', email: 'hudson@answers.com', phone: '8705495500', website: 'http://healthcare.com', industry: 'Healthcare', status: 'false', remark: 'eget orci vehicula' },
    { name: 'Sienna', email: 'sienna@google.com', phone: '4628674456', website: 'http://industrial.com', industry: 'Manufacturing', status: 'true', remark: 'purus felis sagittis' },
    { name: 'Jasper', email: 'jasper@wikispaces.com', phone: '4222905888', website: 'http://technology.com', industry: 'Technology', status: 'false', remark: 'eu est vestibulum' },
    { name: 'Eleanor', email: 'eleanor@fc2.com', phone: '5997557991', website: 'http://finance.com', industry: 'Finance', status: 'true', remark: 'mollis lacus lectus' },
    { name: 'Orion', email: 'orion@sample.com', phone: '4811138634', website: 'http://realestate.com', industry: 'Real Estate', status: 'false', remark: 'malesuada orci' },
    { name: 'Luna', email: 'luna@reference.com', phone: '9917151654', website: 'http://services.com', industry: 'Service Industry', status: 'true', remark: 'semper metus nec' },
    { name: 'Phoenix', email: 'phoenix@sakura.ne.jp', phone: '4928600328', website: 'http://retailworld.com', industry: 'Retail', status: 'false', remark: 'interdum aenean vel' },
    { name: 'Nina', email: 'nina@pinterest.com', phone: '3862038329', website: 'http://eduonline.com', industry: 'Online Education', status: 'true', remark: 'at bibendum augue' },
    { name: 'Sawyer', email: 'sawyer@bigcartel.com', phone: '4333816792', website: 'http://automotive.com', industry: 'Automotive', status: 'false', remark: 'commodo faucibus' },
    { name: 'Harper', email: 'harper@myself.com', phone: '8059808119', website: 'http://medical.com', industry: 'Medical', status: 'true', remark: 'pellentesque habitant' },
    { name: 'Morgan', email: 'morgan@answers.com', phone: '8705495534', website: 'http://cosmetics.com', industry: 'Cosmetics', status: 'false', remark: 'dictum in sollicitudin' },
    { name: 'Skylar', email: 'skylar@google.com', phone: '4628774453', website: 'http://machinery.com', industry: 'Machinery', status: 'true', remark: 'sed turpis fringilla' },
    { name: 'Jordan', email: 'jordan@wikispaces.com', phone: '4222905882', website: 'http://engineering.com', industry: 'Engineering', status: 'false', remark: 'duis vestibulum' },
  ];
  

// Columns
const columns = [
  { Header: 'Account Name', accessor: 'name' },
  { Header: 'Email', accessor: 'email' },
  { Header: 'Phone No.', accessor: 'phone' },
  { Header: 'Website', accessor: 'website' },
  { Header: 'Industry', accessor: 'industry' },
  { Header: 'Account Status', accessor: 'status' },
  { Header: 'Remark', accessor: 'remark' },
];

const TableComponent = () => {
  const [filterInput, setFilterInput] = useState("");

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const handleFilterChange = (e) => {
    const value = e.target.value || "";
    setGlobalFilter(value);
    setFilterInput(value);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Data.xlsx");
  };

  return (
      <div className="p-4 shadow-lg">
          {/* <Sidebar/> */}
      <div className="flex justify-between items-center mb-4">
        <span className='flex flex-col text-xl'>Account Lists
            <span className='text-sm'>Here's a list of account</span>
        </span>
        <input
          value={filterInput}
          onChange={handleFilterChange}
          placeholder="Search..."
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
        <button onClick={downloadExcel} className="bg-green-500  px-4 py-2 rounded-md flex items-center">
          <RiFileExcel2Line className="mr-2" size={25}/>
        </button>
      </div>

      <table {...getTableProps()} className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="py-2 px-4 text-left bg-green-700">
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <FaSortDown className="inline ml-2" />
                        : <FaSortUp className="inline ml-2" />
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="border-t border-gray-200">
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} className="py-2 px-4">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-end items-center mt-4">
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <div>
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="pl-4 py-2  rounded-md mr-2">
          <FaArrowLeft />

          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="pr-4 py-2 rounded-md">
          <FaArrowRight />

          </button>
        </div>


        <select
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-2 py-1"
        >
          {[10, 20, 30, 40, 50].map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TableComponent;

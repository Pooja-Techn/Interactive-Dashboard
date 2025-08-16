// import  { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';
// import tinycolor from 'tinycolor2';


// const getDateArray = (start: Date, end: Date) => {
//   const arr = [];
//   let dt = new Date(start);
//   while (dt <= end) {
//     arr.push(new Date(dt));
//     dt.setDate(dt.getDate() + 1);
//   }
//   return arr;
// };

// const parseRange = (range: string) => {
//   const [start, end] = range.split("-");
//   const parse = (s: string) => {
//     if (s === "today") return new Date();
//     const [mm, dd, yy] = s.split("/");
//     return new Date(`20${yy}-${mm}-${dd}`);
//   };
//   return [parse(start), parse(end)];
// };

// const Linechartcomponent: React.FC<{ coloredData: any, selectedColor: string }> = ({ coloredData, selectedColor }) => {
//   const ref = useRef<HTMLDivElement>(null);
//   const selectedColorUpdate = useRef(false);
   

//   const [dateRange, setDateRange] = useState("05/01/25-today");
//   const [pendingDateRange, setPendingDateRange] = useState(dateRange);
//   const [checkedColors, setCheckedColors] = useState<string[]>([selectedColor]);

//   const [start, end] = parseRange(dateRange);
//   const dates = getDateArray(start, end);
//   const margin = { top: 10, right: 20, bottom: 40, left: 25 };
//     const width = 400 - margin.left - margin.right;
//     const height = 220 - margin.top - margin.bottom;

// const minBarWidth = 16; // Minimum width per date tick (adjust as needed)
// const dynamicWidth = dates.length > 25 ? dates.length * minBarWidth : width;
//   // Filter active countries based on checked colors
//   const activeCountries = coloredData.filter((d: any) => checkedColors.includes(d.color));

//   // Build chart data from active countries' categories
//   const chartData = activeCountries.flatMap((country: any) =>
//     country.categories.flatMap((cat: any) =>
//       dates.map(date => ({
//         category: cat.category,
//         country: country.Country,
//         color: country.color,
//         date,
//         value: cat.value + Math.round(Math.random() * 10 - 5),
//       }))
//     )
//   );
  
//   useEffect(() => {
//     if (!ref.current) return;

//     d3.select(ref.current).selectAll("*").remove();

    
//     //to add horizontal bars, we need to calculate the width dynamically based on the number of dates
  

//     const svg = d3.select(ref.current)
//       .append("svg")
//      .attr("width", width + margin.left + margin.right)
  
//       .attr("height", height + margin.top + margin.bottom)
//       .attr('margin-left', '5px')
//       .append("g")
//       .attr("transform", `translate(${margin.left},${margin.top})`);

      

       

    

//     const y = d3.scaleLinear()
//       .domain([
//         d3.min(chartData, (d: any) => d.value as number)! - 5,
//         d3.max(chartData, (d: any) => d.value as number)! + 5
//       ])
//       .range([height, 0]);

//     svg.append("g")
//       .call(d3.axisLeft(y))
//       .selectAll("text")
//       .style("font-size", "6px");

//     const x = d3.scaleTime()
//       .domain([start, end])
//       .range([0, width]);

//     svg.append("g")
//       .attr("transform", `translate(0,${height})`)
//       .call(
//         d3.axisBottom(x)
//           .tickValues(dates)
//           .tickFormat((d: Date | d3.NumberValue) =>
//             d3.timeFormat("%-d")(d instanceof Date ? d : new Date(Number(d)))
//           )
//       )
//       .selectAll("text")
//       .attr("transform", "rotate(-45)")
//       .style("text-anchor", "end")
//       .style("font-size", "5px");

//     // Group by country + category to draw individual lines
//     // Draw lines only for countries whose color is in checkedColors (activeCountries)
//     // Each line is for a country-category pair, colored by the country color (selectedColor if only one selected)
//      const grouped = d3.group(chartData, (d: any) => `${d.country}-${d.category}`);

// //     grouped.forEach((values, key) => {
// //       const [country, category] = String(key).split("-");
// //       // If only one color is selected, always use selectedColor for all lines
// //       // Otherwise, use the color from the country object
// //       // let color = selectedColor;
// //       // if (checkedColors.length > 1) {
// //       // const colorObj = activeCountries.find((c: any) => c.Country === country);
// //       // color =  selectedColor || colorObj?.color 
// //       // }
// //       const colorObj = activeCountries.find((c: any) => c.Country === country);
// // const color = colorObj?.color || selectedColor;


// //       const line = d3.line<any>()
// //       .x(d => x(d.date))
// //       .y(d => y(d.value));

// //       svg.append("path")
// //       .datum(values)
// //       .attr("fill", "none")
// //       .attr("stroke", tinycolor(color).lighten(Math.random() * 10).toHexString())
// //       .attr("stroke-width", 2)
// //       .attr("d", line as any);
// //     });
// const tooltip = d3.select("#tooltip");

// grouped.forEach((values, key) => {
//   const [country, category] = key.split("-");
//     const colorObj = activeCountries.find((c: any) => c.Country === country);
//   let color = colorObj?.color || selectedColor;

// if (!selectedColorUpdate.current && checkedColors.length > 1) {
//   const colorObj = activeCountries.find((c: any) => c.Country === country);
//   color = colorObj?.color || selectedColor;
// }
// const categoryIndex = activeCountries
//   .flatMap((c: any) => c.categories.map((cat: any) => cat.category))
//   .indexOf(category); // find index of category

// const categoryColor = tinycolor(color).lighten(categoryIndex * 8).toHexString();

//   const line = d3.line<any>()
//     .x(d => x(d.date))
//     .y(d => y(d.value));
    

//   svg.append("path")
//     .datum(values)
//     .attr("fill", "none")
//     .attr("stroke", categoryColor)
//     .attr("stroke-width", 2)
//     .attr('stroke-dasharray', null)
//     .attr("d", line as any)
//     .on("mouseover", function (event, d) {
//       const latest: any = d[d.length - 1]; // show latest value in tooltip
//       // Find the closest data point to the mouse x position
//       const [mouseX] = d3.pointer(event, svg.node());
//       const xDate = x.invert(mouseX);

//       // Find the closest value in the line to the hovered x position
//       const bisect = d3.bisector((d: any) => d.date).left;
//       const idx = bisect(d, xDate);
//       const point: any = d[idx] || d[d.length - 1];

//   tooltip
//     .style("display", "block")
//     .html(`
//       <table style="width: 100px; font-size: 10px;">
//         <tr>
//           <td><strong>${country}</strong></td>
//           <td>${d3.timeFormat("%m/%d/%y")(point.date)}</td>
//         </tr>
//         ${
//           coloredData
//             .filter((a: any) => a.Country == country)
//             .map((d: any) =>
//               d.categories
//                 .map((cat: any, catIdx: number) => {
//                   // Lighten color for each category, similar to lines
//                   //const baseLighten = (Array.from(grouped.keys()).indexOf(key) * 10);
//                   const baseLighten = d.color
//                   const lightenAmount = baseLighten + catIdx * 8;
                  
//                  // const catColor = tinycolor(d.color).lighten(d.color*10).toHexString();
//                  const catColor = tinycolor(d.color).lighten(catIdx * 8).toHexString();
 
//                  return `
//                     <tr>
//                       <td>
//                         <div style="display:inline-block;width:10px;height:10px;background:${catColor};margin-right:4px;"></div>
//                         ${cat.category}:
//                       </td>
//                       <td style="text-align: right">${cat.value}</td>
//                     </tr>
//                   `;
//                 })
//                 .join("")
//             )
//             .join("")
//         }
//       </table>
//     `);
//     })
//     .on("mousemove", function (event) {
//       tooltip
//         .style("left", `${event.pageX + 10}px`)
//         .style("top", `${event.pageY - 30}px`);
//     })
//     .on("mouseout", function () {
//       tooltip.style("display", "none");
//     });
   
// });
// selectedColorUpdate.current = false;


//   }, [checkedColors, dateRange]);


// useEffect(() => {
//   selectedColorUpdate.current = true;
//   setCheckedColors([selectedColor]);
// }, [selectedColor]);
// // useEffect(() => {
// //   setCheckedColors(prev => {
// //     if (prev.includes(selectedColor)) {
// //       return prev; // already included, no change
// //     }
// //     return [...prev, selectedColor]; // add selectedColor to checked colors
// //   });
// // }, [selectedColor]);


//   // Checkbox logic
//   const handleCheckboxChange = (color: string, checked: boolean) => {
//     setCheckedColors(prev =>
//       checked ? [...prev, color] : prev.filter(c => c !== color)
//     );
//   };

//   const handleSelectAll = () => {
//     setCheckedColors(coloredData.map((d: any) => d.color));
//   };

//   const handleDeselectAll = () => {
//     setCheckedColors([selectedColor]);
//   };
//    useEffect(() => {
//           setPendingDateRange(dateRange);
//         }, [dateRange]);

//   return (
//     <>
//       <label htmlFor="daterangedropdown" style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '11px', textAlign: 'left', margin: '1%' }} >Date range:</label>
//       {/* Use a local state to control the select dropdown */}
//       {(() => {     

//         return (
//           <>
//         <select
//           value={pendingDateRange}
//           onChange={e => setPendingDateRange(e.target.value)}
//         >
//           <option value="05/01/25-today">From May 1, 2025 to Today</option>
//           <option value="04/01/25-04/30/25">April 2025</option>
//           <option value="03/01/25-03/31/25">March 2025</option>
//         </select>
//         <button
//           className="outlined"
//           style={{ alignSelf: 'center' /* vertical centering */
//           /* horizontal centering */}}
//           onClick={() => {
//             if (pendingDateRange !== dateRange) setDateRange(pendingDateRange);
//           }}
//         >
//           Generate
//         </button>
//           </>
//         );
//       })()}

//       <div style={{ display: 'flex', flexDirection: 'row-reverse', marginTop: '0px' }}>
//         <div style={{ marginRight: '20px', marginTop: '-32px' }}>
//           <div style={{ fontSize: '8px', marginBottom: '14px' }}>
//             <label>
//               <input
//                 type="checkbox"
//                 onChange={(e) => e.target.checked ? handleSelectAll() : handleDeselectAll()}
//                 checked={checkedColors.length === coloredData.length}
//                 style={{ marginRight: '4px' }}
//               />
//               <span>Select All</span>
//             </label>

//             <label style={{ marginLeft: '16px' }}>
//               <input
//                 type="checkbox"
//                 onChange={() => handleDeselectAll()}
//               />
//               <span>Deselect All</span>
//             </label>
//           </div>

//           {coloredData.map((d: any) => (
//             <div key={d.color} style={{ display: 'flex', fontSize: '8px', marginBottom: '1px' }}>
//               <input
                
//                 type="checkbox"
//                 checked={checkedColors.includes(d.color)}
//                 onChange={(e) => handleCheckboxChange(d.color, e.target.checked)}
//                 style={{ width: '10px', height: '10px', marginRight: '6px', marginTop: '0px'}}
//               />
//               <div style={{
//                 width: '10px',
//                 height: '10px',
//                 backgroundColor: d.color,
//                 marginRight: '6px'
//               }} />
//               <span>{d.Country}</span>
//             </div>
//           ))}
//         </div>

//         <div ref={ref}  />
//       </div>
      
// <div
//   id="tooltip"
//   style={{
//     position: 'absolute',
//     background: 'rgba(255, 255, 255, 0.95)',
//     border: '1px solid #ccc',
//     borderRadius: '4px',
//     boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
//     padding: '6px 10px',
//     fontSize: '10px',
//     pointerEvents: 'none',
//     display: 'none',
//     zIndex: 1000,
//     color: '#333',
//     maxWidth: '200px',
//     whiteSpace: 'nowrap'
//   }}
// ></div>


//     </>
//   );
// };

// export default Linechartcomponent;


// import * as React from 'react';
// import {
//   Box, Table, TableBody, TableCell, TableContainer, TableHead,
//   TablePagination, TableRow, TableSortLabel, Toolbar, Typography,
//   Paper, Checkbox, IconButton, Tooltip, FormControlLabel, Switch,
//   Menu, MenuItem, Button, Dialog, DialogTitle, DialogContent
// } from '@mui/material';
// import { alpha } from '@mui/material/styles';
// import { visuallyHidden } from '@mui/utils';
// import { exportImportData } from "../components/data";

// // Define the flattened row shape
// interface FlattenedRow {
//   Country: string;
//   Category: string;
//   CategoryValue: number;
//   Export: number;
//   Import: number;
//   color: string;
// }

// // Flatten dataset
// const flattenData = (): FlattenedRow[] => {
//   return exportImportData.flatMap((item) =>
//     item.categories.map((cat) => ({
//       Country: item.Country,
//       Category: cat.category,
//       CategoryValue: cat.value,
//       Export: item.Export,
//       Import: item.Import,
//       color: item.color
//     }))
//   );
// };

// type Order = 'asc' | 'desc';

// function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
//   if (b[orderBy] < a[orderBy]) return -1;
//   if (b[orderBy] > a[orderBy]) return 1;
//   return 0;
// }

// function getComparator<Key extends keyof FlattenedRow>(
//   order: Order,
//   orderBy: Key
// ): (a: FlattenedRow, b: FlattenedRow) => number {
//   return (a, b) => {
//     const aValue = a[orderBy];
//     const bValue = b[orderBy];

//     if (aValue == null) return 1;
//     if (bValue == null) return -1;

//     if (typeof aValue === 'number' && typeof bValue === 'number') {
//       return order === 'desc' ? bValue - aValue : aValue - bValue;
//     }

//     return order === 'desc'
//       ? String(bValue).localeCompare(String(aValue))
//       : String(aValue).localeCompare(String(bValue));
//   };
// }
// interface EnhancedTableProps {
 
//   order: Order;
//   orderBy: keyof FlattenedRow;
//   onRequestSort: (event: React.MouseEvent<unknown>, property: keyof FlattenedRow) => void;
//   visibleColumns: (keyof FlattenedRow)[];
// }


// interface HeadCell {
//   id: keyof FlattenedRow;
//   label: string;
//   numeric: boolean;
//   disablePadding: boolean;
// }

// // const headCells: HeadCell[] = [
// //   { id: 'Country', label: 'Country', numeric: false },
// //   { id: 'Category', label: 'Category', numeric: false },
// //   { id: 'CategoryValue', label: 'Value', numeric: true },
// //   { id: 'Export', label: 'Export', numeric: true },
// //   { id: 'Import', label: 'Import', numeric: true }
// // ];
// const headCells: Record<keyof FlattenedRow, HeadCell> = {
//   Country: {
//     id: 'Country',
//     label: 'Country',
//     numeric: false,
//     disablePadding: false
//   },
//   Category: {
//     id: 'Category',
//     label: 'Category',
//     numeric: false,
//     disablePadding: false
//   },
//   CategoryValue: {
//     id: 'CategoryValue',
//     label: 'Value',
//     numeric: true,
//     disablePadding: false
//   },
//   Export: {
//     id: 'Export',
//     label: 'Export',
//     numeric: true,
//     disablePadding: false
//   },
//   Import: {
//     id: 'Import',
//     label: 'Import',
//     numeric: true,
//     disablePadding: false
//   },
//   color: {
//     id: 'color',
//     label: 'Color',
//     numeric: false,
//     disablePadding: false
//   }
// };

// function EnhancedTableHead(props: EnhancedTableProps) {
//   const { order, orderBy, onRequestSort, visibleColumns } = props;

//   const createSortHandler = (property: keyof FlattenedRow) => (event: React.MouseEvent<unknown>) => {
//     onRequestSort(event, property);
//   };

//   return (
//     <TableHead>
//       <TableRow>
//         {visibleColumns.map((colKey) => {
//           const headCell = headCells[colKey];
//           return (
//             <TableCell
//               key={headCell.id}
//               align={headCell.numeric ? 'right' : 'left'}
//               padding={headCell.disablePadding ? 'none' : 'normal'}
//               sortDirection={orderBy === headCell.id ? order : false}
//             >
//               <TableSortLabel
//                 active={orderBy === headCell.id}
//                 direction={orderBy === headCell.id ? order : 'asc'}
//                 onClick={createSortHandler(headCell.id)}
//               >
//                 {headCell.label}
//                 {orderBy === headCell.id ? (
//                   <Box component="span" sx={visuallyHidden}>
//                     {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
//                   </Box>
//                 ) : null}
//               </TableSortLabel>
//             </TableCell>
//           );
//         })}
//       </TableRow>
//     </TableHead>
//   );
// }

// // function EnhancedTableHead({
// //   order, orderBy, onRequestSort, visibleColumns
// // }: {
// //   order: Order;
// //   orderBy: string;
// //   onRequestSort: (event: React.MouseEvent<unknown>, property: keyof FlattenedRow) => void;
// //   visibleColumns: (keyof FlattenedRow)[];
// // }) {
// //   const createSortHandler = (property: keyof FlattenedRow) => (event: React.MouseEvent<unknown>) => {
// //     onRequestSort(event, property);
// //   };

// //   return (
// //     <TableHead>
// //       <TableRow>
// //         {headCells.filter(cell => visibleColumns.includes(cell.id)).map((headCell) => (
// //           <TableCell
// //             key={headCell.id}
// //             align={headCell.numeric ? 'right' : 'left'}
// //             sortDirection={orderBy === headCell.id ? order : false}
// //           >
// //             <TableSortLabel
// //               active={orderBy === headCell.id}
// //               direction={orderBy === headCell.id ? order : 'asc'}
// //               onClick={createSortHandler(headCell.id)}
// //             >
// //               {headCell.label}
// //               {orderBy === headCell.id ? (
// //                 <Box component="span" sx={visuallyHidden}>
// //                   {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
// //                 </Box>
// //               ) : null}
// //             </TableSortLabel>
// //           </TableCell>
// //         ))}
// //       </TableRow>
// //     </TableHead>
// //   );
// // }

// export default function TicketView() {
//   const [order, setOrder] = React.useState<Order>('asc');
//   const [orderBy, setOrderBy] = React.useState<keyof FlattenedRow>('Country');
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);
//   const [dense, setDense] = React.useState(false);
//   const [visibleColumns, setVisibleColumns] = React.useState<(keyof FlattenedRow)[]>([
//     'Country', 'Category', 'CategoryValue', 'Export', 'Import'
//   ]);
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const [dialogData, setDialogData] = React.useState<FlattenedRow | null>(null);

//   const rows = React.useMemo(() => flattenData(), []);

//   const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof FlattenedRow) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setDense(event.target.checked);
//   };

//   const handleColumnMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleColumnToggle = (column: keyof FlattenedRow) => {
//     setVisibleColumns((prev) =>
//       prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
//     );
//   };

//   const handleDialogOpen = (row: FlattenedRow) => setDialogData(row);
//   const handleDialogClose = () => setDialogData(null);


//   const paginatedRows = React.useMemo(() => {
//   const start = page * rowsPerPage;
//   const end = start + rowsPerPage;
//   return sortedRows.slice(start, end);
// }, [sortedRows, page, rowsPerPage]);


//     const sortedRows = React.useMemo(() => {
//     const stabilizedRows = flattenData().map((row: any, index: any) => [row, index] as const);
//     stabilizedRows.sort((a, b) => {
//       const orderComp = getComparator(order, orderBy)(a[0], b[0]);
//       if (orderComp !== 0) return orderComp;
//       return a[1] - b[1]; // stable sort
//     });
//     return stabilizedRows.map((el) => el[0]);
//   }, [order, orderBy, flattenData]);


//   return (
//     <Box sx={{ width: '100%' }}>
//       <Paper sx={{ width: '100%', mb: 2 }}>
//         <Toolbar
//           sx={{
//             pl: { sm: 2 },
//             pr: { xs: 1, sm: 1 },
//             display: 'flex',
//             justifyContent: 'space-between'
//           }}
//         >
//           <Typography variant="h6" component="div">Ticket Categories</Typography>
//           <Button variant="outlined" onClick={handleColumnMenuOpen}>Manage Columns</Button>
//           <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
//             {Object.values(headCells).map((cell) => (
//               <MenuItem key={cell.id} onClick={() => handleColumnToggle(cell.id)}>
//                 <Checkbox checked={visibleColumns.includes(cell.id)} />
//                 {cell.label}
//               </MenuItem>
//             ))}
//           </Menu>
//         </Toolbar>
//         <TableContainer>
//           <Table size={dense ? 'small' : 'medium'}>
//             <EnhancedTableHead
//               order={order}
//               orderBy={orderBy}
//               onRequestSort={handleRequestSort}
//               visibleColumns={visibleColumns}
//             />
//             <TableBody>
//               {paginatedRows.map((row, index) => (
//                 <TableRow key={index} hover>
//                   {visibleColumns.map((col) => {
//   let displayValue: string | number = '';

//   switch (col) {
//     case 'Country':
//       displayValue = row.Country;
//       break;
//     case 'Category':
//       displayValue = row.Category;
//       break;
//     case 'CategoryValue':
//       displayValue = row.CategoryValue;
//       break;
//     case 'Export':
//       displayValue = row.Export;
//       break;
//     case 'Import':
//       displayValue = row.Import;
//       break;
//     default:
//       displayValue = '';
//   }

//   return (
//     <TableCell
//       key={col}
//       align={typeof displayValue === 'number' ? 'right' : 'left'}
//       onClick={() => col === 'Country' && handleDialogOpen(row)}
//       sx={{ cursor: col === 'Country' ? 'pointer' : 'default' }}
//     >
//       {displayValue}
//     </TableCell>
//   );
// })}

//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={rows.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//         <FormControlLabel
//           control={<Switch checked={dense} onChange={handleChangeDense} />}
//           label="Dense padding"
//         />
//       </Paper>

//       {/* Dialog for Row Details */}
//       <Dialog open={Boolean(dialogData)} onClose={handleDialogClose} fullWidth>
//         <DialogTitle>{dialogData?.Country} - {dialogData?.Category}</DialogTitle>
//         <DialogContent>
//           <Typography>Category Value: {dialogData?.CategoryValue}</Typography>
//           <Typography>Export: {dialogData?.Export}</Typography>
//           <Typography>Import: {dialogData?.Import}</Typography>
//           <Typography>Color: {dialogData?.color}</Typography>
//         </DialogContent>
//       </Dialog>
//     </Box>
//   );
// }
import React from 'react'

export const Filters = () => {
  return (
    <div>Filters</div>
  )
}

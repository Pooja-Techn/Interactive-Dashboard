import React, { useMemo, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, TableSortLabel, Toolbar, Typography,
  Paper, Checkbox, IconButton, Tooltip, FormControlLabel, Switch,
  Menu, MenuItem, Button, Dialog, DialogTitle, DialogContent,
  Input,
  TextField,
  Select,
  FormControl
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import { exportImportData } from "../components/data";

import CloseIcon from '@mui/icons-material/Close';
import { KeyOff, SettingsAccessibilitySharp } from '@mui/icons-material';



//textfield styling in dialog
const compactTextFieldSx = {
  '& .MuiInputBase-root': {
    height: 32,
    fontSize: '0.60rem',
    padding: '0 8px',
    margin: '3px'
  },
  '& input': {
    padding: '4px 0',
    fontSize: '0.75rem',
  },
  '& label': {
    fontSize: '0.75rem',
  },
};

 
function getComparator<Key extends keyof FlattenedRow>(
  order: Order,
  orderBy: Key
): (a: FlattenedRow, b: FlattenedRow) => number {
  return (a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'desc' ? bValue - aValue : aValue - bValue;
    }

    return order === 'desc'
      ? String(bValue).localeCompare(String(aValue))
      : String(aValue).localeCompare(String(bValue));
  };
}
interface EnhancedTableProps {
 
  order: Order;
  orderBy: keyof FlattenedRow;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof FlattenedRow) => void;
  visibleColumns: (keyof FlattenedRow)[];
}
interface FlattenedRow {
  Country: string;
  Category: string;
  CategoryValue: number;
  Export: number;
  Import: number;
  color: string;
}

// Flatten dataset
const flattenData = (): FlattenedRow[] => {
  return exportImportData.flatMap((item) =>
    item.categories.map((cat) => ({
      Country: item.Country,
      Category: cat.category,
      CategoryValue: cat.value,
      Export: item.Export,
      Import: item.Import,
      color: item.color
    }))
  );
};
type Order = 'asc' | 'desc';
interface HeadCell {
  id: keyof FlattenedRow;
  label: string;
  numeric: boolean;
  disablePadding: boolean;
}
const headCells: Record<keyof FlattenedRow, HeadCell> = {
  Country: {
    id: 'Country',
    label: 'Country',
    numeric: false,
    disablePadding: false
  },
  Category: {
    id: 'Category',
    label: 'Category',
    numeric: false,
    disablePadding: false
  },
  CategoryValue: {
    id: 'CategoryValue',
    label: 'Value',
    numeric: true,
    disablePadding: false
  },
  Export: {
    id: 'Export',
    label: 'Export',
    numeric: true,
    disablePadding: false
  },
  Import: {
    id: 'Import',
    label: 'Import',
    numeric: true,
    disablePadding: false
  },
  color: {
    id: 'color',
    label: 'Color',
    numeric: false,
    disablePadding: false
  }
};
function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort, visibleColumns } = props;

  const createSortHandler = (property: keyof FlattenedRow) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {visibleColumns.map((colKey: keyof FlattenedRow) => {
          const headCell = headCells[colKey];
          return (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
              style={{fontSize: 'x-small', fontWeight: 'bold'}}
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

export default function TicketView() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof FlattenedRow>('Country');
  //The generic <keyof FlattenedRow> ensures that orderBy can only be set to a key (property name) from the FlattenedRow TypeScript type/interface. This provides type safety.
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dense, setDense] = React.useState(true);
  const [visibleColumns, setVisibleColumns] = React.useState<(keyof FlattenedRow)[]>([
    'Country', 'Category', 'CategoryValue', 'Export', 'Import'
  ]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dialogData, setDialogData] = React.useState<FlattenedRow | null>(null);
  const [category, setCategory] = React.useState<string>("create user")
  
  // Compute and reuse rows
  const rows = React.useMemo(() => flattenData(), []);

  // Sorting logic
  const sortedRows = React.useMemo(() => {
    // //Tells TypeScript to treat the tuple as a fixed, read-only pair (a tuple of exact types, e.g., [RowType, number]), not as a general array.
// //Without as const, TypeScript would infer the type as (RowType | number)[], which is less precise.

    const stabilized = rows.map((el, index) => [el, index] as const);
    stabilized.sort((a, b) => {
      const comp = getComparator(order, orderBy)(a[0], b[0]);
      return comp !== 0 ? comp : a[1] - b[1];
    });
    return stabilized.map((el) => el[0]);
  }, [rows, order, orderBy]);

  // Pagination logic
  const paginatedRows = React.useMemo(() => {
    const start = page * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  // Handlers
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof FlattenedRow) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const handleColumnMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleColumnToggle = (column: keyof FlattenedRow) => {
    setVisibleColumns((prev) =>
      prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
    );
  };

  const handleDialogOpen = (row: FlattenedRow) => setDialogData(row);
  const handleDialogClose = () => setDialogData(null);

  return (
    <Box sx={{ width: '100%', marginTop: '2%' }}>
      <Paper sx={{ width: '100%', 
           mb: 2 }}>
        <Toolbar
        
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            display: 'flex',
            justifyContent: 'space-between',
         
          }}
          style={{marginBottom: '-3.5%', height: '4%'}}
        >
          {/* <Typography variant="h6">Ticket Categories</Typography> */}
          <div></div>
          <Button  style ={{ fontSize: '8px', margin: '1px',marginBottom: '2.5%',
   
   textTransform: 'none',
    backgroundColor: 'orange',
    padding: '2px 11px',
    borderRadius: '50px',
    border: 'none',
    cursor: 'pointer',
    color: 'black',
    fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
   
    fontWeight: 'bold'}} onClick={handleColumnMenuOpen}> Settings</Button>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            {Object.values(headCells).map((cell) => (
              <MenuItem key={cell.id} onClick={() => handleColumnToggle(cell.id)}>
                <Checkbox checked={visibleColumns.includes(cell.id)} />
                {cell.label}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>

        <TableContainer style={{ marginTop: '-2%'}}>
          <Table size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              visibleColumns={visibleColumns}
             
            />
            <TableBody>
              {paginatedRows.map((row, index) => (
                <TableRow style={{fontSize: 'x-small'}} key={index} hover  >
                  {visibleColumns.map((col) => {
                    let displayValue: string | number = '';
                    switch (col) {
                      case 'Country':
                        displayValue = row.Country;
                        break;
                      case 'Category':
                        displayValue = row.Category;
                        break;
                      case 'CategoryValue':
                        displayValue = row.CategoryValue;
                        break;
                      case 'Export':
                        displayValue = row.Export;
                        break;
                      case 'Import':
                        displayValue = row.Import;
                        break;
                      case 'color':
                        displayValue = row.color;
                        break;
                      default:
                        displayValue = '';
                    }
                    return (
                      <TableCell
                        key={col}
                        align={typeof displayValue === 'number' ? 'right' : 'left'}
                        onClick={() => col === 'Country' && handleDialogOpen(row)}
                        sx={{ cursor: col === 'Country' ? 'pointer' : 'default' }}
                        style={{margin: '5px', fontSize: 'xx-small'}}
                      >
                        {displayValue}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <FormControlLabel
          control={<Switch checked={dense}  />}
          label="Dense padding"
          style={{display: 'none'}}
        />
      </Paper>

      <Dialog
        open={Boolean(dialogData)} onClose={handleDialogClose} 
        PaperProps={{
    sx: {
      width: '800px',        // custom width
      height: '600px',       // optional custom height
      maxWidth: 'none',      // override default maxWidth
    }
  }}>
        <DialogTitle>{dialogData?.Country} </DialogTitle>
         <IconButton
          aria-label="close"
          onClick={handleDialogClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Box display={'flex'}>
          <Typography style={{width: '100px', fontSize: '10px', padding: '5px'}}>Import: </Typography>
         
          <TextField
          id="outlined-multiline-flexible"
          label=""
          multiline
          maxRows={1}
          value={dialogData?.Import}
           sx={compactTextFieldSx}
        />
        </Box>
        <Box display={'flex'}>
          <Typography style={{width: '100px', fontSize: '10px', padding: '5px'}}>Export : </Typography>
         
          <TextField
          id="outlined-multiline-flexible"
          label=""
          multiline
          maxRows={1}
          value={dialogData?.Export}
           sx={compactTextFieldSx}
        />
        </Box>
        {/* <Box display={'flex'}>
          <Typography style={{width: '100px', fontSize: '10px', padding: '5px'}}>Category Value: </Typography>
         
          <TextField
          id="outlined-multiline-flexible"
          label=""
          multiline
          maxRows={1}
          value={dialogData?.Category}
          sx={compactTextFieldSx}
        />
        </Box> */}
        <Box display={'flex'}>
          <Typography style={{width: '100px', fontSize: '10px', padding: '5px'}}>Category Value : </Typography>
         
          <TextField
          id="outlined-multiline-flexible"
          label=""
          multiline
          maxRows={1}
          value={dialogData?.CategoryValue}
           sx={compactTextFieldSx}
        />
         </Box>
        <Box display= {'flex'}>
         <Typography style={{width: '100px', fontSize: '10px', padding: '5px'}}>Category Type : </Typography>
      <Select
  value={dialogData?.Category== category? dialogData?.Category : category}
  onChange={(e) => setCategory(e.target.value)}
  size="small"
  sx={{
    width: '115px',
    fontSize: '0.75rem',
    height: 32,
    '& .MuiSelect-select': {
      padding: '4px 8px',
      fontSize: '0.75rem',
    },
  }}
>
  <MenuItem value="create user" sx={{ fontSize: '0.75rem' }}>create user</MenuItem>
  <MenuItem value="remove or inactive user" sx={{ fontSize: '0.75rem' }}>remove or inactive users</MenuItem>
  <MenuItem value="account issue" sx={{ fontSize: '0.75rem' }}>account issue</MenuItem>
</Select>

      </Box>
       
          <Button style ={{ fontSize: '8px', margin: '40px',marginBottom: '2.5%',
   
   textTransform: 'none',
    backgroundColor: 'orange',
    padding: '2px 11px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    color: 'black',
    fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
   
    fontWeight: 'bold'}} > save</Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

// type Order = 'asc'| 'desc';
// const compactTextFieldSx ={

// }

// interface FlattenedRow{
//   Country: string;
//   Category: string;
//   CategoryValue: number;
//   Export: number;
//   Import: number;
//   color: string;

// }

// interface HeadCell {
//   id: keyof FlattenedRow;
//   label: string;
//   numeric: boolean;
//   disablePadding: boolean
// }

// interface EnhancedTableProps{
//   order: Order;
//   orderBy: keyof FlattenedRow,
//   onRequestSort: (event: React.MouseEvent<unknown>, property: keyof FlattenedRow) => void;
//   visibleColumns: (keyof FlattenedRow)[];

// }

// const headCells: Record<keyof FlattenedRow, HeadCell> =
// {
//   Country:{ id: 'Country', label: 'Country', numeric: false, disablePadding: false  },
//   Category: {id: 'Category', label: 'Category', numeric: false, disablePadding: false},
//   CategoryValue: {id: 'CategoryValue', label: 'value', numeric: true, disablePadding: false},
//   Export: {id: 'Export', label: 'Export', numeric: true, disablePadding: false},
//   Import : {id: 'Import', label: 'Import', numeric: true, disablePadding: false},
//   color: { id: 'color', label: 'Color', numeric: false, disablePadding: false}
// }
// const flattenData = (): FlattenedRow[] =>{
//   //flatten the array with depth1
//   //if we use map it will add categories as subarray with 3 object
//   //with flatMap, it add individual obj directly to main array
//       return exportImportData.flatMap((item) =>
    
//       item.categories.map((cat) =>
//       ({
//         Country: item.Country,
//         Category: cat.category,
//         CategoryValue: cat.value,
//         Export: item.Export,
//         Import: item.Import,
//         color: item.color
//       }))
    
//     )
// }

//   function getComparator<Key extends keyof FlattenedRow>(order:Order, orderBy: Key): (a: FlattenedRow, b: FlattenedRow) => number
// {
//   return (a, b) =>
//   {
//     const aValue = a[orderBy];
//     const bValue = b[orderBy];

//     if (aValue == null) return 1;
//     if (bValue == null) return -1;

//     if (typeof aValue === 'number' && typeof bValue === 'number')
//     {
//       return order === 'desc' ? bValue - aValue : aValue - bValue   
//     }

//     return order === 'desc'? String(bValue).localeCompare(String(aValue)): String(aValue).localeCompare(String(bValue))

//   }

// }
// function EnhancedTableHead(props: EnhancedTableProps){
//   const { order, orderBy, onRequestSort, visibleColumns} = props;

//   const createSortHandler = (property: keyof FlattenedRow) => (event: React.MouseEvent<unknown>) =>{
//     onRequestSort(event, property)
//   }

//   return(<TableHead>
//     <TableRow>
//       {visibleColumns.map((colKey: keyof FlattenedRow) => {
//         const headCell = headCells[colKey];
//         return (
//         <TableCell key={headCell.id} 
//         align={headCell.numeric? 'right': 'left'}
//         padding={headCell.disablePadding? 'none': 'normal'}
//         sortDirection={orderBy === headCell.id? order: false}>
//         <TableSortLabel style={{ fontSize: 'x-small', fontWeight: 'bold' }}
//         active={orderBy === headCell.id}
//         direction={orderBy === headCell.id? order: 'asc'}
//         onClick={createSortHandler(headCell.id)}> 
//         {headCell.label}
//         {orderBy === headCell.id? (
//           <Box component="span" sx={visuallyHidden}>
//             {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
//           </Box>        
//         ): null}</TableSortLabel>
//          </TableCell>
      
//       )
//       })}
//     </TableRow>

//   </TableHead>)
// }


// export default function TicketView()
// {
//   const [order, setOrder] = useState<Order>('asc');
//   const [orderBy, setOrderBy] = useState<keyof FlattenedRow>('Country');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [dense, setDense] = useState(true)
//   const [visibleColumns, setVisibleColumns] = useState<(keyof FlattenedRow)[]>(['Country', 'Category', 'CategoryValue','Export','Import'])
//   const [anchorEl, setAnchorEl] =useState<null | HTMLElement>(null)
//   const [dialogData, setDialogData] = useState<FlattenedRow | null>(null)
//   const [category, setCategory] = useState<string>("create user");

//   const rows = useMemo(()=>{
//     flattenData()

//   },[])

//   //Sorting logic
//   const sortedRows = useMemo(()=>
//   {
//     //as const
// //Tells TypeScript to treat the tuple as a fixed, read-only pair (a tuple of exact types, e.g., [RowType, number]), not as a general array.
// //Without as const, TypeScript would infer the type as (RowType | number)[], which is less precise.
//     const stabilized = rows.map((el: any, index: any) => [el, index]  as const)
//     stabilized.sort((a: any,b: any) =>
//     {
//       const comp = getComparator(order, orderBy)(a[0],b[0])
//       return comp !==0 ? comp: a[1]-b[1]
//     })
    
//   },[rows, order, orderBy])

//   const paginatedRows = useMemo(()=>
//   {
//     const start = page* rowsPerPage;
//     return sortedRows.slice(start, start+ rowsPerPage);
        
//   },[sortedRows, page, rowsPerPage])

//   //handlers
//   const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof FlattenedRow) =>
//   {
//     const isAsc = orderBy === property && order==='asc';
//     setOrder(isAsc? 'desc': 'asc')
//     setOrderBy(property)
//   }

//   const handlePageChange = (_: unknown, newPage: number) => setPage(newPage)
  
//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) =>
//   {
//     setRowsPerPage(parseInt(event.target.value,10))
//     setPage(0)
//   }

//   const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) =>
//   {
//     setDense(event.target.checked)
//   }

//   const handleColumnMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
//   {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleColumnToggle = (column: keyof FlattenedRow) =>
//   {
//     setVisibleColumns((prev) => prev.includes(column) ? prev.filter(c => c != column): [...prev, column])
//   }

//   const handleDialogOpen = (row: FlattenedRow) => setDialogData(row);
//   const handleDialogClose = () => setDialogData(null)

//   return(<Box sx={{width: '100%', marginTop: '2%', }}>
//     <Paper sx={{width: '100%', mb:2}}>
//       <Toolbar
//       sx={{
//         pl: {sm: 2},
//         pr: {xs: 1, sm: 1},
//         display: 'flex',
//         justifyContent: 'space-between',
//       }}

//       style={{marginBottom: '-3.5%', height: '4%'}}
//        >
//         <div></div>
//         <Button style={{fontSize: '8px', margin: '1px', marginBottom: '2.5%', 
//           textTransform: 'none',
//           backgroundColor: 'organge',
//           padding: '2px 11px',
//           borderRadius: '50px',
//           border: 'none',
//           cursor: 'pointer',
//           color: 'black',
//           fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
//           fontWeight: 'bold'
//         }} onClick={handleColumnMenuOpen} > Settings</Button>

//         <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={()=> setAnchorEl(null)}>
//           {Object.values(headCells).map((cell) =>(
//             <MenuItem key={cell.id} onClick={() => handleColumnToggle(cell.id)}>
//               <Checkbox checked={visibleColumns.includes(cell.id)}/>
//               {cell.label}
//             </MenuItem>
//           ))}
//         </Menu>
//        </Toolbar>

//        <TableContainer style={{marginTop: '-2%'}}>
//         <Table size={dense? 'small' : 'medium'}>
//           <EnhancedTableHead
//             order={order}
//             orderBy={orderBy}
//             onRequestSort={handleRequestSort}
//             visibleColumns={visibleColumns}
//           />
//           <TableBody>
//             {paginatedRows.map((row, index) =>
//             (
//               <TableRow style={{fontSize: 'x-small'}} key={index} hover>
//                 {visibleColumns.map((col) => {
//                   let displayValue : string | number ='';
//                   switch (col)
//                   {
//                     case 'Country':
//                       displayValue = row.Country;
//                       break;
//                     case 'Category': 
//                     displayValue = row.Category;
//                     break;

//                     case 'CategoryValue':
//                       displayValue= row.CategoryValue;
//                       break;
                    
//                     case 'Export':
//                       displayValue = row.Export;
//                     break;

//                     case 'Import':
//                       displayValue = row.Import;
//                       break;

//                     case 'color':
//                       displayValue = row.color;
//                       break;

//                     default :
//                     displayValue='';
//                   }
//                   return(<TableCell
//                     key={col}
//                     align={typeof displayValue=== 'number' ? 'right': 'left'}
//                     onClick={()=> col === 'Country' && handleDialogOpen(row)}
//                     sx={{ cursor: col === 'Country' ? 'pointer' : 'default'}}
//                     style={{margin: '5px', fontSize: 'xx-small'}}
//                     >
//                       {displayValue}
//                   </TableCell>)
//                 })}
//               </TableRow>
//             ))}
//           </TableBody>
          

//         </Table>

//        </TableContainer>
//        <TablePagination rowsPerPageOptions={[5,10,25]}
//        component="div"
//        count={sortedRows.length}
//        rowsPerPage={rowsPerPage}
//        page={page}
//        onPageChange={handleChangePage}
//        onRowsPerPageChange={handleChangeRowsPerPage}>
//        </TablePagination>

//        <FormControl control={<Switch checked={dense}/>}
//        label="Dense padding"
//        style={{display: 'none'}} />

//     </Paper>

//     <Dialog open={Boolean(dialogData)} onClose={handleDialogClose}
//     PaperProps={{sx:{
//       width: '800px',
//       height: '600px',
//       maxWidth: 'none'
//     }}}>
//       <DialogTitle>{dialogData?.Country}</DialogTitle>
//       <IconButton aria-label='close'
//       onClick={handleDialogClose}
//       sx={(theme) =>({
//         position: 'absolute',
//         right:8,
//         top: 8,
//         color: theme.palette.grey[500]
//       })}><CloseIcon />
//       <DialogContent>
//         <Box display={'flex'}>
//           <Typography>Import </Typography>
//           <TextField id="outlined-multiline-flexible"
//           label=""
//           multiline
//           maxRows={1}
//           value={dialogData?.Import}
//           sx={compactTextFieldSx}></TextField>
//         </Box>
//       </DialogContent>
//       </IconButton>
//     </Dialog>
//   </Box>)





// }




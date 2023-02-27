import { Box } from '@mui/material';

import './App.css';

import Kanban from './conponents/Kanban';

function App() {

  return (
    <>
      <Box sx={{ padding: '45px' }}>
        {/* Kanban board */}
        <Kanban />
      </Box>
    </>
  );
}

export default App;

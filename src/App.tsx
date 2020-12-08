import React from 'react';
import { Grid } from '@material-ui/core';
import './App.css';
import Form from './Components/Form/Form';

function App() {
  return (
    <Grid className='app' container direction='column' justify='center' alignItems='center'>
      <Form />
    </Grid>
  );
}
export default App;

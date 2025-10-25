import React, { useRef } from 'react';
import { Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  name: string;
  label: string;
  filename?: string;
}

const FileInput: React.FC<Props> = ({ onChange, name, onClear, label, filename }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const activateInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <>
      <input
        style={{ display: 'none' }}
        type="file"
        name={name}
        onChange={onChange}
        ref={inputRef}
        accept="image/jpeg,image/png, image/jpg"
      />
      <Grid container direction="row" spacing={2} alignItems="center">
        <Grid size={6}>
          <TextField disabled label={label} value={filename || ''} onClick={activateInput} />
        </Grid>
        <Grid size={3}>
          <Button variant="contained" onClick={activateInput}>
            Browse
          </Button>
        </Grid>
        {onClear && (
          <Grid size={3}>
            <Button variant="contained" onClick={onClear}>
              Clear
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default FileInput;

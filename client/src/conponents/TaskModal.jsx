import { Backdrop, Fade, IconButton, Modal, Box, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Moment from 'moment';
import { taskApi } from '../api';

const modalStyle = {
  outline: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 1,
  height: '30%'
};

let timer;
const timeout = 500;
let isModalClosed = false;

const TaskModal = props => {
  const [task, setTask] = useState(props.task);
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTask(props.task);
    setTitle(props.task !== undefined ? props.task.title : '');
    if (props.task !== undefined) {
      isModalClosed = false;
    }
  }, [props.task]);


  const onClose = () => {
    isModalClosed = true;
    props.onUpdate(task);
    props.onClose();
  };

  const deleteTask = async () => {
    try {
      props.onDelete(task);
      setTask(undefined);
      await taskApi.delete(task._id);
    } catch (err) {
      alert(err);
    }
  };

  const updateTitle = async (e) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    timer = setTimeout(async () => {
      try {
        await taskApi.update(task._id, { title: newTitle });
      } catch (err) {
        alert(err);
      }
    }, timeout);

    task.title = newTitle;
    setTitle(newTitle);
    props.onUpdate(task);
  };


  return (
    <Modal
      open={task !== undefined}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={task !== undefined}>
        <Box sx={modalStyle}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%'
          }}>
            <IconButton variant='outlined' color='error' onClick={deleteTask}>
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>
          <Box sx={{
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            padding: '2rem 5rem 5rem'
          }}>
            <TextField
              value={title}
              onChange={updateTitle}
              placeholder='Untitled'
              variant='outlined'
              fullWidth
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-input': { padding: 0 },
                '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                '& .MuiOutlinedInput-root': { fontSize: '2.5rem', fontWeight: '700' },
                marginBottom: '10px'
              }}
            />
            <Typography variant='body2' fontWeight='700'>
              {task !== undefined ? Moment(task.createdAt).format('YYYY-MM-DD') : ''}
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TaskModal;
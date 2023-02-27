import { Box, Button, Typography, Divider, TextField, IconButton, Card } from '@mui/material';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseLine from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';



import { sectionApi, taskApi } from '../api';
import TaskModal from './TaskModal';
import { getSections } from '../actions/sectionAction';



function Kanban() {
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo('en-US');

    const dispatch = useDispatch();
    useSelector((state) => state.sectionReducer.sections);

    const [data, setData] = useState([]);
    const [selectedTask, setSelectedTask] = useState(undefined);
    const [asc, setAsc] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            dispatch(getSections());
            const sections = await sectionApi.getAll();
            setData(sections.data);
        };
        fetchData();
    }, []);


    const theme = createTheme({
        palette: { mode: 'dark' }
    });
    const onDragEnd = async ({ source, destination }) => {
        if (!destination) return;
        const sourceColIndex = data.findIndex(e => e._id === source.droppableId);
        const destinationColIndex = data.findIndex(e => e._id === destination.droppableId);
        const sourceCol = data[sourceColIndex];
        const destinationCol = data[destinationColIndex];

        const sourceSectionId = sourceCol._id;
        const destinationSectionId = destinationCol._id;

        const sourceTasks = [...sourceCol.tasks];
        const destinationTasks = [...destinationCol.tasks];

        if (source.droppableId !== destination.droppableId) {
            const [removed] = sourceTasks.splice(source.index, 1);
            destinationTasks.splice(destination.index, 0, removed);
            data[sourceColIndex].tasks = sourceTasks;
            data[destinationColIndex].tasks = destinationTasks;
        } else {
            const [removed] = destinationTasks.splice(source.index, 1);
            destinationTasks.splice(destination.index, 0, removed);
            data[destinationColIndex].tasks = destinationTasks;
        }

        try {
            await taskApi.updatePosition({
                resourceList: sourceTasks,
                destinationList: destinationTasks,
                resourceSectionId: sourceSectionId,
                destinationSectionId: destinationSectionId
            });
            // await taskApi.updatePosition({hello:"hello"});
            setData(data);
        } catch (err) {
            alert(err);
        }
    };
    const createSection = async () => {
        try {
            const section = await sectionApi.create();
            setData([...data, section.data]);
            // dispatch(createSectionAction());
            // setData(state);
        } catch (err) {
            alert(err);
        }
    };
    const deleteSection = async (sectionId) => {
        try {
            const newData = data.filter(e => e._id !== sectionId);
            setData(newData);
            await sectionApi.deleteOne(sectionId);
        } catch (err) {
            alert(err);
        }
    };
    const sortSection = (sectionId) => {
        const newData = [...data];
        const index = newData.findIndex(e => e._id === sectionId);
        if (asc) newData[index].tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        if (!asc) newData[index].tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setData(newData);
    };
    const updateSectionTitle = async (e, sectionId) => {
        const newTitle = e.target.value;
        const newData = [...data];
        const index = newData.findIndex(e => e._id === sectionId);
        newData[index].title = newTitle;
        setData(newData);
        setTimeout(async () => {
            try {
                await sectionApi.update(sectionId, { title: newTitle });
            } catch (err) {
                alert(err);
            }
        }, 500);
    };
    const createTask = async (sectionId) => {
        try {
            const task = await taskApi.create({ sectionId });
            const newData = [...data];
            const index = newData.findIndex(e => e._id === sectionId);
            newData[index].tasks.unshift(task.data);
            setData(newData);
        } catch (err) {
            alert(err);
        }
    };
    const onUpdateTask = (task) => {
        const newData = [...data];
        const sectionIndex = newData.findIndex(e => e._id === task.section._id);
        const taskIndex = newData[sectionIndex].tasks.findIndex(e => e._id === task._id);
        newData[sectionIndex].tasks[taskIndex] = task;
        setData(newData);
    };

    const onDeleteTask = (task) => {
        const newData = [...data];
        const sectionIndex = newData.findIndex(e => e._id === task.section._id);
        const taskIndex = newData[sectionIndex].tasks.findIndex(e => e._id === task._id);
        newData[sectionIndex].tasks.splice(taskIndex, 1);
        setData(newData);
    };


    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseLine />
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Button onClick={createSection}>
                        Add section
                    </Button>
                    <Typography variant='body2' fontWeight='700'>
                        {data.length} Sections
                    </Typography>
                </Box>
                <Divider sx={{ margin: '10px 0' }} />
                <DragDropContext onDragEnd={onDragEnd}>
                    <Box sx={{
                        height: '85hv',
                        display: 'flex',
                        alignItems: 'flex-start',
                        width: '100%',
                        overflowX: 'auto',
                        overflowY: 'auto'
                    }}>
                        {
                            data.map(section => (
                                <div key={section._id} style={{ width: '300px' }}>
                                    <Droppable key={section._id} droppableId={section._id}>
                                        {(provided) => (
                                            <Box
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                sx={{ width: '300px', padding: '10px', marginRight: '10px' }}
                                            >
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    marginBottom: '10px'
                                                }}>
                                                    <TextField
                                                        value={section.title}
                                                        onChange={(e) => updateSectionTitle(e, section._id)}
                                                        placeholder='Untitled'
                                                        variant='outlined'
                                                        sx={{
                                                            flexGrow: 1,
                                                            '& .MuiOutlinedInput-input': { padding: 0 },
                                                            '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                                                            '& .MuiOutlinedInput-root': { fontSize: '1rem', fontWeight: '700' }
                                                        }}
                                                    />
                                                    <IconButton
                                                        variant='outlined'
                                                        size='small'
                                                        sx={{
                                                            color: 'gray',
                                                            '&:hover': { color: 'yellow' }
                                                        }}
                                                        onClick={() => { sortSection(section._id); setAsc(!asc); }}

                                                    >
                                                        <ArrowDropDownIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        variant='outlined'
                                                        size='small'
                                                        sx={{
                                                            color: 'gray',
                                                            '&:hover': { color: 'green' }
                                                        }}
                                                        onClick={() => createTask(section._id)}

                                                    >
                                                        <AddOutlinedIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        variant='outlined'
                                                        size='small'
                                                        sx={{
                                                            color: 'gray',
                                                            '&:hover': { color: 'red' }
                                                        }}
                                                        onClick={() => deleteSection(section._id)}
                                                    >
                                                        <DeleteOutlinedIcon />
                                                    </IconButton>
                                                </Box>
                                                {/* tasks */}
                                                {
                                                    section.tasks.map((task, index) => (
                                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <Card
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    sx={{
                                                                        padding: '10px',
                                                                        marginBottom: '10px',
                                                                        cursor: snapshot.isDragging ? 'grab' : 'pointer!important'
                                                                    }}
                                                                    onClick={() => { setSelectedTask(task); }}
                                                                >
                                                                    <Typography>
                                                                        {task.title === '' ? 'Untitled' : task.title}
                                                                    </Typography>
                                                                    <Typography fontSize={"12px"}>
                                                                        {timeAgo.format(Date.parse(task.createdAt))}
                                                                    </Typography>
                                                                </Card>
                                                            )}
                                                        </Draggable>
                                                    ))
                                                }
                                                {provided.placeholder}
                                            </Box>
                                        )}
                                    </Droppable>
                                </div>
                            ))
                        }
                    </Box>
                </DragDropContext>
                <TaskModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(undefined)}
                    onUpdate={onUpdateTask}
                    onDelete={onDeleteTask}
                />
            </ThemeProvider>
        </>
    );
}

export default Kanban;

import {
  createSlice,
  createSelector,
  createAsyncThunk
} from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

const mongodbUrl = 'mongodb://127.0.0.1:27017/';

const initialState = {
  taskArray: [],
  status: null,
  error: null
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await axios.get(mongodbUrl + 'tasks');
  return response.data;
});

export const addTaskAsync = createAsyncThunk('tasks/addTask', async (task) => {
  const response = await axios.post(mongodbUrl + 'tasks', task);
  return response.data;
});

export const removeTaskAsync = createAsyncThunk(
  'tasks/removeTask',
  async (id) => {
    const response = await axios.delete(mongodbUrl + 'tasks/' + id);
    return response.data;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.taskArray.push({
        id: uuid(),
        ...action.payload
      });
    },
    removeTask: (state, action) => {
      state.taskArray = state.taskArray.filter(
        (task) => task.id !== action.payload.id
      );
    },
    setTasks: (state, action) => {
      state = action.payload;
    },
    reset: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.taskArray = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTaskAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.taskArray.push(action.payload);
      })
      .addCase(addTaskAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(removeTaskAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeTaskAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.taskArray = state.taskArray.filter(
          (task) => task.id !== action.payload.id
        );
      })
      .addCase(removeTaskAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const taskReducer = taskSlice.reducer;
export const { addTask, removeTask, setTasks, reset } = taskSlice.actions;

export const selectAllTasks = (state) => state.tasks;

export const selectTasksByDate = createSelector(
  [(state) => state.tasks, (state, date) => date],
  (tasks, date) => {
    console.log('Select by Date selector running...');
    return tasks.taskArray.filter((item) => {
      const taskDate = new Date(item.startTime);
      return (
        taskDate instanceof Date &&
        !isNaN(taskDate) &&
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });
  }
);

// import axios from 'axios';
// import { MongoClient } from 'mongodb';

// const url = 'mongodb+srv://username:password@cluster-name-shard-00-00-example.com:27017/';
// const client = new MongoClient(url);
// const db = client.db('mydatabase');
// const tasksCollection = db.collection('tasks');

// // Create an async thunk to fetch tasks from the database
// export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
//   const response = await tasksCollection.find().toArray();
//   return response;
// });

// // Create an async thunk to add a task to the database
// export const addTaskAsync = createAsyncThunk('tasks/addTask', async (task) => {
//   const response = await tasksCollection.insertOne(task);
//   return response;
// });

// // Create an async thunk to remove a task from the database
// export const removeTaskAsync = createAsyncThunk('tasks/removeTask', async (id) => {
//   const response = await tasksCollection.deleteOne({ _id: new ObjectId(id) });
//   return response;
// });

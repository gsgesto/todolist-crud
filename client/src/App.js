import React, { useEffect, useState } from "react";
import Axios from "axios";
import { makeStyles } from "@mui/styles";
import {
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
} from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";
import DeleteIcon from "@mui/icons-material/Delete";

const useStyles = makeStyles({
  container: {
    marginTop: "2rem",
    display: "grid",
    justifyContent: "space-between",
  },
  heading: {
    marginBottom: "1rem",
    textAlign: "center",
    fontWeight: "bold",
  },
  headingUndone: {
    marginBottom: "1rem",
  },
  headingDone: {
    paddingTop: "1rem",
  },
  form: {
    display: "grid",
    alignItems: "center",
    gap: "1rem",
    margin: "2rem",
  },
  buttonContainer: {
    display: "grid",
    justifyContent: "center",
  },
  taskList: {
    marginTop: "2rem",
    width: "100%",
  },
  taskCardDone: {
    marginBottom: "0.5rem",
    padding: "1rem",
    borderRadius: "0.5rem",
    backgroundColor: "#CCCCCC",
    border: "3px solid #000",
    display: "flex",
    justifyContent: "space-between",
  },
  taskCard: {
    marginBottom: "0.5rem",
    padding: "1rem",
    borderRadius: "0.5rem",
    backgroundColor: "#fff",
    border: "3px solid #000",
    display: "flex",
    justifyContent: "space-between",
  },
  checkbox: {
    color: "#000000 !important",
  },
  empty: {
    textAlign: "center",
    margin: "1rem",
  },
  magic: {
    textAlign: "center",
  },
});

function App() {
  const [form, setForm] = useState("");
  const [checkedState, setCheckedState] = useState({});
  const classes = useStyles();
  const [tasks, setTasks] = useState([]);
  const [background, setBackground] = useState("#FFF");

  const addTask = () => {
    Axios.post("http://localhost:3001/create", {
      task: form,
      done: false,
    }).then(() => {
      console.log("Tarea creada");
      setForm("");
      getTasks();
    });
  };

  const getTasks = () => {
    Axios.get("http://localhost:3001/tasks").then((response) => {
      setTasks(response.data);
      const checkedState = {};
      response.data.forEach(({ id, done }) => {
        checkedState[id] = done;
      });
      setCheckedState(checkedState);
    });
  };

  const updateTask = (id, checked) => {
    console.log("id:", { id }, "done:", checked);
    Axios.put("http://localhost:3001/update", { done: checked, id: id }).then(
      () => {
        console.log("id:", { id }, "done:", checked);
      }
    );
  };

  const deleteTask = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`).then(() => {
      console.log("Tarea eliminada");
      const filteredTasks = tasks.filter((item) => item.id !== id);
      setTasks(filteredTasks);
    });
  };

  const doneTasks = tasks.filter(({ id }) => checkedState[id]);
  const undoneTasks = tasks.filter(({ id }) => !checkedState[id]);
  const handleCheckboxChange = (taskId, checked) => {
    setCheckedState((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
    updateTask(taskId, checked);
  };

  const handleKeypress = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      addTask();
    }
  };

  const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256
  )}, ${Math.floor(Math.random() * 256)}, 0.2)`;

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    if (form.trim() === "") {
      setForm("");
    }
  }, [form]);

  return (
    <Container className={classes.container}>
      <GlobalStyles
        styles={{
          body: { backgroundColor: background },
        }}
      />
      <Typography variant="h4" component="h1" className={classes.heading}>
        Mi lista de tareas
      </Typography>
      <div className={classes.magic}>
        <Button onClick={() => setBackground(randomColor)}>🌈✨</Button>
      </div>
      <form className={classes.form}>
        <TextField
          label={"Nueva tarea"}
          variant="outlined"
          value={form}
          onChange={(e) => setForm(e.target.value)}
          onKeyDown={handleKeypress}
          sx={{
            "& .MuiOutlinedInput-root.Mui-focused": {
              "& > fieldset": {
                borderColor: "black",
              },
            },
          }}
          InputLabelProps={{
            style: { color: "#000" },
          }}
        />
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#000" }}
            onClick={addTask}
            disabled={!form}
          >
            Agregar tarea
          </Button>
        </div>
      </form>
      <Typography variant="h5" component="h1" className={classes.headingUndone}>
        Tareas pendientes
      </Typography>
      <div className={classes.taskList}>
        <FormGroup>
          {undoneTasks.map(({ task, id }) => (
            <div
              key={id}
              className={
                checkedState[id] ? classes.taskCardDone : classes.taskCard
              }
            >
              <FormControlLabel
                control={
                  <Checkbox
                    className={classes.checkbox}
                    checked={checkedState[id]}
                    onChange={(e) => handleCheckboxChange(id, e.target.checked)}
                  />
                }
                label={task}
              />
              <IconButton onClick={() => deleteTask(id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </FormGroup>
      </div>
      {!undoneTasks.length && (
        <div className={classes.empty}>
          <Typography variant="button">
            Aún no tienes tareas pendientes. 😄
          </Typography>
        </div>
      )}
      <Typography variant="h5" component="h1" className={classes.headingDone}>
        Tareas terminadas
      </Typography>
      <div className={classes.taskList}>
        <FormGroup>
          {doneTasks.map(({ task, id }) => (
            <div
              key={id}
              className={
                checkedState[id] ? classes.taskCardDone : classes.taskCard
              }
            >
              <FormControlLabel
                control={
                  <Checkbox
                    className={classes.checkbox}
                    checked={checkedState[id]}
                    onChange={(e) => handleCheckboxChange(id, e.target.checked)}
                  />
                }
                label={task}
              />
              <IconButton onClick={() => deleteTask(id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </FormGroup>
        {!doneTasks.length && (
          <div className={classes.empty}>
            <Typography variant="button">
              Aún no tienes tareas completadas.
            </Typography>
          </div>
        )}
      </div>
    </Container>
  );
}

export default App;

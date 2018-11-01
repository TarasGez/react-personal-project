// Core
import React, { Component } from 'react';

// Components
import Spinner from 'components/Spinner';
import Task from 'components/Task';
import Checkbox from '../../theme/assets/Checkbox';

// Instruments
import Styles from './styles.m.css';
//import { getDisplayName, sortTasksByDate } from '../../instruments/helpers';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

export default class Scheduler extends Component {
    state = {
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
        tasks:           [],
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state,
        });
    };

    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);

        const tasks = await api.fetchTasks();

        this.setState({
            tasks,
        });

        this._setTasksFetchingState(false);
    };

    _createTaskAsync = async (event) => {
        const { newTaskMessage } = this.state;

        if (!newTaskMessage.length) {
            return null;
        }

        event.preventDefault();

        this._setTasksFetchingState(true);

        const task = await api.createTask(newTaskMessage);

        this.setState(({ tasks }) => ({
            tasks:          [task, ...tasks],
            newTaskMessage: '',
        }));

        this._setTasksFetchingState(false);
    };

    _updateTaskAsync = async (params) => {
        this._setTasksFetchingState(true);

        const updatedTask = await api.updateTask(params);

        console.log("updatedTask from She:", updatedTask);

        this.setState(({ tasks }) => ({
            tasks: tasks.map(
                (task) => task.id === updatedTask.id ? updatedTask : task,
            ),
        }));

        this.forceUpdate();

        this._setTasksFetchingState(false);

    };

    _removeTaskAsync = async (id) => {
        this._setTasksFetchingState(true);

        await api.removeTask(id);

        this.setState(({ tasks }) => ({
            tasks: tasks.filter((task) => task.id !== id),
        }));

        this._setTasksFetchingState(false);
    };

    _updateTasksFilter = (event) => {
        this.setState({
            tasksFilter: event.target.value,
        });
    }

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    };

    _completeAllTasksAsync = async () => {

        // var nameLengths = names.map(function(name) {
        //     return name.length;
        //   });

        // const newTasks = this.state.task.map((task) {
        //     if (task.completed) {
        //         console.log("All tasks completed!");

        //         return null;
        //     } else {

        //     }

        // });

        this._setTasksFetchingState(true);

        await api.removeTask(1);

    };

    _toggleTaskFavoriteState = (id) => {
        this._setTasksFetchingState(true);

        const newTasks = this.state.task.map((task) => {
            if (task.id === id) {
                task.favorite = !task.favorite;
                console.log("favorite: ", task.favorite);
            }

            return task;
        });

        this.setState({
            tasks:           newTasks,
            isTasksFetching: false,
        });
    };

    //////////////////
    _getAllCompleted = () => {
        const completedTasksArray = this.state.task.map((task) => {
            if (!task.completed) {
                return false;
            }

            return true;

        });

        this.setState({
            tasks: completedTasksArray,
        });
    };

    render () {
        const {
            newTaskMessage,
            tasksFilter,
            isTasksFetching,
            tasks,
        } = this.state;

        const modified = '';

        const tasksJSX = tasks.map((task) => {
            return (
                <Task
                    key = { task.id }
                    { ...task }
                    _removeTaskAsync = { this._removeTaskAsync }
                    _updateTaskAsync = { this._updateTaskAsync }
                    modified = { modified }
                />
            );
        });

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching } />
                <main>
                    <header>
                        <h1>
                            Планировщик задач
                        </h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { tasksFilter }
                            onChange = { this._updateTasksFilter }
                        />
                    </header>

                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                className = { Styles.createTask }
                                maxLength = { 50 }
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>
                                Добавить задачу
                            </button>
                        </form>

                        <div className = 'overlay'>
                            <ul>
                                {tasksJSX}
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { false }
                            color1 = '#363636'
                            color2 = '#fff'
                            hover = { false }
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}

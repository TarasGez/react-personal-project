// Core
import React, { Component } from 'react';
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
import FlipMove from 'react-flip-move';

// Components
import Spinner from 'components/Spinner';
import Task from 'components/Task';
import Checkbox from '../../theme/assets/Checkbox';

// Instruments
import Styles from './styles.m.css';
import { sortTasksByGroup } from '../../instruments/helpers';
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

        console.log("NEW TASK ++++++++++", task);

        this.setState(({ tasks }) => ({
            tasks:          [task, ...tasks],
            newTaskMessage: '',
        }));

        this._setTasksFetchingState(false);
    };

    _updateTaskAsync = async (params) => {
        this._setTasksFetchingState(true);

        console.log("PARAMS Sheduler:", params);

        console.log("PARAMS.ID Sheduler:", params.id);

        const updatedTasks = await api.updateTask(params);

        console.log("updatedTask IN Sheduler:", updatedTasks);

        console.log("TASKS MAP >>>>>>>>>> :", this.state.tasks.map((task) => task));

        console.log("updatedTasks MAP >>>>>>>>>> :", updatedTasks.map((upTask) => upTask));

        console.log("updatedTasks.id        >>>>>>>>>> :", updatedTasks[0].id);

        console.log("!!!!!!!!!!!!!!!!>>>>>>>>>> :", this.state.tasks.map(
            (task) => updatedTasks.map(
                (upTask) => task.id === String(upTask.id) ? upTask[0] : task,
            )
        ));

        this.setState(({ tasks }) => ({
            tasks: tasks.map(
                (task) => task.id === updatedTasks[0].id ? updatedTasks[0] : task,
            ),
        }));

        console.log("this.state.tasks from Sheduler2:", this.state.tasks);

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
            tasksFilter: event.target.value.toLowerCase(),
        });
    }

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    };

    _completeAllTasksAsync = async () => {

        const isAllTasksCompleted = this.state.tasks.every((task) => task.completed);

        if (isAllTasksCompleted) {

            return null;
        }

        this._setTasksFetchingState(true);

        const notCompletedTasks = this.state.tasks.filter((task) => !task.completed);

        await api.completeAllTasks(notCompletedTasks);

        this.setState(({ tasks }) => ({
            tasks: tasks.map(
                (task) => {
                    return {
                        ...task,
                        completed: true,
                    };
                }),
        }));

        this._setTasksFetchingState(false);
    };

    _getAllCompleted = () => {
        return this.state.tasks.every((task) => task.completed);
    };

    render () {
        const {
            newTaskMessage,
            tasksFilter,
            isTasksFetching,
            tasks,
        } = this.state;

        const modified = '';
        const getAllCompleted = this._getAllCompleted();

        const tasksJSX = sortTasksByGroup(tasks).filter(
            (task) => task.message.toLowerCase().includes(tasksFilter)
        ).map((task) => {
            return (
                // <CSSTransition
                //     appear
                //     classNames = { {
                //         appear:       Styles.taskAppear,
                //         appearActive: Styles.taskAppearActive,
                //         enter:        Styles.taskInStart,
                //         enterActive:  Styles.taskInEnd,
                //         exit:         Styles.postOutStart,
                //         exitActive:   Styles.postOutEnd,
                //     } }
                //     key = { task.id }
                //     timeout = { {
                //         enter: 400,
                //         exit:  400,
                //     } }>

                <Task
                    { ...task }
                    _removeTaskAsync = { this._removeTaskAsync }
                    _updateTaskAsync = { this._updateTaskAsync }
                    key = { task.id }
                    modified = { modified }
                />
                // </CSSTransition>
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

                        <ul>
                            {/* <TransitionGroup> */}
                            <FlipMove>
                                {tasksJSX}
                            </FlipMove>
                            {/* </TransitionGroup> */}
                        </ul>

                    </section>
                    <footer>
                        <Checkbox
                            checked = { getAllCompleted }
                            color1 = '#363636'
                            color2 = '#fff'
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

// Core
import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

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
            tasks: sortTasksByGroup(
                tasks.filter((task) => task.message.includes(
                    this.state.tasksFilter)
                )),
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

        const newTask = await api.createTask(newTaskMessage);

        this.setState(({ tasks }) => ({
            tasks: sortTasksByGroup(
                [newTask, ...tasks].filter((task) => task.message.includes(
                    this.state.tasksFilter)
                )),
            newTaskMessage: '',
        }));

        this._setTasksFetchingState(false);

        // this._fetchTasksAsync();
    };

    _updateTaskAsync = async (params) => {
        this._setTasksFetchingState(true);

        const updatedTask = await api.updateTask(params);

        // console.log("updatedTask from Sheduler:", updatedTask);

        this.setState(({ tasks }) => ({
            tasks: tasks.map(
                (task) => task.id === updatedTask.id ? updatedTask : task,
            ),
        }));

        this._setTasksFetchingState(false);

        this._fetchTasksAsync();
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
        if (!event.target.value) {
            this._fetchTasksAsync();
        }

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

        const isAllTasksCompleted = this.state.tasks.every((task) => task.completed);

        if (isAllTasksCompleted) {
            // console.log("All Tasks Completed:", isAllTasksCompleted);

            return null;
        }

        this._setTasksFetchingState(true);

        const notCompletedTasks = this.state.tasks.filter((task) => !task.completed);

        // console.log("Not Completed Tasks:", notCompletedTasks);

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

        // console.log("TASKS:", this.state.tasks);

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

        const tasksJSX = tasks.map((task) => {
            return (
                <CSSTransition
                    appear
                    classNames = { {
                        appear:       Styles.taskAppear,
                        appearActive: Styles.taskAppearActive,
                        enter:        Styles.taskInStart,
                        enterActive:  Styles.taskInEnd,
                        exit:         Styles.postOutStart,
                        exitActive:   Styles.postOutEnd,
                    } }
                    key = { task.id }
                    timeout = { {
                        enter: 400,
                        exit:  400,
                    } }>
                    <Task
                        { ...task }
                        _removeTaskAsync = { this._removeTaskAsync }
                        _updateTaskAsync = { this._updateTaskAsync }
                        modified = { modified }
                    />
                </CSSTransition>
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
                            value = { tasksFilter.toLowerCase() }
                            onChange = { this._updateTasksFilter }
                            onKeyDown = { this._fetchTasksAsync }
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

                        <div>
                            <ul>
                                <TransitionGroup>
                                    {tasksJSX}
                                </TransitionGroup>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { getAllCompleted }
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

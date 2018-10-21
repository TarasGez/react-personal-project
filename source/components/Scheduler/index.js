// Core
import React, { Component } from 'react';
import moment from 'moment';

// Components
import Spinner from 'components/Spinner';
import Task from 'components/Task';

// Instruments
import Styles from './styles.m.css';
//import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

export default class Scheduler extends Component {
    // constructor () {
    //     super();

    //     this._createTask = this._createTask.bind(this);
    //     this._setTasksFetchingState = this._setTasksFetchingState.bind(this);
    //     // this._removeTask = this._removeTask.bind(this);
    // }

    state = {
        tasks: [
            {
                id:        '123',
                message:   'Task 1',
                created:   1526825076849,
                favorite:  true,
                completed: false,
            },
            {
                id:        '456',
                message:   'Task 2',
                created:   1526825076849,
                favorite:  false,
                completed: false,
            },
            {
                id:        '789',
                message:   'Task 3',
                created:   1526825076849,
                favorite:  false,
                completed: false,
            }
        ],
        searchQuery:     '',
        message:         '',
        isTasksFetching: false,
    };

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state,
        });
    }

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
            isPostsFetching: false,
        });
    }

    _updateTask = () => {
        this._setTasksFetchingState(true);

        this.setState({
            isPostsFetching: false,
        });
    }

    _createTask = (message) => {
        this._setTasksFetchingState(true);

        const task = {
            id:        Math.random().toString(),
            created:   moment().utc().unix(),
            message,
            favorite:  false,
            completed: false,
        };

        this.setState(({ tasks }) => ({
            tasks:           [task, ...tasks],
            isTasksFetching: false,
        }));
    }

    _removeTask = (id) => {
        this._setTasksFetchingState(true);

        this.setState(({ tasks }) => ({
            tasks:          tasks.filter((task) => task.id !== id),
            isTaskFetching: false,
        }));
    }

    _updateSearch = (event) => {
        this.setState({
            searchQuery: event.target.value,
        });
    }

    _updateTaskMessage = (event) => {
        this.setState({
            message: event.target.value,
        });
    }

    _handleFormSubmit = (event) => {
        event.preventDefault();
        this._submitTask();
    }

    _submitTask = () => {
        const { message } = this.state;

        if (!message) {
            return null;
        }

        this._createTask(message);

        this.setState({
            message: '',
        });
    }

    _submitOnEnter = (event) => {
        const enterKey = event.key === 'Enter';

        if (enterKey) {
            event.preventDefault();
            this._submitTask();
            console.log('onEnter SHE');
        }
    }

    render () {
        const {
            isTasksFetching,
            tasks,
            searchQuery,
            message,
        } = this.state;

        const tasksJSX = tasks.map((task) => {
            return <Task key = { task.id } { ...task } _removeTask = { this._removeTask } />;
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
                            value = { searchQuery }
                            onChange = { this._updateSearch }
                        />
                    </header>

                    <section>
                        <form onSubmit = { this._handleFormSubmit }>
                            <input
                                className = 'createTask'
                                maxLength = { 50 }
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { message }
                                onChange = { this._updateTaskMessage }
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
                </main>
            </section>
        );
    }
}

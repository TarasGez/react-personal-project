import { TOKEN, MAIN_URL } from './config';

export const api = {
    async fetchTasks () {
        const response = await fetch(MAIN_URL, {
            method:  'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
        });

        const { data: tasks } = await response.json();

        console.log('fetchTasks:', tasks);

        return tasks;
    },

    async createTask (message) {
        console.log('Message:', message);

        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message }),
        });

        const { data: task } = await response.json();

        console.log('createTask:', task);

        return task;
    },

    async updateTask (newTaskMessage) {
        console.log('newTaskMessage:', newTaskMessage);

        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ newTaskMessage }),
        });

        const { data: task } = await response.json();

        console.log('createTask:', task);

        return task;
    },

    removeTask () {
        return null;
    },

    completeAllTasks () {
        return null;
    },
};

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

        return tasks;
    },

    async createTask (message) {
        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message }),
        });

        const { data: task } = await response.json();

        return task;
    },

    async updateTask (params) {
        console.log("UdateTASK params in API:", params);

        const response = await fetch(MAIN_URL, {
            method:  'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify([{ ...params }]),
        });

        const { data: task } = await response.json();

        console.log("updateTask in API:", task);

        return task;
    },

    async removeTask (id) {
        await fetch(`${MAIN_URL}/${id}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });
    },

    async completeAllTasks (notCompletedTasks) {
        await notCompletedTasks.forEach((item) => {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!notCompletedTasks", item);
            api.updateTask({
                ...item,
                completed: true,
            });
        }

        );
    },
};

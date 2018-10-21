// Core
import React, { Component } from 'react';

export default class Scheduler extends Component {
    render () {
        return (
            <header>
                <h1>
                    Планировщик задач
                </h1>
                <input
                    placeholder = "Поиск"
                    type = "search"
                    value = ""
                />
            </header>
        );
    }
}

// Core
import React, { Component } from 'react';

export default class Scheduler extends Component {
    render () {
        return (
        <form>
          <input
            className = "createTask"
            maxLength = {50}

            placeholder = "Описaние моей новой задачи"
            type = "text"
            value = ""
          />
          <button>
            Добавить задачу
          </button>
        </form>
        );
    }
}

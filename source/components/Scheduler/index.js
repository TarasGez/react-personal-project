// Core
import React, { Component } from 'react';

// Components
import Spinner from '../Spinner';
import Header from '../Header';
import CreateTask from '../CreateTask';

import Footer from '../Footer';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

export default class Scheduler extends Component {
    render () {
        return (
            <section className = { Styles.scheduler }>
                <Spinner />
                
                <main>
                    <Header />
                    <section>
                        <CreateTask />
                    </section>

                    <Footer />
                </main>
            </section>
        );
    }
}

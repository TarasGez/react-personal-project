// Core
import React, { PureComponent } from 'react';
//import moment from 'moment';
import PropTypes from 'prop-types';

// Instruments
import Styles from './styles.m.css';
//import withSvg from '../../instruments/withSvg';
//import Star from 'theme/assets/Star';

export default class Task extends PureComponent {
    static propTypes = {
        _removeTask: PropTypes.func.isRequired,
        //_updateTask: PropTypes.func.isRequired,
        // _toggleTaskFavoriteState: PropTypes.func.isRequired,
        completed:   PropTypes.bool.isRequired,
        created:     PropTypes.number.isRequired,
        favorite:    PropTypes.bool.isRequired,
        id:          PropTypes.string.isRequired,
        message:     PropTypes.string.isRequired,
    }

    state = {
        favorite:   this.props.favorite,
        myRef:      this.props.id,
        isDisabled: true,
        message:    this.props.message,
    }

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _setTaskFavoriteState (state) {
        this.setState({
            favorite: state,
        });
        console.log("favorite: ", state);
    }

    _toggleTaskFavoriteState = () => {

        if (this.state.favorite) {
            this._setTaskFavoriteState(false);
        } else {
            this._setTaskFavoriteState(true);
        }
    }

    _setDisabled (state) {
        this.setState({
            isDisabled: state,
        });
    }

    _removeTask = () => {
        const { _removeTask, id } = this.props;

        _removeTask(id);
    }

    _updateTaskMessageOnClick = () => {
        const ref = this.state.myRef;

        this._setDisabled(false);

        console.log(ref);
        // SEND DATA
    }

    _updateTaskMessage = (event) => {
        this.setState({
            message: event.target.value,
        });
    }

    _updateOnEnter = (event) => {
        if (event.key === 'Esc') {
            event.preventDefault();
            this._setDisabled(true);
        } else
        if (event.key === 'Enter') {
            event.preventDefault();
            this._setDisabled(true);
        }
    }

    _clearUpdates = (event) => {
        if (event.keyCode === 27) {
            event.preventDefault();
            this._setDisabled(true);
            this.setState({
                message: this.props.message,
            });
            console.log("Esc this.state.message: ", this.state.message);
            console.log("Esc this.props.message: ", this.props.message);
        }
    }

    _getStarStyles = () => {
        const favorite = this.state.favorite;

        if (favorite) {
            return `*`;
        }

        return `-`;
    }

    render () {
        const {
            textInput,
            isDisabled,
            message,
        } = this.state;

        const checkbox = {
            "display": "inline-block",
            "height":  25,
            "width":   25,
        };

        const star = {
            "display": "inline-block",
            "height":  19,
            "width":   19,
        };

        const edit = {
            "display": "inline-block",
            "height":  19,
            "width":   19,
        };

        const remove = {
            "display": "inline-block",
            "height":  17,
            "width":   17,
        };

        const pointer = {
            "cursor": "pointer",
        };

        const starStyles = this._getStarStyles();

        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <div
                        className = { Styles.toggleTaskCompletedState }
                        style = { checkbox }>
                    [ ]
                    </div>
                    <input
                        disabled = { isDisabled }
                        maxLength = { 50 }
                        ref = { textInput }
                        type = 'text'
                        value = { message }
                        onChange = { this._updateTaskMessage }
                        onKeyDown = { this._clearUpdates }
                        onKeyPress = { this._updateOnEnter }
                    />
                </div>

                <div className = { Styles.actions }>
                    <div
                        className = { Styles.toggleTaskFavoriteState }
                        style = { star }
                        onClick = { this._toggleTaskFavoriteState }>

                        <span style = { pointer }>{starStyles}</span>
                    </div>

                    <div
                        className = { Styles.updateTaskMessageOnClick }
                        style = { edit }
                        onClick = { this._updateTaskMessageOnClick }>
                        <span style = { pointer }>[~]</span>
                    </div>
                    <div style = { remove } onClick = { this._removeTask } >
                        <span style = { pointer }>x</span>
                    </div>
                </div>
            </li>
        );
    }
}

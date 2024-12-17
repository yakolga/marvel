import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newElementLoading: false,
        offset: 210,
        charEnded: false
    };

    marvelService = new MarvelService();

    onCharLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }
        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList], 
            loading: false, 
            newElementLoading: false,
            offset: offset + 9,
            charEnded: ended
        }));
    }


    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    itemRefs = [];

    setRef = (item) => {
        this.itemRefs.push(item);
    }

    designOnClick = (id) => {
        this.itemRefs.forEach(element => {element.classList.remove('char__item_selected')});
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    componentDidMount() {
        this.onRequest();
    }

    onRequest(offset) {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({
            newElementLoading: true
        });
    }

    renderItems(arr) {
        const items = arr.map((element, i) => {
            const notAvailableImage = element.thumbnail.includes('image_not_available') ? {objectFit: 'inherit'} : null;
            return (
                <li className="char__item"
                    key={element.id}
                    ref={this.setRef}
                    onClick={() => {
                        this.props.onCharSelected(element.id);
                        this.designOnClick(i);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(element.id);
                            this.focusOnItem(i);
                        }
                    }}
                    >
                    <img src={element.thumbnail} alt={element.name} style={notAvailableImage}/>
                    <div className="char__name">{element.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const {charList, loading, error, newElementLoading, offset, charEnded} = this.state;
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newElementLoading}
                    onClick={() => this.onRequest(offset)}
                    style={charEnded ? {display: 'none'} : null}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;
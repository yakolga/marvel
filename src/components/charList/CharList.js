import React from 'react';
import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';
import useMarvelService from '../../services/MarvelService';

const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [newElementLoading, setNewElementLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} =  useMarvelService();

    const marvelService = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewElementLoading(false) : setNewElementLoading(true);
        getAllCharacters(offset)
            .then(onCharLoaded);
    }

    const onCharLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewElementLoading(newElementLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }

    const itemRefs = useRef([]);

    const designOnClick = (id) => {
        itemRefs.current.forEach(element => {element.classList.remove('char__item_selected')});
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems(arr) {
        const items = arr.map((element, i) => {
            const notAvailableImage = element.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? {objectFit: 'inherit'} : null;
            return (
                <li className="char__item"
                    key={element.id}
                    ref={element => itemRefs.current[i] = element}
                    onClick={() => {
                        props.onCharSelected(element.id);
                        designOnClick(i);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(element.id);
                            designOnClick(i);
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

    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newElementLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newElementLoading}
                onClick={() => onRequest(offset)}
                style={charEnded ? {display: 'none'} : null}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;
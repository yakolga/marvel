import React from 'react';
import {useState, useEffect, useRef, useMemo} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';
import useMarvelService from '../../services/MarvelService';

const setContent = (process, Component, newElementLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
            break;
        case 'loading':
            return newElementLoading ? <Component/> : <Spinner/>;
            break;
        case 'confirmed':
            return <Component/>;
            break;
        case 'error':
            <ErrorMessage/>
            break;
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [newElementLoading, setNewElementLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters, process, setProcess} =  useMarvelService();

    const marvelService = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewElementLoading(false) : setNewElementLoading(true);
        getAllCharacters(offset)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
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

    const elements = useMemo(() => {
        return setContent(process, () => renderItems(charList), newElementLoading)
    }, [process])


    return (
        <div className="char__list">
            {elements}
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
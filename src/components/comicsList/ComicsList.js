import './comicsList.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ComicsList = () => {
    const [charList, setCharList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newElementLoading, setNewElementLoading] = useState(false);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    const marvelService = useMarvelService();

    useEffect(() => {
        onRequest(0, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewElementLoading(false) : setNewElementLoading(true);
        setOffset(offset => offset + 7);
        getAllComics(offset)
            .then(onCharLoaded);
    }

    const onCharLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 7) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewElementLoading(newElementLoading => false);
        setCharEnded(ended);
    }

    function renderComics(arr) {
        const items = arr.map(item => {
            return (
                <li className="comics__item" key={item.id}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt="ultimate war" className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        });

        return items;
    }

    const items = renderComics(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newElementLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {spinner}
            <ul className="comics__grid">
                {errorMessage}
                {items}
            </ul>
            <button className="button button__main button__long" 
                disabled={newElementLoading}
                onClick={() => onRequest(offset)}
                style={charEnded ? {display: 'none'} : null}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

const View = () => {
    
}

export default ComicsList;
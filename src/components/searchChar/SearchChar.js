import './SearchChar.scss';
import useMarvelService from '../../services/MarvelService';
import {useState} from 'react';
import { Link } from 'react-router-dom';

const SearchChar = () => {
    const {searchChar} = useMarvelService();
    const [inputValue, setInputValue] = useState(null);
    const [loadedChar, setLoadedChar] = useState(null);
    const [inputError, showInputError] = useState(false);
    const onSubmit = (e, name) => {
        e.preventDefault();
        if (inputValue && inputValue.length) {
            showInputError(false);
            searchChar(inputValue)
            .then(onCharLoaded);
        } else {
            showInputError(true);
        }
    }

    const onCharLoaded = (char) => {
        setLoadedChar(char);
    }

    return (
        <div className="search-char" onSubmit={(e) => onSubmit(e)}>
            <div className="search-char__label">Or find a charakter by name:</div>
            <form className="search-char__form">
                <input name="name" type="text" placeholder="Enter name" onChange={(e) => {setInputValue(e.target.value); showInputError(false)}}></input>
                <button type="submit" className="search-char__button button button__main"><div className="inner">Find</div></button>
                {loadedChar && loadedChar !== 'error'
                ? 
                <div className="search-char__result">
                    <div className="search-char__info">There is! Visit {inputValue} page?</div>
                    <Link to={`/character/${loadedChar.id}`}><button className="search-char__button button button__secondary"><div className="inner">To page</div></button></Link>
                </div>
                : null}
                {loadedChar === 'error' ? <div className="search-char__result search-char__error">
                    <div className="search-char__info">The character was not found. Check the name and try again</div>
                </div> : null}
                {inputError ? <div className='error'>This field is required</div> : null}
            </form>
        </div>
    )
}

export default SearchChar;
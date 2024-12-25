import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';
import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);

    const {loading, error, getCharacter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId]);

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }

        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;
    const notAvailableImage = data.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? {objectFit: 'inherit'} : null;

    function comicsStructure(comics) {
        if (comics.length) {
            return (
                <>
                    <div className="char__comics">Comics:</div>
                    <ul className="char__comics-list">
                        {comics.map((elem, i) => {
                            if (i <= 9) {
                                return (
                                    <li key={i} className="char__comics-item">
                                        {elem.name}
                                    </li>
                                )
                            }
                        })}
                    </ul>
                </>
            )
        } else {
            return <div className="char__comics">There is no comics with this character</div>
        }
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt="abyss" style={notAvailableImage}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            {comicsStructure(comics)}
        </>
    )
}

export default CharInfo;
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    };

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    componentDidCatch(err, info) {
        console.log(err);
        console.log(info);
        this.setState({
            error: true
        })
    }

    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }

        this.onLoadingChar();

        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    onCharLoaded = (char) => {
        this.setState({
            char, 
            loading: false
        });
    }

    onLoadingChar = () => {
        this.setState({
            loading: true
        });
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    render () {
        const {char, loading, error} = this.state;
        const skeleton = char || loading || error ? null : <Skeleton/>;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;
        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    const notAvailableImage = char.thumbnail.includes('image_not_available') ? {objectFit: 'inherit'} : null;

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
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false
    };

    marvelService = new MarvelService();

    onCharLoaded = (charList) => {
        this.setState({
            charList, 
            loading: false
        });
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    componentDidMount() {
        this.marvelService
        .getAllCharacters()
        .then(this.onCharLoaded)
        .catch(this.onError);
    }

    renderItems(arr) {
        const items = arr.map(element => {
            const notAvailableImage = element.thumbnail.includes('image_not_available') ? {objectFit: 'inherit'} : null;
            return (
                <li className="char__item"
                    key={element.id}
                    onClick={() => this.props.onCharSelected(element.id)}
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
        const {charList, loading, error} = this.state;
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;
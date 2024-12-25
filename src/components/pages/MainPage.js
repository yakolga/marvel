import {useState} from "react";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import SearchCharForm from "../searchChar/SearchChar";
import {Helmet} from "react-helmet";

import decoration from '../../resources/img/vision.png';

const MainPage = () => {
    const [char, selectChar] = useState(null);

    const onCharSelected = (id) => {
        selectChar(id);
    }

    return (
        <>
            <Helmet>
                <meta name="description" content="Marvel information pportal"></meta>
                <title>Marvel information</title>
            </Helmet>
            <ErrorBoundary>
                <RandomChar />
            </ErrorBoundary>
            <div className="char__content">
                <ErrorBoundary>
                    <CharList onCharSelected={onCharSelected} />
                </ErrorBoundary>
                <ErrorBoundary>
                    <CharInfo charId={char} />
                </ErrorBoundary>
                <ErrorBoundary>
                    <SearchCharForm />
                </ErrorBoundary>
            </div>
            <img className="bg-decoration" src={decoration} alt="vision" />
        </>
    )
}

export default MainPage;
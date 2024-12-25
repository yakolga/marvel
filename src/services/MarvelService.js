import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {request, clearError, process, setProcess} = useHttp();
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=227d90e9a49db26c43bef21d78210972';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const _transformCharacter = (res) => {
        return {
            id: res.id,
            name: res.name,
            description: res.description ? res.description : 'There is no description for this charakter.',
            thumbnail: `${res.thumbnail.path}.${res.thumbnail.extension}`,
            homepage: res.urls[0].url,
            wiki: res.urls[1].url,
            comics: res.comics.items
        }
    }

    const getAllComics = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComic);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComic(res.data.results[0]);
    }

    const _transformComic = (res) => {
        return {
            id: res.id,
            title: res.title,
            description: res.description || 'There is no description', 
            pageCount: res.pageCount ? `${res.pageCount} p.` : 'No information about the number of pages',
            language: res.textObjects.language || 'en-us',
            price: res.prices[0].price ? `${res.prices[0].price + '$'}` : 'NOT AVAILABLE',
            thumbnail: `${res.thumbnail.path}.${res.thumbnail.extension}`,
        }
    }

    const searchChar = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.length > 0 ? _transformCharacter(res.data.results[0]) : 'error' 
    }

    return {
            getAllCharacters, 
            getCharacter, 
            clearError, 
            process,
            setProcess,
            getAllComics, 
            getComic, 
            _transformComic, 
            searchChar}
}

export default useMarvelService;
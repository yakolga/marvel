import './SearchChar.scss';
import useMarvelService from '../../services/MarvelService';
import {useState} from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import ErrorMessage from '../errorMessage/ErrorMessage';

const SearchCharForm = () => {
    const {loading, error, searchChar, clearError} = useMarvelService();
    const [char, setChar] = useState(null);

    const onSubmit = (name) => {
        clearError();
            
        searchChar(name)
            .then(onCharLoaded);
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const errorMessage = error ? <div className="error"><ErrorMessage /></div> : null;
    const result = !char ? null : char && char !== 'error' 
    ? 
    <div className="search-char__result">
        <div className="search-char__info">There is! Visit {char.name} page?</div>
        <Link to={`/character/${char.id}`}><button className="search-char__button button button__secondary"><div className="inner">To page</div></button></Link>
    </div>
    : <div className="search-char__result search-char__error">
        <div className="search-char__info">The character was not found. Check the name and try again</div>
    </div>;

    return (
        <div className="search-char">
            <Formik                 
                initialValues = {{
                    charName: ''
                }}
                validationSchema = {Yup.object({
                    charName: Yup.string().required('This field is required')
                })}
                onSubmit={({charName}) => {
                    onSubmit(charName);
                }}
                >
                <Form>
                    <div className="search-char__label">Or find a charakter by name:</div>
                    <div className="search-char__wrapper">
                        <Field id="charName" name="charName" type="text" placeholder="Enter name"/>
                        <button type="submit" className="search-char__button button button__main"><div className="inner">Find</div></button>
                    </div>
                    <FormikErrorMessage component="div" className="error" name="charName" />
                    {result}
                    {errorMessage}
                </Form>
            </Formik>
        </div>
    )
}

export default SearchCharForm;
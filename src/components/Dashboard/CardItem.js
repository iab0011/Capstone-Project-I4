import React from 'react';
import { Link } from 'react-router-dom';

function CardItem(props) {          //Code to make page scroll to top
    const scrollToTop = () => {
        window.scrollTo(0, 0)
        
    }

    // props.path - Path to redirect to
    // props.label - Subtext
    // props.src - image for project
    // props.text - Project title
    // props.desc - project description
  return (
    <>
        <li className='cards__item'>
            <Link className='cards__item__link' to={props.path} state={{key: props.projectKey}} onClick={scrollToTop}>
                <figure className='cards__item__pic-wrap' data-label={props.label}>
                    <img src={props.src} alt='Project Image' className='cards__item__img' />
                    <Link className="card-edit" to="/EditProject" state={{key: props.projectKey}}  onClick={scrollToTop}>
                        <i class="fas fa-bars"></i>
                    </Link>
                </figure>
                <div className='cards__item__info'>
                    <h5 className='cards__item__text'>{props.text}</h5>
                    <p className='cards__item__desc'>{props.desc}</p>
                </div>
            </Link>
        </li>
    </>
  )
}

export default CardItem;
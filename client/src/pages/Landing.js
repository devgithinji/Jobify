import React from 'react';
import main from '../assets/images/main.svg'
import Wrapper from "../assets/wrappers/Testing";
import {Logo} from '../components'


const Landing = () => {
    return (
        <Wrapper>
            <nav>
                <Logo/>
            </nav>
            <div className="container page">
                <div className="info">
                    <h1>
                        job <span>tracking</span> app
                    </h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquid amet debitis deleniti
                        error labore reprehenderit sit! A commodi, delectus deleniti deserunt dignissimos dolores fugiat
                        illum impedit neque praesentium quas quisquam rem repellendus soluta ullam veniam voluptatum!
                        Dolor, nulla, vel.</p>
                    <button className='btn btn-hero'>Login/Register</button>
                </div>
                <img src={main} alt="job hunt" className='img main-img'/>
            </div>
        </Wrapper>
    );
};


export default Landing;
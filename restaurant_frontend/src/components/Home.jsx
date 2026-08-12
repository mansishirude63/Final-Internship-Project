import React, { useState, useEffect } from 'react'

import Navbar from './common/Navbar'
import Hero from './common/Hero'
import Features from './common/Features'
import FeaturedMenu from './common/FeaturedMenu'
import About from './common/About'
import Testimonials from './common/Testimonials'
import Footer from './common/Footer'
import GroupOrderingOffer from "./common/GroupOrderingOffer";
import AuthPopup from "./AddPopUp"



const Home = () => {


    const [showPopup, setShowPopup] = useState(false);



    useEffect(() => {

        const user = localStorage.getItem("user");


        if (!user) {

            setShowPopup(true);

        }

    }, []);



    return (
        <>

            <Navbar />

            <Hero />

            <GroupOrderingOffer />

            <Features />

            <FeaturedMenu />

            <About />

            <Testimonials />

            <Footer />


            {
                showPopup &&

                <AuthPopup
                    closePopup={() => setShowPopup(false)}
                />

            }


        </>
    )
}


export default Home
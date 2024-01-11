import React, { useState } from 'react'
import {  useNavigate } from "react-router-dom";
function Sider() {
    const [expand, setExpand] = useState(false);
    const navigate = useNavigate();
    const handleExpand = () => {
        setExpand(true);
    }
    const handleRetract = () => {
        setExpand(false);
    }


    
    const siderItems = [
        {
            id: 1,
            title: "Home",
            route: "/",
            // icon:'🏚',
            class:"fa fa-home"
        },
        {
            id: 2,
            title: "Search",
            route: "/search",
            // icon:'⌕'
            class:"fa fa-search"
        },
    ]
    return (
        <div className={expand ? 'sider-wrapper expand' : 'sider-wrapper'}
            onMouseEnter={handleExpand}
            onMouseLeave={handleRetract}
        >
            <div className='sider-brand-container'>
                <div className='sider-brand-logo'>
                   
                </div>
            </div >
            <div className='sider-container'>

                <div className='sider-content'>
                    {
                        (siderItems || []).map((item, index) => {
                            return (
                                <div onClick={(()=>{navigate(item.route)})} className='siderItem cursor-pointer' key={index}>
                                    <i class={item.class} aria-hidden="true"></i>
                                    <div className={`title ${expand ? 'expanded' : ''}`} >{item.title}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div >
        </div>
    )
}

export default Sider
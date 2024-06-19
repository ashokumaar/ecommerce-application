import React from 'react';
import { Instagram, Linkedin } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom';

const Copyrights = () => {

    return (
        <div className='container'>
            <div className='footer fixed-bottom px-3 d-flex justify-content-between align-items-center' style={{ height: '25px', backgroundColor: '#D0C6C6' }}>
                <div>Copyright ©️ 2024 - All rights are reserved.</div>
                <div className='d-flex align-items-center'>
                    <div style={{ background: 'linear-gradient(115deg, #f9ce34, #ee2a7b, #6228d7)', borderRadius: '50%'}}>
                        <Link to='https://www.instagram.com/ashok_veeraboyini?igsh=c2l4bmx5Z3AxZjMx' target='_blank' style={{padding:'0 1px'}}>
                            <Instagram size='20' style={{ color: 'white', paddingBottom:'4px'}} />
                        </Link>
                    </div>
                    <div>
                        <Link className='px-2' to='https://www.linkedin.com/in/ashok-kumar-v-g-42994221a' target='_blank'>
                            <Linkedin size='22' style={{paddingBottom:'1px', borderRadius:'20%'}}/>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Copyrights;

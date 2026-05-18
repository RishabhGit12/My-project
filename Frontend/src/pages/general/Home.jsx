import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Function to check if the authentication token cookie exists
        const checkAuthToken = () => {
            const cookies = document.cookie.split(';');
            const hasToken = cookies.some(cookie => cookie.trim().startsWith('token='));
            setIsLoggedIn(hasToken);
        };

        checkAuthToken();

        // Fetch feed items
        axios.get(`${import.meta.env.VITE_API_URL}/api/food`, { withCredentials: true })
            .then(response => {
                console.log(response.data);
                setVideos(response.data.foodItems || []);
            })
            .catch((err) => { 
                console.error("Error fetching feed:", err);
            });
    }, []);

    async function likeVideo(item) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/food/like`, { foodId: item._id }, { withCredentials: true });
            if (response.data.like) {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v));
            } else {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v));
            }
        } catch (err) {
            if (err.response?.status === 401) navigate('/user/login');
        }
    }

    async function saveVideo(item) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/food/save`, { foodId: item._id }, { withCredentials: true });
            if (response.data.save) {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v));
            } else {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v));
            }
        } catch (err) {
            if (err.response?.status === 401) navigate('/user/login');
        }
    }

    return (
        <div className="home-page-container" style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#000' }}>
            
            {/* Modern Top Navigation Glassmorphism Bar */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 100,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 24px',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                boxSizing: 'border-box'
            }}>
                {/* Brand Logo/Text */}
                <h2 style={{ 
                    margin: 0, 
                    color: '#fff', 
                    fontSize: '1.4rem', 
                    fontWeight: '800', 
                    letterSpacing: '0.5px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>
                    Food<span style={{ color: '#ff3f6c' }}>Flix</span>
                </h2>

                {/* Conditional Auth Button Profile Group */}
                {!isLoggedIn ? (
                    <button 
                        onClick={() => navigate('/user/login')}
                        style={{
                            padding: '10px 22px',
                            background: '#ff3f6c', 
                            color: '#fff',
                            border: 'none',
                            borderRadius: '25px', 
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0px 4px 15px rgba(255, 63, 108, 0.4)',
                            letterSpacing: '0.3px'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.04)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        Sign In
                    </button>
                ) : (
                    <div style={{
                        padding: '6px 14px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                        🟢 Live Feed
                    </div>
                )}
            </div>

            {/* Existing Reels Feed Component */}
            <ReelFeed
                items={videos}
                onLike={likeVideo}
                onSave={saveVideo}
                emptyMessage="Please Login First!"
            />
        </div>
    )
}

export default Home;
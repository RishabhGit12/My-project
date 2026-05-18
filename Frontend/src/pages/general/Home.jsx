import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Helper function to scan browser cookies for an active session token
    const checkAuthToken = () => {
        const cookies = document.cookie.split(';');
        return cookies.some(cookie => cookie.trim().startsWith('token='));
    };

    useEffect(() => {
        setIsLoggedIn(checkAuthToken());

        // Fetch feed items
        axios.get(`${import.meta.env.VITE_API_URL}/api/food`, { withCredentials: true })
            .then(response => {
                setVideos(response.data.foodItems || []);
            })
            .catch((err) => { 
                console.error("Error fetching feed:", err);
            });
    }, []);

    // Intercepts actions if no session token is present
    const handleUnauthenticatedAction = () => {
        alert("Please Login/Signup First!");
        navigate('/user/login');
    };

    async function likeVideo(item) {
        if (!checkAuthToken()) {
            handleUnauthenticatedAction();
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/food/like`, { foodId: item._id }, { withCredentials: true });
            if (response.data.like) {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v));
            } else {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v));
            }
        } catch (err) {
            if (err.response?.status === 401) handleUnauthenticatedAction();
        }
    }

    async function saveVideo(item) {
        if (!checkAuthToken()) {
            handleUnauthenticatedAction();
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/food/save`, { foodId: item._id }, { withCredentials: true });
            if (response.data.save) {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v));
            } else {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v));
            }
        } catch (err) {
            if (err.response?.status === 401) handleUnauthenticatedAction();
        }
    }

    // New clear cookie and logout utility handler
    const handleLogout = async () => {
        try {
            // Fires an explicit call to clear backend cookie context
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, { withCredentials: true });
        } catch (err) {
            console.error("Backend logout cleanup error:", err);
        }

        // Wipe client-side cookies manually to guarantee state updates instantly
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setIsLoggedIn(false);
        navigate('/');
    };

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
                {/* Brand Logo */}
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

                {/* Dynamic Auth Button */}
                <button 
                    onClick={isLoggedIn ? handleLogout : () => navigate('/user/login')}
                    style={{
                        padding: '10px 22px',
                        background: isLoggedIn ? 'rgba(255, 255, 255, 0.15)' : '#ff3f6c', 
                        color: '#fff',
                        border: isLoggedIn ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                        borderRadius: '25px', 
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        backdropFilter: isLoggedIn ? 'blur(10px)' : 'none',
                        WebkitBackdropFilter: isLoggedIn ? 'blur(10px)' : 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: isLoggedIn ? '0 4px 12px rgba(0,0,0,0.2)' : '0px 4px 15px rgba(255, 63, 108, 0.4)',
                        letterSpacing: '0.3px'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.04)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                    {isLoggedIn ? 'Sign Out' : 'Sign In'}
                </button>
            </div>

            {/* Reels Feed Component */}
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
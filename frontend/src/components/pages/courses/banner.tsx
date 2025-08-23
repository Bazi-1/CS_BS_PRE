import { React, useState, useEffect } from '../../imports/imports.tsx';
import "../../../styles/banner.css";
import type { AppDispatch } from '../../../store/store.tsx';
import { RootState } from '../../../store/store.tsx';
import { fetchCourses, searchCourses, setSearchTerm } from '../../../store/courses/bannerSlice.tsx';
import { useDispatch, useSelector } from 'react-redux';

const BannerWithSearch: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { searchTerm } = useSelector((state: RootState) => state.banner);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.trim() === '') {
                dispatch(fetchCourses());
            } else {
                dispatch(searchCourses(searchTerm));
            }
        }, 300); // debounce for smooth user experience

        return () => clearTimeout(delayDebounce);
    }, [dispatch, searchTerm]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchTerm(e.target.value));
    };

    return (
        <div className="banner-container">
            <section
                className="banner-section"
                style={{
                    backgroundImage: "url('http://localhost:3001/images/learn.png')",
                    backgroundSize: "cover",
                }}
            >
                <div className="container text-white">
                    <div className="banner-content">
                        <h1 className="display-3 mb-3">Reach new heights</h1>
                        <h2 className="mb-4">Start your online course today!</h2>
                        <p className="lead">
                            Skill up and have an impact! Your business career starts here. <br />
                            Time to start a course.
                        </p>
                    </div>
                </div>
            </section>
            <div className="search-bar-container">
                <div className="container">
                    <div className="search-bar d-flex align-items-center">
                        <span className="icon">🎓</span>
                        <span className="search-title">All courses</span>
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Search courses"
                            value={searchTerm}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerWithSearch;

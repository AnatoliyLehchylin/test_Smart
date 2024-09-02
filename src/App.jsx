import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, setFilter, clearFilter, toggleFilter, filterUsers } from './redux/slice/userSlice.js';
import './style/style.css';
import './App.css';

function App() {
    const dispatch = useDispatch();
    const { filteredData, filter, isFilterActive, status, error } = useSelector(state => state.users);
    const [typingTimeout, setTypingTimeout] = useState(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchUsers());
        }
    }, [status, dispatch]);

    useEffect(() => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        setTypingTimeout(setTimeout(() => {
            dispatch(filterUsers());
        }, 700));

        return () => clearTimeout(typingTimeout);
    }, [filter, dispatch]);

    const handleFilterChange = (e, property) => {
        dispatch(setFilter({ ...filter, [property]: e.target.value }));
    };

    const handleClearFilter = () => {
        dispatch(clearFilter());
    };

    const handleToggleFilter = () => {
        dispatch(clearFilter());
        dispatch(toggleFilter());
    };

    return (
        <div className='page-wrapp'>
            {status === 'failed' ? (
                <div className='error-message'>Error: {error}</div>
            ) : (
                status === 'succeeded' && <div className='title'>Users</div>
            )}

            {status === 'loading' && <div className='loading'>Loading...</div>}

            {status === 'succeeded' && (
                <>
                    <div className='button-filter-wrapp'>
                        <button
                            style={isFilterActive ? { backgroundColor: '#bb1024', color: '#e7dddd' } : {}}
                            className='button'
                            onClick={handleToggleFilter}
                        >
                            {isFilterActive ? 'Close Filter' : 'Filter'}
                        </button>
                    </div>

                    {isFilterActive && (
                        <div className='filter-wrap'>
                            <div className='inputs-wrapp'>
                                <input
                                    placeholder={'name'}
                                    value={filter.name}
                                    onChange={(e) => handleFilterChange(e, 'name')}
                                    className='input'
                                />
                                <input
                                    placeholder={'username'}
                                    value={filter.username}
                                    onChange={(e) => handleFilterChange(e, 'username')}
                                    className='input'
                                />
                                <input
                                    placeholder={'email'}
                                    value={filter.email}
                                    onChange={(e) => handleFilterChange(e, 'email')}
                                    className='input'
                                />
                                <input
                                    placeholder={'phone (only number!)'}
                                    value={filter.phone}
                                    onChange={(e) => handleFilterChange(e, 'phone')}
                                    className='input'
                                    style={{ marginRight: '0' }}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/\D/g, '');
                                    }}
                                />
                            </div>
                                <button className='button button-clear' onClick={handleClearFilter}>
                                    Clear Filter
                                </button>
                        </div>
                    )}
                </>
            )}

            {filteredData.length < 1 ? (
                    status === 'succeeded' && <div className='no-data'>NO USERS</div>
            ) : (
                <div className='headers'>
                    <div className='headers-item'>NAME</div>
                    <div className='headers-item'>USERNAME</div>
                    <div className='headers-item'>EMAIL</div>
                    <div className='headers-item'>PHONE</div>
                </div>
            )}
            {filteredData.map(user => (
                <div key={user.id} className='line'>
                    <div className='line-item'>{user.name}</div>
                    <div className='line-item'>{user.username}</div>
                    <div className='line-item'>{user.email}</div>
                    <div className='line-item'>{user.phone}</div>
                </div>
            ))}
        </div>
    );
}

export default App;

import {useEffect, useState} from 'react';
import './Style/style.css';
import './App.css';


function App() {

    const [data, setData] = useState([]);
    const [objFilter, setObjFilter] = useState({name: '', username: '', email: '', phone: ''});
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isFilter, setIsFilter] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);

    // function FilterChange(e, property) {
    //     setObjFilter(prevFilter => ({...prevFilter, [property]: e.target.value}));
    // }

    function FilterChange(e, property) {
        const value = e.target.value;

        // Если таймер существует, очищаем его
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Обновляем состояние фильтра
        setObjFilter(prevFilter => ({...prevFilter, [property]: value}));

        // Устанавливаем новый таймер для фильтрации
        setTypingTimeout(setTimeout(() => {
            // const filteredData = data.filter(profile =>
            //     Object.entries({...objFilter, [property]: value}).every(([key, filterValue]) => filterValue === '' || profile[key].toString().toLowerCase().startsWith(filterValue.toLowerCase()))
            // );
            const filteredData = data.filter(profile =>
                Object.entries({...objFilter, [property]: value}).every(([key, filterValue]) => {
                    if (filterValue === '') return true;

                    // Для поля телефона очищаем от лишних символов
                    if (key === 'phone') {
                        const cleanPhone = profile[key].replace(/\D/g, ''); // Оставляем только цифры
                        const cleanFilterValue = filterValue.replace(/\D/g, ''); // Очищаем фильтр от лишних символов
                        return cleanPhone.startsWith(cleanFilterValue); // Проверяем начало номера
                    }

                    // Для остальных полей проверяем по началу строки
                    return profile[key].toString().toLowerCase().startsWith(filterValue.toLowerCase());
                })
            );
            setFilteredUsers(filteredData);
        }, 500)); // Таймаут 500 мс
    }

    function Filtration() {
        const filteredData = data.filter(profile =>
            Object.entries(objFilter).every(([key, value]) => value === '' || profile[key].toString() === value.toString())
        );
        setFilteredUsers(filteredData);
    }

    function IsClear() {
        setFilteredUsers(data);
        setObjFilter({name: '', username: '', email: '', phone: ''});
    }

    function IsClose() {
        setFilteredUsers(data);
        setObjFilter({name: '', username: '', email: '', phone: ''});
        setIsFilter(!isFilter)
    }

    const fetchUsers = async () => {
        try {
            const res = await fetch('https://jsonplaceholder.typicode.com/users');
            const json = await res.json();
            return json;
        } catch (error) {
            console.error("Error while receiving data:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const dataUsers = await fetchUsers();
            console.log(dataUsers);
            setData(dataUsers);
        };

        fetchData();
    }, []);

    useEffect(() => {
        setFilteredUsers(data)
    }, [data]);

    // useEffect(() => {
    //     const filteredData = data.filter(profile =>
    //         Object.entries(objFilter).every(([key, value]) => value === '' || profile[key].toString().toLowerCase().includes(value.toLowerCase()))
    //     );
    //     setFilteredUsers(filteredData);
    // }, [objFilter, data]);

    return (
        <div className='page-wrapp'>
            <div className='title'>Users</div>
            {filteredUsers.length > 0 && (
                <>
                    <div className='sort-filter-wrapp'>
                        {/*<select id="dropdown" value={sort} onChange={ChangeSort} className='button sort'>*/}
                        {/*    <option value="true">Спочатку створені раніше</option>*/}
                        {/*    <option value="false">Спочатку створені пізніше</option>*/}
                        {/*</select>*/}
                        <button style={isFilter ? {backgroundColor: '#e184ad'} : {}} className='button'
                                onClick={() => IsClose()}>{isFilter ? 'Close' : 'Filter'}</button>
                    </div>

                    {isFilter && (
                        <div className='filter-wrap'>
                            <div className='inputs-wrapp'>
                                <input placeholder={'name'} value={objFilter.name}
                                       onChange={(e) => FilterChange(e, 'name')} className='input'/>
                                <input placeholder={'username'} value={objFilter.username}
                                       onChange={(e) => FilterChange(e, 'username')}
                                       className='input'/>
                                <input placeholder={'email'} value={objFilter.email}
                                       onChange={(e) => FilterChange(e, 'email')} className='input'/>
                                {/*<input placeholder={'phone'} value={objFilter.phone}*/}
                                {/*       onChange={(e) => FilterChange(e, 'phone')} className='input'*/}
                                {/*       style={{marginRight: '0'}}/>*/}
                                <input
                                    placeholder={'phone (only numbers!)'}
                                    value={objFilter.phone}
                                    onChange={(e) => FilterChange(e, 'phone')}
                                    onInput={(e) => {
                                        // Удаляем все символы, кроме цифр
                                        e.target.value = e.target.value.replace(/\D/g, '');
                                    }}
                                    className='input'
                                    style={{ marginRight: '0' }}
                                    inputMode="numeric" // Подсказка для мобильных клавиатур
                                />
                            </div>
                            <div>
                                <button className='button' onClick={() => Filtration()}>Filtration</button>
                                <button className='button button-delete' onClick={() => IsClear()}>Clear</button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {filteredUsers.length < 1 ? (
                <div className='no-data'>NO USERS</div>
            ) : (
                <div className='headers'>
                    <div className='headers-item'>NAME</div>
                    <div className='headers-item'>USERNAME</div>
                    <div className='headers-item'>EMAIL</div>
                    <div className='headers-item'>PHONE</div>
                </div>
            )}
            {filteredUsers.map(user => (
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

export default App

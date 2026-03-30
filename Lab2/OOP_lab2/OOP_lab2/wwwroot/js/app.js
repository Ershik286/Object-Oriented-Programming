const API_URL = 'https://localhost:60525';
const API_BASE = `${API_URL}/api`;

let currentEntity = 'computer';

// Конфигурация конструкторов для каждого класса
const constructors = {
    computer: [
        {
            name: 'Конструктор по умолчанию',
            description: 'Computer()',
            fields: []
        },
        {
            name: 'Конструктор с процессором и RAM',
            description: 'Computer(modelProcessor, ram, name, id)',
            fields: [
                { name: 'modelProcessor', label: 'Процессор', type: 'text', required: true },
                { name: 'ram', label: 'RAM (ГБ)', type: 'number', required: true, min: 1 },
                { name: 'name', label: 'Название', type: 'text', required: true },
                { name: 'id', label: 'ID', type: 'number', required: true, min: 1 }
            ]
        },
        {
            name: 'Полный конструктор',
            description: 'Computer(modelProcessor, ram, name, id, country, enabled)',
            fields: [
                { name: 'modelProcessor', label: 'Процессор', type: 'text', required: true },
                { name: 'ram', label: 'RAM (ГБ)', type: 'number', required: true, min: 1 },
                { name: 'name', label: 'Название', type: 'text', required: true },
                { name: 'id', label: 'ID', type: 'number', required: true, min: 1 },
                { name: 'country', label: 'Страна', type: 'text', required: true },
                { name: 'enabled', label: 'Включен', type: 'checkbox' }
            ]
        }
    ],
    smartfon: [
        {
            name: 'Конструктор по умолчанию',
            description: 'Smartfon()',
            fields: []
        },
        {
            name: 'Конструктор с камерой',
            description: 'Smartfon(name, id, cameraMP)',
            fields: [
                { name: 'name', label: 'Название', type: 'text', required: true },
                { name: 'id', label: 'ID', type: 'number', required: true, min: 1 },
                { name: 'cameraMP', label: 'Камера (МП)', type: 'number', required: true, min: 1 }
            ]
        },
        {
            name: 'Полный конструктор',
            description: 'Smartfon(name, id, country, enabled, cameraMP, isCall, manufactures)',
            fields: [
                { name: 'name', label: 'Название', type: 'text', required: true },
                { name: 'id', label: 'ID', type: 'number', required: true, min: 1 },
                { name: 'country', label: 'Страна', type: 'text', required: true },
                { name: 'enabled', label: 'Включен', type: 'checkbox' },
                { name: 'cameraMP', label: 'Камера (МП)', type: 'number', required: true, min: 1 },
                { name: 'isCall', label: 'Звонок', type: 'checkbox' },
                { name: 'manufactures', label: 'Производитель', type: 'text', required: true }
            ]
        }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    document.getElementById('entitySelector').addEventListener('change', onEntityChange);
    document.getElementById('refreshBtn').addEventListener('click', refreshAllData);

    renderConstructors();
    loadAllData();
}

function onEntityChange(e) {
    currentEntity = e.target.value;
    renderConstructors();
    showAppropriateTable();
}

function showAppropriateTable() {
    // Скрываем обе дочерние таблицы
    document.getElementById('computerTableWrapper').style.display = 'none';
    document.getElementById('smartfonTableWrapper').style.display = 'none';
    
    // Показываем нужную в зависимости от выбранного класса
    if (currentEntity === 'computer') {
        document.getElementById('computerTableWrapper').style.display = 'block';
    } else if (currentEntity === 'smartfon') {
        document.getElementById('smartfonTableWrapper').style.display = 'block';
    }
}

function renderConstructors() {
    const container = document.getElementById('constructorsContainer');
    container.innerHTML = '';

    constructors[currentEntity].forEach((constructor, index) => {
        const card = document.createElement('div');
        card.className = 'constructor-card';
        
        let fieldsHtml = '';
        constructor.fields.forEach(field => {
            if (field.type === 'checkbox') {
                fieldsHtml += `
                    <div class="field-group checkbox">
                        <label for="${field.name}_${index}">${field.label}:</label>
                        <input type="checkbox" id="${field.name}_${index}" name="${field.name}">
                    </div>
                `;
            } else {
                fieldsHtml += `
                    <div class="field-group">
                        <label for="${field.name}_${index}">${field.label}:</label>
                        <input type="${field.type}" 
                               id="${field.name}_${index}" 
                               name="${field.name}" 
                               ${field.min ? `min="${field.min}"` : ''}
                               ${field.required ? 'required' : ''}>
                    </div>
                `;
            }
        });

        card.innerHTML = `
            <h4>${constructor.name}</h4>
            <p class="constructor-desc">${constructor.description}</p>
            <div class="constructor-fields" data-constructor-index="${index}">
                ${fieldsHtml}
            </div>
            <button class="btn btn-primary" onclick="createEntity(${index})">Создать</button>
        `;
        
        container.appendChild(card);
    });
}

async function loadAllData() {
    showLoading(true);
    try {
        await fetchBaseEntities();
        
        // Загружаем данные для компьютеров
        await fetchComputers();
        
        // Загружаем данные для смартфонов
        await fetchSmartfons();
        
        // Показываем нужную таблицу
        showAppropriateTable();
        
        showNotification('Все данные загружены', 'success');
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Ошибка загрузки данных');
    } finally {
        showLoading(false);
    }
}

async function fetchBaseEntities() {
    try {
        const response = await fetch(`${API_BASE}/technics`);
        if (!response.ok) throw new Error('Failed to fetch base entities');
        const entities = await response.json();
        displayBaseEntities(entities);
    } catch (error) {
        console.error('Error fetching base entities:', error);
    }
}

async function fetchComputers() {
    try {
        console.log('API_BASE:', API_BASE);

        const response = await fetch(`${API_BASE}/computers`);
        if (!response.ok) throw new Error('Failed to fetch computers');
        const computers = await response.json();
        displayComputers(computers);
        document.getElementById('computerTableWrapper').style.display = 'block';
    } catch (error) {
        console.error('Error fetching computers:', error);
        document.getElementById('computerTableWrapper').style.display = 'none';
    }
}

async function fetchSmartfons() {
    try {
        const response = await fetch(`${API_BASE}/smartfons`);
        if (!response.ok) throw new Error('Failed to fetch smartfons');
        const smartfons = await response.json();
        displaySmartfons(smartfons);
    } catch (error) {
        console.error('Error fetching smartfons:', error);
        displaySmartfons([]);
    }
}

function displayBaseEntities(entities) {
    const tbody = document.getElementById('baseTableBody');
    tbody.innerHTML = '';

    if (entities.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Нет данных</td></tr>';
        return;
    }

    entities.forEach(entity => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entity.id || entity.getId?.() || '-'}</td>
            <td>${entity.name || entity.getName?.() || '-'}</td>
            <td>${entity.country || entity.getCountry?.() || '-'}</td>
            <td>${entity.enabled || entity.isEnabled?.() ? 'Да' : 'Нет'}</td>
            <td>
                <button class="delete-btn" onclick="deleteBaseEntity(${entity.id || entity.getId?.()})">Удалить</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function displayComputers(computers) {
    const tbody = document.getElementById('computerTableBody');
    tbody.innerHTML = '';

    if (computers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Нет данных</td></tr>';
        return;
    }

    computers.forEach(computer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${computer.id || '-'}</td>
            <td>${computer.technicId || computer.id || '-'}</td>
            <td>${computer.modelProcessor || '-'}</td>
            <td>${computer.ram || '-'}</td>
            <td>
                <button class="delete-btn" onclick="deleteComputer(${computer.id})">Удалить</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function displaySmartfons(smartfons) {
    const tbody = document.getElementById('smartfonTableBody');
    tbody.innerHTML = '';

    if (smartfons.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Нет данных</td></tr>';
        return;
    }

    smartfons.forEach(smartfon => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${smartfon.id || '-'}</td>
            <td>${smartfon.technicId || smartfon.id || '-'}</td>
            <td>${smartfon.cameraMP || '-'}</td>
            <td>${smartfon.manufactures || '-'}</td>
            <td>
                <button class="delete-btn" onclick="deleteSmartfon(${smartfon.id})">Удалить</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function createEntity(constructorIndex) {
    const constructor = constructors[currentEntity][constructorIndex];
    const form = document.querySelector(`[data-constructor-index="${constructorIndex}"]`);
    
    if (!form) return;

    const formData = new FormData();
    const entityData = {};

    constructor.fields.forEach(field => {
        const input = document.getElementById(`${field.name}_${constructorIndex}`);
        if (input) {
            let value;
            if (field.type === 'checkbox') {
                value = input.checked;
            } else {
                value = field.type === 'number' ? parseInt(input.value) : input.value;
            }
            
            if (value !== undefined && value !== '') {
                entityData[field.name] = value;
                formData.append(field.name, value);
            }
        }
    });

    // Для конструктора по умолчанию отправляем пустой объект
    if (constructor.fields.length === 0) {
        showNotification('Создание через конструктор по умолчанию', 'info');
    }

    showLoading(true);
    try {
        const endpoint = currentEntity === 'computer' ? 'computers' : 'smartfons';
        const response = await fetch(`${API_BASE}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entityData)
        });

        if (!response.ok) { 
            console.error('Error createEntity, currentEntity = ', currentEntity, '/ endpoint = ', endpoint);
            console.error('response = ', response);
            throw new Error('Failed to create entity');
        }

        showNotification(`${currentEntity === 'computer' ? 'Компьютер' : 'Смартфон'} создан`, 'success');
        
        // Очищаем форму
        constructor.fields.forEach(field => {
            const input = document.getElementById(`${field.name}_${constructorIndex}`);
            if (input) {
                if (field.type === 'checkbox') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            }
        });

        await Promise.all([
            fetchBaseEntities(),
            currentEntity === 'computer' ? fetchComputers() : fetchSmartfons()
        ]);

    } catch (error) {
        console.error('Error creating entity:', error);
        showNotification('Ошибка при создании', 'error');
    } finally {
        showLoading(false);
    }
}

async function deleteBaseEntity(id) {
    if (!confirm('Удалить запись из базовой таблицы? Это также удалит связанные дочерние записи.')) return;

    try {
        const response = await fetch(`${API_BASE}/technics/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete');

        showNotification('Запись удалена', 'success');
        await loadAllData();

    } catch (error) {
        console.error('Error deleting entity:', error);
        showNotification('Ошибка при удалении', 'error');
    }
}

async function deleteComputer(id) {
    if (!confirm('Удалить компьютер?')) return;

    try {
        const response = await fetch(`${API_BASE}/computers/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete');

        showNotification('Компьютер удален', 'success');
        await loadAllData();

    } catch (error) {
        console.error('Error deleting computer:', error);
        showNotification('Ошибка при удалении', 'error');
    }
}

async function deleteSmartfon(id) {
    if (!confirm('Удалить смартфон?')) return;

    try {
        const response = await fetch(`${API_BASE}/smartfons/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete');

        showNotification('Смартфон удален', 'success');
        await loadAllData();

    } catch (error) {
        console.error('Error deleting smartfon:', error);
        showNotification('Ошибка при удалении', 'error');
    }
}

async function refreshAllData() {
    await loadAllData();
}

function showLoading(show) {
    document.getElementById('loadingIndicator').style.display = show ? 'block' : 'none';
}

function showError(message) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    
    setTimeout(() => {
        errorMsg.style.display = 'none';
    }, 5000);
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    // Показываем таблицу для начального выбранного класса (computer)
    setTimeout(() => showAppropriateTable(), 100); // Небольшая задержка для гарантии
});

// Глобальные функции
window.createEntity = createEntity;
window.deleteBaseEntity = deleteBaseEntity;
window.deleteComputer = deleteComputer;
window.deleteSmartfon = deleteSmartfon;
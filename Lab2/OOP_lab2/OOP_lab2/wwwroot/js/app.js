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
    const computerWrapper = document.getElementById('computerTableWrapper');
    const smartfonWrapper = document.getElementById('smartfonTableWrapper');
    
    if (computerWrapper) computerWrapper.style.display = 'none';
    if (smartfonWrapper) smartfonWrapper.style.display = 'none';
    
    // Показываем нужную в зависимости от выбранного класса
    if (currentEntity === 'computer' && computerWrapper) {
        computerWrapper.style.display = 'block';
    } else if (currentEntity === 'smartfon' && smartfonWrapper) {
        smartfonWrapper.style.display = 'block';
    }
}

function renderConstructors() {
    const container = document.getElementById('constructorsContainer');
    if (!container) return;
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
        await fetchComputers();
        await fetchSmartfons();
        showAppropriateTable();
        updateEntityCount();
        showNotification('Все данные загружены', 'success');
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Ошибка загрузки данных');
    } finally {
        showLoading(false);
    }
}

function updateEntityCount() {
    const countSpan = document.getElementById('entityCount');
    if (countSpan) {
        const rows = document.querySelectorAll('#baseTableBody tr');
        const count = rows.length;
        countSpan.textContent = count;
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
        const response = await fetch(`${API_BASE}/computers`);
        if (!response.ok) throw new Error('Failed to fetch computers');
        const computers = await response.json();
        displayComputers(computers);
    } catch (error) {
        console.error('Error fetching computers:', error);
        displayComputers([]);
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
    if (!tbody) return;
    tbody.innerHTML = '';

    if (entities.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Нет данных</td></tr>';
        return;
    }

    entities.forEach(entity => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entity.id || '-'}</td>
            <td>${entity.name || '-'}</td>
            <td>${entity.country || '-'}</td>
            <td>${entity.enabled ? 'Да' : 'Нет'}</td>
            <td class="action-buttons">
                <button class="method-btn" onclick="callBaseMethod(${entity.id}, 'displayInfo')">displayInfo()</button>
                <button class="method-btn" onclick="callBaseMethod(${entity.id}, 'calculatePowerConsumption')">calcPower()</button>
                <button class="edit-btn" onclick="editBaseEntity(${entity.id})">✏️ Изменить</button>
                <button class="delete-btn" onclick="deleteBaseEntity(${entity.id})">Удалить</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function displayComputers(computers) {
    const tbody = document.getElementById('computerTableBody');
    if (!tbody) return;
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
            <td class="action-buttons">
                <button class="method-btn" onclick="callComputerMethod(${computer.id}, 'displayInfo')">displayInfo()</button>
                <button class="method-btn" onclick="callComputerMethod(${computer.id}, 'calculatePowerConsumption')">calcPower()</button>
                <button class="method-btn" onclick="callComputerMethod(${computer.id}, 'enabledDevice')">enabledDevice()</button>
                <button class="edit-btn" onclick="editComputer(${computer.id})">✏️ Изменить</button>
                <button class="delete-btn" onclick="deleteComputer(${computer.id})">Удалить</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function displaySmartfons(smartfons) {
    const tbody = document.getElementById('smartfonTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (smartfons.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Нет данных</td></tr>';
        return;
    }

    smartfons.forEach(smartfon => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${smartfon.id || '-'}</td>
            <td>${smartfon.technicId || smartfon.id || '-'}</td>
            <td>${smartfon.cameraMP || '-'}</td>
            <td>${smartfon.manufactures || '-'}</td>
            <td>${smartfon.isCall ? 'Да' : 'Нет'}</td>
            <td class="action-buttons">
                <button class="method-btn" onclick="callSmartfonMethod(${smartfon.id}, 'displayInfo')">displayInfo()</button>
                <button class="method-btn" onclick="callSmartfonMethod(${smartfon.id}, 'calculatePowerConsumption')">calcPower()</button>
                <button class="method-btn" onclick="callSmartfonMethod(${smartfon.id}, 'takePhoto')">takePhoto()</button>
                <button class="method-btn" onclick="callSmartfonMethod(${smartfon.id}, 'call')">call()</button>
                <button class="edit-btn" onclick="editSmartfon(${smartfon.id})">✏️ Изменить</button>
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
            }
        }
    });

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

        await loadAllData();

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

async function callBaseMethod(id, methodName) {
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/technics/${id}/call-method`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ methodName, args: [] })
        });
        const result = await response.json();

        if (result.output) {
            showNotificationWithOutput(methodName, result.output);
        } else {
            showNotification(`Метод ${methodName} выполнен: ${result.message || 'успешно'}`, 'success');
        }
    } catch (error) {
        showNotification(`Ошибка вызова ${methodName}`, 'error');
    } finally {
        showLoading(false);
    }
}

async function callComputerMethod(id, methodName) {
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/computers/${id}/call-method`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ methodName, args: [] })
        });
        const result = await response.json();

        if (result.output) {
            showNotificationWithOutput(methodName, result.output);
        } else {
            showNotification(`Метод ${methodName} выполнен: ${result.message || 'успешно'}`, 'success');
        }

        if (methodName === 'enabledDevice') {
            await refreshDataSilently(); // Обновляем без лишних уведомлений
        }
    } catch (error) {
        showNotification(`Ошибка вызова ${methodName}`, 'error');
    } finally {
        showLoading(false);
    }
}

async function callSmartfonMethod(id, methodName) {
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/smartfons/${id}/call-method`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ methodName, args: [] })
        });
        const result = await response.json();

        // Сначала показываем результат метода
        if (result.output) {
            showNotificationWithOutput(methodName, result.output);
        } else {
            showNotification(`Метод ${methodName} выполнен: ${result.message || 'успешно'}`, 'success');
        }

        // Затем обновляем данные, НО без уведомления о загрузке
        if (methodName === 'call' || methodName === 'reset') {
            // Обновляем данные без показа уведомления "Все данные загружены"
            await refreshDataSilently();
        }
    } catch (error) {
        showNotification(`Ошибка вызова ${methodName}`, 'error');
    } finally {
        showLoading(false);
    }
}

// Новая функция для тихого обновления данных (без уведомления)
async function refreshDataSilently() {
    try {
        await fetchBaseEntities();
        await fetchComputers();
        await fetchSmartfons();
        updateEntityCount();
        // Не показываем уведомление "Все данные загружены"
    } catch (error) {
        console.error('Error refreshing data:', error);
    }
}
function showNotificationWithOutput(methodName, output) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    let formattedOutput = output;
    if (typeof output === 'string' && output.includes('\n')) {
        formattedOutput = output.replace(/\n/g, '<br>');
    }
    
    notification.innerHTML = `
        <strong>${methodName}()</strong><br>
        <div style="font-family: monospace; font-size: 12px; margin-top: 8px; max-height: 200px; overflow-y: auto;">
            ${formattedOutput}
        </div>
    `;
    notification.className = `notification success show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.innerHTML = '';
        }, 300);
    }, 5000);
}

async function editBaseEntity(id) {
    const newName = prompt('Введите новое название:');
    const newCountry = prompt('Введите новую страну:');
    const newEnabled = confirm('Включено? (OK - да, Отмена - нет)');
    
    if (!newName && !newCountry && newEnabled === null) return;
    
    showLoading(true);
    try {
        const updateData = {};
        if (newName) updateData.name = newName;
        if (newCountry) updateData.country = newCountry;
        if (newEnabled !== null) updateData.enabled = newEnabled;
        
        const response = await fetch(`${API_BASE}/technics/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        if (!response.ok) throw new Error('Update failed');
        showNotification('Запись обновлена', 'success');
        await loadAllData();
    } catch (error) {
        showNotification('Ошибка обновления', 'error');
    } finally {
        showLoading(false);
    }
}

async function editComputer(id) {
    const newProcessor = prompt('Новый процессор:');
    const newRam = prompt('Новый RAM (ГБ):');
    if (!newProcessor && !newRam) return;
    
    showLoading(true);
    try {
        const updateData = {};
        if (newProcessor) updateData.modelProcessor = newProcessor;
        if (newRam) updateData.ram = parseInt(newRam);
        
        const response = await fetch(`${API_BASE}/computers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        if (!response.ok) throw new Error('Update failed');
        showNotification('Компьютер обновлён', 'success');
        await loadAllData();
    } catch (error) {
        showNotification('Ошибка обновления', 'error');
    } finally {
        showLoading(false);
    }
}

async function editSmartfon(id) {
    const newCamera = prompt('Новое значение камеры (МП):');
    const newManufacturer = prompt('Новый производитель:');
    const newIsCall = confirm('Статус звонка? (OK - true, Отмена - false)');

    if (!newCamera && !newManufacturer && newIsCall === null) return;

    showLoading(true);
    try {
        const updateData = {};
        if (newCamera) updateData.cameraMP = parseInt(newCamera);
        if (newManufacturer) updateData.manufactures = newManufacturer;
        if (newIsCall !== null) updateData.isCall = newIsCall;

        const response = await fetch(`${API_BASE}/smartfons/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        if (!response.ok) throw new Error('Update failed');
        showNotification('Смартфон обновлён', 'success');
        await loadAllData();
    } catch (error) {
        showNotification('Ошибка обновления', 'error');
    } finally {
        showLoading(false);
    }
}

async function refreshAllData() {
    await loadAllData();
}

function showLoading(show) {
    const loader = document.getElementById('loadingIndicator');
    if (loader) {
        loader.style.display = show ? 'block' : 'none';
    }
}

function showError(message) {
    const errorMsg = document.getElementById('errorMessage');
    if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        
        setTimeout(() => {
            errorMsg.style.display = 'none';
        }, 5000);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setTimeout(() => showAppropriateTable(), 100);
});

// Глобальные функции
window.createEntity = createEntity;
window.deleteBaseEntity = deleteBaseEntity;
window.deleteComputer = deleteComputer;
window.deleteSmartfon = deleteSmartfon;
window.callBaseMethod = callBaseMethod;
window.callComputerMethod = callComputerMethod;
window.callSmartfonMethod = callSmartfonMethod;
window.editBaseEntity = editBaseEntity;
window.editComputer = editComputer;
window.editSmartfon = editSmartfon;
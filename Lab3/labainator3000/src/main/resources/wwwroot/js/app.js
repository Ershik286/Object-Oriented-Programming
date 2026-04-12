const API_URL = 'http://localhost:8080';
const API_BASE = `${API_URL}/api`;

let currentTab = 'shop';
let shops = [];

// Конфигурация конструкторов для Computer (3 конструктора)
const computerConstructors = [
    {
        name: 'Конструктор 1: По умолчанию',
        description: 'Computer() - процессор Intel Core i5, RAM 8 ГБ',
        fields: [],
        endpoint: '/default'
    },
    {
        name: 'Конструктор 2: С процессором и RAM',
        description: 'Computer(name, modelProcessor, ram) + выбор магазина',
        fields: [
            { name: 'name', label: 'Название', type: 'text', required: true },
            { name: 'modelProcessor', label: 'Процессор', type: 'text', required: true },
            { name: 'ram', label: 'RAM (ГБ)', type: 'number', required: true, min: 1 }
        ],
        endpoint: '/create'
    },
    {
        name: 'Конструктор 3: Полный',
        description: 'Computer(name, country, enabled, modelProcessor, ram) + выбор магазина',
        fields: [
            { name: 'name', label: 'Название', type: 'text', required: true },
            { name: 'country', label: 'Страна', type: 'text', required: true },
            { name: 'enabled', label: 'Включен', type: 'checkbox' },
            { name: 'modelProcessor', label: 'Процессор', type: 'text', required: true },
            { name: 'ram', label: 'RAM (ГБ)', type: 'number', required: true, min: 1 }
        ],
        endpoint: '/create-full'
    }
];

// Конфигурация конструкторов для Smartfon (3 конструктора)
const smartfonConstructors = [
    {
        name: 'Конструктор 1: По умолчанию',
        description: 'Smartfon() - камера 12МП, производитель Samsung',
        fields: [],
        endpoint: '/default'
    },
    {
        name: 'Конструктор 2: С камерой',
        description: 'Smartfon(name, cameraMP, manufactures) + выбор магазина',
        fields: [
            { name: 'name', label: 'Название', type: 'text', required: true },
            { name: 'cameraMP', label: 'Камера (МП)', type: 'number', required: true, min: 1 },
            { name: 'manufactures', label: 'Производитель', type: 'text', required: true }
        ],
        endpoint: '/create'
    },
    {
        name: 'Конструктор 3: Полный',
        description: 'Smartfon(name, country, enabled, cameraMP, isCall, manufactures) + выбор магазина',
        fields: [
            { name: 'name', label: 'Название', type: 'text', required: true },
            { name: 'country', label: 'Страна', type: 'text', required: true },
            { name: 'enabled', label: 'Включен', type: 'checkbox' },
            { name: 'cameraMP', label: 'Камера (МП)', type: 'number', required: true, min: 1 },
            { name: 'isCall', label: 'Звонок', type: 'checkbox' },
            { name: 'manufactures', label: 'Производитель', type: 'text', required: true }
        ],
        endpoint: '/create-full'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    document.getElementById('refreshBtn')?.addEventListener('click', () => loadAllData());
    document.getElementById('createShopBtn')?.addEventListener('click', () => createShop());
    await loadAllData();
    renderComputerConstructors();
    renderSmartfonConstructors();
}

function switchTab(tabId) {
    currentTab = tabId;
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabId}Tab`);
    });
}

async function loadAllData() {
    showLoading(true);
    try {
        await Promise.all([
            loadShops(),
            loadBaseEntities(),
            loadComputers(),
            loadSmartfons()
        ]);
        showNotification('Все данные загружены', 'success');
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Ошибка загрузки данных');
    } finally {
        showLoading(false);
    }
}

// ============ МАГАЗИНЫ ============
async function loadShops() {
    try {
        const response = await fetch(`${API_BASE}/shop/all`);
        if (!response.ok) throw new Error('Failed to fetch shops');
        shops = await response.json();
        displayShops();
        document.getElementById('shopCount').textContent = shops.length;
        // Обновляем конструкторы после загрузки магазинов
        renderComputerConstructors();
        renderSmartfonConstructors();
    } catch (error) {
        console.error('Error loading shops:', error);
    }
}

function displayShops() {
    const grid = document.getElementById('shopsGrid');
    if (!grid) return;
    if (shops.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 40px;">Нет созданных магазинов</div>';
        return;
    }
    grid.innerHTML = shops.map(shop => `
        <div class="shop-card">
            <h4>🏪 ${shop.name || 'Без названия'}</h4>
            <p>ID: ${shop.id} | Техники: ${shop.saleTechnic?.length || 0} шт.</p>
            <div class="shop-card-buttons">
                <button class="btn btn-sm btn-warning" onclick="editShop(${shop.id}, '${shop.name}')">✏️ Редактировать</button>
                <button class="btn btn-sm btn-danger" onclick="deleteShop(${shop.id})">🗑️ Удалить</button>
            </div>
        </div>
    `).join('');
}

async function createShop() {
    const nameInput = document.getElementById('shopNameInput');
    const name = nameInput.value.trim();
    if (!name) {
        showNotification('Введите название магазина', 'error');
        return;
    }
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/shop/create?name=${encodeURIComponent(name)}`, { method: 'POST' });
        if (!response.ok) throw new Error('Failed to create shop');
        showNotification(`Магазин "${name}" создан`, 'success');
        nameInput.value = '';
        await loadShops();
    } catch (error) {
        showNotification('Ошибка создания магазина', 'error');
    } finally {
        showLoading(false);
    }
}

async function editShop(id, currentName) {
    const newName = prompt('Введите новое название магазина:', currentName);
    if (!newName || newName === currentName) return;
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/shop/${id}?name=${encodeURIComponent(newName)}`, { method: 'PUT' });
        if (!response.ok) throw new Error('Failed to update shop');
        showNotification('Магазин обновлен', 'success');
        await loadShops();
    } catch (error) {
        showNotification('Ошибка обновления магазина', 'error');
    } finally {
        showLoading(false);
    }
}

async function deleteShop(id) {
    if (!confirm('Удалить магазин? Вся техника в нем также будет удалена!')) return;
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/shop/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete shop');
        showNotification('Магазин удален', 'success');
        await loadAllData();
    } catch (error) {
        showNotification('Ошибка удаления магазина', 'error');
    } finally {
        showLoading(false);
    }
}

// ============ ТЕХНИКА (БАЗОВАЯ) ============
async function loadBaseEntities() {
    try {
        const response = await fetch(`${API_BASE}/technic`);
        if (!response.ok) throw new Error('Failed to fetch base entities');
        const entities = await response.json();
        displayBaseEntities(entities);
        document.getElementById('entityCount').textContent = entities.length;
    } catch (error) {
        console.error('Error loading base entities:', error);
    }
}

function displayBaseEntities(entities) {
    const tbody = document.getElementById('baseTableBody');
    if (!tbody) return;
    if (entities.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Нет данных</td></tr>';
        return;
    }
    tbody.innerHTML = entities.map(entity => `
        <tr>
            <td>${entity.id || '-'}</td>
            <td>${entity.name || '-'}</td>
            <td>${entity.country || '-'}</td>
            <td>${entity.enabled ? '✅ Да' : '❌ Нет'}</td>
            <td>${entity.shop?.name || '—'}</td>
            <td class="action-buttons">
                <button class="method-btn" onclick="callMethod('technic', ${entity.id}, 'displayInfo')">displayInfo()</button>
                <button class="method-btn" onclick="callMethod('technic', ${entity.id}, 'calculatePowerConsumption')">calcPower()</button>
                <button class="delete-btn" onclick="deleteBaseEntity(${entity.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

async function deleteBaseEntity(id) {
    if (!confirm('Удалить запись?')) return;
    try {
        const response = await fetch(`${API_BASE}/technic/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete');
        showNotification('Запись удалена', 'success');
        await loadAllData();
    } catch (error) {
        showNotification('Ошибка удаления', 'error');
    }
}

// ============ КОМПЬЮТЕРЫ ============
async function loadComputers() {
    try {
        const response = await fetch(`${API_BASE}/computer`);
        if (!response.ok) throw new Error('Failed to fetch computers');
        const computers = await response.json();
        displayComputers(computers);
    } catch (error) {
        console.error('Error loading computers:', error);
    }
}

function displayComputers(computers) {
    const tbody = document.getElementById('computerTableBody');
    if (!tbody) return;
    if (!computers || computers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Нет данных</td></tr>';
        return;
    }

    tbody.innerHTML = computers.map(comp => `
        <tr>
            <td>${comp.id || '-'}</td>
            <td>${comp.name || comp.technicName || '-'}</td>
            <td>${comp.modelProcessor || '-'}</td>
            <td>${comp.ram || '-'}</td>
            <td>${comp.shopName || '—'}</td>
            <td class="action-buttons">
                <button class="method-btn" onclick="callMethod('computer', ${comp.id}, 'displayInfo')">displayInfo()</button>
                <button class="method-btn" onclick="callMethod('computer', ${comp.id}, 'calculatePowerConsumption')">calcPower()</button>
                <button class="method-btn" onclick="callMethod('computer', ${comp.id}, 'enabledDevice')">enabledDevice()</button>
                <button class="delete-btn" onclick="deleteComputer(${comp.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

async function deleteComputer(id) {
    if (!confirm('Удалить компьютер?')) return;
    try {
        const response = await fetch(`${API_BASE}/computer/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete');
        showNotification('Компьютер удален', 'success');
        await loadAllData();
    } catch (error) {
        showNotification('Ошибка удаления', 'error');
    }
}

// ============ СМАРТФОНЫ ============
async function loadSmartfons() {
    try {
        const response = await fetch(`${API_BASE}/smartfon`);
        if (!response.ok) throw new Error('Failed to fetch smartfons');
        const smartfons = await response.json();
        displaySmartfons(smartfons);
    } catch (error) {
        console.error('Error loading smartfons:', error);
    }
}

function displaySmartfons(smartfons) {
    const tbody = document.getElementById('smartfonTableBody');
    if (!tbody) return;
    if (!smartfons || smartfons.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Нет данных</td></tr>';
        return;
    }

    tbody.innerHTML = smartfons.map(sf => `
        <tr>
            <td>${sf.id || '-'}</td>
            <td>${sf.name || sf.technicName || '-'}</td>
            <td>${sf.cameraMP || '-'}</td>
            <td>${sf.manufactures || '-'}</td>
            <td>${sf.isCall ? '📞 Да' : '🔇 Нет'}</td>
            <td>${sf.shopName || '—'}</td>
            <td class="action-buttons">
                <button class="method-btn" onclick="callMethod('smartfon', ${sf.id}, 'displayInfo')">displayInfo()</button>
                <button class="method-btn" onclick="callMethod('smartfon', ${sf.id}, 'calculatePowerConsumption')">calcPower()</button>
                <button class="method-btn" onclick="callMethod('smartfon', ${sf.id}, 'takePhoto')">takePhoto()</button>
                <button class="method-btn" onclick="callMethod('smartfon', ${sf.id}, 'call')">call()</button>
                <button class="delete-btn" onclick="deleteSmartfon(${sf.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

async function deleteSmartfon(id) {
    if (!confirm('Удалить смартфон?')) return;
    try {
        const response = await fetch(`${API_BASE}/smartfon/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete');
        showNotification('Смартфон удален', 'success');
        await loadAllData();
    } catch (error) {
        showNotification('Ошибка удаления', 'error');
    }
}

// ============ ВЫЗОВ МЕТОДОВ ============
async function callMethod(type, id, methodName) {
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/${type}/${id}/call-method`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ methodName, args: [] })
        });
        const result = await response.json();
        if (result.message) {
            showNotificationWithOutput(methodName, result.message);
        } else {
            showNotification(`Метод ${methodName} выполнен`, 'success');
        }
        await loadAllData();
    } catch (error) {
        showNotification(`Ошибка вызова ${methodName}`, 'error');
    } finally {
        showLoading(false);
    }
}

// ============ КОНСТРУКТОРЫ ============
function renderComputerConstructors() {
    const container = document.getElementById('computerConstructorsContainer');
    if (!container) return;

    container.innerHTML = computerConstructors.map((constructor, idx) => `
        <div class="constructor-card">
            <h4>${constructor.name}</h4>
            <p class="constructor-desc">${constructor.description}</p>
            <div class="constructor-fields">
                ${renderFieldsForComputer(constructor.fields, idx)}
                <div class="field-group">
                    <label>Выбрать магазин:</label>
                    <select id="shop_select_computer_${idx}" class="shop-select">
                        <option value="">-- Выберите магазин --</option>
                        ${shops.map(shop => `<option value="${shop.id}">${shop.name} (ID: ${shop.id})</option>`).join('')}
                    </select>
                </div>
            </div>
            <button class="btn btn-primary" onclick="createComputer(${idx})">Создать</button>
        </div>
    `).join('');
}

function renderSmartfonConstructors() {
    const container = document.getElementById('smartfonConstructorsContainer');
    if (!container) return;

    container.innerHTML = smartfonConstructors.map((constructor, idx) => `
        <div class="constructor-card">
            <h4>${constructor.name}</h4>
            <p class="constructor-desc">${constructor.description}</p>
            <div class="constructor-fields">
                ${renderFieldsForSmartfon(constructor.fields, idx)}
                <div class="field-group">
                    <label>Выбрать магазин:</label>
                    <select id="shop_select_smartfon_${idx}" class="shop-select">
                        <option value="">-- Выберите магазин --</option>
                        ${shops.map(shop => `<option value="${shop.id}">${shop.name} (ID: ${shop.id})</option>`).join('')}
                    </select>
                </div>
            </div>
            <button class="btn btn-primary" onclick="createSmartfon(${idx})">Создать</button>
        </div>
    `).join('');
}

function renderFieldsForComputer(fields, idx) {
    if (fields.length === 0) return '<p style="color: #999;">Без параметров</p>';
    return fields.map(field => {
        if (field.type === 'checkbox') {
            return `<div class="field-group checkbox"><label>${field.label}:</label><input type="checkbox" id="${field.name}_computer_${idx}"></div>`;
        }
        return `<div class="field-group"><label>${field.label}:</label><input type="${field.type}" id="${field.name}_computer_${idx}" ${field.min ? `min="${field.min}"` : ''} ${field.required ? 'required' : ''}></div>`;
    }).join('');
}

function renderFieldsForSmartfon(fields, idx) {
    if (fields.length === 0) return '<p style="color: #999;">Без параметров</p>';
    return fields.map(field => {
        if (field.type === 'checkbox') {
            return `<div class="field-group checkbox"><label>${field.label}:</label><input type="checkbox" id="${field.name}_smartfon_${idx}"></div>`;
        }
        return `<div class="field-group"><label>${field.label}:</label><input type="${field.type}" id="${field.name}_smartfon_${idx}" ${field.min ? `min="${field.min}"` : ''} ${field.required ? 'required' : ''}></div>`;
    }).join('');
}

async function createComputer(constructorIdx) {
    const constructor = computerConstructors[constructorIdx];
    const data = {};

    for (const field of constructor.fields) {
        const input = document.getElementById(`${field.name}_computer_${constructorIdx}`);
        if (input) {
            if (field.type === 'checkbox') {
                data[field.name] = input.checked;
            } else {
                const value = input.value.trim();
                if (value) data[field.name] = field.type === 'number' ? parseInt(value) : value;
            }
        }
    }

    const shopSelect = document.getElementById(`shop_select_computer_${constructorIdx}`);
    if (shopSelect && shopSelect.value) {
        data.shopId = parseInt(shopSelect.value);
    }

    showLoading(true);
    try {
        const url = `${API_BASE}/computer${constructor.endpoint}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create computer');
        showNotification('Компьютер создан', 'success');
        await loadAllData();

        for (const field of constructor.fields) {
            const input = document.getElementById(`${field.name}_computer_${constructorIdx}`);
            if (input) {
                if (field.type === 'checkbox') input.checked = false;
                else input.value = '';
            }
        }
        if (shopSelect) shopSelect.value = '';
    } catch (error) {
        showNotification('Ошибка создания компьютера', 'error');
    } finally {
        showLoading(false);
    }
}

async function createSmartfon(constructorIdx) {
    const constructor = smartfonConstructors[constructorIdx];
    const data = {};

    for (const field of constructor.fields) {
        const input = document.getElementById(`${field.name}_smartfon_${constructorIdx}`);
        if (input) {
            if (field.type === 'checkbox') {
                data[field.name] = input.checked;
            } else {
                const value = input.value.trim();
                if (value) data[field.name] = field.type === 'number' ? parseInt(value) : value;
            }
        }
    }

    const shopSelect = document.getElementById(`shop_select_smartfon_${constructorIdx}`);
    if (shopSelect && shopSelect.value) {
        data.shopId = parseInt(shopSelect.value);
    }

    showLoading(true);
    try {
        const url = `${API_BASE}/smartfon${constructor.endpoint}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create smartfon');
        showNotification('Смартфон создан', 'success');
        await loadAllData();

        for (const field of constructor.fields) {
            const input = document.getElementById(`${field.name}_smartfon_${constructorIdx}`);
            if (input) {
                if (field.type === 'checkbox') input.checked = false;
                else input.value = '';
            }
        }
        if (shopSelect) shopSelect.value = '';
    } catch (error) {
        showNotification('Ошибка создания смартфона', 'error');
    } finally {
        showLoading(false);
    }
}

// ============ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ============
function showLoading(show) {
    const loader = document.getElementById('loadingIndicator');
    if (loader) loader.style.display = show ? 'block' : 'none';
}

function showError(message) {
    const errorMsg = document.getElementById('errorMessage');
    if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        setTimeout(() => errorMsg.style.display = 'none', 5000);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        setTimeout(() => notification.classList.remove('show'), 3000);
    }
}

function showNotificationWithOutput(methodName, output) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    notification.innerHTML = `<strong>${methodName}()</strong><br><div style="font-family: monospace; font-size: 12px; margin-top: 8px; max-height: 200px; overflow-y: auto;">${output.replace(/\n/g, '<br>')}</div>`;
    notification.className = 'notification success show';
    setTimeout(() => notification.classList.remove('show'), 5000);
}

// Глобальные функции
window.callMethod = callMethod;
window.deleteBaseEntity = deleteBaseEntity;
window.deleteComputer = deleteComputer;
window.deleteSmartfon = deleteSmartfon;
window.editShop = editShop;
window.deleteShop = deleteShop;
window.createComputer = createComputer;
window.createSmartfon = createSmartfon;
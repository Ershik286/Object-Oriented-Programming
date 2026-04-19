const API_URL = 'http://localhost:8080';
const API_BASE = `${API_URL}/api`;

let currentTab = 'shop';
let shops = [];
let notificationTimeout = null;

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
        showNotification('Все данные загружены', 'success', false);
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
            <h4>🏪 ${escapeHtml(shop.name || 'Без названия')}</h4>
            <p>ID: ${shop.id} | Техники: ${shop.saleTechnic?.length || 0} шт.</p>
            <div class="shop-card-buttons">
                <button class="btn btn-sm btn-warning" onclick="editShop(${shop.id}, '${escapeHtml(shop.name)}')">✏️ Редактировать</button>
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
            <td>${escapeHtml(entity.name || '-')}</td>
            <td>${escapeHtml(entity.country || '-')}</td>
            <td>${entity.enabled ? '✅ Да' : '❌ Нет'}</td>
            <td>${escapeHtml(entity.shopName || '—')}</td>
            <td class="action-buttons">
                <button class="method-btn" onclick="callMethod('technic', ${entity.id}, 'displayInfo')">📄 Показать информацию</button>
                <button class="method-btn" onclick="callMethod('technic', ${entity.id}, 'calculatePowerConsumption')">⚡ Расчёт энергии</button>
                <button class="method-btn" onclick="callMethod('technic', ${entity.id}, 'switchDevice')">🔌 Включить/Выключить</button>
                <button class="delete-btn" onclick="deleteBaseEntity(${entity.id})">🗑️ Удалить</button>
                <button class="edit-btn" onclick='showEditTechnicModal(${entity.id}, "${escapeHtml(entity.name || '')}", "${escapeHtml(entity.country || '')}", ${entity.enabled}, ${entity.shopId || 'null'})'>✏️ Изменить</button>
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
            <td>${escapeHtml(comp.name || comp.technicName || '-')}</td>
            <td>${escapeHtml(comp.modelProcessor || '-')}</td>
            <td>${comp.ram || '-'}</td>
            <td class="action-buttons">
                <button class="method-btn" onclick="callMethod('computer', ${comp.id}, 'displayInfo')">📄 Показать информацию</button>
                <button class="method-btn" onclick="callMethod('computer', ${comp.id}, 'calculatePowerConsumption')">⚡ Расчёт энергии</button>
                <button class="method-btn" onclick="callMethod('computer', ${comp.id}, 'switchDevice')">🔌 Включить/Выключить</button>
                <button class="method-btn" onclick="showUpgradeProcessorModal(${comp.id})">🔄 Обновить процессор</button>
                <button class="method-btn" onclick="showChangeRamModal(${comp.id})">💾 Изменить RAM</button>
                <button class="delete-btn" onclick="deleteComputer(${comp.id})">🗑️ Удалить</button>
                <button class="edit-btn" onclick='editComputerById(${comp.id})'>✏️ Изменить</button>
            </td>
        </tr>
    `).join('');
}

// Модальные окна для методов компьютера
function showUpgradeProcessorModal(id) {
    const modal = document.createElement('div');
    modal.id = 'inputModal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 10000;
        width: 350px;
        max-width: 90%;
        display: flex;
        flex-direction: column;
        animation: modalSlideIn 0.3s ease-out;
    `;

    modal.innerHTML = `
        <div style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); color: white; padding: 15px 20px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 18px;">🔄 Обновление процессора</strong>
            <button onclick="closeInputModal()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        <div style="padding: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: bold;">Новая модель процессора:</label>
            <input type="text" id="newProcessorInput" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" placeholder="Например: Intel Core i9">
        </div>
        <div style="padding: 12px 20px; border-top: 1px solid #e0e0e0; text-align: right;">
            <button onclick="closeInputModal()" style="background: #999; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-right: 8px;">Отмена</button>
            <button onclick="upgradeProcessor(${id})" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Обновить</button>
        </div>
    `;

    const overlay = createOverlay();
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

function showChangeRamModal(id) {
    const modal = document.createElement('div');
    modal.id = 'inputModal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 10000;
        width: 350px;
        max-width: 90%;
        display: flex;
        flex-direction: column;
        animation: modalSlideIn 0.3s ease-out;
    `;

    modal.innerHTML = `
        <div style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); color: white; padding: 15px 20px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 18px;">💾 Изменение RAM</strong>
            <button onclick="closeInputModal()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        <div style="padding: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: bold;">Новый объем RAM (ГБ):</label>
            <input type="number" id="newRamInput" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" placeholder="16" min="1">
        </div>
        <div style="padding: 12px 20px; border-top: 1px solid #e0e0e0; text-align: right;">
            <button onclick="closeInputModal()" style="background: #999; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-right: 8px;">Отмена</button>
            <button onclick="changeRam(${id})" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Изменить</button>
        </div>
    `;

    const overlay = createOverlay();
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'inputModalOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
        animation: overlayFadeIn 0.3s ease-out;
    `;
    overlay.onclick = closeInputModal;
    return overlay;
}

function closeInputModal() {
    const modal = document.getElementById('inputModal');
    const overlay = document.getElementById('inputModalOverlay');
    if (modal) modal.remove();
    if (overlay) overlay.remove();
}

async function upgradeProcessor(id) {
    const input = document.getElementById('newProcessorInput');
    const newProcessor = input?.value.trim();

    if (!newProcessor) {
        showNotification('Введите модель процессора!', 'error');
        return;
    }

    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/computer/call_method/upgradeProcessor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                newProcessor: newProcessor,
                methodInfo: { methodName: 'upgradeProcessor', args: [] }
            })
        });
        const result = await response.json();

        closeInputModal();

        if (result.status === 'success') {
            showNotificationWithOutput('Обновление процессора', result.message);
            await loadAllData();
        } else {
            showNotification(result.message || 'Ошибка обновления', 'error');
        }
    } catch (error) {
        showNotification('Ошибка при обновлении процессора', 'error');
    } finally {
        showLoading(false);
    }
}

async function changeRam(id) {
    const input = document.getElementById('newRamInput');
    const newRam = parseInt(input?.value);

    if (!newRam || newRam < 1) {
        showNotification('Введите корректный объем RAM (не менее 1 ГБ)!', 'error');
        return;
    }

    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/computer/call_method/changeRam`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                newRam: newRam,
                methodInfo: { methodName: 'changeRam', args: [] }
            })
        });
        const result = await response.json();

        closeInputModal();

        if (result.status === 'success') {
            showNotificationWithOutput('Изменение RAM', result.message);
            await loadAllData();
        } else {
            showNotification(result.message || 'Ошибка изменения RAM', 'error');
        }
    } catch (error) {
        showNotification('Ошибка при изменении RAM', 'error');
    } finally {
        showLoading(false);
    }
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
            <td>${escapeHtml(sf.name || sf.technicName || '-')}</td>
            <td>${sf.cameraMP || '-'}</td>
            <td>${escapeHtml(sf.manufactures || '-')}</td>
            <td>${sf.isCall ? '📞 Да' : '🔇 Нет'}</td>
            <td class="action-buttons">
                <button class="method-btn" onclick="callMethod('smartfon', ${sf.id}, 'displayInfo')">📄 Показать информацию</button>
                <button class="method-btn" onclick="callMethod('smartfon', ${sf.id}, 'calculatePowerConsumption')">⚡ Расчёт энергии</button>
                <button class="method-btn" onclick="callMethod('smartfon', ${sf.id}, 'switchDevice')">🔌 Включить/Выключить</button>
                <button class="method-btn" onclick="callMethod('smartfon', ${sf.id}, 'takePhoto')">📷 Сделать фото</button>
                <button class="method-btn" onclick="callMethod('smartfon', ${sf.id}, 'call')">📞 Позвонить</button>
                <button class="method-btn" onclick="callMethod('smartfon', ${sf.id}, 'reset')">🔇 Сбросить звонок</button>
                <button class="delete-btn" onclick="deleteSmartfon(${sf.id})">🗑️ Удалить</button>
                <button class="edit-btn" onclick="editSmartfonById(${sf.id})">✏️ Изменить</button>
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
        const response = await fetch(`${API_BASE}/${type}/call_method`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                methodInfo: { methodName: methodName, args: [] }
            })
        });
        const result = await response.json();

        console.log('Response from server:', result);

        if (methodName === 'displayInfo') {
            if (result.data) {
                showDisplayInfoResult(getRussianMethodName(methodName), result.data);
            } else {
                showNotificationWithOutput(getRussianMethodName(methodName), result.message || 'Нет данных');
            }
        } else if (methodName === 'calculatePowerConsumption') {
            if (result.data !== undefined) {
                showNotificationWithOutput(getRussianMethodName(methodName), `⚡ Энергопотребление: ${result.data} Вт`);
            } else {
                showNotificationWithOutput(getRussianMethodName(methodName), result.message || 'Расчёт выполнен');
            }
        } else if (methodName === 'switchDevice') {
            showNotification(getRussianMethodName(methodName) + ': ' + (result.message || 'Выполнено'), 'success');
            await loadAllData();
        } else if (methodName === 'takePhoto') {
            showNotificationWithOutput(getRussianMethodName(methodName), result.message || 'Фото сделано');
        } else if (methodName === 'call') {
            showNotificationWithOutput(getRussianMethodName(methodName), result.message || 'Звонок начат');
            await loadAllData();
        } else if (methodName === 'reset') {
            showNotificationWithOutput(getRussianMethodName(methodName), result.message || 'Звонок сброшен');
            await loadAllData();
        } else {
            showNotificationWithOutput(getRussianMethodName(methodName), result.message || 'Метод выполнен');
        }

    } catch (error) {
        console.error('Error:', error);
        showNotification(`Ошибка вызова ${methodName}`, 'error');
    } finally {
        showLoading(false);
    }
}

function showDisplayInfoResult(methodName, data) {
    const notification = document.getElementById('notification');
    if (!notification) return;

    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }

    let formattedHtml = `<strong>${methodName}</strong><br><div style="margin-top: 8px;">`;

    const fieldNames = {
        'modelProcessor': '🖥️ Процессор',
        'ram': '💾 RAM (ГБ)',
        'name': '📛 Название',
        'country': '🌍 Страна',
        'enabled': '🔌 Включен',
        'cameraMP': '📷 Камера (МП)',
        'manufactures': '🏭 Производитель',
        'isCall': '📞 Звонок',
        'id': '🆔 ID'
    };

    const excludedFields = ['status', 'type'];
    const order = ['name', 'country', 'enabled', 'modelProcessor', 'ram', 'cameraMP', 'manufactures', 'isCall', 'id'];

    let hasData = false;

    for (const key of order) {
        if (data.hasOwnProperty(key) && data[key] !== undefined && data[key] !== null) {
            hasData = true;
            const label = fieldNames[key] || key;
            let displayValue = data[key];
            if (typeof displayValue === 'boolean') {
                displayValue = displayValue ? '✅ Да' : '❌ Нет';
            }
            if (key === 'ram' && typeof displayValue === 'number') {
                displayValue = `${displayValue} ГБ`;
            }
            if (key === 'cameraMP' && typeof displayValue === 'number') {
                displayValue = `${displayValue} МП`;
            }
            formattedHtml += `
                <div style="margin: 8px 0; padding: 5px 0; border-bottom: 1px solid #eee;">
                    <span style="font-weight: bold;">${label}:</span> 
                    <span>${escapeHtml(String(displayValue))}</span>
                </div>
            `;
        }
    }

    for (const [key, value] of Object.entries(data)) {
        if (excludedFields.includes(key)) continue;
        if (order.includes(key)) continue;
        if (value === undefined || value === null) continue;
        hasData = true;
        const label = fieldNames[key] || key;
        let displayValue = value;
        if (typeof displayValue === 'boolean') {
            displayValue = displayValue ? '✅ Да' : '❌ Нет';
        }
        formattedHtml += `
            <div style="margin: 8px 0; padding: 5px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold;">${label}:</span> 
                <span>${escapeHtml(String(displayValue))}</span>
            </div>
        `;
    }

    if (!hasData) {
        formattedHtml += `<div style="color: #999;">Нет данных для отображения</div>`;
    }

    formattedHtml += `</div>`;

    notification.innerHTML = formattedHtml;
    notification.className = 'notification success show';

    notificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.innerHTML = '';
        }, 300);
        notificationTimeout = null;
    }, 8000);
}

function getRussianMethodName(methodName) {
    const names = {
        'displayInfo': 'Показать информацию',
        'calculatePowerConsumption': 'Расчёт энергопотребления',
        'switchDevice': 'Включение/выключение устройства',
        'enabledDevice': 'Включение устройства',
        'takePhoto': 'Сделать фото',
        'call': 'Звонок',
        'reset': 'Сброс звонка'
    };
    return names[methodName] || methodName;
}

// ============ КОНСТРУКТОРЫ ============
function renderComputerConstructors() {
    const container = document.getElementById('computerConstructorsContainer');
    if (!container) return;

    container.innerHTML = computerConstructors.map((constructor, idx) => {
        const isDefault = constructor.endpoint === '/default';
        return `
            <div class="constructor-card">
                <h4>${constructor.name}</h4>
                <p class="constructor-desc">${constructor.description}</p>
                <div class="constructor-fields">
                    ${renderFieldsForComputer(constructor.fields, idx)}
                    ${!isDefault ? `
                        <div class="field-group">
                            <label>Выбрать магазин:</label>
                            <select id="shop_select_computer_${idx}" class="shop-select">
                                <option value="">-- Выберите магазин --</option>
                                ${shops.map(shop => `<option value="${shop.id}">${escapeHtml(shop.name)} (ID: ${shop.id})</option>`).join('')}
                            </select>
                        </div>
                    ` : ''}
                </div>
                <button class="btn btn-primary" onclick="createComputer(${idx})">Создать</button>
            </div>
        `;
    }).join('');
}

function renderSmartfonConstructors() {
    const container = document.getElementById('smartfonConstructorsContainer');
    if (!container) return;

    container.innerHTML = smartfonConstructors.map((constructor, idx) => {
        const isDefault = constructor.endpoint === '/default';
        return `
            <div class="constructor-card">
                <h4>${constructor.name}</h4>
                <p class="constructor-desc">${constructor.description}</p>
                <div class="constructor-fields">
                    ${renderFieldsForSmartfon(constructor.fields, idx)}
                    ${!isDefault ? `
                        <div class="field-group">
                            <label>Выбрать магазин:</label>
                            <select id="shop_select_smartfon_${idx}" class="shop-select">
                                <option value="">-- Выберите магазин --</option>
                                ${shops.map(shop => `<option value="${shop.id}">${escapeHtml(shop.name)} (ID: ${shop.id})</option>`).join('')}
                            </select>
                        </div>
                    ` : ''}
                </div>
                <button class="btn btn-primary" onclick="createSmartfon(${idx})">Создать</button>
            </div>
        `;
    }).join('');
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

    if (constructorIdx !== 0) {
        const shopSelect = document.getElementById(`shop_select_computer_${constructorIdx}`);
        if (shopSelect && shopSelect.value) {
            data.shopId = parseInt(shopSelect.value);
        } else {
            showNotification('Выберите магазин!', 'error');
            return;
        }
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
        if (constructorIdx !== 0) {
            const shopSelect = document.getElementById(`shop_select_computer_${constructorIdx}`);
            if (shopSelect) shopSelect.value = '';
        }
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

    if (constructorIdx !== 0) {
        const shopSelect = document.getElementById(`shop_select_smartfon_${constructorIdx}`);
        if (shopSelect && shopSelect.value) {
            data.shopId = parseInt(shopSelect.value);
        } else {
            showNotification('Выберите магазин!', 'error');
            return;
        }
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
        if (constructorIdx !== 0) {
            const shopSelect = document.getElementById(`shop_select_smartfon_${constructorIdx}`);
            if (shopSelect) shopSelect.value = '';
        }
    } catch (error) {
        showNotification('Ошибка создания смартфона', 'error');
    } finally {
        showLoading(false);
    }
}

// ============ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ============
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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

function showNotification(message, type = 'info', isMethodResult = true) {
    const notification = document.getElementById('notification');
    if (!notification) return;

    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }

    notification.textContent = message;
    notification.className = `notification ${type} show`;

    const duration = isMethodResult ? 5000 : 3000;
    notificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
        notificationTimeout = null;
    }, duration);
}

function showNotificationWithOutput(methodName, output) {
    const notification = document.getElementById('notification');
    if (!notification) return;

    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }

    let formattedOutput = output;
    if (typeof output === 'string' && output.includes('\n')) {
        formattedOutput = output.replace(/\n/g, '<br>');
    }

    notification.innerHTML = `
        <strong>${methodName}</strong><br>
        <div style="font-family: monospace; font-size: 12px; margin-top: 8px; max-height: 200px; overflow-y: auto;">
            ${formattedOutput}
        </div>
    `;
    notification.className = 'notification success show';

    notificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.innerHTML = '';
        }, 300);
        notificationTimeout = null;
    }, 5000);
}

//EDIT

// Редактирование базовой техники
function showEditTechnicModal(id, currentName, currentCountry, currentEnabled, currentShopId) {
    const modal = document.createElement('div');
    modal.id = 'editModal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 10000;
        width: 400px;
        max-width: 90%;
        display: flex;
        flex-direction: column;
        animation: modalSlideIn 0.3s ease-out;
    `;

    modal.innerHTML = `
        <div style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); color: white; padding: 15px 20px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 18px;">✏️ Редактирование техники</strong>
            <button onclick="closeEditModal()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        <div style="padding: 20px;">
            <div class="field-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Название:</label>
                <input type="text" id="edit_name" value="${escapeHtml(currentName)}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div class="field-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Страна:</label>
                <input type="text" id="edit_country" value="${escapeHtml(currentCountry)}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div class="field-group checkbox" style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="edit_enabled" ${currentEnabled ? 'checked' : ''}> Включен
                </label>
            </div>
            <div class="field-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Магазин:</label>
                <select id="edit_shopId" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <option value="">-- Без магазина --</option>
                    ${shops.map(shop => `<option value="${shop.id}" ${currentShopId == shop.id ? 'selected' : ''}>${escapeHtml(shop.name)} (ID: ${shop.id})</option>`).join('')}
                </select>
            </div>
        </div>
        <div style="padding: 12px 20px; border-top: 1px solid #e0e0e0; text-align: right;">
            <button onclick="closeEditModal()" style="background: #999; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-right: 8px;">Отмена</button>
            <button onclick="updateTechnic(${id})" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Сохранить</button>
        </div>
    `;

    const overlay = createEditOverlay();
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

// Редактирование компьютера
function showEditComputerModal(id, computer) {
    const modal = document.createElement('div');
    modal.id = 'editModal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 10000;
        width: 450px;
        max-width: 90%;
        display: flex;
        flex-direction: column;
        animation: modalSlideIn 0.3s ease-out;
    `;

    modal.innerHTML = `
        <div style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); color: white; padding: 15px 20px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 18px;">✏️ Редактирование компьютера</strong>
            <button onclick="closeEditModal()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        <div style="padding: 20px;">
            <div class="field-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Название:</label>
                <input type="text" id="edit_name" value="${escapeHtml(computer.name || '')}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div class="field-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Страна:</label>
                <input type="text" id="edit_country" value="${escapeHtml(computer.country || '')}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div class="field-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Процессор:</label>
                <input type="text" id="edit_modelProcessor" value="${escapeHtml(computer.modelProcessor || '')}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div class="field-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">RAM (ГБ):</label>
                <input type="number" id="edit_ram" value="${computer.ram || 8}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" min="1">
            </div>
            <div class="field-group checkbox" style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="edit_enabled" ${computer.enabled ? 'checked' : ''}> Включен
                </label>
            </div>
            <div class="field-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Магазин:</label>
                <select id="edit_shopId" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <option value="">-- Без магазина --</option>
                    ${shops.map(shop => `<option value="${shop.id}" ${computer.shopId == shop.id ? 'selected' : ''}>${escapeHtml(shop.name)} (ID: ${shop.id})</option>`).join('')}
                </select>
            </div>
        </div>
        <div style="padding: 12px 20px; border-top: 1px solid #e0e0e0; text-align: right;">
            <button onclick="closeEditModal()" style="background: #999; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-right: 8px;">Отмена</button>
            <button onclick="updateComputer(${id})" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Сохранить</button>
        </div>
    `;

    const overlay = createEditOverlay();
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

// Редактирование смартфона
function showEditSmartfonModal(id, smartfon) {
    const modal = document.createElement('div');
    modal.id = 'editModal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 10000;
        width: 450px;
        max-width: 90%;
        display: flex;
        flex-direction: column;
        animation: modalSlideIn 0.3s ease-out;
    `;

    modal.innerHTML = `
        <div style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); color: white; padding: 15px 20px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 18px;">✏️ Редактирование смартфона</strong>
            <button onclick="closeEditModal()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        <div style="padding: 20px;">
            <div class="field-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Название:</label>
                <input type="text" id="edit_name" value="${escapeHtml(smartfon.name || '')}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div class="field-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Страна:</label>
                <input type="text" id="edit_country" value="${escapeHtml(smartfon.country || '')}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div class="field-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Камера (МП):</label>
                <input type="number" id="edit_cameraMP" value="${smartfon.cameraMP || 12}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" min="1">
            </div>
            <div class="field-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Производитель:</label>
                <input type="text" id="edit_manufactures" value="${escapeHtml(smartfon.manufactures || '')}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div class="field-group checkbox" style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="edit_enabled" ${smartfon.enabled ? 'checked' : ''}> Включен
                </label>
            </div>
            <div class="field-group checkbox" style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="edit_isCall" ${smartfon.isCall ? 'checked' : ''}> Может звонить
                </label>
            </div>
            <div class="field-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Магазин:</label>
                <select id="edit_shopId" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <option value="">-- Без магазина --</option>
                    ${shops.map(shop => `<option value="${shop.id}" ${smartfon.shopId == shop.id ? 'selected' : ''}>${escapeHtml(shop.name)} (ID: ${shop.id})</option>`).join('')}
                </select>
            </div>
        </div>
        <div style="padding: 12px 20px; border-top: 1px solid #e0e0e0; text-align: right;">
            <button onclick="closeEditModal()" style="background: #999; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-right: 8px;">Отмена</button>
            <button onclick="updateSmartfon(${id})" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Сохранить</button>
        </div>
    `;

    const overlay = createEditOverlay();
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

function createEditOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'editModalOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
        animation: overlayFadeIn 0.3s ease-out;
    `;
    overlay.onclick = closeEditModal;
    return overlay;
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    const overlay = document.getElementById('editModalOverlay');
    if (modal) modal.remove();
    if (overlay) overlay.remove();
}

// API вызовы для обновления
async function updateTechnic(id) {
    const name = document.getElementById('edit_name')?.value;
    const country = document.getElementById('edit_country')?.value;
    const enabled = document.getElementById('edit_enabled')?.checked;
    const shopId = document.getElementById('edit_shopId')?.value;

    const updateData = {};
    if (name) updateData.name = name;
    if (country) updateData.country = country;
    updateData.enabled = enabled;
    if (shopId) updateData.shopId = parseInt(shopId);

    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/technic/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        const result = await response.json();
        closeEditModal();
        if (result.status === 'success') {
            showNotification('Техника обновлена', 'success');
            await loadAllData();
        } else {
            showNotification('Ошибка обновления', 'error');
        }
    } catch (error) {
        showNotification('Ошибка обновления', 'error');
    } finally {
        showLoading(false);
    }
}

async function updateComputer(id) {
    const name = document.getElementById('edit_name')?.value;
    const country = document.getElementById('edit_country')?.value;
    const modelProcessor = document.getElementById('edit_modelProcessor')?.value;
    const ram = document.getElementById('edit_ram')?.value;
    const enabled = document.getElementById('edit_enabled')?.checked;
    const shopId = document.getElementById('edit_shopId')?.value;

    const updateData = {};
    if (name) updateData.name = name;
    if (country) updateData.country = country;
    if (modelProcessor) updateData.modelProcessor = modelProcessor;
    if (ram) updateData.ram = parseInt(ram);
    updateData.enabled = enabled;
    if (shopId) updateData.shopId = parseInt(shopId);

    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/computer/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        const result = await response.json();
        closeEditModal();
        if (result.status === 'success') {
            showNotification('Компьютер обновлён', 'success');
            await loadAllData();
        } else {
            showNotification('Ошибка обновления', 'error');
        }
    } catch (error) {
        showNotification('Ошибка обновления', 'error');
    } finally {
        showLoading(false);
    }
}

async function updateSmartfon(id) {
    const name = document.getElementById('edit_name')?.value;
    const country = document.getElementById('edit_country')?.value;
    const cameraMP = document.getElementById('edit_cameraMP')?.value;
    const manufactures = document.getElementById('edit_manufactures')?.value;
    const enabled = document.getElementById('edit_enabled')?.checked;
    const isCall = document.getElementById('edit_isCall')?.checked;
    const shopId = document.getElementById('edit_shopId')?.value;

    const updateData = {};
    if (name) updateData.name = name;
    if (country) updateData.country = country;
    if (cameraMP) updateData.cameraMP = parseInt(cameraMP);
    if (manufactures) updateData.manufactures = manufactures;
    updateData.enabled = enabled;
    updateData.isCall = isCall;
    if (shopId) updateData.shopId = parseInt(shopId);

    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/smartfon/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        const result = await response.json();
        closeEditModal();
        if (result.status === 'success') {
            showNotification('Смартфон обновлён', 'success');
            await loadAllData();
        } else {
            showNotification('Ошибка обновления', 'error');
        }
    } catch (error) {
        showNotification('Ошибка обновления', 'error');
    } finally {
        showLoading(false);
    }
}

async function editComputerById(id) {
    try {
        const response = await fetch(`${API_BASE}/computer/${id}`);
        const computer = await response.json();
        showEditComputerModal(id, computer);
    } catch (error) {
        showNotification('Ошибка загрузки данных компьютера', 'error');
    }
}

async function editSmartfonById(id) {
    try {
        const response = await fetch(`${API_BASE}/smartfon/${id}`);
        const smartfon = await response.json();
        showEditSmartfonModal(id, smartfon);
    } catch (error) {
        showNotification('Ошибка загрузки данных смартфона', 'error');
    }
}

// Глобальные функции
window.callMethod = callMethod;
window.deleteBaseEntity = deleteBaseEntity;
window.deleteComputer = deleteComputer;
window.deleteSmartfon = deleteSmartfon;
window.deleteShop = deleteShop;
window.editShop = editShop;
window.createComputer = createComputer;
window.createSmartfon = createSmartfon;
window.showUpgradeProcessorModal = showUpgradeProcessorModal;
window.showChangeRamModal = showChangeRamModal;
window.upgradeProcessor = upgradeProcessor;
window.changeRam = changeRam;
window.closeInputModal = closeInputModal;
window.showEditTechnicModal = showEditTechnicModal;
window.showEditComputerModal = showEditComputerModal;
window.showEditSmartfonModal = showEditSmartfonModal;
window.editComputerById = editComputerById;
window.editSmartfonById = editSmartfonById;
window.updateTechnic = updateTechnic;
window.updateComputer = updateComputer;
window.updateSmartfon = updateSmartfon;
window.closeEditModal = closeEditModal;
